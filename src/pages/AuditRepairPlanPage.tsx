import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wrench, ArrowLeft, Check, Copy, Code2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { RepairRecommendation, AuditJob } from '../types';

export const AuditRepairPlanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [plans, setPlans] = useState<RepairRecommendation[]>([]);
  const [job, setJob] = useState<AuditJob | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      apiRequest(`/api/v1/audit/${id}`),
      apiRequest(`/api/v1/audit/${id}/repair-plan`),
    ])
      .then(([jobRes, plansRes]) => {
        if (jobRes.audit) setJob(jobRes.audit);
        if (plansRes.repairPlans) setPlans(plansRes.repairPlans);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyCode = (text: string, planId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(planId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleResolved = (planId: string) => {
    setResolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(planId)) next.delete(planId);
      else next.add(planId);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-[#0B192C]">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/journal-audit/${id}/findings`} className="text-xs font-mono text-[#475E79] hover:text-[#0B192C] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Findings
        </Link>
        <Link to={`/indexing/applications`} className="ss-btn-primary text-xs py-1.5 px-3 font-bold">
          <span>Prepare Indexing Application &rarr;</span>
        </Link>
      </div>

      {/* Header */}
      <div className="ss-card p-6 shadow-paper">
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15 inline-block">
          Remediation Blueprint · Audit #{id?.substring(0, 8).toUpperCase()}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B192C] tracking-tight mt-2">
          Actionable Repair Plan ({plans.length} Tasks)
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 leading-relaxed">
          Step-by-step technical and editorial modifications required to eliminate indexing blockers prior to dossier submission.
        </p>
      </div>

      {/* Repair Items */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#475E79] font-mono">
          Loading repair checklist...
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((p) => {
            const isResolved = resolvedIds.has(p.id);

            return (
              <div
                key={p.id}
                className={`ss-card p-5 space-y-3 transition-opacity shadow-paper ${
                  isResolved ? 'opacity-60 bg-[#FAF7F2]' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm border ${
                      p.priority === 1
                        ? 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B]'
                        : p.priority === 2
                        ? 'bg-[#FAF7F2] border-[#E06B43] text-[#8C460C]'
                        : 'bg-[#FAF7F2] border-[#0B192C]/20 text-[#475E79]'
                    }`}>
                      Priority {p.priority}: {p.priority === 1 ? 'High Blocker' : p.priority === 2 ? 'Medium' : 'Enhancement'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleResolved(p.id)}
                    className={`text-xs font-mono px-3 py-1 rounded-sm border flex items-center gap-1.5 transition-colors font-semibold ${
                      isResolved
                        ? 'bg-[#EAF5F2] border-[#167C6B] text-[#0B192C] font-bold'
                        : 'bg-[#FFFFFF] border-[#0B192C]/25 text-[#475E79] hover:text-[#0B192C] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isResolved ? 'Marked Completed' : 'Mark as Fixed'}</span>
                  </button>
                </div>

                <h3 className={`font-serif font-bold text-base text-[#0B192C] ${isResolved ? 'line-through text-[#475E79]' : ''}`}>
                  {p.title}
                </h3>

                <p className="text-xs text-[#475E79] leading-relaxed">
                  {p.actionPlan}
                </p>

                {/* Code Snippet Template if available */}
                {p.codeTemplate && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#475E79]">
                      <span className="flex items-center gap-1 font-semibold text-[#0B192C]">
                        <Code2 className="w-3.5 h-3.5 text-[#0B192C]" /> Recommended HTML Structure:
                      </span>
                      <button
                        onClick={() => handleCopyCode(p.codeTemplate!, p.id)}
                        className="text-[#0B192C] hover:underline flex items-center gap-1 font-semibold"
                      >
                        {copiedId === p.id ? '✓ Copied' : <><Copy className="w-3 h-3" /> Copy Snippet</>}
                      </button>
                    </div>
                    <pre className="bg-[#FAF7F2] border border-[#0B192C]/15 p-3 rounded-sm text-[11px] font-mono text-[#0B192C] overflow-x-auto">
                      {p.codeTemplate}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
