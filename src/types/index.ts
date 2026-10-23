export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'RESEARCHER' | 'EDITOR' | 'INSTITUTION_ADMIN' | 'PORTFOLIO_MGR' | 'ADMIN';
  institution?: string;
  orcid?: string;
  memberships?: any[];
}

export interface JournalIdentifier {
  id: string;
  type: string;
  value: string;
  isPrimary: boolean;
}

export interface Journal {
  id: string;
  title: string;
  publisher?: string;
  country?: string;
  websiteUrl?: string;
  oaType?: string;
  apcAmount?: number;
  apcCurrency?: string;
  currentScore?: number;
  currentGrade?: string;
  doajIndexed?: boolean;
  crossrefActive?: boolean;
  lastAssessedAt?: string;
  identifiers: JournalIdentifier[];
  isExternal?: boolean;
  openalexStats?: {
    worksCount: number;
    twoYearCitedness: number;
  };
}

export interface CriterionResult {
  id: string;
  pillar: 'IDENTITY' | 'EDITORIAL' | 'TECHNICAL' | 'PRESERVATION' | 'REACH';
  criterionKey: string;
  name: string;
  description?: string;
  maxPoints: number;
  awardedPoints: number;
  status: 'VERIFIED' | 'FAILED' | 'UNAVAILABLE' | 'NOT_APPLICABLE';
  explanation: string;
  sourceName: string;
  sourceUrl?: string;
}

export interface EvidenceRecord {
  id: string;
  sourceName: string;
  endpointUrl: string;
  httpStatus?: number;
  extractedSummary?: string;
  verifiedAt: string;
}

export interface JournalAssessment {
  id: string;
  journalId: string;
  totalScore: number;
  letterGrade: string;
  identityGovernanceScore: number;
  editorialIntegrityScore: number;
  technicalStandingScore: number;
  preservationAccessScore: number;
  reachCitationScore: number;
  redFlagCount: number;
  summaryText?: string;
  createdAt: string;
  criteriaResults: CriterionResult[];
  evidenceRecords: EvidenceRecord[];
}

export interface AuditJob {
  id: string;
  targetUrl: string;
  status: 'QUEUED' | 'CRAWLING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  progressPercent: number;
  totalPagesParsed: number;
  totalFindings: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  score?: number;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  findings?: AuditFinding[];
  repairPlans?: RepairRecommendation[];
}

export interface AuditFinding {
  id: string;
  auditJobId: string;
  category: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  affectedUrl?: string;
  ruleKey: string;
}

export interface RepairRecommendation {
  id: string;
  auditJobId: string;
  priority: number;
  title: string;
  actionPlan: string;
  codeTemplate?: string;
  status: string;
}

export interface DoiInspection {
  doi: string;
  isValidSyntax: boolean;
  isResolving: boolean;
  httpStatus: number | null;
  resolvedUrl: string | null;
  latencyMs: number;
  errorMessage?: string;
  title?: string;
  publisher?: string;
  citationCount?: number;
  metadataCompleteness: number;
  checks: {
    hasAbstract: boolean;
    hasReferences: boolean;
    hasLicense: boolean;
    hasFunding: boolean;
    hasArchive: boolean;
  };
  checkedAt: string;
}

export interface IndexingService {
  id: string;
  name: string;
  slug: string;
  category: string;
  websiteUrl: string;
  applicationUrl: string;
  acceptanceRateEst?: string;
  reviewPeriodMonths?: string;
  scopeDescription: string;
  requirementsSummary: string;
  evaluationCriteria: string; // JSON string
  feeDescription?: string;
}

export interface IndexingApplication {
  id: string;
  journalId: string;
  indexingServiceId: string;
  status: 'PREPARING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  dossierNotes?: string;
  targetSubmitDate?: string;
  submissionDate?: string;
  decisionDate?: string;
  journal: Journal;
  indexingService: IndexingService;
}
