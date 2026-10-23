import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';
import { CrossrefAdapter } from '../../adapters/crossref.adapter';
import { OpenAlexAdapter } from '../../adapters/openalex.adapter';
import { TrustRatingService } from '../../services/trust-rating.service';

const router = Router();

// Search journals across local DB + Crossref + OpenAlex
router.get('/search', async (req: Request, res: Response) => {
  try {
    const q = ((req.query.q as string) || '').trim();
    if (!q) {
      // Return recently assessed journals from DB
      const journals = await prisma.journal.findMany({
        take: 12,
        orderBy: { updatedAt: 'desc' },
        include: { identifiers: true },
      });
      return res.json({ success: true, count: journals.length, results: journals, source: 'LOCAL_DATABASE' });
    }

    // 1. Search local DB first
    const isIssn = /^\d{4}-?\d{3}[\dX]$/i.test(q);
    const localMatches = await prisma.journal.findMany({
      where: isIssn
        ? { identifiers: { some: { value: q.replace(/[^0-9X-]/gi, '') } } }
        : {
            OR: [
              { title: { contains: q } },
              { publisher: { contains: q } },
            ],
          },
      include: { identifiers: true },
      take: 8,
    });

    if (localMatches.length > 0) {
      return res.json({
        success: true,
        count: localMatches.length,
        results: localMatches,
        source: 'LOCAL_DATABASE',
      });
    }

    // 2. Query Crossref & OpenAlex in parallel
    const [crossrefItems, openAlexItems] = await Promise.all([
      isIssn ? [await CrossrefAdapter.getJournalByIssn(q)].filter(Boolean) : CrossrefAdapter.searchJournals(q, 4),
      isIssn ? [await OpenAlexAdapter.getSourceByIssn(q)].filter(Boolean) : OpenAlexAdapter.searchSources(q),
    ]);

    // Map external results to clean unified journal items
    const combined: any[] = [];
    const seenTitles = new Set<string>();

    for (const item of [...crossrefItems, ...openAlexItems]) {
      const title = item.title || item.displayName;
      if (!title || seenTitles.has(title.toLowerCase())) continue;
      seenTitles.add(title.toLowerCase());

      const issnList = item.issn || [];
      const primaryIssn = typeof issnList === 'string' ? issnList : (issnList[0] || item.issnPrint || item.issnOnline || null);

      combined.push({
        id: `ext-${Buffer.from(title).toString('base64').substring(0, 16)}`,
        title,
        publisher: item.publisher || 'Unknown Publisher',
        country: item.countryCode || null,
        currentGrade: item.isInDoaj ? 'A' : 'UNVERIFIED',
        currentScore: item.isInDoaj ? 85.0 : null,
        doajIndexed: Boolean(item.isInDoaj),
        crossrefActive: Boolean(item.totalDoiCount || item.totalDois),
        isExternal: true,
        identifiers: primaryIssn ? [{ type: 'ISSN', value: primaryIssn, isPrimary: true }] : [],
        openalexStats: item.worksCount ? { worksCount: item.worksCount, twoYearCitedness: item.twoYearMeanCitedness } : null,
      });
    }

    res.json({
      success: true,
      count: combined.length,
      results: combined,
      source: 'REGISTRY_FEDERATION',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Journal search failed.' });
  }
});

// Get journal details by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const journal = await prisma.journal.findUnique({
      where: { id },
      include: {
        identifiers: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            criteriaResults: true,
            evidenceRecords: true,
          },
        },
      },
    });

    if (!journal) {
      return res.status(404).json({ success: false, error: 'Journal record not found.' });
    }

    res.json({ success: true, journal });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching journal.' });
  }
});

// Trigger live 5-pillar assessment for a journal
router.post('/assess', async (req: Request, res: Response) => {
  try {
    const { title, issn, publisher, websiteUrl } = req.body;

    if (!title && !issn) {
      return res.status(400).json({ success: false, error: 'Title or ISSN is required to evaluate a journal.' });
    }

    // 1. Run deterministic scoring engine
    const ratingResult = await TrustRatingService.evaluateJournal({
      title: title || '',
      issn,
      publisher,
      websiteUrl,
    });

    // 2. Find or create Journal record in database
    let journal = null;
    if (issn) {
      journal = await prisma.journal.findFirst({
        where: { identifiers: { some: { value: issn } } },
        include: { identifiers: true },
      });
    }

    if (!journal && title) {
      journal = await prisma.journal.findFirst({
        where: { title },
        include: { identifiers: true },
      });
    }

    if (!journal) {
      journal = await prisma.journal.create({
        data: {
          title: title || `Journal (${issn})`,
          publisher: publisher || null,
          websiteUrl: websiteUrl || null,
          currentScore: ratingResult.totalScore,
          currentGrade: ratingResult.letterGrade,
          identifiers: issn
            ? {
                create: [{ type: 'ISSN', value: issn, isPrimary: true }],
              }
            : undefined,
        },
        include: { identifiers: true },
      });
    }

    // 3. Save assessment and criteria results
    const savedAssessment = await TrustRatingService.saveAssessment(
      journal.id,
      ratingResult,
      req.user?.id
    );

    res.json({
      success: true,
      journal,
      assessment: savedAssessment,
      ratingResult,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Assessment execution failed.' });
  }
});

// Downloadable / printable report data
router.get('/:id/export', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const journal = await prisma.journal.findUnique({
      where: { id },
      include: {
        identifiers: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            criteriaResults: true,
            evidenceRecords: true,
            methodology: true,
          },
        },
      },
    });

    if (!journal || journal.assessments.length === 0) {
      return res.status(404).json({ success: false, error: 'Assessment not found for export.' });
    }

    const latest = journal.assessments[0];

    const report = {
      reportId: `SS-REP-${latest.id.substring(0, 8).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      platform: 'Smart Scholars — Research Integrity Desk',
      disclaimer: 'This assessment is generated deterministically from public scholarly bibliographic registries (Crossref, OpenAlex, DOAJ) and technical crawl heuristics. It is an independent integrity rating and does not constitute official accreditation or endorsement.',
      methodologyVersion: latest.methodology.version,
      journal: {
        title: journal.title,
        publisher: journal.publisher,
        issns: journal.identifiers.map(i => i.value),
        website: journal.websiteUrl,
      },
      evaluation: {
        totalScore: latest.totalScore,
        letterGrade: latest.letterGrade,
        redFlagCount: latest.redFlagCount,
        summary: latest.summaryText,
        pillarScores: {
          identityGovernance: latest.identityGovernanceScore,
          editorialIntegrity: latest.editorialIntegrityScore,
          technicalStanding: latest.technicalStandingScore,
          preservationAccess: latest.preservationAccessScore,
          reachCitation: latest.reachCitationScore,
        },
        criteria: latest.criteriaResults.map(c => ({
          pillar: c.pillar,
          name: c.name,
          awardedPoints: c.awardedPoints,
          maxPoints: c.maxPoints,
          status: c.status,
          explanation: c.explanation,
          source: c.sourceName,
        })),
        evidence: latest.evidenceRecords.map(e => ({
          source: e.sourceName,
          endpoint: e.endpointUrl,
          verifiedAt: e.verifiedAt,
          summary: e.extractedSummary,
        })),
      },
    };

    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error exporting assessment report.' });
  }
});

export default router;
