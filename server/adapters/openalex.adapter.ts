import { config } from '../config';

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

export class OpenAlexAdapter {
  private static baseUrl = 'https://api.openalex.org';

  private static getHeaders() {
    return {
      'User-Agent': `SmartScholars/1.0 (mailto:${config.openalexEmail})`,
      'Accept': 'application/json',
    };
  }

  /**
   * Search scholarly sources (journals) on OpenAlex
   */
  static async searchSources(query: string): Promise<any[]> {
    const cacheKey = `openalex:sources:${query}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) return cached;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    try {
      const url = `${this.baseUrl}/sources?search=${encodeURIComponent(query)}&per-page=5`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!res.ok) return [];

      const json = await res.json();
      const results = (json.results || []).map((src: any) => ({
        openalexId: src.id,
        displayName: src.display_name,
        issnL: src.issn_l,
        issn: src.issn || [],
        publisher: src.host_organization_name,
        isOa: src.is_oa,
        isInDoaj: src.is_in_doaj,
        worksCount: src.works_count || 0,
        citedByCount: src.cited_by_count || 0,
        twoYearMeanCitedness: src.summary_stats?.['2yr_mean_citedness'] || 0,
        hIndex: src.summary_stats?.h_index || 0,
        homepageUrl: src.homepage_url,
        apcUsd: src.apc_usd || null,
        countryCode: src.country_code,
      }));

      setCached(cacheKey, results);
      return results;
    } catch (err) {
      clearTimeout(timer);
      console.warn('OpenAlex search sources error:', err);
      return [];
    }
  }

  /**
   * Find source by ISSN on OpenAlex
   */
  static async getSourceByIssn(issn: string): Promise<any | null> {
    const cleanIssn = issn.replace(/[^0-9X-]/gi, '').trim();
    const cacheKey = `openalex:issn:${cleanIssn}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    try {
      const url = `${this.baseUrl}/sources?filter=issn:${encodeURIComponent(cleanIssn)}`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!res.ok) return null;

      const json = await res.json();
      const first = json.results?.[0];
      if (!first) return null;

      const mapped = {
        openalexId: first.id,
        displayName: first.display_name,
        issnL: first.issn_l,
        issn: first.issn || [],
        publisher: first.host_organization_name,
        isOa: first.is_oa,
        isInDoaj: first.is_in_doaj,
        worksCount: first.works_count || 0,
        citedByCount: first.cited_by_count || 0,
        twoYearMeanCitedness: first.summary_stats?.['2yr_mean_citedness'] || 0,
        hIndex: first.summary_stats?.h_index || 0,
        homepageUrl: first.homepage_url,
        apcUsd: first.apc_usd || null,
        countryCode: first.country_code,
      };

      setCached(cacheKey, mapped);
      return mapped;
    } catch (err) {
      clearTimeout(timer);
      console.warn(`OpenAlex ISSN ${cleanIssn} fetch failed:`, err);
      return null;
    }
  }
}
