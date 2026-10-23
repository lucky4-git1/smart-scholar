import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// Get indexing directory services
router.get('/directory', async (req: Request, res: Response) => {
  try {
    const services = await prisma.indexingService.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, count: services.length, services });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching indexing directory.' });
  }
});

// Get single indexing service details
router.get('/directory/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const service = await prisma.indexingService.findUnique({
      where: { slug },
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Indexing service not found.' });
    }

    res.json({ success: true, service });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching indexing service.' });
  }
});

// Get user's indexing applications
router.get('/applications', requireAuth, async (req: Request, res: Response) => {
  try {
    const applications = await prisma.indexingApplication.findMany({
      where: { userId: req.user!.id },
      include: {
        journal: true,
        indexingService: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, count: applications.length, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching applications.' });
  }
});

// Create a new indexing application
router.post('/applications', requireAuth, async (req: Request, res: Response) => {
  try {
    const { journalId, indexingServiceId, dossierNotes, targetSubmitDate } = req.body;

    if (!journalId || !indexingServiceId) {
      return res.status(400).json({ success: false, error: 'journalId and indexingServiceId are required.' });
    }

    const application = await prisma.indexingApplication.create({
      data: {
        journalId,
        indexingServiceId,
        userId: req.user!.id,
        status: 'PREPARING',
        dossierNotes: dossierNotes || '',
        targetSubmitDate: targetSubmitDate ? new Date(targetSubmitDate) : null,
      },
      include: {
        journal: true,
        indexingService: true,
      },
    });

    res.status(201).json({ success: true, application });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error creating application.' });
  }
});

// Update application dossier status
router.patch('/applications/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, dossierNotes, targetSubmitDate, submissionDate, decisionDate } = req.body;

    const existing = await prisma.indexingApplication.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    if (existing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const updated = await prisma.indexingApplication.update({
      where: { id },
      data: {
        status: status || existing.status,
        dossierNotes: dossierNotes !== undefined ? dossierNotes : existing.dossierNotes,
        targetSubmitDate: targetSubmitDate ? new Date(targetSubmitDate) : existing.targetSubmitDate,
        submissionDate: submissionDate ? new Date(submissionDate) : existing.submissionDate,
        decisionDate: decisionDate ? new Date(decisionDate) : existing.decisionDate,
      },
      include: {
        journal: true,
        indexingService: true,
      },
    });

    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error updating application.' });
  }
});

export default router;
