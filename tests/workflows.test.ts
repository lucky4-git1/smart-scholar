import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server/index';
import { TrustRatingService } from '../server/services/trust-rating.service';
import { DoiDoctorService } from '../server/services/doi-doctor.service';
import { DoiResolverAdapter } from '../server/adapters/doi-resolver.adapter';
import { validateSafeUrl, isPrivateIp } from '../server/middleware/security';

describe('Comprehensive Smart Scholars Test Suite', () => {
  let authToken = '';
  let adminToken = '';
  let testUserId = '';
  let createdJournalId = '';
  let createdAuditJobId = '';

  // 1. UNIT TESTS
  describe('Unit Tests: Core Algorithms & Security', () => {
    it('Deterministic 5-pillar scoring: evaluates legitimate journal to Grade A/A+', async () => {
      const result = await TrustRatingService.evaluateJournal({
        title: 'PLOS ONE',
        issn: '1932-6203',
        publisher: 'Public Library of Science',
      });

      expect(result.totalScore).toBeGreaterThanOrEqual(75);
      expect(['A+', 'A', 'B']).toContain(result.letterGrade);
      expect(result.pillarScores.identity).toBeGreaterThan(0);
      expect(result.pillarScores.editorial).toBeGreaterThan(0);
      expect(result.pillarScores.technical).toBeGreaterThan(0);
      expect(result.pillarScores.preservation).toBeGreaterThan(0);
      expect(result.pillarScores.reach).toBeGreaterThan(0);
      expect(result.criteria.length).toBeGreaterThanOrEqual(8);
    });

    it('Deterministic 5-pillar scoring: missing ISSN triggers red flag deductions', async () => {
      const result = await TrustRatingService.evaluateJournal({
        title: 'Questionable Rapid Publication Journal',
      });

      expect(result.redFlags.length).toBeGreaterThan(0);
      expect(result.criteria.find(c => c.criterionKey === 'ISSN_VERIFIED')?.status).toBe('FAILED');
    });

    it('DOI syntax and validation', () => {
      expect(DoiResolverAdapter.isValidSyntax('10.1038/nature12345')).toBe(true);
      expect(DoiResolverAdapter.isValidSyntax('10.1371/journal.pone.0000001')).toBe(true);
      expect(DoiResolverAdapter.isValidSyntax('invalid/doi')).toBe(false);
      expect(DoiResolverAdapter.isValidSyntax('10.123')).toBe(false);
    });

    it('SSRF URL validation: rejects localhost, internal subnets and cloud metadata', async () => {
      const localCheck = await validateSafeUrl('http://localhost:8080/admin');
      expect(localCheck.valid).toBe(false);

      const metadataCheck = await validateSafeUrl('http://169.254.169.254/latest/meta-data/');
      expect(metadataCheck.valid).toBe(false);

      const internalCheck = await validateSafeUrl('http://10.0.0.5/api');
      expect(internalCheck.valid).toBe(false);
    });

    it('Private IP detection matches standard RFC 1918 and loopback', () => {
      expect(isPrivateIp('127.0.0.1')).toBe(true);
      expect(isPrivateIp('192.168.0.100')).toBe(true);
      expect(isPrivateIp('172.20.0.1')).toBe(true);
      expect(isPrivateIp('1.1.1.1')).toBe(false);
    });
  });

  // 2. INTEGRATION TESTS
  describe('Integration Tests: API Endpoints & RBAC', () => {
    it('POST /api/v1/auth/register creates a new user account and returns token', async () => {
      const testEmail = `researcher_${Date.now()}@cambridge-academic.org`;
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'SecurePassword123!',
          fullName: 'Dr. Alistair Finch',
          institution: 'University of Cambridge',
          role: 'RESEARCHER',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      authToken = res.body.token;
      testUserId = res.body.user.id;
    });

    it('POST /api/v1/auth/login authenticates admin user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@smartscholars.in',
          password: 'Admin@SmartScholars2026',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('ADMIN');
      adminToken = res.body.token;
    });

    it('RBAC Enforcement: Unauthorized user is rejected from admin routes', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Admin can access protected system health and user directory', async () => {
      const res = await request(app)
        .get('/api/v1/admin/system-health')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.database.status).toBe('CONNECTED');
    });

    it('POST /api/v1/journals/assess evaluates and persists a journal assessment', async () => {
      const res = await request(app)
        .post('/api/v1/journals/assess')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'BMJ Open',
          issn: '2044-6055',
          publisher: 'BMJ Publishing Group',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.assessment).toBeDefined();
      expect(res.body.assessment.criteriaResults.length).toBeGreaterThan(0);
      createdJournalId = res.body.journal.id;
    });

    it('GET /api/v1/journals/:id/export exports verifiable assessment report', async () => {
      const res = await request(app)
        .get(`/api/v1/journals/${createdJournalId}/export`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.report.reportId).toBeDefined();
      expect(res.body.report.methodologyVersion).toBe('v1.2.0-2026');
      expect(res.body.report.evaluation.criteria.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/audit initiates safe journal readiness audit', async () => {
      const res = await request(app)
        .post('/api/v1/audit')
        .send({ targetUrl: 'https://bmjopen.bmj.com' });

      expect(res.status).toBe(202);
      expect(res.body.success).toBe(true);
      expect(res.body.auditJobId).toBeDefined();
      createdAuditJobId = res.body.auditJobId;
    });

    it('GET /api/v1/audit/:id retrieves audit job status', async () => {
      const res = await request(app)
        .get(`/api/v1/audit/${createdAuditJobId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.audit.targetUrl).toBe('https://bmjopen.bmj.com/');
    });

    it('POST /api/v1/doi/check verifies resolution and Crossref metadata completeness', async () => {
      const res = await request(app)
        .post('/api/v1/doi/check')
        .send({ doi: '10.1038/s41586-020-2649-2' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.inspection.doi).toBe('10.1038/s41586-020-2649-2');
      expect(res.body.inspection.isResolving).toBe(true);
      expect(res.body.inspection.metadataCompleteness).toBeGreaterThanOrEqual(50);
    });

    it('POST /api/v1/doi/census reconciles article inventory', async () => {
      const res = await request(app)
        .post('/api/v1/doi/census')
        .send({
          items: [
            { title: 'Article One', doi: '10.1038/s41586-020-2649-2' },
            { title: 'Article Broken', doi: '10.9999/broken-article-link-sample' },
            { title: 'Article No DOI', doi: '' },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.report.totalRecords).toBe(3);
      expect(res.body.report.resolvedCount).toBe(1);
      expect(res.body.report.brokenCount).toBe(1);
      expect(res.body.report.missingDoiCount).toBe(1);
    });

    it('Institutional Watchlist workflow: Add, List, and Delete', async () => {
      // 1. Add to Watchlist
      const addRes = await request(app)
        .post('/api/v1/institution/watchlist')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          journalId: createdJournalId,
          category: 'APPROVED',
          notes: 'Approved by Faculty Review Board',
        });

      expect(addRes.status).toBe(201);
      expect(addRes.body.entry.journalId).toBe(createdJournalId);
      const entryId = addRes.body.entry.id;

      // 2. List Watchlist
      const listRes = await request(app)
        .get('/api/v1/institution/watchlist?category=APPROVED');
      expect(listRes.status).toBe(200);
      expect(listRes.body.entries.some((e: any) => e.id === entryId)).toBe(true);

      // 3. Delete from Watchlist
      const delRes = await request(app)
        .delete(`/api/v1/institution/watchlist/${entryId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);
    });

    it('POST /api/v1/public/contact logs support message with tracking ID', async () => {
      const res = await request(app)
        .post('/api/v1/public/contact')
        .send({
          name: 'Prof. Helen Clark',
          email: 'h.clark@university.edu',
          subject: 'Methodology Question',
          message: 'Can you provide the raw weights for preservation escrow scoring?',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.ticketId).toBeDefined();
    });
  });
});
