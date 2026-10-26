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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-[#0A3D36]">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/journal-audit/${id}/findings`} className="text-xs font-mono text-[#4B635E] hover:text-[#0A3D36] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Findings
        </Link>
        <Link to={`/indexing/applications`} className="ss-btn-primary text-xs py-1.5 px-3 font-bold">
          <span>Prepare Indexing Application &rarr;</span>
        </Link>
      </div>

      {/* Header */}
      <div className="ss-card p-6 shadow-paper">
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15 inline-block">
          Remediation Blueprint · Audit #{id?.substring(0, 8).toUpperCase()}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Actionable Repair Plan ({plans.length} Tasks)
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 leading-relaxed">
          Step-by-step technical and editorial modifications required to eliminate indexing blockers prior to dossier submission.
        </p>
      </div>

      {/* Repair Items */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#4B635E] font-mono">
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
                  isResolved ? 'opacity-60 bg-[#FAF6EE]' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm border ${
                      p.priority === 1
                        ? 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B]'
                        : p.priority === 2
                        ? 'bg-[#FEF5ED] border-[#F6AC6D] text-[#8C460C]'
                        : 'bg-[#FAF6EE] border-[#0A3D36]/20 text-[#4B635E]'
                    }`}>
                      Priority {p.priority}: {p.priority === 1 ? 'High Blocker' : p.priority === 2 ? 'Medium' : 'Enhancement'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleResolved(p.id)}
                    className={`text-xs font-mono px-3 py-1 rounded-sm border flex items-center gap-1.5 transition-colors font-semibold ${
                      isResolved
                        ? 'bg-[#E8F8F5] border-[#109C89] text-[#0A3D36] font-bold'
                        : 'bg-[#FFFDF9] border-[#0A3D36]/25 text-[#4B635E] hover:text-[#0A3D36] hover:bg-[#FAF6EE]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isResolved ? 'Marked Completed' : 'Mark as Fixed'}</span>
                  </button>
                </div>

                <h3 className={`font-serif font-bold text-base text-[#0A3D36] ${isResolved ? 'line-through text-[#4B635E]' : ''}`}>
                  {p.title}
                </h3>

                <p className="text-xs text-[#4B635E] leading-relaxed">
                  {p.actionPlan}
                </p>

                {/* Code Snippet Template if available */}
                {p.codeTemplate && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#4B635E]">
                      <span className="flex items-center gap-1 font-semibold text-[#0A3D36]">
                        <Code2 className="w-3.5 h-3.5 text-[#0A3D36]" /> Recommended HTML Structure:
                      </span>
                      <button
                        onClick={() => handleCopyCode(p.codeTemplate!, p.id)}
                        className="text-[#0A3D36] hover:underline flex items-center gap-1 font-semibold"
                      >
                        {copiedId === p.id ? '✓ Copied' : <><Copy className="w-3 h-3" /> Copy Snippet</>}
                      </button>
                    </div>
                    <pre className="bg-[#FAF6EE] border border-[#0A3D36]/15 p-3 rounded-sm text-[11px] font-mono text-[#0A3D36] overflow-x-auto">
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
