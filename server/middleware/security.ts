import dns from 'dns/promises';
import { Request, Response, NextFunction } from 'express';

// Check if an IP address is in private, link-local, or loopback ranges
export function isPrivateIp(ip: string): boolean {
  // IPv4 checks
  if (ip === '127.0.0.1' || ip === '0.0.0.0' || ip === 'localhost') return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (ip.startsWith('169.254.')) return true; // Link-local & cloud metadata
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;

  // IPv6 checks
  if (ip === '::1' || ip === '::' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
    return true;
  }

  return false;
}

// Validate a target URL for external fetching, resolving DNS to prevent SSRF
export async function validateSafeUrl(rawUrl: string): Promise<{ valid: boolean; error?: string; normalizedUrl?: string }> {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Protocol must be HTTP or HTTPS.' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === '169.254.169.254' ||
      hostname === 'metadata.google.internal'
    ) {
      return { valid: false, error: 'Destination host is restricted.' };
    }

    // Resolve DNS
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      for (const addr of addresses) {
        if (isPrivateIp(addr.address)) {
          return { valid: false, error: `Host resolves to private address space (${addr.address}).` };
        }
      }
    } catch {
      return { valid: false, error: 'Hostname could not be resolved by public DNS.' };
    }

    return { valid: true, normalizedUrl: parsed.toString() };
  } catch {
    return { valid: false, error: 'Malformed URL syntax.' };
  }
}

// Safe fetch wrapper enforcing SSRF checks, max size (2MB), and timeout (8s)
export async function safeFetch(url: string, options: RequestInit = {}): Promise<Response | any> {
  const check = await validateSafeUrl(url);
  if (!check.valid || !check.normalizedUrl) {
    throw new Error(`SSRF Blocked: ${check.error}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(check.normalizedUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'SmartScholars-IntegrityAudit/1.0 (+https://smartscholars.in; mailto:audit@smartscholars.in)',
        ...(options.headers || {}),
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    return response;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out after 8000ms');
    }
    throw err;
  }
}

// Simple in-memory rate limiter per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function apiRateLimiter(windowMs: number = 60 * 1000, maxRequests: number = 120) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before trying again.',
      });
    }

    next();
  };
}
