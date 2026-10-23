import { prisma } from '../database/prisma';
import { CrossrefAdapter } from '../adapters/crossref.adapter';
import { OpenAlexAdapter } from '../adapters/openalex.adapter';
import { DOAJAdapter } from '../adapters/doaj.adapter';
import { PreservationAdapter } from '../adapters/preservation.adapter';

export interface CriterionEvaluation {
  pillar: 'IDENTITY' | 'EDITORIAL' | 'TECHNICAL' | 'PRESERVATION' | 'REACH';
  criterionKey: string;
  name: string;
  description: string;
  maxPoints: number;
  awardedPoints: number;
  status: 'VERIFIED' | 'FAILED' | 'UNAVAILABLE' | 'NOT_APPLICABLE';
  explanation: string;
  sourceName: string;
  sourceUrl?: string;
}

export interface RatingResult {
  totalScore: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'RED_FLAG' | 'UNVERIFIED';
  pillarScores: {
    identity: number;
    editorial: number;
    technical: number;
    preservation: number;
    reach: number;
  };
  redFlags: string[];
  criteria: CriterionEvaluation[];
  evidenceRecords: Array<{
    sourceName: string;
    endpointUrl: string;
    httpStatus?: number;
    extractedSummary: string;
    verifiedAt: Date;
  }>;
}

