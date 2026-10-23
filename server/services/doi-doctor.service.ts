import { prisma } from '../database/prisma';
import { CrossrefAdapter } from '../adapters/crossref.adapter';
import { DoiResolverAdapter, DoiResolutionResult } from '../adapters/doi-resolver.adapter';

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
  metadataCompleteness: number; // 0 - 100%
  checks: {
    hasAbstract: boolean;
    hasReferences: boolean;
    hasLicense: boolean;
    hasFunding: boolean;
    hasArchive: boolean;
  };
  checkedAt: string;
}

export class DoiDoctorService {
  /**
   * Run a comprehensive inspection on a single DOI
   */
  static async inspectDoi(rawDoi: string): Promise<DoiInspection> {
    const cleanDoi = rawDoi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim();

    // 1. Check HTTP Resolution
    const resResult: DoiResolutionResult = await DoiResolverAdapter.resolveDoi(cleanDoi);

    // 2. Fetch Crossref Metadata (fallback to persisted record if external registry times out)
    let work = await CrossrefAdapter.getWorkByDoi(cleanDoi);
    const existing = await prisma.dOIRecord.findUnique({ where: { doi: cleanDoi } });

    // 3. Compute Metadata Completeness Score
    let completeness = 20; // Base points for resolving
    const checks = {
      hasAbstract: work?.hasAbstract ?? existing?.hasAbstract ?? false,
      hasReferences: work?.hasReferences ?? existing?.hasReferences ?? false,
      hasLicense: work?.hasLicense ?? existing?.hasLicense ?? false,
      hasFunding: work?.hasFunding ?? existing?.hasFunding ?? false,
      hasArchive: work?.hasArchive ?? existing?.hasArchive ?? false,
    };

    if (checks.hasAbstract) completeness += 20;
    if (checks.hasReferences) completeness += 20;
    if (checks.hasLicense) completeness += 15;
    if (checks.hasFunding) completeness += 15;
    if (checks.hasArchive) completeness += 10;

    const inspection: DoiInspection = {
      doi: cleanDoi,
      isValidSyntax: resResult.isValidSyntax,
      isResolving: resResult.isResolving,
      httpStatus: resResult.httpStatus,
      resolvedUrl: resResult.resolvedUrl,
      latencyMs: resResult.latencyMs,
      errorMessage: resResult.errorMessage,
      title: work?.title || existing?.title || 'Unknown Title',
      publisher: work?.publisher || (existing as any)?.publisher || 'Unknown Publisher',
      citationCount: work?.citationCount ?? existing?.citationCount ?? 0,
      metadataCompleteness: Math.min(100, completeness),
      checks,
      checkedAt: resResult.checkedAt,
    };

    // 4. Upsert DOIRecord in database
    await prisma.dOIRecord.upsert({
      where: { doi: cleanDoi },
      update: {
        title: inspection.title,
        registeredUrl: work?.registeredUrl || null,
        resolvedUrl: inspection.resolvedUrl,
        httpStatus: inspection.httpStatus,
        isResolving: inspection.isResolving,
        citationCount: inspection.citationCount,
        metadataCompleteness: inspection.metadataCompleteness,
        hasAbstract: checks.hasAbstract,
        hasReferences: checks.hasReferences,
        hasLicense: checks.hasLicense,
        hasFunding: checks.hasFunding,
        hasArchive: checks.hasArchive,
        lastCheckedAt: new Date(),
      },
      create: {
        doi: cleanDoi,
        title: inspection.title,
        registeredUrl: work?.registeredUrl || null,
        resolvedUrl: inspection.resolvedUrl,
        httpStatus: inspection.httpStatus,
        isResolving: inspection.isResolving,
        citationCount: inspection.citationCount,
        metadataCompleteness: inspection.metadataCompleteness,
        hasAbstract: checks.hasAbstract,
        hasReferences: checks.hasReferences,
        hasLicense: checks.hasLicense,
        hasFunding: checks.hasFunding,
        hasArchive: checks.hasArchive,
      },
    });

    return inspection;
  }

  /**
   * Run batch inspection on a list of DOIs
   */
  static async inspectBatch(dois: string[]): Promise<DoiInspection[]> {
    const unique = Array.from(new Set(dois.map(d => d.trim()).filter(Boolean))).slice(0, 50);
    const results: DoiInspection[] = [];

    for (const d of unique) {
      try {
        const item = await this.inspectDoi(d);
        results.push(item);
      } catch (err: any) {
        results.push({
          doi: d,
          isValidSyntax: false,
          isResolving: false,
          httpStatus: null,
          resolvedUrl: null,
          latencyMs: 0,
          errorMessage: err.message || 'Error inspecting DOI',
          metadataCompleteness: 0,
          checks: {
            hasAbstract: false,
            hasReferences: false,
            hasLicense: false,
            hasFunding: false,
            hasArchive: false,
          },
          checkedAt: new Date().toISOString(),
        });
      }
    }

    return results;
  }

  /**
   * Reconcile an article CSV census against live DOI registry
   */
  static async reconcileCensus(csvLines: Array<{ title: string; doi: string; volume?: string; issue?: string }>) {
    const totalRecords = csvLines.length;
    let resolvedCount = 0;
    let brokenCount = 0;
    let missingDoiCount = 0;

    const reconciledRows = [];

    for (const row of csvLines.slice(0, 100)) {
      if (!row.doi || row.doi.trim().length === 0) {
        missingDoiCount++;
        reconciledRows.push({
          ...row,
          status: 'MISSING_DOI',
          completeness: 0,
          remediation: 'Generate Crossref deposit payload and assign a valid DOI.',
        });
        continue;
      }

      const insp = await this.inspectDoi(row.doi);
      if (insp.isResolving) {
        resolvedCount++;
        reconciledRows.push({
          ...row,
          status: 'RESOLVING',
          completeness: insp.metadataCompleteness,
          citationCount: insp.citationCount,
          remediation: insp.metadataCompleteness < 70 ? 'Missing abstract, references, or license in Crossref deposit.' : 'Healthy record.',
        });
      } else {
        brokenCount++;
        reconciledRows.push({
          ...row,
          status: 'BROKEN_RESOLUTION',
          completeness: 0,
          remediation: `DOI returned HTTP ${insp.httpStatus || 404}. Update primary URL in Crossref deposit.`,
        });
      }
    }

    return {
      totalRecords,
      resolvedCount,
      brokenCount,
      missingDoiCount,
      healthyRate: totalRecords > 0 ? Math.round((resolvedCount / totalRecords) * 100) : 0,
      rows: reconciledRows,
    };
  }
}
