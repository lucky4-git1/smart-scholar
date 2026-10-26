import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Building, 
  BookOpen, 
  Layers, 
  ChevronRight,
  Database,
  FileCheck2,
  Lock,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { GradeBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJournals, setFeaturedJournals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    indexedJournals: 4,
    verifiedAssessments: 4,
    indexingDirectories: 4,
    monitoredDois: 3,
  });

  useEffect(() => {
    apiRequest('/api/v1/journals/search')
      .then(res => {
        if (res.results) setFeaturedJournals(res.results.slice(0, 4));
      })
      .catch(() => {});

    apiRequest('/api/v1/public/stats')
      .then(res => {
        if (res.stats) setStats(res.stats);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/journal-check?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 border-b border-zinc-800/80 bg-gradient-to-b from-[#0e0e12] via-[#09090b] to-[#09090b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
            Standard 5-Pillar Research Integrity Methodology &bull; v1.2
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-zinc-50 tracking-[-0.03em] leading-[1.08]">
            Which journals can be <span className="text-white underline decoration-emerald-500/50 decoration-2 underline-offset-8">trusted</span>?
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Deterministic trust evaluations, page-level indexing readiness audits, and persistent DOI diagnostics backed by verified bibliographic registries.
          </p>

          {/* Unified Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-2">
            <div className="flex items-center bg-zinc-900/90 border border-zinc-700/80 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-400/20 rounded-lg p-1.5 shadow-tactile transition-all">
              <Search className="w-4 h-4 text-zinc-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter Journal Title, ISSN (e.g. 1932-6203), or DOI prefix (10.1038)..."
                className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="ss-btn-primary px-5 py-2.5 text-xs whitespace-nowrap"
              >
                Check Journal
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-zinc-400 font-mono">
              <span className="text-zinc-400">Try verified records:</span>
              <button type="button" onClick={() => navigate('/journal-check?q=Nature')} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700">Nature</button>
              <button type="button" onClick={() => navigate('/journal-check?q=1932-6203')} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700">1932-6203 (PLOS ONE)</button>
              <button type="button" onClick={() => navigate('/journal-check?q=BMJ%20Open')} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700">BMJ Open</button>
            </div>
          </form>

        </div>
      </section>

      {/* 2. FOUR AUDIENCE ENTRY POINTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
              Start Where You Stand
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono uppercase tracking-wider">
              Tailored workflows for researchers, editors, institutions, and publishers
            </p>
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            4 DISTINCT PORTALS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Authors */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <BookOpen className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-sm text-zinc-100 mb-1.5">
                Authors & Researchers
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Verify journal legitimacy, peer-review transparency, and indexing eligibility before paying submission or publication charges.
              </p>
            </div>
            <Link to="/journal-check" className="text-xs font-medium text-zinc-300 hover:text-white inline-flex items-center gap-1 group">
              <span>Check a journal</span> <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Editors */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-sm text-zinc-100 mb-1.5">
                Editors & Publishers
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Crawl your journal domain against 121 criteria to generate an actionable remediation plan before applying to Scopus or DOAJ.
              </p>
            </div>
            <Link to="/journal-audit" className="text-xs font-medium text-zinc-300 hover:text-white inline-flex items-center gap-1 group">
              <span>Start readiness audit</span> <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Institutions */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <Building className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-sm text-zinc-100 mb-1.5">
                Institutions & Deans
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Maintain institutional watchlists, run batch CSV publication evaluations, and produce auditable research integrity committee reports.
              </p>
            </div>
            <Link to="/institution/dashboard" className="text-xs font-medium text-zinc-300 hover:text-white inline-flex items-center gap-1 group">
              <span>Integrity Desk</span> <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Portfolio Managers */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-4">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-sm text-zinc-100 mb-1.5">
                Portfolio Managers
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Monitor complete journal portfolios on a single dashboard, catch dead DOI resolutions, and audit metadata completeness.
              </p>
            </div>
            <Link to="/portfolio/dashboard" className="text-xs font-medium text-zinc-300 hover:text-white inline-flex items-center gap-1 group">
              <span>Portfolio Console</span> <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. THE FIVE SCORING PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121215] border border-zinc-800 rounded-xl p-7 sm:p-9 shadow-tactile">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Deterministic Scoring Engine
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 mt-1">
              The 5 Pillars of Journal Trust
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              Every journal rating is computed from verifiable evidence retrieved directly from public scholarly infrastructure. Zero black-box guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-zinc-100 tabular-nums">25%</div>
              <h4 className="font-display font-semibold text-xs text-zinc-200 mt-1">Identity & Governance</h4>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                Active ISSN confirmed on CIEPS, verified publisher corporate jurisdiction, transparent editorial leadership.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-zinc-100 tabular-nums">25%</div>
              <h4 className="font-display font-semibold text-xs text-zinc-200 mt-1">Editorial Integrity</h4>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                Verifiable peer review workflow, COPE ethics conformity, automated plagiarism screening disclosures.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-zinc-100 tabular-nums">20%</div>
              <h4 className="font-display font-semibold text-xs text-zinc-200 mt-1">Technical Standing</h4>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                Persistent Crossref DOI resolution, machine-readable CC licensing, JATS XML structured metadata.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-zinc-100 tabular-nums">15%</div>
              <h4 className="font-display font-semibold text-xs text-zinc-200 mt-1">Preservation & Access</h4>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                Permanent archival escrow (Portico, CLOCKSS, Internet Archive), transparent author fees or Diamond OA.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-zinc-100 tabular-nums">15%</div>
              <h4 className="font-display font-semibold text-xs text-zinc-200 mt-1">Reach & Citation</h4>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                Documented OpenAlex citation history, Crossref reference distribution, global author and reviewer diversity.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. RECENT VERIFIED ASSESSMENTS TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-zinc-100">
              Verified Journal Assessments
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Live records scored against Methodology v1.2.0-2026
            </p>
          </div>
          <Link to="/journal-check" className="text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1">
            <span>Explore all journals</span> &rarr;
          </Link>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-lg overflow-hidden shadow-tactile">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Journal Title</th>
                  <th className="py-3 px-4 font-semibold">Publisher</th>
                  <th className="py-3 px-4 font-semibold">Primary ISSN</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Trust Grade</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {featuredJournals.map((j) => {
                  const issn = j.identifiers?.[0]?.value || 'N/A';
                  return (
                    <tr key={j.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-zinc-100">
                        {j.title}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {j.publisher || 'Unknown'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {issn}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-zinc-200">
                        {j.currentScore !== null ? `${j.currentScore} / 100` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <GradeBadge grade={j.currentGrade || 'UNVERIFIED'} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/journal-check/results/${j.id}`}
                          className="ss-btn-secondary text-[11px] py-1 px-2.5"
                        >
                          View Evidence
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. LIVE PLATFORM METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-[#121215] border border-zinc-800 p-5 rounded-lg text-center shadow-tactile">
            <div className="font-mono text-3xl font-extrabold text-zinc-100 tabular-nums">
              {stats.indexedJournals}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">
              Assessed Serials
            </div>
          </div>

          <div className="bg-[#121215] border border-zinc-800 p-5 rounded-lg text-center shadow-tactile">
            <div className="font-mono text-3xl font-extrabold text-zinc-100 tabular-nums">
              121
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">
              Audit Criteria
            </div>
          </div>

          <div className="bg-[#121215] border border-zinc-800 p-5 rounded-lg text-center shadow-tactile">
            <div className="font-mono text-3xl font-extrabold text-emerald-400 tabular-nums">
              {stats.indexingDirectories}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">
              Index Directories
            </div>
          </div>

          <div className="bg-[#121215] border border-zinc-800 p-5 rounded-lg text-center shadow-tactile">
            <div className="font-mono text-3xl font-extrabold text-zinc-100 tabular-nums">
              {stats.monitoredDois}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mt-1">
              Monitored DOIs
            </div>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-[#121215] border border-zinc-800 rounded-xl p-8 sm:p-12 space-y-4 shadow-elevated">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Know Exactly What Stands Between Your Journal and Indexing
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Run an automated page-level crawler on your journal domain. Receive an itemized report of missing metadata, broken DOIs, and policy gaps.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link to="/journal-audit" className="ss-btn-primary px-6 py-2.5 text-xs">
              Start Indexing Readiness Audit
            </Link>
            <Link to="/how-it-works" className="ss-btn-secondary px-6 py-2.5 text-xs">
              Read the Scoring Methodology
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
