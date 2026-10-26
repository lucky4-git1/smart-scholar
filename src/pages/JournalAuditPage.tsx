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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[#0A3D36]">
      
      {/* Header */}
      <div className="border-b border-[#0A3D36]/15 pb-6">
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#F2E8D8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
          JOURNAL AUDIT · INDEXING READINESS SCANNER
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Know Exactly What Stands Between Your Journal and Indexing
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 max-w-2xl leading-relaxed">
          Evaluates 121 criteria across 11 areas required by Scopus, Web of Science, and DOAJ. Inspects editorial board transparency, peer review disclosures, APC statements, licensing, and persistent DOIs.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="ss-card p-6 shadow-paper max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#0A3D36] font-bold mb-1.5">
              Journal Homepage URL
            </label>
            <div className="flex items-center bg-[#FAF6EE] border-2 border-[#0A3D36] focus-within:border-[#109C89] rounded-sm p-1.5 shadow-retro-sm">
              <input
                type="url"
                required
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://journal-example.org or https://bmjopen.bmj.com"
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-[#0A3D36] placeholder-[#7A9891] focus:outline-none font-medium"
              />
              <button
                type="submit"
                disabled={submitting}
                className="ss-btn-primary px-5 py-2 text-xs whitespace-nowrap font-bold"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Audit'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#4B635E] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#109C89]" />
            <span>SSRF Protection Active: Local networks and cloud metadata endpoints are blocked.</span>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-mono">
            {error}
          </div>
        )}
      </div>

      {/* Active Audit Execution / Progress View */}
      {activeJob && (
        <div className="ss-card p-6 sm:p-8 space-y-6 shadow-retro">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0A3D36]/15 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#0A3D36] px-2 py-0.5 rounded-sm bg-[#F2E8D8] border border-[#0A3D36]/20 font-bold">
                AUDIT JOB #{activeJob.id.substring(0, 8).toUpperCase()}
              </span>
              <h2 className="font-serif font-bold text-xl text-[#0A3D36] mt-2 truncate max-w-xl">
                {activeJob.targetUrl}
              </h2>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-2.5 py-1 rounded-sm border uppercase font-bold ${
                activeJob.status === 'COMPLETED'
                  ? 'bg-[#E8F8F5] border-[#109C89] text-[#0A3D36]'
                  : activeJob.status === 'FAILED'
                  ? 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B]'
                  : 'bg-[#FEF5ED] border-[#F6AC6D] text-[#8C460C]'
              }`}>
                {activeJob.status}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-[#4B635E]">
              <span>Scanning editorial pages, metadata headers, and policy declarations...</span>
              <span className="font-bold text-[#0A3D36]">{activeJob.progressPercent}%</span>
            </div>
            <div className="w-full bg-[#EADBC6] h-2 rounded-sm overflow-hidden">
              <div
                className="bg-[#0A3D36] h-full rounded-sm transition-all duration-300"
                style={{ width: `${activeJob.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Completed Metrics Summary */}
          {activeJob.status === 'COMPLETED' && (
            <div className="space-y-6 pt-4 border-t border-[#0A3D36]/15">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-[#FAF6EE] border border-[#0A3D36]/20 p-4 rounded-sm">
                  <span className="text-[10px] font-mono text-[#4B635E] uppercase block font-semibold">Indexing Readiness</span>
                  <span className="font-mono text-2xl font-bold text-[#0A3D36] tabular-nums">
                    {activeJob.score}%
                  </span>
                </div>

                <div className="bg-[#FDF2F2] border border-[#E05252]/40 p-4 rounded-sm">
                  <span className="text-[10px] font-mono text-[#A81B1B] uppercase block font-semibold">Critical Deficiencies</span>
                  <span className="font-mono text-2xl font-bold text-[#A81B1B] tabular-nums">
                    {activeJob.criticalCount}
                  </span>
                </div>

                <div className="bg-[#FEF5ED] border border-[#F6AC6D]/50 p-4 rounded-sm">
                  <span className="text-[10px] font-mono text-[#8C460C] uppercase block font-semibold">Warnings</span>
                  <span className="font-mono text-2xl font-bold text-[#8C460C] tabular-nums">
                    {activeJob.warningCount}
                  </span>
                </div>

                <div className="bg-[#E8F8F5] border border-[#109C89]/40 p-4 rounded-sm">
                  <span className="text-[10px] font-mono text-[#0A3D36] uppercase block font-semibold">Passed Checks</span>
                  <span className="font-mono text-2xl font-bold text-[#109C89] tabular-nums">
                    {activeJob.infoCount}
                  </span>
                </div>

              </div>

              {/* Navigation to Findings and Repair Plan */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/journal-audit/${activeJob.id}/findings`}
                  className="ss-btn-primary text-xs py-2 px-4 font-bold"
                >
                  <AlertTriangle className="w-4 h-4 text-[#062923]" />
                  <span>Inspect Audit Findings ({activeJob.totalFindings})</span>
                </Link>
                <Link
                  to={`/journal-audit/${activeJob.id}/repair-plan`}
                  className="ss-btn-secondary text-xs py-2 px-4 font-bold"
                >
                  <Wrench className="w-4 h-4 text-[#0A3D36]" />
                  <span>View Actionable Repair Plan</span>
                </Link>
              </div>
            </div>
          )}

          {activeJob.status === 'FAILED' && (
            <div className="p-4 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-mono">
              Audit Error: {activeJob.errorMessage || 'Unable to complete crawl.'}
            </div>
          )}
        </div>
      )}

      {/* 121 Criteria Overview Cards */}
      <div className="ss-card p-6 sm:p-8 space-y-4 shadow-paper">
        <h3 className="font-serif font-bold text-xl text-[#0A3D36]">
          121 Criteria Evaluated Across 11 Areas
        </h3>
        <p className="text-xs text-[#4B635E] leading-relaxed max-w-3xl">
          Our crawler tests every domain against the specific criteria used by Scopus Content Selection & Advisory Board (CSAB), Web of Science Editorial Quality Evaluation, and DOAJ Criteria for Inclusion.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs text-[#0A3D36] font-medium">
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">1. Editorial Board Integrity</div>
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">2. Peer Review Transparency</div>
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">3. APC & Fee Disclosure</div>
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">4. COPE Publication Ethics</div>
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">5. Plagiarism Screening</div>
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">6. DOI Implementation</div>
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">7. Creative Commons License</div>
          <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm">8. Digital Archiving Escrow</div>
        </div>
      </div>

    </div>
  );
};
