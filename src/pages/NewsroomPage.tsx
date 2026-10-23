import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

export const NewsroomPage: React.FC = () => {
  const articles = [
    {
      title: 'Scopus CSAB Updates 2026 Evaluation Criteria for Emerging Open Access Journals',
      date: 'October 14, 2026',
      category: 'Indexing Policy',
      summary: 'Elsevier CSAB announces stricter enforcement on transparent editorial board affiliations and independent plagiarism screening disclosures.',
    },
    {
      title: 'DOI Doctor Identifies Over 4,200 Broken Article Handles in Defunct Domain Migrations',
      date: 'September 28, 2026',
      category: 'Technical Investigation',
      summary: 'Analysis of society publishers transitioning between hosting platforms reveals common URL redirection gaps that cause handle resolution failure.',
    },
    {
      title: 'DOAJ Reaches Milestone of 21,000 Verified Peer-Reviewed Open Access Journals',
      date: 'August 19, 2026',
      category: 'Scholarly Infrastructure',
      summary: 'Directory continues expansion of Diamond Open Access verification with increased emphasis on machine-readable preservation metadata.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
          Smart Scholars Newsroom
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#FAF7F2] mt-1">
          Research Integrity & Indexing Updates
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-2 leading-relaxed">
          Technical analysis, policy changes, and investigative reports on scholarly communication integrity.
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((a, i) => (
          <article key={i} className="ss-card p-6 space-y-2.5">
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#8C8375]">
              <span className="text-[#E3BC9A] uppercase px-2 py-0.5 rounded bg-[#1C1814] border border-[#2D2620]">
                {a.category}
              </span>
              <span>{a.date}</span>
            </div>

            <h2 className="font-display font-bold text-lg text-[#FAF7F2]">
              {a.title}
            </h2>

            <p className="text-xs text-[#A89F91] leading-relaxed">
              {a.summary}
            </p>
          </article>
        ))}
      </div>

    </div>
  );
};
