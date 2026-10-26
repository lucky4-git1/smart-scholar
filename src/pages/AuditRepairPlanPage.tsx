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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to={`/journal-audit/${id}/findings`} className="text-xs font-mono text-zinc-400 hover:text-zinc-100 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Findings
        </Link>
        <Link to={`/indexing/applications`} className="ss-btn-primary text-xs py-1.5 px-3">
          <span>Prepare Indexing Application &rarr;</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6">
        <span className="text-[10px] font-mono uppercase text-emerald-400 block">
          Remediation Blueprint · Audit #{id?.substring(0, 8).toUpperCase()}
        </span>
        <h1 className="font-display text-2xl font-extrabold text-zinc-100 mt-1">
          Actionable Repair Plan ({plans.length} Tasks)
        </h1>
        <p className="text-xs text-[#8A8173] mt-1">
          Step-by-step technical and editorial modifications required to eliminate indexing blockers prior to dossier submission.
        </p>
      </div>

      {/* Repair Items */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#9E9486]">
          Loading repair checklist...
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((p) => {
            const isResolved = resolvedIds.has(p.id);

            return (
              <div
                key={p.id}
                className={`ss-card p-5 space-y-3 transition-opacity ${
                  isResolved ? 'opacity-60 bg-[#100E0C]' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      p.priority === 1
                        ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                        : p.priority === 2
                        ? 'bg-amber-950/70 border-amber-600 text-amber-300'
                        : 'bg-zinc-800 border-zinc-600 text-zinc-300'
                    }`}>
                      Priority {p.priority}: {p.priority === 1 ? 'High Blocker' : p.priority === 2 ? 'Medium' : 'Enhancement'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleResolved(p.id)}
                    className={`text-xs font-mono px-3 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                      isResolved
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-[#1C1814] border-[#312B24] text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isResolved ? 'Marked Completed' : 'Mark as Fixed'}</span>
                  </button>
                </div>

                <h3 className={`font-display font-bold text-base text-zinc-100 ${isResolved ? 'line-through text-[#8A8174]' : ''}`}>
                  {p.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {p.actionPlan}
                </p>

                {/* Code Snippet Template if available */}
                {p.codeTemplate && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8C8375]">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Recommended HTML Structure:
                      </span>
                      <button
                        onClick={() => handleCopyCode(p.codeTemplate!, p.id)}
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {copiedId === p.id ? '✓ Copied' : <><Copy className="w-3 h-3" /> Copy Snippet</>}
                      </button>
                    </div>
                    <pre className="bg-[#09090b] border border-[#27272a] p-3 rounded text-[11px] font-mono text-emerald-400 overflow-x-auto">
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
