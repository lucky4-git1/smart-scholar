import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';

const router = Router();

// Submit contact / support request
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const request = await prisma.supportRequest.create({
      data: {
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        userId: req.user?.id || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received by the Research Integrity Desk. A confirmation has been logged.',
      ticketId: request.id,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error submitting message.' });
  }
});

// Verified platform metrics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [journalsCount, assessmentsCount, indexingCount, doisCount] = await Promise.all([
      prisma.journal.count(),
      prisma.journalAssessment.count(),
      prisma.indexingService.count(),
      prisma.dOIRecord.count(),
    ]);

    res.json({
      success: true,
      stats: {
        indexedJournals: journalsCount,
        verifiedAssessments: assessmentsCount,
        indexingDirectories: indexingCount,
        monitoredDois: doisCount,
        methodologyVersion: 'v1.2.0-2026',
        activePillars: 5,
        totalCriteria: 121,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching stats.' });
  }
});

export default router;
