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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-[#0B192C]">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/journal-audit?url=${encodeURIComponent(job?.targetUrl || '')}`} className="text-xs font-mono text-[#475E79] hover:text-[#0B192C] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Audit Overview
        </Link>
        <Link to={`/journal-audit/${id}/repair-plan`} className="ss-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold">
          <Wrench className="w-3.5 h-3.5" />
          <span>Actionable Repair Checklist</span>
        </Link>
      </div>

      {/* Header */}
      <div className="ss-card p-6 shadow-paper">
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15 inline-block">
          Audited Target: {job?.targetUrl || id}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B192C] tracking-tight mt-2">
          Itemized Audit Findings ({findings.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 leading-relaxed">
          Page-level deficiencies categorized by severity according to international indexing inclusion guidelines.
        </p>

        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#0B192C]/15">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'ALL'
                ? 'bg-[#0B192C] text-[#FAF7F2] font-bold border-[#0B192C]'
                : 'bg-[#FFFFFF] text-[#475E79] border-[#0B192C]/20 hover:bg-[#FAF7F2]'
            }`}
          >
            ALL ({findings.length})
          </button>
          <button
            onClick={() => setSeverityFilter('CRITICAL')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'CRITICAL'
                ? 'bg-[#A81B1B] text-[#FAF7F2] font-bold border-[#A81B1B]'
                : 'bg-[#FFFFFF] text-[#A81B1B] border-[#A81B1B]/30 hover:bg-[#FAF7F2]'
            }`}
          >
            CRITICAL ({findings.filter(f => f.severity === 'CRITICAL').length})
          </button>
          <button
            onClick={() => setSeverityFilter('WARNING')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'WARNING'
                ? 'bg-[#EF8D41] text-[#FAF7F2] font-bold border-[#EF8D41]'
                : 'bg-[#FFFFFF] text-[#8C460C] border-[#E06B43]/50 hover:bg-[#FAF7F2]'
            }`}
          >
            WARNINGS ({findings.filter(f => f.severity === 'WARNING').length})
          </button>
          <button
            onClick={() => setSeverityFilter('INFO')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              severityFilter === 'INFO'
                ? 'bg-[#167C6B] text-[#FAF7F2] font-bold border-[#167C6B]'
                : 'bg-[#FFFFFF] text-[#167C6B] border-[#167C6B]/30 hover:bg-[#FAF7F2]'
            }`}
          >
            PASSED / INFO ({findings.filter(f => f.severity === 'INFO').length})
          </button>
        </div>
      </div>

      {/* Findings List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#475E79] font-mono">
          Loading findings...
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFindings.map((f) => (
            <div key={f.id} className="ss-card p-5 space-y-2.5 shadow-paper">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0B192C] px-2 py-0.5 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/15 font-semibold">
                    {f.category}
                  </span>
                </div>
                <span className="text-[10.5px] font-mono text-[#475E79] font-semibold">
                  {f.ruleKey}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#0B192C]">
                {f.title}
              </h3>

              <p className="text-xs text-[#475E79] leading-relaxed">
                {f.description}
              </p>

              {f.affectedUrl && (
                <div className="text-[11px] font-mono text-[#475E79] pt-2 border-t border-[#0B192C]/10">
                  Target Page: <span className="text-[#0B192C] font-semibold underline">{f.affectedUrl}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
