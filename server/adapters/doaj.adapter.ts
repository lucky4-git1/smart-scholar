interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T, ttlMs: number = 1000 * 60 * 60): void {
  memoryCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export class DOAJAdapter {
  private static baseUrl = 'https://doaj.org/api/v2';

  /**
   * Search DOAJ by ISSN
   */
  static async checkIssn(issn: string): Promise<any | null> {
    const cleanIssn = issn.replace(/[^0-9X-]/gi, '').trim();
    const cacheKey = `doaj:issn:${cleanIssn}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    try {
      const url = `${this.baseUrl}/search/journals/issn:${encodeURIComponent(cleanIssn)}?pageSize=1`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!res.ok) return null;

      const json = await res.json();
      const first = json.results?.[0];
      if (!first || !first.bibjson) return null;

      const b = first.bibjson;
      const preservationList = Array.isArray(b.preservation?.service) ? b.preservation.service : [];
      const depositList = Array.isArray(b.deposit_policy) ? b.deposit_policy : [];

      const result = {
        title: b.title,
        publisher: b.publisher?.name,
        isDoajIndexed: true,
        license: b.license?.[0]?.type || 'Unknown License',
        hasApc: Boolean(b.apc?.has_apc),
        apcMax: b.apc?.max?.[0]?.price || null,
        apcCurrency: b.apc?.max?.[0]?.currency || null,
        preservationServices: preservationList.map((s: any) => typeof s === 'string' ? s : s.service),
        oaStartYear: b.oa_start?.year || null,
        editorialReviewType: b.editorial_review?.review_type || null,
        plagiarismDetection: Boolean(b.plagiarism_detection?.has_detection),
        depositPolicy: depositList.map((p: any) => typeof p === 'string' ? p : p.service),
        doajSeal: Boolean(first.admin?.seal),
      };

      setCached(cacheKey, result);
      return result;
    } catch (err) {
      clearTimeout(timer);
      console.warn(`DOAJ ISSN ${cleanIssn} check failed:`, err);
      return null;
    }
  }
}