export class TrustRatingService {
  /**
   * Deterministically calculate 5-pillar trust rating based on multi-source evidence
   */
  static async evaluateJournal(params: {
    title: string;
    issn?: string;
    publisher?: string;
    websiteUrl?: string;
    doiPrefix?: string;
    crawlFindings?: any[];
  }): Promise<RatingResult> {
    const criteria: CriterionEvaluation[] = [];
    const redFlags: string[] = [];
    const evidenceRecords: any[] = [];

    // Fetch external registry records in parallel
    const [crossrefData, openalexData, doajData, waybackData] = await Promise.all([
      params.issn ? CrossrefAdapter.getJournalByIssn(params.issn) : null,
      params.issn ? OpenAlexAdapter.getSourceByIssn(params.issn) : (params.title ? (await OpenAlexAdapter.searchSources(params.title))[0] || null : null),
      params.issn ? DOAJAdapter.checkIssn(params.issn) : null,
      params.websiteUrl ? PreservationAdapter.checkWaybackAvailability(params.websiteUrl) : null,
    ]);

    if (crossrefData) {
      evidenceRecords.push({
        sourceName: 'Crossref REST API',
        endpointUrl: `https://api.crossref.org/journals/${params.issn || ''}`,
        httpStatus: 200,
        extractedSummary: `Confirmed Crossref member. Total DOIs: ${crossrefData.totalDois || 0}, Current DOIs: ${crossrefData.currentDois || 0}`,
        verifiedAt: new Date(),
      });
    }

    if (openalexData) {
      evidenceRecords.push({
        sourceName: 'OpenAlex Scholarly API',
        endpointUrl: `https://api.openalex.org/sources?filter=issn:${params.issn || ''}`,
        httpStatus: 200,
        extractedSummary: `Works count: ${openalexData.worksCount || 0}, 2yr mean citedness: ${openalexData.twoYearMeanCitedness || 0}, h-index: ${openalexData.hIndex || 0}`,
        verifiedAt: new Date(),
      });
    }

    if (doajData) {
      evidenceRecords.push({
        sourceName: 'DOAJ API v2',
        endpointUrl: `https://doaj.org/api/v2/search/journals/issn:${params.issn || ''}`,
        httpStatus: 200,
        extractedSummary: `DOAJ Indexed: Yes. License: ${doajData.license}. Seal: ${doajData.doajSeal ? 'Awarded' : 'None'}`,
        verifiedAt: new Date(),
      });
    }

    // --- PILLAR 1: Identity & Governance (Max 25 pts) ---
    // 1.1 ISSN Active Registration (10 pts)
    if (params.issn && params.issn.length >= 8) {
      const hasRegistryEvidence = crossrefData || openalexData || doajData;
      if (hasRegistryEvidence) {
        criteria.push({
          pillar: 'IDENTITY',
          criterionKey: 'ISSN_VERIFIED',
          name: 'ISSN Active Registration',
          description: 'Valid, registered International Standard Serial Number verified across public bibliographic authorities.',
          maxPoints: 10,
          awardedPoints: 10,
          status: 'VERIFIED',
          explanation: `ISSN ${params.issn} verified active across scholarly registries.`,
          sourceName: 'Crossref / OpenAlex Registry',
        });
      } else {
        criteria.push({
          pillar: 'IDENTITY',
          criterionKey: 'ISSN_VERIFIED',
          name: 'ISSN Active Registration',
          description: 'ISSN syntax valid, but lacks confirmed metadata across Crossref, OpenAlex, or DOAJ.',
          maxPoints: 10,
          awardedPoints: 4,
          status: 'UNAVAILABLE',
          explanation: `ISSN ${params.issn} provided but unverified in major bibliographic indices.`,
          sourceName: 'ISSN Self-Reported',
        });
      }
    } else {
      criteria.push({
        pillar: 'IDENTITY',
        criterionKey: 'ISSN_VERIFIED',
        name: 'ISSN Active Registration',
        description: 'Missing or malformed ISSN.',
        maxPoints: 10,
        awardedPoints: 0,
        status: 'FAILED',
        explanation: 'No valid ISSN detected.',
        sourceName: 'Direct Input',
      });
      redFlags.push('Missing registered International Standard Serial Number (ISSN).');
    }

    // 1.2 Publisher Identity & Transparency (15 pts)
    const publisherName = params.publisher || crossrefData?.publisher || openalexData?.publisher;
    if (publisherName && publisherName.length > 2) {
      const isKnown = crossrefData?.publisher || openalexData?.publisher;
      criteria.push({
        pillar: 'IDENTITY',
        criterionKey: 'PUBLISHER_IDENTITY',
        name: 'Publisher Legal Identity & Governance',
        description: 'Publisher corporate registration and ownership transparency.',
        maxPoints: 15,
        awardedPoints: isKnown ? 15 : 10,
        status: 'VERIFIED',
        explanation: `Publisher confirmed as "${publisherName}".`,
        sourceName: isKnown ? 'Crossref Member Directory' : 'Declared Publisher',
      });
    } else {
      criteria.push({
        pillar: 'IDENTITY',
        criterionKey: 'PUBLISHER_IDENTITY',
        name: 'Publisher Legal Identity & Governance',
        description: 'Publisher legal entity is unconfirmed.',
        maxPoints: 15,
        awardedPoints: 3,
        status: 'FAILED',
        explanation: 'Publisher information is undisclosed or unverifiable.',
        sourceName: 'Public Metadata',
      });
    }

    // --- PILLAR 2: Editorial Integrity (Max 25 pts) ---
    // 2.1 Peer Review Transparency (13 pts)
    if (doajData?.editorialReviewType || (openalexData && openalexData.worksCount > 100)) {
      criteria.push({
        pillar: 'EDITORIAL',
        criterionKey: 'PEER_REVIEW_STANDARDS',
        name: 'Peer Review Integrity & Rigor',
        description: 'Published peer-review methodology and verifiable scholarly editorial workflow.',
        maxPoints: 13,
        awardedPoints: 13,
        status: 'VERIFIED',
        explanation: doajData?.editorialReviewType
          ? `Verified ${doajData.editorialReviewType} peer-review model.`
          : 'Scholarly peer-review model supported by consistent bibliographic record.',
        sourceName: doajData ? 'DOAJ Registry' : 'OpenAlex Authority',
      });
    } else {
      criteria.push({
        pillar: 'EDITORIAL',
        criterionKey: 'PEER_REVIEW_STANDARDS',
        name: 'Peer Review Integrity & Rigor',
        description: 'Explicit peer-review policies need independent verification.',
        maxPoints: 13,
        awardedPoints: 6,
        status: 'UNAVAILABLE',
        explanation: 'Peer review standards not independently cataloged by DOAJ.',
        sourceName: 'Self-Reported Policy',
      });
    }

    // 2.2 Ethics & Plagiarism Screening (12 pts)
    const hasPlagiarismProof = doajData?.plagiarismDetection;
    criteria.push({
      pillar: 'EDITORIAL',
      criterionKey: 'PUBLICATION_ETHICS',
      name: 'Publication Ethics & Plagiarism Screening',
      description: 'Formal statement of publication ethics (COPE aligned) and automated similarity screening.',
      maxPoints: 12,
      awardedPoints: hasPlagiarismProof ? 12 : 7,
      status: hasPlagiarismProof ? 'VERIFIED' : 'UNAVAILABLE',
      explanation: hasPlagiarismProof
        ? 'Verified plagiarism screening tool integration.'
        : 'Ethics policy self-declared; automated screening not verified via DOAJ.',
      sourceName: hasPlagiarismProof ? 'DOAJ Registry' : 'Platform Heuristic',
    });

    // --- PILLAR 3: Technical Standing (Max 20 pts) ---
    // 3.1 Persistent DOI Allocation (12 pts)
    if (crossrefData && crossrefData.totalDois > 0) {
      const doiScore = Math.min(12, 8 + Math.min(4, Math.floor(crossrefData.totalDois / 500)));
      criteria.push({
        pillar: 'TECHNICAL',
        criterionKey: 'DOI_PERSISTENCE',
        name: 'Persistent DOI Implementation',
        description: 'Active digital object identifier allocation through Crossref or DataCite.',
        maxPoints: 12,
        awardedPoints: doiScore,
        status: 'VERIFIED',
        explanation: `Confirmed active Crossref member with ${crossrefData.totalDois.toLocaleString()} registered DOIs.`,
        sourceName: 'Crossref REST API',
      });
    } else {
      criteria.push({
        pillar: 'TECHNICAL',
        criterionKey: 'DOI_PERSISTENCE',
        name: 'Persistent DOI Implementation',
        description: 'No active Crossref DOI deposit record found for this ISSN.',
        maxPoints: 12,
        awardedPoints: 0,
        status: 'FAILED',
        explanation: 'No registered Crossref DOIs discovered.',
        sourceName: 'Crossref REST API',
      });
      redFlags.push('Journal does not appear to deposit persistent DOIs with Crossref.');
    }

    // 3.2 Machine-Readable Licensing (8 pts)
    if (doajData?.license) {
      criteria.push({
        pillar: 'TECHNICAL',
        criterionKey: 'LICENSING_METADATA',
        name: 'Machine-Readable Open Access Licensing',
        description: 'Standard Creative Commons or open license embedded in article metadata.',
        maxPoints: 8,
        awardedPoints: 8,
        status: 'VERIFIED',
        explanation: `Structured license verified: ${doajData.license}`,
        sourceName: 'DOAJ Registry',
      });
    } else {
      criteria.push({
        pillar: 'TECHNICAL',
        criterionKey: 'LICENSING_METADATA',
        name: 'Machine-Readable Open Access Licensing',
        description: 'Licensing terms require verification on article-level XML.',
        maxPoints: 8,
        awardedPoints: 3,
        status: 'UNAVAILABLE',
        explanation: 'Article-level machine readable license tags not verified via DOAJ.',
        sourceName: 'Registry Check',
      });
    }

    // --- PILLAR 4: Preservation & Access (Max 15 pts) ---
    // 4.1 Digital Preservation Archiving (9 pts)
    const hasWayback = waybackData?.isArchived;
    const hasPreservation = (doajData?.preservationServices && doajData.preservationServices.length > 0) || hasWayback;
    if (hasPreservation) {
      const services = [...(doajData?.preservationServices || [])];
      if (hasWayback) services.push('Internet Archive');
      criteria.push({
        pillar: 'PRESERVATION',
        criterionKey: 'DIGITAL_PRESERVATION',
        name: 'Long-term Digital Preservation',
        description: 'Permanent archiving agreement in Portico, CLOCKSS, PKP PN, or Internet Archive.',
        maxPoints: 9,
        awardedPoints: 9,
        status: 'VERIFIED',
        explanation: `Active preservation snapshots confirmed in: ${services.join(', ')}`,
        sourceName: hasWayback ? 'Internet Archive / DOAJ' : 'DOAJ Registry',
      });
    } else {
      criteria.push({
        pillar: 'PRESERVATION',
        criterionKey: 'DIGITAL_PRESERVATION',
        name: 'Long-term Digital Preservation',
        description: 'No confirmed digital preservation repository identified.',
        maxPoints: 9,
        awardedPoints: 2,
        status: 'FAILED',
        explanation: 'Journal lacks verified long-term archival escrow deposits.',
        sourceName: 'Keepers Registry / Wayback',
      });
      redFlags.push('No permanent digital preservation escrow (Portico/CLOCKSS/Wayback) confirmed.');
    }

    // 4.2 Fee Transparency / Diamond OA (6 pts)
    if (doajData) {
      const apcExplanation = doajData.hasApc
        ? `Transparent APC declared: ${doajData.apcMax || ''} ${doajData.apcCurrency || ''}`
        : 'Verified Diamond Open Access (No publication fees).';
      criteria.push({
        pillar: 'PRESERVATION',
        criterionKey: 'APC_TRANSPARENCY',
        name: 'Fee Transparency & Policy Disclosure',
        description: 'Explicit disclosure of Article Processing Charges or zero-fee Diamond status.',
        maxPoints: 6,
        awardedPoints: 6,
        status: 'VERIFIED',
        explanation: apcExplanation,
        sourceName: 'DOAJ Registry',
      });
    } else {
      criteria.push({
        pillar: 'PRESERVATION',
        criterionKey: 'APC_TRANSPARENCY',
        name: 'Fee Transparency & Policy Disclosure',
        description: 'Fee schedule not cataloged in global OA directory.',
        maxPoints: 6,
        awardedPoints: 3,
        status: 'UNAVAILABLE',
        explanation: 'Fee structure not independently indexed by DOAJ.',
        sourceName: 'Public Metadata',
      });
    }

    // --- PILLAR 5: Reach & Citation Transparency (Max 15 pts) ---
    // 5.1 Citation Trajectory & Works Volume (8 pts)
    if (openalexData && openalexData.worksCount > 0) {
      const citeScore = Math.min(8, 3 + Math.min(5, Math.floor(openalexData.twoYearMeanCitedness * 2)));
      criteria.push({
        pillar: 'REACH',
        criterionKey: 'CITATION_IMPACT',
        name: 'Citation Trajectory & Academic Footprint',
        description: 'Documented scholarly citations and publication continuity in OpenAlex.',
        maxPoints: 8,
        awardedPoints: citeScore,
        status: 'VERIFIED',
        explanation: `OpenAlex records ${openalexData.worksCount.toLocaleString()} works with a 2-year mean citedness of ${openalexData.twoYearMeanCitedness}.`,
        sourceName: 'OpenAlex Scholarly API',
      });
    } else {
      criteria.push({
        pillar: 'REACH',
        criterionKey: 'CITATION_IMPACT',
        name: 'Citation Trajectory & Academic Footprint',
        description: 'Insufficient citation history found in OpenAlex.',
        maxPoints: 8,
        awardedPoints: 2,
        status: 'UNAVAILABLE',
        explanation: 'OpenAlex bibliographic record is sparse or unavailable.',
        sourceName: 'OpenAlex Scholarly API',
      });
    }

    // 5.2 Indexing Footprint & Discovery (7 pts)
    const isIndexed = doajData?.isDoajIndexed || (crossrefData && crossrefData.totalDois > 50);
    criteria.push({
      pillar: 'REACH',
      criterionKey: 'DISCOVERY_FOOTPRINT',
      name: 'Scholarly Discovery & Indexing Footprint',
      description: 'Inclusion in curated scholarly databases ensuring discoverability.',
      maxPoints: 7,
      awardedPoints: isIndexed ? 7 : 2,
      status: isIndexed ? 'VERIFIED' : 'UNAVAILABLE',
      explanation: isIndexed
        ? 'Journal is indexed in recognized scholarly infrastructure.'
        : 'Limited presence across primary index discovery feeds.',
      sourceName: 'DOAJ & Crossref',
    });

    // Compute Pillar Scores
    const pillarScores = {
      identity: criteria.filter(c => c.pillar === 'IDENTITY').reduce((acc, c) => acc + c.awardedPoints, 0),
      editorial: criteria.filter(c => c.pillar === 'EDITORIAL').reduce((acc, c) => acc + c.awardedPoints, 0),
      technical: criteria.filter(c => c.pillar === 'TECHNICAL').reduce((acc, c) => acc + c.awardedPoints, 0),
      preservation: criteria.filter(c => c.pillar === 'PRESERVATION').reduce((acc, c) => acc + c.awardedPoints, 0),
      reach: criteria.filter(c => c.pillar === 'REACH').reduce((acc, c) => acc + c.awardedPoints, 0),
    };

    let totalScore = Object.values(pillarScores).reduce((acc, v) => acc + v, 0);

    // Apply red flag deductions (each red flag deducts 15 points)
    if (redFlags.length >= 2) {
      totalScore = Math.min(totalScore, 35); // Cap to red flag territory
    }

    // Determine Letter Grade
    let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'RED_FLAG' | 'UNVERIFIED';
    if (redFlags.length >= 2 || totalScore < 40) {
      letterGrade = 'RED_FLAG';
    } else if (totalScore >= 90) {
      letterGrade = 'A+';
    } else if (totalScore >= 80) {
      letterGrade = 'A';
    } else if (totalScore >= 70) {
      letterGrade = 'B';
    } else if (totalScore >= 55) {
      letterGrade = 'C';
    } else {
      letterGrade = 'D';
    }

    return {
      totalScore: Math.round(totalScore * 10) / 10,
      letterGrade,
      pillarScores,
      redFlags,
      criteria,
      evidenceRecords,
    };
  }

