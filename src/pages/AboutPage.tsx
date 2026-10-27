import React from 'react';
import { ShieldCheck, HeartHandshake, Eye, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#0B192C]">
      
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
          About Smart Scholars · Research Integrity Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
          Restoring Trust in Scholarly Communication
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 leading-relaxed">
          Smart Scholars was created to solve a growing crisis in academic publishing: the proliferation of predatory venues, broken digital persistent identifiers, and opaque indexing barriers.
        </p>
      </div>

      <div className="space-y-6 text-xs text-[#475E79] leading-relaxed">
        <div className="ss-card p-6 space-y-3 shadow-paper">
          <h2 className="font-serif font-bold text-lg text-[#0B192C]">Our Philosophy: Evidence, Not Lists</h2>
          <p>
            Static blacklists quickly become obsolete, litigious, or unfair to legitimate emerging publishers in developing regions. Smart Scholars evaluates journals through continuous, automated, multi-source evidence retrieval.
          </p>
          <p>
            We gather active signals from official Crossref deposit records, OpenAlex citation graphs, Directory of Open Access Journals (DOAJ) verifications, and direct technical crawls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="ss-card p-5 space-y-2 shadow-paper">
            <h3 className="font-serif font-bold text-base text-[#0B192C]">Anti-AI-Slop Standard</h3>
            <p className="text-[11px] text-[#475E79] leading-relaxed">
              No decorative fake metrics, no AI hallucinations for journal grades, and no generic purple gradients. Every awarded point has an explicit provenance trail.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2 shadow-paper">
            <h3 className="font-serif font-bold text-base text-[#0B192C]">Deterministic Rules</h3>
            <p className="text-[11px] text-[#475E79] leading-relaxed">
              Scoring algorithms are versioned and open. Results are completely reproducible given the same registry snapshot.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2 shadow-paper">
            <h3 className="font-serif font-bold text-base text-[#0B192C]">Actionable Remediation</h3>
            <p className="text-[11px] text-[#475E79] leading-relaxed">
              We don't merely point out flaws. Our repair blueprints provide exact HTML and metadata snippets to fix compliance gaps before applying to Scopus or WoS.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
