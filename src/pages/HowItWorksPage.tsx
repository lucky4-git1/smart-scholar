import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Search, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#0B192C]">
      
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
          Methodology v1.2.0-2026 · Standard of Evidence
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
          How the Journal Trust Rating Engine Works
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 leading-relaxed">
          The Smart Scholars Trust Rating is computed strictly from verifiable public scholarly infrastructure: Crossref, OpenAlex, the Directory of Open Access Journals (DOAJ), and the Keepers Registry.
        </p>
      </div>

      {/* 4-Step Process */}
      <div className="space-y-6">
        <h2 className="font-serif font-bold text-2xl text-[#0B192C]">
          From Query to Action Plan in Four Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="ss-card p-5 space-y-2 shadow-paper">
            <span className="font-mono text-[#0B192C] text-xl font-bold">01</span>
            <h3 className="font-serif font-bold text-base text-[#0B192C]">Federated Registry Query</h3>
            <p className="text-[#475E79] leading-relaxed">
              When a journal title, ISSN, or DOI prefix is submitted, our federated adapters query Crossref, OpenAlex, and DOAJ with strict timeouts and response schema validation.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2 shadow-paper">
            <span className="font-mono text-[#0B192C] text-xl font-bold">02</span>
            <h3 className="font-serif font-bold text-base text-[#0B192C]">SSRF-Guarded Technical Crawl</h3>
            <p className="text-[#475E79] leading-relaxed">
              For readiness audits, our crawler safely inspects the journal domain, preventing private address probing (RFC 1918) while testing policy disclosures, editorial board names, APC clarity, and licensing schemas.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2 shadow-paper">
            <span className="font-mono text-[#0B192C] text-xl font-bold">03</span>
            <h3 className="font-serif font-bold text-base text-[#0B192C]">Deterministic 5-Pillar Scoring</h3>
            <p className="text-[#475E79] leading-relaxed">
              Points are awarded according to explicit weights across Identity (25%), Editorial (25%), Technical (20%), Preservation (15%), and Reach (15%). Red flags deduct points and cap letter grades.
            </p>
          </div>

          <div className="ss-card p-5 space-y-2 shadow-paper">
            <span className="font-mono text-[#0B192C] text-xl font-bold">04</span>
            <h3 className="font-serif font-bold text-base text-[#0B192C]">Verifiable Provenance & Repair Plan</h3>
            <p className="text-[#475E79] leading-relaxed">
              Every score breakdown records the exact endpoint, HTTP status, and timestamp. A prioritized repair checklist with code snippets helps editors resolve deficiencies.
            </p>
          </div>

        </div>
      </div>

      {/* Grade Thresholds Table */}
      <div className="ss-card overflow-hidden shadow-paper">
        <div className="p-5 border-b border-[#0B192C]/15 bg-[#FAF7F2]">
          <h2 className="font-serif font-bold text-lg text-[#0B192C]">
            Documented Letter Grade Mapping
          </h2>
          <p className="text-xs text-[#475E79]">
            Point cutoffs and standard criteria benchmarks for journal evaluation.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B192C] text-[#FAF7F2] uppercase text-[10.5px]">
              <tr>
                <th className="py-3 px-4 font-bold">Grade</th>
                <th className="py-3 px-4 font-bold">Point Threshold</th>
                <th className="py-3 px-4 font-bold">Integrity Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B192C]/10 bg-[#FFFFFF] text-[#0B192C]">
              <tr className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3 px-4 font-bold text-[#0B192C]">GRADE A+</td>
                <td className="py-3 px-4 tabular-nums">90 – 100 points</td>
                <td className="py-3 px-4 text-[#475E79] font-sans">Meets all primary indexing standards across all 5 pillars.</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3 px-4 font-bold text-[#167C6B]">GRADE A</td>
                <td className="py-3 px-4 tabular-nums">80 – 89 points</td>
                <td className="py-3 px-4 text-[#475E79] font-sans">Strong standing; minor metadata enhancements advised.</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3 px-4 font-bold text-[#10243E]">GRADE B</td>
                <td className="py-3 px-4 tabular-nums">70 – 79 points</td>
                <td className="py-3 px-4 text-[#475E79] font-sans">Solid foundation; needs improved preservation or citation transparency.</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3 px-4 font-bold text-[#8C460C]">GRADE C</td>
                <td className="py-3 px-4 tabular-nums">55 – 69 points</td>
                <td className="py-3 px-4 text-[#475E79] font-sans">Incomplete policy disclosures or inconsistent DOI deposit record.</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3 px-4 font-bold text-[#9E3E00]">GRADE D</td>
                <td className="py-3 px-4 tabular-nums">40 – 54 points</td>
                <td className="py-3 px-4 text-[#475E79] font-sans">Significant deficiencies; high barrier for Scopus or DOAJ admission.</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3 px-4 font-bold text-[#A81B1B]">RED FLAG</td>
                <td className="py-3 px-4 tabular-nums">&lt; 40 points or &ge; 2 Red Flags</td>
                <td className="py-3 px-4 text-[#A81B1B] font-sans font-semibold">Severe integrity risk (missing ISSN, fake claims, broken links).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
