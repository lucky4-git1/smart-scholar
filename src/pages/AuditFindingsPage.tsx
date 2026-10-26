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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-[#0A3D36]">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/journal-audit?url=${encodeURIComponent(job?.targetUrl || '')}`} className="text-xs font-mono text-[#4B635E] hover:text-[#0A3D36] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Audit Overview
        </Link>
        <Link to={`/journal-audit/${id}/repair-plan`} className="ss-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold">
          <Wrench className="w-3.5 h-3.5" />
          <span>Actionable Repair Checklist</span>
        </Link>
      </div>

      {/* Header */}
      <div className="ss-card p-6 shadow-paper">
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15 inline-block">
          Audited Target: {job?.targetUrl || id}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Itemized Audit Findings ({findings.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 leading-relaxed">
          Page-level deficiencies categorized by severity according to international indexing inclusion guidelines.
        </p>

        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#0A3D36]/15">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'ALL'
                ? 'bg-[#0A3D36] text-[#FAF6EE] font-bold border-[#0A3D36]'
                : 'bg-[#FFFDF9] text-[#4B635E] border-[#0A3D36]/20 hover:bg-[#FAF6EE]'
            }`}
          >
            ALL ({findings.length})
          </button>
          <button
            onClick={() => setSeverityFilter('CRITICAL')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'CRITICAL'
                ? 'bg-[#A81B1B] text-[#FAF6EE] font-bold border-[#A81B1B]'
                : 'bg-[#FFFDF9] text-[#A81B1B] border-[#A81B1B]/30 hover:bg-[#FAF6EE]'
            }`}
          >
            CRITICAL ({findings.filter(f => f.severity === 'CRITICAL').length})
          </button>
          <button
            onClick={() => setSeverityFilter('WARNING')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'WARNING'
                ? 'bg-[#EF8D41] text-[#FAF6EE] font-bold border-[#EF8D41]'
                : 'bg-[#FFFDF9] text-[#8C460C] border-[#F6AC6D]/50 hover:bg-[#FAF6EE]'
            }`}
          >
            WARNINGS ({findings.filter(f => f.severity === 'WARNING').length})
          </button>
          <button
            onClick={() => setSeverityFilter('INFO')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'INFO'
                ? 'bg-[#109C89] text-[#FAF6EE] font-bold border-[#109C89]'
                : 'bg-[#FFFDF9] text-[#109C89] border-[#109C89]/30 hover:bg-[#FAF6EE]'
            }`}
          >
            PASSED / INFO ({findings.filter(f => f.severity === 'INFO').length})
          </button>
        </div>
      </div>

      {/* Findings List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#4B635E] font-mono">
          Loading findings...
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFindings.map((f) => (
            <div key={f.id} className="ss-card p-5 space-y-2.5 shadow-paper">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0A3D36] px-2 py-0.5 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/15 font-semibold">
                    {f.category}
                  </span>
                </div>
                <span className="text-[10.5px] font-mono text-[#4B635E] font-semibold">
                  {f.ruleKey}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#0A3D36]">
                {f.title}
              </h3>

              <p className="text-xs text-[#4B635E] leading-relaxed">
                {f.description}
              </p>

              {f.affectedUrl && (
                <div className="text-[11px] font-mono text-[#4B635E] pt-2 border-t border-[#0A3D36]/10">
                  Target Page: <span className="text-[#0A3D36] font-semibold underline">{f.affectedUrl}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
