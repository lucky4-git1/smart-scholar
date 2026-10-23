import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';
import { DoiResolverAdapter } from '../server/adapters/doi-resolver.adapter';
import { isPrivateIp } from '../server/middleware/security';

describe('Smart Scholars System & Security Tests', () => {
  it('GET /api/health should return healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('Smart Scholars');
  });

  it('SSRF blocker must correctly identify private, loopback, and metadata IPs', () => {
    expect(isPrivateIp('127.0.0.1')).toBe(true);
    expect(isPrivateIp('10.0.0.1')).toBe(true);
    expect(isPrivateIp('192.168.1.1')).toBe(true);
    expect(isPrivateIp('169.254.169.254')).toBe(true);
    expect(isPrivateIp('172.16.0.1')).toBe(true);
    expect(isPrivateIp('::1')).toBe(true);
    expect(isPrivateIp('8.8.8.8')).toBe(false);
    expect(isPrivateIp('104.244.42.1')).toBe(false);
  });

  it('DoiResolverAdapter should validate DOI syntax correctly', () => {
    expect(DoiResolverAdapter.isValidSyntax('10.1038/s41586-020-2649-2')).toBe(true);
    expect(DoiResolverAdapter.isValidSyntax('10.1371/journal.pone.0245421')).toBe(true);
    expect(DoiResolverAdapter.isValidSyntax('not-a-doi')).toBe(false);
    expect(DoiResolverAdapter.isValidSyntax('http://example.com')).toBe(false);
  });

  it('GET /api/v1/journals/search returns seeded journals', async () => {
    const res = await request(app).get('/api/v1/journals/search?q=Nature');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].title).toBe('Nature');
  });

  it('GET /api/v1/indexing/directory returns indexing services', async () => {
    const res = await request(app).get('/api/v1/indexing/directory');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.services.length).toBeGreaterThanOrEqual(4);
  });

  it('POST /api/v1/assistant/ask returns deterministic grounded response', async () => {
    const res = await request(app)
      .post('/api/v1/assistant/ask')
      .send({ message: 'What is the 5-pillar scoring methodology?' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reply).toContain('Identity & Governance');
  });
});
