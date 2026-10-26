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
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
          Scholar Shield · Journal Trust Rating
        </span>
        <h1 className="font-display text-3xl font-extrabold text-zinc-100 tracking-tight mt-1">
          Journal Trust & Safety Search
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Search over millions of serials. Check ISSN validation, DOI resolution, editorial board transparency, and peer-review integrity with verifiable evidence.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="max-w-3xl">
        <div className="flex items-center bg-zinc-900 border border-zinc-700/80 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-400/20 rounded-lg p-1.5 shadow-tactile transition-all">
          <Search className="w-4 h-4 text-zinc-400 ml-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by Journal Title, ISSN (e.g. 2044-6055), or Publisher..."
            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary px-5 py-2 text-xs whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-xs text-zinc-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
          <span>Querying verified registries and local repository...</span>
        </div>
      )}

      {/* Results List */}
      {!loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>SHOWING {journals.length} JOURNALS</span>
          </div>

          {journals.length === 0 ? (
            <div className="bg-[#121215] border border-zinc-800 rounded-lg p-10 text-center space-y-3 shadow-tactile">
              <ShieldAlert className="w-8 h-8 text-zinc-500 mx-auto" />
              <h3 className="font-display font-semibold text-base text-zinc-100">
                No journals found matching "{query}"
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try searching by ISSN (e.g. `0028-0836`), exact journal title, or publisher name. Alternatively, submit a journal website for an indexing audit.
              </p>
              <div className="pt-2">
                <Link to="/journal-audit" className="ss-btn-secondary text-xs">
                  Submit for Technical Audit
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {journals.map((j) => {
                const issn = j.identifiers?.[0]?.value || 'N/A';
                const isAssessed = j.currentScore !== null && j.currentScore !== undefined;

                return (
                  <div key={j.id} className="ss-card p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-display font-semibold text-sm text-zinc-100 leading-snug">
                            {j.title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {j.publisher || 'Unknown Publisher'}
                          </p>
                        </div>
                        <GradeBadge grade={j.currentGrade || 'UNVERIFIED'} size="sm" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-zinc-800/80 text-xs">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Primary ISSN</span>
                          <span className="font-mono text-zinc-200 font-semibold">{issn}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Trust Rating Score</span>
                          <span className="font-mono text-zinc-100 font-bold tabular-nums">
                            {isAssessed ? `${j.currentScore} / 100` : 'Not evaluated'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block">DOAJ Status</span>
                          <span className="text-zinc-300">
                            {j.doajIndexed ? '✓ DOAJ Indexed' : '— Not in DOAJ'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-400 block">Crossref Active</span>
                          <span className="text-zinc-300">
                            {j.crossrefActive ? '✓ Active DOIs' : '— No DOIs'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      {isAssessed && !j.isExternal ? (
                        <Link
                          to={`/journal-check/results/${j.id}`}
                          className="ss-btn-primary text-xs py-1.5 px-3.5 w-full text-center"
                        >
                          View Full 5-Pillar Evidence
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleAssessNow(j)}
                          disabled={evaluating}
                          className="ss-btn-primary text-xs py-1.5 px-3.5 w-full flex items-center justify-center gap-1.5"
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
