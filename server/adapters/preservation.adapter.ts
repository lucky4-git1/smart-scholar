export interface PreservationResult {
  url: string;
  isArchived: boolean;
  archiveUrl?: string;
  snapshotTimestamp?: string;
  preservationService: string;
  checkedAt: string;
}

export class PreservationAdapter {
  /**
   * Check if a journal or article URL is preserved in the Internet Archive
   */
  static async checkWaybackAvailability(targetUrl: string): Promise<PreservationResult> {
    const checkedAt = new Date().toISOString();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
      const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(apiUrl, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!res.ok) {
        return {
          url: targetUrl,
          isArchived: false,
          preservationService: 'Internet Archive (Wayback Machine)',
          checkedAt,
        };
      }

      const json = await res.json();
      const snapshot = json.archived_snapshots?.closest;

      if (snapshot && snapshot.available) {
        return {
          url: targetUrl,
          isArchived: true,
          archiveUrl: snapshot.url,
          snapshotTimestamp: snapshot.timestamp,
          preservationService: 'Internet Archive (Wayback Machine)',
          checkedAt,
        };
      }

      return {
        url: targetUrl,
        isArchived: false,
        preservationService: 'Internet Archive (Wayback Machine)',
        checkedAt,
      };
    } catch {
      clearTimeout(timer);
      return {
        url: targetUrl,
        isArchived: false,
        preservationService: 'Internet Archive (Wayback Machine)',
        checkedAt,
      };
    }
  }
}