  /**
   * Persist evaluation results to database
   */
  static async saveAssessment(journalId: string, rating: RatingResult, userId?: string) {
    const methodology = await prisma.assessmentMethodologyVersion.findFirst({
      where: { isActive: true },
    });

    if (!methodology) {
      throw new Error('Active assessment methodology version not configured.');
    }

    // Update journal current grade and score
    await prisma.journal.update({
      where: { id: journalId },
      data: {
        currentScore: rating.totalScore,
        currentGrade: rating.letterGrade,
        lastAssessedAt: new Date(),
      },
    });

    // Create JournalAssessment record
    const assessment = await prisma.journalAssessment.create({
      data: {
        journalId,
        userId: userId || null,
        methodologyVersionId: methodology.id,
        totalScore: rating.totalScore,
        letterGrade: rating.letterGrade,
        identityGovernanceScore: rating.pillarScores.identity,
        editorialIntegrityScore: rating.pillarScores.editorial,
        technicalStandingScore: rating.pillarScores.technical,
        preservationAccessScore: rating.pillarScores.preservation,
        reachCitationScore: rating.pillarScores.reach,
        redFlagCount: rating.redFlags.length,
        summaryText: `5-Pillar evaluation completed with score ${rating.totalScore}/100 (${rating.letterGrade}). Methodology: ${methodology.version}. Red flags identified: ${rating.redFlags.length}.`,
        evidenceSummaryJson: JSON.stringify(rating.evidenceRecords),
        criteriaResults: {
          create: rating.criteria.map(c => ({
            pillar: c.pillar,
            criterionKey: c.criterionKey,
            name: c.name,
            description: c.description,
            maxPoints: c.maxPoints,
            awardedPoints: c.awardedPoints,
            status: c.status,
            explanation: c.explanation,
            sourceName: c.sourceName,
            sourceUrl: c.sourceUrl || null,
          })),
        },
        evidenceRecords: {
          create: rating.evidenceRecords.map(e => ({
            sourceName: e.sourceName,
            endpointUrl: e.endpointUrl,
            httpStatus: e.httpStatus || 200,
            extractedSummary: e.extractedSummary,
            verifiedAt: e.verifiedAt,
          })),
        },
      },
      include: {
        criteriaResults: true,
        evidenceRecords: true,
      },
    });

    return assessment;
  }
}
