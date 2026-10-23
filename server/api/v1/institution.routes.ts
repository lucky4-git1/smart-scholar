import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';
import { requireAuth } from '../../middleware/auth';
import { TrustRatingService } from '../../services/trust-rating.service';

const router = Router();

// Institutional Desk Dashboard summary metrics
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const [approvedCount, flaggedCount, totalWatchlist, recentAssessments] = await Promise.all([
      prisma.watchlistEntry.count({ where: { category: 'APPROVED' } }),
      prisma.watchlistEntry.count({ where: { category: 'FLAGGED' } }),
      prisma.watchlistEntry.count(),
      prisma.journalAssessment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { journal: true },
      }),
    ]);

    res.json({
      success: true,
      metrics: {
        totalWatchlist,
        approvedCount,
        flaggedCount,
        complianceRate: totalWatchlist > 0 ? Math.round((approvedCount / totalWatchlist) * 100) : 100,
      },
      recentAssessments,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching institution dashboard.' });
  }
});

// Get institutional watchlist
router.get('/watchlist', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category) where.category = category as string;

    const entries = await prisma.watchlistEntry.findMany({
      where,
      include: {
        journal: {
          include: {
            identifiers: true,
            assessments: {
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    res.json({ success: true, count: entries.length, entries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching watchlist.' });
  }
});

// Add journal to watchlist
router.post('/watchlist', requireAuth, async (req: Request, res: Response) => {
  try {
    const { journalId, category, notes, organizationId } = req.body;
    if (!journalId) {
      return res.status(400).json({ success: false, error: 'journalId is required.' });
    }

    const entry = await prisma.watchlistEntry.create({
      data: {
        journalId,
        category: category || 'APPROVED',
        notes: notes || '',
        organizationId: organizationId || null,
        userId: req.user!.id,
      },
      include: { journal: true },
    });

    res.status(201).json({ success: true, entry });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error adding to watchlist.' });
  }
});

// Delete from watchlist
router.delete('/watchlist/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.watchlistEntry.delete({ where: { id } });
    res.json({ success: true, message: 'Removed from watchlist.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error deleting from watchlist.' });
  }
});

// Batch evaluate publication records from CSV data
router.post('/batch-evaluate', async (req: Request, res: Response) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of records (title, issn, doi) is required.' });
    }

    const evaluated = [];
    let compliantCount = 0;
    let flaggedCount = 0;

    for (const item of records.slice(0, 50)) {
      const evaluation = await TrustRatingService.evaluateJournal({
        title: item.journalTitle || item.title || '',
        issn: item.issn,
        publisher: item.publisher,
      });

      const isCompliant = evaluation.letterGrade === 'A+' || evaluation.letterGrade === 'A' || evaluation.letterGrade === 'B';
      if (isCompliant) compliantCount++;
      if (evaluation.letterGrade === 'RED_FLAG') flaggedCount++;

      evaluated.push({
        articleTitle: item.articleTitle || 'Untitled Publication',
        journalTitle: item.journalTitle || item.title,
        issn: item.issn,
        score: evaluation.totalScore,
        grade: evaluation.letterGrade,
        isCompliant,
        redFlags: evaluation.redFlags,
      });
    }

    res.json({
      success: true,
      totalEvaluated: evaluated.length,
      compliantCount,
      flaggedCount,
      complianceRate: evaluated.length > 0 ? Math.round((compliantCount / evaluated.length) * 100) : 0,
      results: evaluated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Batch evaluation failed.' });
  }
});

export default router;
