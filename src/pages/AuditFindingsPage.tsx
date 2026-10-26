import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Wrench, ArrowLeft, Filter, ExternalLink, ShieldCheck } from 'lucide-react';
import { SeverityBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';
import { AuditFinding, AuditJob } from '../types';

export const AuditFindingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [job, setJob] = useState<AuditJob | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      apiRequest(`/api/v1/audit/${id}`),
      apiRequest(`/api/v1/audit/${id}/findings`),
    ])
      .then(([jobRes, findingsRes]) => {
        if (jobRes.audit) setJob(jobRes.audit);
        if (findingsRes.findings) setFindings(findingsRes.findings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const filteredFindings = findings.filter(f => {
    if (severityFilter === 'ALL') return true;
    return f.severity === severityFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/journal-audit?url=${encodeURIComponent(job?.targetUrl || '')}`} className="text-xs font-mono text-zinc-400 hover:text-zinc-100 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Audit Overview
        </Link>
        <Link to={`/journal-audit/${id}/repair-plan`} className="ss-btn-primary text-xs py-1.5 px-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>Actionable Repair Checklist</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6">
        <span className="text-[10px] font-mono uppercase text-emerald-400 block">
          Audited Target: {job?.targetUrl || id}
        </span>
        <h1 className="font-display text-2xl font-extrabold text-zinc-100 mt-1">
          Itemized Audit Findings ({findings.length})
        </h1>
        <p className="text-xs text-[#8A8173] mt-1">
          Page-level deficiencies categorized by severity according to international indexing inclusion guidelines.
        </p>

        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#221D18]">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
              severityFilter === 'ALL'
                ? 'bg-white text-zinc-950 font-semibold border-emerald-500/40 font-bold'
                : 'bg-[#18181b] text-[#9E9486] border-[#2C251F]'
            }`}
          >
            ALL ({findings.length})
          </button>
          <button
            onClick={() => setSeverityFilter('CRITICAL')}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
              severityFilter === 'CRITICAL'
                ? 'bg-rose-900 border-rose-600 text-rose-200 font-bold'
                : 'bg-[#18181b] text-rose-400 border-[#2C251F]'
            }`}
          >
            CRITICAL ({findings.filter(f => f.severity === 'CRITICAL').length})
          </button>
          <button
            onClick={() => setSeverityFilter('WARNING')}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
              severityFilter === 'WARNING'
                ? 'bg-amber-900 border-amber-600 text-amber-200 font-bold'
                : 'bg-[#18181b] text-amber-400 border-[#2C251F]'
            }`}
          >
            WARNINGS ({findings.filter(f => f.severity === 'WARNING').length})
          </button>
          <button
            onClick={() => setSeverityFilter('INFO')}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
              severityFilter === 'INFO'
                ? 'bg-zinc-800 border-zinc-600 text-zinc-200 font-bold'
                : 'bg-[#18181b] text-zinc-400 border-[#2C251F]'
            }`}
          >
            PASSED / INFO ({findings.filter(f => f.severity === 'INFO').length})
          </button>
        </div>
      </div>

      {/* Findings List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#9E9486]">
          Loading findings...
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFindings.map((f) => (
            <div key={f.id} className="ss-card p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8174] px-1.5 py-0.5 rounded bg-[#1B1814] border border-[#27272a]">
                    {f.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6E6457]">
                  {f.ruleKey}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-zinc-100">
                {f.title}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {f.description}
              </p>

              {f.affectedUrl && (
                <div className="text-[11px] font-mono text-[#8C8274] pt-2 border-t border-[#201B17]">
                  Target Page: <span className="text-emerald-400">{f.affectedUrl}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
