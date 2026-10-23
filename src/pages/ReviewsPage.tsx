import React from 'react';
import { Quote, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GradeBadge } from '../components/Badge';

export const ReviewsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
          Audited Case Studies & Feedback
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#FAF7F2] mt-1">
          Evidence-Based Case Studies
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-2 leading-relaxed">
          Real institutional and publisher audits demonstrating how deterministic criteria evaluation eliminates indexing delays.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Case Study 1 */}
        <div className="ss-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#E3BC9A] px-2 py-0.5 rounded bg-[#1C1814] border border-[#2D2620]">
              Publisher Case Study · Society Journal Migration
            </span>
            <GradeBadge grade="A" size="sm" />
          </div>

          <h3 className="font-display font-bold text-lg text-[#FAF7F2]">
            Remediating 48 Broken DOIs Prior to DOAJ Re-application
          </h3>

          <p className="text-xs text-[#A89F91] leading-relaxed">
            A biomedical society journal was rejected by DOAJ due to non-resolving article URLs following an OJS platform upgrade. Running DOI Doctor revealed that trailing slashes in Crossref handle deposits produced 404 destination responses.
          </p>

          <div className="p-4 bg-[#100E0C] border border-[#241F1A] rounded-lg text-xs space-y-1 font-mono text-[#C7BFB3]">
            <div>• Initial Audit Score: <span className="text-rose-400">54 / 100 (Grade D)</span></div>
            <div>• Remediation: Batch URL redirection correction in Crossref XML deposit</div>
            <div>• Re-evaluated Score: <span className="text-emerald-400">88 / 100 (Grade A)</span></div>
            <div>• Result: DOAJ acceptance granted in 4 months.</div>
          </div>
        </div>

        {/* Case Study 2 */}
        <div className="ss-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#E3BC9A] px-2 py-0.5 rounded bg-[#1C1814] border border-[#2D2620]">
              University Integrity Case Study · Faculty Publication Screening
            </span>
            <GradeBadge grade="A+" size="sm" />
          </div>

          <h3 className="font-display font-bold text-lg text-[#FAF7F2]">
            Replacing Static Blacklists with Dynamic Registry Verification
          </h3>

          <p className="text-xs text-[#A89F91] leading-relaxed">
            A research integrity committee at a European university screened 340 faculty publication entries for annual reporting. Using the Batch Publication Screening tool, 92% of submissions were verified within minutes against Crossref and DOAJ, while 8 questionable serials were flagged for manual review due to missing ISSN registrations.
          </p>
        </div>

      </div>

    </div>
  );
};
