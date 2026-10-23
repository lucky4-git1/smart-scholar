import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { prisma } from './database/prisma';
import { authMiddleware } from './middleware/auth';
import { apiRateLimiter } from './middleware/security';

// Route imports
import authRoutes from './api/v1/auth.routes';
import journalRoutes from './api/v1/journals.routes';
import auditRoutes from './api/v1/audit.routes';
import doiRoutes from './api/v1/doi.routes';
import indexingRoutes from './api/v1/indexing.routes';
import institutionRoutes from './api/v1/institution.routes';
import portfolioRoutes from './api/v1/portfolio.routes';
import adminRoutes from './api/v1/admin.routes';
import assistantRoutes from './api/v1/assistant.routes';
import publicRoutes from './api/v1/public.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Security and utility middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(apiRateLimiter(60 * 1000, 200));
app.use(authMiddleware);

// Health & Readiness Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Smart Scholars Research Integrity Platform',
  });
});

app.get('/api/ready', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready', database: 'connected' });
  } catch (err: any) {
    res.status(503).json({ status: 'not_ready', error: err.message });
  }
});

// Mount API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/journals', journalRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/doi', doiRoutes);
app.use('/api/v1/indexing', indexingRoutes);
app.use('/api/v1/institution', institutionRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/assistant', assistantRoutes);
app.use('/api/v1/public', publicRoutes);

// Serve static frontend assets in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found.' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In dev mode when dist/ has not been built yet, provide simple notice
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Smart Scholars API Ready</title></head>
          <body style="font-family:sans-serif; background:#0A0908; color:#FAF7F2; padding:40px;">
            <h2>Smart Scholars API Server is running on port ${config.port}</h2>
            <p>Access the frontend at <a href="http://localhost:3000" style="color:#E3BC9A;">http://localhost:3000</a> (Vite Dev Server) or run <code>npm run build</code>.</p>
          </body>
        </html>
      `);
    }
  });
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: config.nodeEnv === 'production' ? 'An internal server error occurred.' : err.message,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`\n======================================================`);
    console.log(`  SMART SCHOLARS RESEARCH INTEGRITY PLATFORM`);
    console.log(`  Backend API: http://localhost:${config.port}`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`======================================================\n`);
  });
}
