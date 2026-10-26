import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Search, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
          Methodology v1.2.0-2026 · Standard of Evidence
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-100 mt-1">
          How the Journal Trust Rating Engine Works
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-2 leading-relaxed">
          The Smart Scholars Trust Rating is computed strictly from verifiable public scholarly infrastructure: Crossref, OpenAlex, the Directory of Open Access Journals (DOAJ), and the Keepers Registry.
        </p>
      </div>

      {/* 4-Step Process */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-xl text-zinc-100">
          From Query to Action Plan in Four Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="ss-card p-5 space-y-2">
            <span className="font-mono text-emerald-400 text-lg font-bold">01</span>
            <h3 className="font-display font-bold text-base text-zinc-100">Federated Registry Query</h3>
            <p className="text-zinc-400 leading-relaxed">
              When a journal title, ISSN, or DOI prefix is submitted, our federated adapters query Crossref, OpenAlex, and DOAJ with strict timeouts and response schema validation.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2">
            <span className="font-mono text-emerald-400 text-lg font-bold">02</span>
            <h3 className="font-display font-bold text-base text-zinc-100">SSRF-Guarded Technical Crawl</h3>
            <p className="text-zinc-400 leading-relaxed">
              For readiness audits, our crawler safely inspects the journal domain, preventing private address probing (RFC 1918) while testing policy disclosures, editorial board names, APC clarity, and licensing schemas.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2">
            <span className="font-mono text-emerald-400 text-lg font-bold">03</span>
            <h3 className="font-display font-bold text-base text-zinc-100">Deterministic 5-Pillar Scoring</h3>
            <p className="text-zinc-400 leading-relaxed">
              Points are awarded according to explicit weights across Identity (25%), Editorial (25%), Technical (20%), Preservation (15%), and Reach (15%). Red flags deduct points and cap letter grades.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2">
            <span className="font-mono text-emerald-400 text-lg font-bold">04</span>
            <h3 className="font-display font-bold text-base text-zinc-100">Verifiable Provenance & Repair Plan</h3>
            <p className="text-zinc-400 leading-relaxed">
              Every score breakdown records the exact endpoint, HTTP status, and timestamp. A prioritized repair checklist with code snippets helps editors resolve deficiencies.
            </p>
          </div>

        </div>
      </div>

      {/* Grade Thresholds Table */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-zinc-100">
          Documented Letter Grade Mapping
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1A1713] border-b border-[#2B241D] text-[#8C8375] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Point Threshold</th>
                <th className="py-2.5 px-3">Integrity Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#201B17] text-[#C7BFB3]">
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-400">GRADE A+</td>
                <td className="py-2.5 px-3">90 – 100 points</td>
                <td className="py-2.5 px-3">Meets all primary indexing standards across all 5 pillars.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-300">GRADE A</td>
                <td className="py-2.5 px-3">80 – 89 points</td>
                <td className="py-2.5 px-3">Strong standing; minor metadata enhancements advised.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-teal-300">GRADE B</td>
                <td className="py-2.5 px-3">70 – 79 points</td>
                <td className="py-2.5 px-3">Solid foundation; needs improved preservation or citation transparency.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-300">GRADE C</td>
                <td className="py-2.5 px-3">55 – 69 points</td>
                <td className="py-2.5 px-3">Incomplete policy disclosures or inconsistent DOI deposit record.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-400">GRADE D</td>
                <td className="py-2.5 px-3">40 – 54 points</td>
                <td className="py-2.5 px-3">Significant deficiencies; high barrier for Scopus or DOAJ admission.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-400">RED FLAG</td>
                <td className="py-2.5 px-3">&lt; 40 points or &ge; 2 Red Flags</td>
                <td className="py-2.5 px-3">Severe integrity risk (missing ISSN, fake claims, broken links).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
