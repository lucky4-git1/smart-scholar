import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does an A+ rating guarantee acceptance by Scopus or Web of Science?',
      a: 'No. Smart Scholars is an independent research integrity evaluator and technical diagnostic engine. While an A+ rating indicates that your journal fulfills key technical, editorial, and governance criteria verified across public indices, final indexing decisions rest entirely with the respective selection committees (e.g. Scopus CSAB or Clarivate editorial board).',
    },
    {
      q: 'Why did my journal receive an "UNAVAILABLE" status on certain criteria?',
      a: 'If a specific metric cannot be independently confirmed through public bibliographic registries (for example, if a journal is not yet listed in the DOAJ directory to confirm CC license tags), our engine marks that criterion as UNAVAILABLE rather than assuming misconduct. Incomplete evidence awards partial baseline points.',
    },
    {
      q: 'How does DOI Doctor test handle resolution?',
      a: 'DOI Doctor issues real-time HTTP requests to the official Handle System proxy (https://doi.org/<doi>), traces redirects, and records the final destination HTTP response status. It flags non-resolving endpoints (404, 500, timeouts) and inspects deposited Crossref metadata for abstracts, references, and license URLs.',
    },
    {
      q: 'What triggers an automatic RED FLAG rating?',
      a: 'A RED FLAG grade is triggered when deterministic evidence indicates critical integrity risks: e.g., missing or invalid ISSN registration on CIEPS, guaranteed rapid acceptance (< 5 days) without peer review, or high rates of non-resolving DOIs. Red flags deduct points and cap the maximum possible grade.',
    },
    {
      q: 'Can our institution upload faculty publication lists for tenure review?',
      a: 'Yes. The Research Integrity Desk includes a Batch Publication Evaluation tool. You can upload publication lists in CSV format (article title, journal title, ISSN), and the engine will return an automated compliance report identifying verified vs. high-risk venues.',
    },
    {
      q: 'How often are trust ratings recalculated?',
      a: 'Ratings are updated whenever an authorized user or editor triggers a live re-assessment, or when our background monitoring jobs detect changes in registered Crossref or DOAJ metadata.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#0A3D36]">
      
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
          FAQ & Knowledge Base
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 leading-relaxed">
          Technical specifications, evaluation criteria, and operational policies of the Smart Scholars platform.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="ss-card overflow-hidden shadow-paper">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF6EE] transition-colors"
              >
                <span className="font-serif font-bold text-base text-[#0A3D36]">
                  {f.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#0A3D36] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#4B635E] flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-[#4B635E] leading-relaxed border-t border-[#0A3D36]/10 pt-3 bg-[#FFFDF9]">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
