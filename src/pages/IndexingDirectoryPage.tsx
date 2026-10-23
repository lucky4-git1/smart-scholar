import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, Search, ExternalLink, CheckCircle2, Clock, DollarSign, FileCheck, ArrowRight } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { IndexingService } from '../types';

export const IndexingDirectoryPage: React.FC = () => {
  const [services, setServices] = useState<IndexingService[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/v1/indexing/directory')
      .then(res => {
        if (res.services) setServices(res.services);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.scopeDescription.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
            GetIndexed · Global Database Directory
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
            Apply to Every Indexing Database from One Place
          </h1>
          <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
            Curated evaluation requirements, acceptance metrics, and official submission guidelines for DOAJ, Scopus, Web of Science, and PubMed Central.
          </p>
        </div>

        <Link to="/indexing/applications" className="ss-btn-primary text-xs py-2 px-4">
          <FileCheck className="w-4 h-4" />
          <span>My Application Dossiers</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <div className="flex items-center bg-[#15120F] border border-[#2E2721] rounded-lg p-1.5 focus-within:border-[#E3BC9A]">
          <Search className="w-4 h-4 text-[#8C8071] ml-2.5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search index database (e.g. Scopus, DOAJ)..."
            className="w-full bg-transparent px-2.5 py-1.5 text-xs text-[#FAF7F2] placeholder-[#665D52] focus:outline-none"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#9E9486]">
          Loading indexing directory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((s) => {
            let criteria: string[] = [];
            try {
              criteria = JSON.parse(s.evaluationCriteria);
            } catch {}

            return (
              <div key={s.id} className="ss-card p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E3BC9A] px-2 py-0.5 rounded bg-[#201B16] border border-[#3A3026]">
                        {s.category}
                      </span>
                      <h3 className="font-display font-bold text-lg text-[#FAF7F2] mt-1.5">
                        {s.name}
                      </h3>
                    </div>
                    {s.acceptanceRateEst && (
                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase text-[#8A8173] block">Est. Acceptance</span>
                        <span className="font-mono text-sm font-bold text-[#E3BC9A]">{s.acceptanceRateEst}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#A89F91] leading-relaxed mt-2.5">
                    {s.scopeDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#221D18] text-xs font-mono text-[#8C8375]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#E3BC9A]" />
                      <span>{s.reviewPeriodMonths || '3 - 6 mos'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#14B8A6]" />
                      <span>{s.feeDescription || 'No evaluation fee'}</span>
                    </div>
                  </div>

                  {criteria.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono uppercase text-[#8A8174] block">
                        Mandatory Inclusion Criteria
                      </span>
                      <ul className="space-y-1 text-[11px] text-[#C7BFB3]">
                        {criteria.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#E3BC9A] mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#221D18] flex items-center justify-between gap-3">
                  <a
                    href={s.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#E3BC9A] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    to="/indexing/applications"
                    className="ss-btn-secondary text-xs py-1.5 px-3"
                  >
                    <span>Track Application Dossier</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
