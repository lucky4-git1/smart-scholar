import React from 'react';
import { Quote, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GradeBadge } from '../components/Badge';

export const ReviewsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#0B192C]">
      
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
          Audited Case Studies & Feedback
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
          Evidence-Based Case Studies
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 leading-relaxed">
          Real institutional and publisher audits demonstrating how deterministic criteria evaluation eliminates indexing delays.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Case Study 1 */}
        <div className="ss-card p-6 sm:p-8 space-y-4 shadow-paper">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#0B192C] font-bold px-2 py-0.5 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/15">
              Publisher Case Study · Society Journal Migration
            </span>
            <GradeBadge grade="A" size="sm" />
          </div>

          <h3 className="font-serif font-bold text-xl text-[#0B192C]">
            Remediating 48 Broken DOIs Prior to DOAJ Re-application
          </h3>

          <p className="text-xs text-[#475E79] leading-relaxed">
            A biomedical society journal was rejected by DOAJ due to non-resolving article URLs following an OJS platform upgrade. Running DOI Doctor revealed that trailing slashes in Crossref handle deposits produced 404 destination responses.
          </p>

          <div className="p-4 bg-[#FAF7F2] border border-[#0B192C]/15 rounded-sm text-xs space-y-1 font-mono text-[#0B192C]">
            <div>• Initial Audit Score: <span className="text-[#A81B1B] font-bold">54 / 100 (Grade D)</span></div>
            <div>• Remediation: Batch URL redirection correction in Crossref XML deposit</div>
            <div>• Re-evaluated Score: <span className="text-[#167C6B] font-bold">88 / 100 (Grade A)</span></div>
            <div>• Result: DOAJ acceptance granted in 4 months.</div>
          </div>
        </div>

        {/* Case Study 2 */}
        <div className="ss-card p-6 sm:p-8 space-y-4 shadow-paper">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#0B192C] font-bold px-2 py-0.5 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/15">
              University Integrity Case Study · Faculty Publication Screening
            </span>
            <GradeBadge grade="A+" size="sm" />
          </div>

          <h3 className="font-serif font-bold text-xl text-[#0B192C]">
            Replacing Static Blacklists with Dynamic Registry Verification
          </h3>

          <p className="text-xs text-[#475E79] leading-relaxed">
            A research integrity committee at a European university screened 340 faculty publication entries for annual reporting. Using the Batch Publication Screening tool, 92% of submissions were verified within minutes against Crossref and DOAJ, while 8 questionable serials were flagged for manual review due to missing ISSN registrations.
          </p>
        </div>

      </div>

    </div>
  );
};
