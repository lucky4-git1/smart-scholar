import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma';
import { DoiDoctorService } from '../../services/doi-doctor.service';
import { PreservationAdapter } from '../../adapters/preservation.adapter';

const router = Router();

// Single DOI resolution and metadata inspection
router.post('/check', async (req: Request, res: Response) => {
  try {
    const { doi } = req.body;
    if (!doi) {
      return res.status(400).json({ success: false, error: 'DOI string is required.' });
    }

    const inspection = await DoiDoctorService.inspectDoi(doi);
    res.json({ success: true, inspection });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'DOI check failed.' });
  }
});

// Batch DOI resolution check
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { dois } = req.body;
    if (!Array.isArray(dois) || dois.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of DOIs is required.' });
    }

    const results = await DoiDoctorService.inspectBatch(dois);
    res.json({
      success: true,
      totalChecked: results.length,
      resolvingCount: results.filter(r => r.isResolving).length,
      brokenCount: results.filter(r => !r.isResolving).length,
      results,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Batch DOI check failed.' });
  }
});

// DOI Census Reconciliation
router.post('/census', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array (title, doi) is required.' });
    }

    const report = await DoiDoctorService.reconcileCensus(items);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Census reconciliation failed.' });
  }
});

// Digital Preservation check (Wayback Machine)
router.post('/preservation', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'Target URL is required.' });
    }

    const result = await PreservationAdapter.checkWaybackAvailability(url);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Preservation check failed.' });
  }
});

// List recently monitored DOIs from DB
router.get('/records', async (req: Request, res: Response) => {
  try {
    const records = await prisma.dOIRecord.findMany({
      take: 20,
      orderBy: { lastCheckedAt: 'desc' },
    });
    res.json({ success: true, count: records.length, records });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error fetching DOI records.' });
  }
});

export default router;
