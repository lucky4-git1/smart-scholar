export interface DoiResolutionResult {
  doi: string;
  isValidSyntax: boolean;
  isResolving: boolean;
  httpStatus: number | null;
  resolvedUrl: string | null;
  latencyMs: number;
  errorMessage?: string;
  checkedAt: string;
}

export class DoiResolverAdapter {
  private static DOI_REGEX = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/i;

  static isValidSyntax(doi: string): boolean {
    const clean = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim();
    return this.DOI_REGEX.test(clean);
  }

  static async resolveDoi(rawDoi: string): Promise<DoiResolutionResult> {
    const clean = rawDoi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim();
    const isValid = this.isValidSyntax(clean);
    const checkedAt = new Date().toISOString();

    if (!isValid) {
      return {
        doi: clean,
        isValidSyntax: false,
        isResolving: false,
        httpStatus: null,
        resolvedUrl: null,
        latencyMs: 0,
        errorMessage: 'Invalid DOI syntax format. Must begin with 10.xxxx/',
        checkedAt,
      };
    }

    const targetUrl = `https://doi.org/${encodeURIComponent(clean)}`;
    const startTime = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'SmartScholars-DoiDoctor/1.0 (+https://smartscholars.in; mailto:doidoctor@smartscholars.in)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timer);
      const latencyMs = Date.now() - startTime;
      const isResolving = response.status >= 200 && response.status < 400;

      return {
        doi: clean,
        isValidSyntax: true,
        isResolving,
        httpStatus: response.status,
        resolvedUrl: response.url || null,
        latencyMs,
        errorMessage: isResolving ? undefined : `Destination returned HTTP ${response.status}`,
        checkedAt,
      };
    } catch (err: any) {
      clearTimeout(timer);
      const latencyMs = Date.now() - startTime;
      const isTimeout = err.name === 'AbortError';

      return {
        doi: clean,
        isValidSyntax: true,
        isResolving: false,
        httpStatus: null,
        resolvedUrl: null,
        latencyMs,
        errorMessage: isTimeout ? 'DOI resolution request timed out (7000ms)' : (err.message || 'Network resolution failure'),
        checkedAt,
      };
    }
  }
}
