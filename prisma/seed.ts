import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Smart Scholars Seed ---');

  // 1. Seed Assessment Methodology Version
  const methodology = await prisma.assessmentMethodologyVersion.upsert({
    where: { version: 'v1.2.0-2026' },
    update: {},
    create: {
      version: 'v1.2.0-2026',
      description: 'Standard 5-Pillar Research Integrity & Journal Trust Rating Methodology (2026 Edition)',
      isActive: true,
      rulesJson: JSON.stringify({
        pillars: [
          { key: 'IDENTITY', weight: 25, label: 'Identity & Governance' },
          { key: 'EDITORIAL', weight: 25, label: 'Editorial Integrity' },
          { key: 'TECHNICAL', weight: 20, label: 'Technical Standing' },
          { key: 'PRESERVATION', weight: 15, label: 'Preservation & Access' },
          { key: 'REACH', weight: 15, label: 'Reach & Citation Transparency' },
        ],
        gradeThresholds: [
          { min: 90, grade: 'A+' },
          { min: 80, grade: 'A' },
          { min: 70, grade: 'B' },
          { min: 55, grade: 'C' },
          { min: 40, grade: 'D' },
          { min: 0, grade: 'RED_FLAG' },
        ]
      }),
    },
  });
  console.log('✔ Seeded Methodology Version:', methodology.version);

  // 2. Seed Default Indexing Services
  const indexingServicesData = [
    {
      name: 'Directory of Open Access Journals (DOAJ)',
      slug: 'doaj',
      category: 'OPEN_ACCESS',
      websiteUrl: 'https://doaj.org',
      applicationUrl: 'https://doaj.org/apply/',
      acceptanceRateEst: '42%',
      reviewPeriodMonths: '3 - 6 months',
      scopeDescription: 'Global directory of peer-reviewed open access journals meeting high standards of transparency and publication ethics.',
      requirementsSummary: 'Active ISSN, CC license on full-text, documented APC or zero-fee policy, clear peer review process, preservation agreement.',
      evaluationCriteria: JSON.stringify([
        'Confirmed active ISSN on ISSN Portal',
        'Transparent APC policy (or explicit Diamond OA statement)',
        'Explicit licensing scheme (CC BY, CC BY-SA, CC BY-NC)',
        'Archiving policy in recognized digital preservation registry',
        'At least one year of publishing history'
      ]),
      feeDescription: 'Free of charge (Community non-profit)',
    },
    {
      name: 'Scopus (Elsevier)',
      slug: 'scopus',
      category: 'GLOBAL_INDEX',
      websiteUrl: 'https://www.scopus.com',
      applicationUrl: 'https://www.readyforscopus.com',
      acceptanceRateEst: '33%',
      reviewPeriodMonths: '6 - 12 months',
      scopeDescription: 'Largest curated abstract and citation database of peer-reviewed literature: scientific journals, books, and conference proceedings.',
      requirementsSummary: 'Minimum 2-year publishing history, peer-reviewed articles, English abstracts and titles, timely publication schedule, international editorial diversity.',
      evaluationCriteria: JSON.stringify([
        'Journal policy and publication ethics statement (COPE alignment)',
        'Geographic diversity of editors and contributing authors',
        'Academic quality of articles and clear citations in Scopus',
        'Punctuality of publication schedule',
        'Functional website with transparent editorial board'
      ]),
      feeDescription: 'No fee for journal evaluation or indexing',
    },
    {
      name: 'Web of Science Core Collection (ESCI / SCIE)',
      slug: 'web-of-science',
      category: 'GLOBAL_INDEX',
      websiteUrl: 'https://clarivate.com/products/scientific-and-academic-research/research-discovery-and-workflow-solutions/web-of-science/',
      applicationUrl: 'https://clarivate.com/products/scientific-and-academic-research/research-publishing-solutions/journal-submission-portal/',
      acceptanceRateEst: '25%',
      reviewPeriodMonths: '9 - 18 months',
      scopeDescription: 'Clarivate Web of Science Master Journal List, SCIE, SSCI, and Emerging Sources Citation Index.',
      requirementsSummary: '24 quality criteria (editorial rigor, international diversity, ethical guidelines) and 4 impact criteria.',
      evaluationCriteria: JSON.stringify([
        '24 Essential Quality Criteria met in full',
        'Scholarly integrity and verification of editorial board qualifications',
        'Peer review clarity and COPE compliance',
        'DOI persistence and XML metadata quality',
        'Citation impact and relevance to the research community'
      ]),
      feeDescription: 'No application fee',
    },
    {
      name: 'PubMed Central (PMC)',
      slug: 'pubmed-central',
      category: 'BIOMEDICAL',
      websiteUrl: 'https://www.ncbi.nlm.nih.gov/pmc/',
      applicationUrl: 'https://www.ncbi.nlm.nih.gov/pmc/pub/addjournal/',
      acceptanceRateEst: '35%',
      reviewPeriodMonths: '6 - 9 months',
      scopeDescription: 'National Library of Medicine free full-text archive of biomedical and life sciences journal literature.',
      requirementsSummary: 'Biomedical scope, minimum 25 peer-reviewed articles, NLM JATS XML compliance, high scientific rigor.',
      evaluationCriteria: JSON.stringify([
        'NLM scientific quality evaluation',
        'Full-text JATS XML data file verification',
        'Conformity with NLM publication guidelines',
        'Clear statement of conflict of interest and ethics'
      ]),
      feeDescription: 'Free of charge (US Federal Service)',
    },
  ];

  for (const s of indexingServicesData) {
    await prisma.indexingService.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log('✔ Seeded Indexing Services (4 major platforms)');

  // 3. Seed Users (Admin & Research Auditor)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@SmartScholars2026', salt);
  const researcherPasswordHash = await bcrypt.hash('Researcher@2026', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smartscholars.in' },
    update: {},
    create: {
      email: 'admin@smartscholars.in',
      passwordHash: adminPasswordHash,
      fullName: 'Dr. Evelyn Reed (Chief Integrity Officer)',
      role: 'ADMIN',
      institution: 'Smart Scholars Platform Integrity Office',
      isVerified: true,
    },
  });

  const researcherUser = await prisma.user.upsert({
    where: { email: 'auditor@oxford-research.ac.uk' },
    update: {},
    create: {
      email: 'auditor@oxford-research.ac.uk',
      passwordHash: researcherPasswordHash,
      fullName: 'Prof. Marcus Vance',
      role: 'INSTITUTION_ADMIN',
      institution: 'University Research Integrity Committee',
      isVerified: true,
    },
  });
  console.log('✔ Seeded Users (Admin & Institution Auditor)');

  // 4. Seed Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'oxford-research-integrity' },
    update: {},
    create: {
      name: 'Oxford Academic Integrity Office',
      slug: 'oxford-research-integrity',
      type: 'UNIVERSITY',
      country: 'United Kingdom',
      website: 'https://integrity.ox.ac.uk',
    },
  });

  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: researcherUser.id,
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      userId: researcherUser.id,
      role: 'OWNER',
    },
  });
  console.log('✔ Seeded Organization and Membership');

  // 5. Seed Real Reference Journals with Verified Data
  const sampleJournals = [
    {
      title: 'Nature',
      publisher: 'Springer Nature',
      country: 'United Kingdom',
      websiteUrl: 'https://www.nature.com/nature',
      oaType: 'Hybrid',
      apcAmount: 11690,
      apcCurrency: 'EUR',
      currentScore: 97.5,
      currentGrade: 'A+',
      doajIndexed: false,
      crossrefActive: true,
      lastAssessedAt: new Date('2026-09-15T10:00:00Z'),
      identifiers: [
        { type: 'ISSN_PRINT', value: '0028-0836', isPrimary: true },
        { type: 'ISSN_ONLINE', value: '1476-4687', isPrimary: false },
        { type: 'DOI_PREFIX', value: '10.1038', isPrimary: false },
      ],
      scores: { identity: 25, editorial: 25, technical: 20, preservation: 14.5, reach: 13 },
    },
    {
      title: 'PLOS ONE',
      publisher: 'Public Library of Science',
      country: 'United States',
      websiteUrl: 'https://journals.plos.org/plosone/',
      oaType: 'Gold',
      apcAmount: 2290,
      apcCurrency: 'USD',
      currentScore: 94.0,
      currentGrade: 'A+',
      doajIndexed: true,
      crossrefActive: true,
      lastAssessedAt: new Date('2026-10-01T12:00:00Z'),
      identifiers: [
        { type: 'ISSN_ONLINE', value: '1932-6203', isPrimary: true },
        { type: 'DOI_PREFIX', value: '10.1371', isPrimary: false },
      ],
      scores: { identity: 24, editorial: 24, technical: 20, preservation: 14, reach: 12 },
    },
    {
      title: 'BMJ Open',
      publisher: 'BMJ Publishing Group',
      country: 'United Kingdom',
      websiteUrl: 'https://bmjopen.bmj.com',
      oaType: 'Gold',
      apcAmount: 2600,
      apcCurrency: 'GBP',
      currentScore: 91.0,
      currentGrade: 'A+',
      doajIndexed: true,
      crossrefActive: true,
      lastAssessedAt: new Date('2026-08-20T14:30:00Z'),
      identifiers: [
        { type: 'ISSN_ONLINE', value: '2044-6055', isPrimary: true },
        { type: 'DOI_PREFIX', value: '10.1136', isPrimary: false },
      ],
      scores: { identity: 24, editorial: 23, technical: 19, preservation: 13, reach: 12 },
    },
    {
      title: 'International Journal of Advanced Multidisciplinary Research & Innovations',
      publisher: 'Apex Global Academic Press',
      country: 'Unknown',
      websiteUrl: 'https://example-predatory-academic-journal.org',
      oaType: 'Unverified Open Access',
      apcAmount: 150,
      apcCurrency: 'USD',
      currentScore: 28.0,
      currentGrade: 'RED_FLAG',
      doajIndexed: false,
      crossrefActive: false,
      lastAssessedAt: new Date('2026-10-18T09:15:00Z'),
      identifiers: [
        { type: 'ISSN_ONLINE', value: '9999-0001', isPrimary: true },
      ],
      scores: { identity: 8, editorial: 6, technical: 7, preservation: 2, reach: 5 },
    },
  ];

  for (const jData of sampleJournals) {
    const { identifiers, scores, ...journalFields } = jData;
    
    // Check if journal exists
    let journal = await prisma.journal.findFirst({
      where: { title: journalFields.title },
    });

    if (!journal) {
      journal = await prisma.journal.create({
        data: {
          ...journalFields,
          identifiers: {
            create: identifiers,
          },
        },
      });
    }

    // Create Assessment record
    await prisma.journalAssessment.create({
      data: {
        journalId: journal.id,
        userId: adminUser.id,
        methodologyVersionId: methodology.id,
        totalScore: journalFields.currentScore || 0,
        letterGrade: journalFields.currentGrade || 'UNVERIFIED',
        identityGovernanceScore: scores.identity,
        editorialIntegrityScore: scores.editorial,
        technicalStandingScore: scores.technical,
        preservationAccessScore: scores.preservation,
        reachCitationScore: scores.reach,
        redFlagCount: journalFields.currentGrade === 'RED_FLAG' ? 4 : 0,
        summaryText: `Comprehensive 5-pillar assessment performed according to Smart Scholars methodology ${methodology.version}. Evidence gathered from Crossref, DOAJ, and direct technical crawl.`,
        criteriaResults: {
          create: [
            {
              pillar: 'IDENTITY',
              criterionKey: 'ISSN_VERIFIED',
              name: 'ISSN Verification',
              maxPoints: 10,
              awardedPoints: journalFields.currentGrade === 'RED_FLAG' ? 2 : 10,
              status: journalFields.currentGrade === 'RED_FLAG' ? 'FAILED' : 'VERIFIED',
              explanation: journalFields.currentGrade === 'RED_FLAG' ? 'ISSN not confirmed in official CIEPS database' : 'Confirmed active registration with CIEPS / ISSN International Centre',
              sourceName: 'ISSN Portal',
            },
            {
              pillar: 'IDENTITY',
              criterionKey: 'PUBLISHER_TRANSPARENCY',
              name: 'Publisher Legal Identity',
              maxPoints: 15,
              awardedPoints: journalFields.currentGrade === 'RED_FLAG' ? 6 : 15,
              status: journalFields.currentGrade === 'RED_FLAG' ? 'FAILED' : 'VERIFIED',
              explanation: journalFields.currentGrade === 'RED_FLAG' ? 'Publisher physical jurisdiction and corporate registration unverified' : 'Verified legal corporate registration and physical address',
              sourceName: 'Crossref Member Directory',
            },
            {
              pillar: 'EDITORIAL',
              criterionKey: 'PEER_REVIEW_POLICY',
              name: 'Peer Review Integrity & Transparency',
              maxPoints: 15,
              awardedPoints: journalFields.currentGrade === 'RED_FLAG' ? 3 : 15,
              status: journalFields.currentGrade === 'RED_FLAG' ? 'FAILED' : 'VERIFIED',
              explanation: journalFields.currentGrade === 'RED_FLAG' ? 'Guaranteed 48-hour acceptance advertised on homepage' : 'Rigorous double-blind or transparent peer review with published policies',
              sourceName: 'Direct Journal Crawl',
            },
            {
              pillar: 'TECHNICAL',
              criterionKey: 'DOI_RESOLUTION',
              name: 'Persistent DOI Implementation',
              maxPoints: 10,
              awardedPoints: journalFields.currentGrade === 'RED_FLAG' ? 0 : 10,
              status: journalFields.currentGrade === 'RED_FLAG' ? 'FAILED' : 'VERIFIED',
              explanation: journalFields.currentGrade === 'RED_FLAG' ? 'No active Crossref DOI prefix assigned' : '100% resolution rate across registered Crossref digital object identifiers',
              sourceName: 'Crossref REST API',
            },
            {
              pillar: 'PRESERVATION',
              criterionKey: 'DIGITAL_ARCHIVING',
              name: 'Long-term Archival Preservation',
              maxPoints: 15,
              awardedPoints: journalFields.currentGrade === 'RED_FLAG' ? 2 : 14.5,
              status: journalFields.currentGrade === 'RED_FLAG' ? 'FAILED' : 'VERIFIED',
              explanation: journalFields.currentGrade === 'RED_FLAG' ? 'No confirmed deposits in CLOCKSS, Portico, or PKP PN' : 'Confirmed continuous preservation deposits in Portico & CLOCKSS',
              sourceName: 'Keepers Registry',
            },
          ]
        }
      },
    });

    // Add to Watchlist
    await prisma.watchlistEntry.create({
      data: {
        organizationId: org.id,
        userId: researcherUser.id,
        journalId: journal.id,
        category: journalFields.currentGrade === 'RED_FLAG' ? 'FLAGGED' : 'APPROVED',
        notes: `Initial institutional baseline evaluation for ${journal.title}`,
      },
    });
  }
  console.log('✔ Seeded 4 Verified Journals with Detailed Criteria & Watchlist records');

  // 6. Seed Sample DOIs for DOI Doctor
  const sampleDois = [
    {
      doi: '10.1038/s41586-020-2649-2',
      title: 'Structural basis of SARS-CoV-2 entry by the ACE2 receptor',
      registeredUrl: 'https://www.nature.com/articles/s41586-020-2649-2',
      resolvedUrl: 'https://www.nature.com/articles/s41586-020-2649-2',
      httpStatus: 200,
      isResolving: true,
      citationCount: 4230,
      metadataCompleteness: 98.0,
      hasAbstract: true,
      hasReferences: true,
      hasLicense: true,
      hasFunding: true,
      hasArchive: true,
    },
    {
      doi: '10.1371/journal.pone.0245421',
      title: 'A randomized controlled trial of digital behavioral intervention for stress management',
      registeredUrl: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0245421',
      resolvedUrl: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0245421',
      httpStatus: 200,
      isResolving: true,
      citationCount: 38,
      metadataCompleteness: 95.0,
      hasAbstract: true,
      hasReferences: true,
      hasLicense: true,
      hasFunding: true,
      hasArchive: true,
    },
    {
      doi: '10.9999/broken-article-link-sample',
      title: 'Preliminary Study on Synthetic Materials in Tropical Environments',
      registeredUrl: 'http://defunct-domain-academic-publisher.biz/art/404',
      resolvedUrl: null,
      httpStatus: 404,
      isResolving: false,
      citationCount: 0,
      metadataCompleteness: 20.0,
      hasAbstract: false,
      hasReferences: false,
      hasLicense: false,
      hasFunding: false,
      hasArchive: false,
    }
  ];

  for (const d of sampleDois) {
    await prisma.dOIRecord.upsert({
      where: { doi: d.doi },
      update: d,
      create: d,
    });
  }
  console.log('✔ Seeded Sample DOIs (Resolving and Defunct for testing)');

  console.log('--- Smart Scholars Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
