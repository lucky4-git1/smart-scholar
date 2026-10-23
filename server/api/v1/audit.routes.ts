import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';
import { validateSafeUrl } from '../../middleware/security';
import { JournalAuditService } from '../../services/journal-audit.service';

const router = Router();

// Create and trigger an indexing readiness audit
router.post('/', async (req: Request, res: Response) => {
  try {
    const { targetUrl } = req.body;
    if (!targetUrl) {
      return res.status(400).json({ success: false, error: 'Target URL is required.' });
    }

    // SSRF Safety Check
    const urlCheck = await validateSafeUrl(targetUrl);
    if (!urlCheck.valid || !urlCheck.normalizedUrl) {
      return res.status(400).json({ success: false, error: urlCheck.error || 'Invalid or prohibited URL.' });
    }

    // Create AuditJob record
    const auditJob = await prisma.auditJob.create({
      data: {
        targetUrl: urlCheck.normalizedUrl,
        userId: req.user?.id || null,
        status: 'QUEUED',
        progressPercent: 5,
      },
    });

    // Run audit asynchronously
    JournalAuditService.runAudit(auditJob.id).catch((err) => {
      console.error(`Async audit error for job ${auditJob.id}:`, err);
    });

    res.status(202).json({
      success: true,
      auditJobId: auditJob.id,
      status: 'QUEUED',
      targetUrl: auditJob.targetUrl,
      message: 'Journal audit initiated. Poll status at /api/v1/audit/:id',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to initiate audit.' });
  }
});

// Get audit job status
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const audit = await prisma.auditJob.findUnique({
      where: { id },
      include: {
        findings: { take: 5 },
        repairPlans: { take: 5 },
      },
    });

    if (!audit) {
      return res.status(404).json({ success: false, error: 'Audit job not found.' });
    }

    res.json({ success: true, audit });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching audit job.' });
  }
});

// Get all findings for an audit job
router.get('/:id/findings', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { severity, category } = req.query;

    const where: any = { auditJobId: id };
    if (severity) where.severity = severity as string;
    if (category) where.category = category as string;

    const findings = await prisma.auditFinding.findMany({
      where,
      orderBy: { severity: 'asc' },
    });

    res.json({ success: true, count: findings.length, findings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching findings.' });
  }
});

// Get prioritized repair plan
router.get('/:id/repair-plan', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repairPlans = await prisma.repairRecommendation.findMany({
      where: { auditJobId: id },
      orderBy: { priority: 'asc' },
    });

    res.json({ success: true, count: repairPlans.length, repairPlans });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching repair plan.' });
  }
});

export default router;
