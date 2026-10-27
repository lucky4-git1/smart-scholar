import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Loader2, ShieldAlert, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { GradeBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';
import { Journal } from '../types';

export const JournalCheckPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(`/api/v1/journals/search?q=${encodeURIComponent(searchTerm)}`);
      if (res.results) {
        setJournals(res.results);
      }
    } catch (err: any) {
      setError(err.message || 'Error searching journals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    fetchJournals(query);
  };

  const handleAssessNow = async (j: any) => {
    setEvaluating(true);
    try {
      const issn = j.identifiers?.[0]?.value || '';
      const res = await apiRequest('/api/v1/journals/assess', {
        method: 'POST',
        body: JSON.stringify({
          title: j.title,
          issn,
          publisher: j.publisher,
        }),
      });

      if (res.success && res.journal) {
        navigate(`/journal-check/results/${res.journal.id}`);
      }
    } catch (err: any) {
      alert('Assessment failed: ' + (err.message || 'Unknown error'));
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#0B192C]/15 pb-6">
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
          SCHOLAR SHIELD · JOURNAL TRUST REGISTRY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
          Journal Trust & Safety Search
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 max-w-2xl leading-relaxed">
          Search over millions of serials. Verify ISSN registration on CIEPS, DOI resolution, editorial board transparency, and peer-review integrity with verifiable evidence.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="max-w-3xl">
        <div className="flex items-center bg-[#FFFFFF] border-2 border-[#0B192C] focus-within:border-[#167C6B] rounded-sm p-1.5 shadow-retro transition-all">
          <Search className="w-4 h-4 text-[#0B192C] ml-2.5 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by Journal Title, ISSN (e.g. 0028-0836), or Publisher..."
            className="w-full min-w-0 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#0B192C] placeholder-[#71869E] focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary px-4 sm:px-5 py-2 text-xs whitespace-nowrap font-bold flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search Registry'}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-mono">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16 flex flex-col items-center justify-center text-xs text-[#0B192C] gap-2 font-mono">
          <Loader2 className="w-6 h-6 animate-spin text-[#167C6B]" />
          <span>Querying verified registries (Crossref, DOAJ, OpenAlex)...</span>
        </div>
      )}

      {/* Results List */}
      {!loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#475E79] font-mono border-b border-[#0B192C]/10 pb-2">
            <span>SHOWING {journals.length} JOURNALS</span>
            <span>METHODOLOGY: v1.2.0-2026</span>
          </div>

          {journals.length === 0 ? (
            <div className="ss-card p-10 text-center space-y-3 shadow-paper">
              <ShieldAlert className="w-8 h-8 text-[#A81B1B] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#0B192C]">
                No journals found matching "{query}"
              </h3>
              <p className="text-xs text-[#475E79] max-w-md mx-auto">
                Try searching by ISSN (e.g. `0028-0836`), exact journal title, or publisher name. Alternatively, submit a journal website for an indexing audit.
              </p>
              <div className="pt-2">
                <Link to="/journal-audit" className="ss-btn-secondary text-xs">
                  Submit for Technical Audit
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {journals.map((j) => {
                const issn = j.identifiers?.[0]?.value || 'N/A';
                const isAssessed = j.currentScore !== null && j.currentScore !== undefined;

                return (
                  <div key={j.id} className="ss-card p-5 flex flex-col justify-between shadow-paper hover:shadow-paper-lg transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#0B192C] leading-snug">
                            {j.title}
                          </h3>
                          <p className="text-xs text-[#475E79] mt-0.5">
                            {j.publisher || 'Unknown Publisher'}
                          </p>
                        </div>
                        <GradeBadge grade={j.currentGrade || 'UNVERIFIED'} size="sm" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#0B192C]/10 text-xs">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#475E79] block font-semibold">Primary ISSN</span>
                          <span className="font-mono text-[#0B192C] font-bold">{issn}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#475E79] block font-semibold">Trust Rating Score</span>
                          <span className="font-mono text-[#0B192C] font-extrabold tabular-nums">
                            {isAssessed ? `${j.currentScore} / 100` : 'Not evaluated'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#475E79] block font-semibold">DOAJ Status</span>
                          <span className="text-[#0B192C] font-medium">
                            {j.doajIndexed ? '✓ DOAJ Indexed' : '— Not in DOAJ'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#475E79] block font-semibold">Crossref Active</span>
                          <span className="text-[#0B192C] font-medium">
                            {j.crossrefActive ? '✓ Active DOIs' : '— No DOIs'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#0B192C]/10 flex items-center justify-between">
                      {isAssessed && !j.isExternal ? (
                        <Link
                          to={`/journal-check/results/${j.id}`}
                          className="ss-btn-primary text-xs py-2 px-3.5 w-full text-center font-bold"
                        >
                          View Full 5-Pillar Evidence Dossier
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleAssessNow(j)}
                          disabled={evaluating}
                          className="ss-btn-primary text-xs py-2 px-3.5 w-full flex items-center justify-center gap-1.5 font-bold"
                        >
                          {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>Run 5-Pillar Assessment Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
