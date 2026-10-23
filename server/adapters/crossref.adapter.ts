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

function setCached<T>(key: string, data: T, ttlMs: number = 1000 * 60 * 30): void {
  memoryCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export class CrossrefAdapter {
  private static baseUrl = 'https://api.crossref.org';

  private static getHeaders() {
    return {
      'User-Agent': `SmartScholars-IntegrityAudit/1.0 (mailto:${config.crossrefMailto})`,
      'Accept': 'application/json',
    };
  }

  /**
   * Search journals in Crossref by query string or ISSN
   */
  static async searchJournals(query: string, rows: number = 5): Promise<any[]> {
    const cacheKey = `crossref:journals:${query}:${rows}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) return cached;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    try {
      const url = `${this.baseUrl}/journals?query=${encodeURIComponent(query)}&rows=${rows}`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!res.ok) {
        return [];
      }

      const json = await res.json();
      const items = json.message?.items || [];
      const results = items.map((item: any) => ({
        title: item.title,
        publisher: item.publisher,
        issn: item.ISSN || [],
        issnPrint: item['issn-type']?.find((i: any) => i.type === 'print')?.value,
        issnOnline: item['issn-type']?.find((i: any) => i.type === 'electronic')?.value,
        totalDoiCount: item.counts?.['total-dois'] || 0,
        currentDoiCount: item.counts?.['current-dois'] || 0,
        subjects: item.subjects || [],
        flags: item.flags || {},
        crossrefMemberId: item.member,
      }));

      setCached(cacheKey, results);
      return results;
    } catch (err) {
      clearTimeout(timer);
      console.warn('Crossref search error:', err);
      return [];
    }
  }

  /**
   * Fetch single journal metadata by ISSN from Crossref
   */
  static async getJournalByIssn(issn: string): Promise<any | null> {
    const cleanIssn = issn.replace(/[^0-9X-]/gi, '').trim();
    const cacheKey = `crossref:issn:${cleanIssn}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    try {
      const url = `${this.baseUrl}/journals/${encodeURIComponent(cleanIssn)}`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!res.ok) return null;

      const json = await res.json();
      const msg = json.message;
      if (!msg) return null;

      const details = {
        title: msg.title,
        publisher: msg.publisher,
        issn: msg.ISSN || [],
        issnPrint: msg['issn-type']?.find((i: any) => i.type === 'print')?.value,
        issnOnline: msg['issn-type']?.find((i: any) => i.type === 'electronic')?.value,
        totalDois: msg.counts?.['total-dois'] || 0,
        currentDois: msg.counts?.['current-dois'] || 0,
        breakdowns: msg.breakdowns || {},
        flags: msg.flags || {},
        crossrefMemberId: msg.member,
        subjects: msg.subjects || [],
      };

      setCached(cacheKey, details);
      return details;
    } catch (err) {
      clearTimeout(timer);
      console.warn(`Crossref ISSN ${cleanIssn} fetch failed:`, err);
      return null;
    }
  }

  /**
   * Fetch specific DOI metadata from Crossref
   */
  static async getWorkByDoi(doi: string): Promise<any | null> {
    const cleanDoi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim();
    const cacheKey = `crossref:doi:${cleanDoi}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    try {
      const url = `${this.baseUrl}/works/${encodeURIComponent(cleanDoi)}`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!res.ok) return null;

      const json = await res.json();
      const item = json.message;
      if (!item) return null;

      const work = {
        doi: item.DOI,
        title: item.title?.[0] || 'Untitled Work',
        containerTitle: item['container-title']?.[0] || '',
        publisher: item.publisher,
        publishedDate: item.published?.['date-parts']?.[0]?.join('-') || null,
        registeredUrl: item.resource?.primary?.URL || item.URL || null,
        citationCount: item['is-referenced-by-count'] || 0,
        referenceCount: item['references-count'] || 0,
        hasAbstract: Boolean(item.abstract),
        hasReferences: Boolean(item.reference && item.reference.length > 0),
        hasLicense: Boolean(item.license && item.license.length > 0),
        hasFunding: Boolean(item.funder && item.funder.length > 0),
        hasArchive: Boolean(item.archive && item.archive.length > 0),
        authors: (item.author || []).map((a: any) => ({
          name: `${a.given || ''} ${a.family || ''}`.trim(),
          orcid: a.ORCID || null,
        })),
        raw: item,
      };

      setCached(cacheKey, work);
      return work;
    } catch (err) {
      clearTimeout(timer);
      console.warn(`Crossref DOI ${cleanDoi} fetch failed:`, err);
      return null;
    }
  }
}
