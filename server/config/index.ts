import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'smartscholars-default-dev-secret-key-replace-in-prod',
  sessionSecret: process.env.SESSION_SECRET || 'smartscholars-session-cookie-secret-key',
  crossrefMailto: process.env.CROSSREF_MAILTO || 'integrity@smartscholars.in',
  openalexEmail: process.env.OPENALEX_EMAIL || 'integrity@smartscholars.in',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  jobPollIntervalMs: parseInt(process.env.JOB_POLL_INTERVAL_MS || '2000', 10),
  maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '5', 10),
};
