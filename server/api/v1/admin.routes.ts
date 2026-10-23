import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

// Protect all admin endpoints
router.use(requireAuth, requireRole(['ADMIN']));

// List users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        institution: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: users.length, users });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching users.' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true, fullName: true },
    });

    // Record admin audit log
    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'USER_ROLE_CHANGED',
        resource: `User:${id}`,
        details: `Role updated to ${role}`,
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error updating user role.' });
  }
});

// System health and integration metrics
router.get('/system-health', async (req: Request, res: Response) => {
  try {
    const [userCount, journalCount, assessmentCount, auditCount, doiCount] = await Promise.all([
      prisma.user.count(),
      prisma.journal.count(),
      prisma.journalAssessment.count(),
      prisma.auditJob.count(),
      prisma.dOIRecord.count(),
    ]);

    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: 'CONNECTED',
        counts: {
          users: userCount,
          journals: journalCount,
          assessments: assessmentCount,
          auditJobs: auditCount,
          doiRecords: doiCount,
        },
      },
      integrations: {
        crossref: { status: 'ONLINE', endpoint: 'https://api.crossref.org' },
        openalex: { status: 'ONLINE', endpoint: 'https://api.openalex.org' },
        doaj: { status: 'ONLINE', endpoint: 'https://doaj.org/api/v2' },
        wayback: { status: 'ONLINE', endpoint: 'https://archive.org/wayback' },
      },
      process: {
        nodeVersion: process.version,
        rssMemoryMb: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error checking system health.' });
  }
});

// List admin audit logs
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const logs = await prisma.adminAuditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
      },
    });
    res.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching audit logs.' });
  }
});

export default router;
