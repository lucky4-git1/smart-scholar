import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileCheck2, 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Code2, 
  Wrench,
  Clock
} from 'lucide-react';
import { SeverityBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';
import { AuditJob } from '../types';

export const JournalAuditPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialUrl = searchParams.get('url') || '';

  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [activeJob, setActiveJob] = useState<AuditJob | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll active audit job if running
  useEffect(() => {
    if (!activeJob || activeJob.status === 'COMPLETED' || activeJob.status === 'FAILED') return;

    const interval = setInterval(async () => {
      try {
        const res = await apiRequest(`/api/v1/audit/${activeJob.id}`);
        if (res.audit) {
          setActiveJob(res.audit);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await apiRequest('/api/v1/audit', {
        method: 'POST',
        body: JSON.stringify({ targetUrl: targetUrl.trim() }),
      });

      if (res.success && res.auditJobId) {
        const jobRes = await apiRequest(`/api/v1/audit/${res.auditJobId}`);
        setActiveJob(jobRes.audit);
      }
    } catch (err: any) {
      setError(err.message || 'Audit crawl initiation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
          Journal Audit · Indexing Readiness Scanner
        </span>
        <h1 className="font-display text-3xl font-extrabold text-zinc-100 tracking-tight mt-1">
          Know Exactly What Stands Between Your Journal and Indexing
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Evaluates 121 criteria across 11 areas required by Scopus, Web of Science, and DOAJ. Inspects editorial board transparency, peer review disclosures, APC statements, licensing, and persistent DOIs.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 shadow-tactile max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
              Journal Homepage URL
            </label>
            <div className="flex items-center bg-zinc-900 border border-zinc-700/80 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-400/20 rounded-lg p-1.5">
              <input
                type="url"
                required
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://journal-example.org or https://bmjopen.bmj.com"
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="ss-btn-primary px-5 py-2 text-xs whitespace-nowrap"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Audit'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict SSRF defense: Private subnets (RFC 1918) and cloud metadata services are blocked.</span>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Active Audit Execution / Progress View */}
      {activeJob && (
        <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-tactile">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                AUDIT JOB #{activeJob.id.substring(0, 8).toUpperCase()}
              </span>
              <h2 className="font-display font-semibold text-lg text-zinc-100 mt-1 truncate max-w-xl">
                {activeJob.targetUrl}
              </h2>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-2.5 py-1 rounded border uppercase ${
                activeJob.status === 'COMPLETED'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                  : activeJob.status === 'FAILED'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                {activeJob.status}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Scanning editorial pages and policy declarations...</span>
              <span>{activeJob.progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-2 rounded-sm overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-sm transition-all duration-300"
                style={{ width: `${activeJob.progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Completed Metrics Summary */}
          {activeJob.status === 'COMPLETED' && (
            <div className="space-y-6 pt-4 border-t border-zinc-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Indexing Readiness</span>
                  <span className="font-mono text-2xl font-bold text-zinc-100 tabular-nums">
                    {activeJob.score}%
                  </span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                  <span className="text-[10px] font-mono text-rose-400 uppercase block">Critical Deficiencies</span>
                  <span className="font-mono text-2xl font-bold text-rose-400 tabular-nums">
                    {activeJob.criticalCount}
                  </span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                  <span className="text-[10px] font-mono text-amber-400 uppercase block">Warnings</span>
                  <span className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
                    {activeJob.warningCount}
                  </span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Passed Checks</span>
                  <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
                    {activeJob.infoCount}
                  </span>
                </div>

              </div>

              {/* Navigation to Findings and Repair Plan */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/journal-audit/${activeJob.id}/findings`}
                  className="ss-btn-primary text-xs py-2 px-4"
                >
                  <AlertTriangle className="w-4 h-4 text-zinc-900" />
                  <span>Inspect Audit Findings ({activeJob.totalFindings})</span>
                </Link>
                <Link
                  to={`/journal-audit/${activeJob.id}/repair-plan`}
                  className="ss-btn-secondary text-xs py-2 px-4"
                >
                  <Wrench className="w-4 h-4 text-zinc-300" />
                  <span>View Actionable Repair Plan</span>
                </Link>
              </div>
            </div>
          )}

          {activeJob.status === 'FAILED' && (
            <div className="p-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              Audit Error: {activeJob.errorMessage || 'Unable to complete crawl.'}
            </div>
          )}
        </div>
      )}

      {/* 121 Criteria Overview Cards */}
      <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-tactile">
        <h3 className="font-display font-bold text-base text-zinc-100">
          121 Criteria Evaluated Across 11 Areas
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          Our crawler tests every domain against the specific criteria used by Scopus Content Selection & Advisory Board (CSAB), Web of Science Editorial Quality Evaluation, and DOAJ Criteria for Inclusion.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs text-zinc-300">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">1. Editorial Board Integrity</div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">2. Peer Review Transparency</div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">3. APC & Fee Disclosure</div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">4. COPE Publication Ethics</div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">5. Plagiarism Screening</div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">6. DOI Implementation</div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">7. Creative Commons License</div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">8. Digital Archiving Escrow</div>
        </div>
      </div>

    </div>
  );
};
