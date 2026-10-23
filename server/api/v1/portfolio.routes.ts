import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';

const router = Router();

// Portfolio summary dashboard
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const [journals, doiStats] = await Promise.all([
      prisma.journal.findMany({
        take: 50,
        include: { identifiers: true },
      }),
      prisma.dOIRecord.findMany(),
    ]);

    const totalJournals = journals.length;
    const scores = journals.filter(j => j.currentScore !== null).map(j => j.currentScore as number);
    const avgScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;

    const totalDois = doiStats.length;
    const resolvingDois = doiStats.filter(d => d.isResolving).length;
    const brokenDois = totalDois - resolvingDois;

    res.json({
      success: true,
      metrics: {
        totalJournals,
        averageTrustScore: avgScore,
        totalDoisMonitored: totalDois,
        brokenDois,
        resolutionHealthRate: totalDois > 0 ? Math.round((resolvingDois / totalDois) * 100) : 100,
      },
      journals: journals.slice(0, 10),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching portfolio dashboard.' });
  }
});

// List journals in portfolio
router.get('/journals', async (req: Request, res: Response) => {
  try {
    const journals = await prisma.journal.findMany({
      include: {
        identifiers: true,
      },
      orderBy: { currentScore: 'desc' },
    });

    res.json({ success: true, count: journals.length, journals });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching portfolio journals.' });
  }
});

export default router;
