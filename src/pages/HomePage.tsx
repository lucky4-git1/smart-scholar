import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Building, 
  BookOpen, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Database,
  FileCheck2,
  Lock,
  Compass
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
    // Fetch initial journals and stats
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
      <section className="relative pt-16 pb-12 overflow-hidden border-b border-[#201B16] bg-gradient-to-b from-[#12100E] to-[#0A0908]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1612] border border-[#3A3026] text-xs font-mono text-[#E3BC9A]">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]"></span>
            <span>STANDARD 5-PILLAR RESEARCH INTEGRITY RATING</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#FAF7F2] tracking-tight leading-[1.1]">
            Which journals can be <span className="text-[#E3BC9A] underline decoration-[#E3BC9A]/40 decoration-wavy">trusted</span>?
          </h1>

          <p className="text-base sm:text-lg text-[#A3998B] max-w-2xl mx-auto leading-relaxed">
            Deterministic trust evaluations, page-level indexing readiness audits, and DOI resolution diagnostics backed by verified bibliographic registries.
          </p>

          {/* Unified Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-2">
            <div className="flex items-center bg-[#161310] border-2 border-[#332A22] focus-within:border-[#E3BC9A] rounded-lg p-1.5 shadow-2xl transition-all">
              <Search className="w-5 h-5 text-[#8C8071] ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter Journal Title, ISSN (e.g. 1932-6203), DOI prefix (10.1038), or publisher..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-[#FAF7F2] placeholder-[#665D52] focus:outline-none"
              />
              <button
                type="submit"
                className="ss-btn-primary px-5 py-2.5 text-sm whitespace-nowrap"
              >
                Check Journal
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2.5 text-xs text-[#7A7165] font-mono">
              <span>Try: </span>
              <button type="button" onClick={() => navigate('/journal-check?q=Nature')} className="hover:text-[#E3BC9A] underline">Nature</button>
              <button type="button" onClick={() => navigate('/journal-check?q=1932-6203')} className="hover:text-[#E3BC9A] underline">1932-6203 (PLOS ONE)</button>
              <button type="button" onClick={() => navigate('/journal-check?q=BMJ%20Open')} className="hover:text-[#E3BC9A] underline">BMJ Open</button>
            </div>
          </form>

        </div>
      </section>

      {/* 2. FOUR AUDIENCE ENTRY POINTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display text-2xl font-bold text-[#FAF7F2]">
            Start Where You Stand
          </h2>
          <p className="text-xs text-[#8F8475] mt-1 font-mono uppercase tracking-wider">
            Tailored workflows for each research integrity stakeholder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Authors */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-[#1F1A15] border border-[#3A3026] flex items-center justify-center text-[#E3BC9A] mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[#FAF7F2] mb-1.5">
                Authors & Researchers
              </h3>
              <p className="text-xs text-[#9E9486] leading-relaxed mb-4">
                Verify journal legitimacy, peer-review transparency, and indexing eligibility before paying submission or publication fees.
              </p>
            </div>
            <Link to="/journal-check" className="text-xs font-semibold text-[#E3BC9A] hover:underline inline-flex items-center gap-1">
              Check a journal <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Editors */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-[#1F1A15] border border-[#3A3026] flex items-center justify-center text-[#E3BC9A] mb-3">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[#FAF7F2] mb-1.5">
                Editors & Publishers
              </h3>
              <p className="text-xs text-[#9E9486] leading-relaxed mb-4">
                Crawl your journal website against 121 criteria to generate an actionable remediation plan before applying to Scopus or DOAJ.
              </p>
            </div>
            <Link to="/journal-audit" className="text-xs font-semibold text-[#E3BC9A] hover:underline inline-flex items-center gap-1">
              Start readiness audit <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Institutions */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-[#1F1A15] border border-[#3A3026] flex items-center justify-center text-[#E3BC9A] mb-3">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[#FAF7F2] mb-1.5">
                Institutions & Deans
              </h3>
              <p className="text-xs text-[#9E9486] leading-relaxed mb-4">
                Maintain institutional watchlists, run batch CSV publication evaluations, and produce auditable research integrity committee reports.
              </p>
            </div>
            <Link to="/institution/dashboard" className="text-xs font-semibold text-[#E3BC9A] hover:underline inline-flex items-center gap-1">
              Integrity Desk <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Portfolio Managers */}
          <div className="ss-card p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-[#1F1A15] border border-[#3A3026] flex items-center justify-center text-[#E3BC9A] mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[#FAF7F2] mb-1.5">
                Portfolio Managers
              </h3>
              <p className="text-xs text-[#9E9486] leading-relaxed mb-4">
                Monitor complete journal portfolios on a single dashboard, catch dead DOI resolutions, and audit metadata completeness.
              </p>
            </div>
            <Link to="/portfolio/dashboard" className="text-xs font-semibold text-[#E3BC9A] hover:underline inline-flex items-center gap-1">
              Portfolio Console <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. THE FIVE SCORING PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#12100E] border border-[#27211B] rounded-xl p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
              Deterministic Evaluation Engine
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#FAF7F2] mt-1">
              The 5 Pillars of Journal Trust
            </h2>
            <p className="text-xs sm:text-sm text-[#A3998B] mt-2 leading-relaxed">
              Every journal rating is computed from verifiable evidence retrieved directly from public scholarly infrastructure. Zero black-box guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            <div className="bg-[#171411] border border-[#2B241E] p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-[#E3BC9A]">25%</div>
              <h4 className="font-display font-bold text-sm text-[#FAF7F2] mt-1">Identity & Governance</h4>
              <p className="text-[11px] text-[#8C8274] mt-1.5 leading-relaxed">
                Active ISSN confirmed on CIEPS, verified publisher corporate jurisdiction, transparent editorial leadership.
              </p>
            </div>

            <div className="bg-[#171411] border border-[#2B241E] p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-[#E3BC9A]">25%</div>
              <h4 className="font-display font-bold text-sm text-[#FAF7F2] mt-1">Editorial Integrity</h4>
              <p className="text-[11px] text-[#8C8274] mt-1.5 leading-relaxed">
                Verifiable double-blind or transparent peer review, COPE compliance, automated plagiarism screening disclosures.
              </p>
            </div>

            <div className="bg-[#171411] border border-[#2B241E] p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-[#E3BC9A]">20%</div>
              <h4 className="font-display font-bold text-sm text-[#FAF7F2] mt-1">Technical Standing</h4>
              <p className="text-[11px] text-[#8C8274] mt-1.5 leading-relaxed">
                Persistent Crossref/DataCite DOI resolution, machine-readable CC licensing, JATS XML structured metadata.
              </p>
            </div>

            <div className="bg-[#171411] border border-[#2B241E] p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-[#E3BC9A]">15%</div>
              <h4 className="font-display font-bold text-sm text-[#FAF7F2] mt-1">Preservation & Access</h4>
              <p className="text-[11px] text-[#8C8274] mt-1.5 leading-relaxed">
                Permanent archival escrow (Portico, CLOCKSS, Internet Archive), transparent author processing charges or Diamond OA.
              </p>
            </div>

            <div className="bg-[#171411] border border-[#2B241E] p-4 rounded-lg">
              <div className="font-mono text-xl font-bold text-[#E3BC9A]">15%</div>
              <h4 className="font-display font-bold text-sm text-[#FAF7F2] mt-1">Reach & Citation</h4>
              <p className="text-[11px] text-[#8C8274] mt-1.5 leading-relaxed">
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
            <h3 className="font-display text-xl font-bold text-[#FAF7F2]">
              Verified Journal Assessments
            </h3>
            <p className="text-xs text-[#8A8072] font-mono">
              Live records scored against Methodology v1.2.0-2026
            </p>
          </div>
          <Link to="/journal-check" className="text-xs font-semibold text-[#E3BC9A] hover:underline">
            View All Journals &rarr;
          </Link>
        </div>

        <div className="bg-[#141210] border border-[#26211C] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A1713] border-b border-[#26211C] text-[#9E9486] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Journal Title</th>
                  <th className="py-3 px-4">Publisher</th>
                  <th className="py-3 px-4">Primary ISSN</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Trust Grade</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201B17]">
                {featuredJournals.map((j) => {
                  const issn = j.identifiers?.[0]?.value || 'N/A';
                  return (
                    <tr key={j.id} className="hover:bg-[#181512] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#FAF7F2]">
                        {j.title}
                      </td>
                      <td className="py-3.5 px-4 text-[#A89F91]">
                        {j.publisher || 'Unknown'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#E3BC9A]">
                        {issn}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums font-bold">
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
          
          <div className="bg-[#12100E] border border-[#241F1A] p-5 rounded-lg text-center">
            <div className="font-mono text-2xl font-bold text-[#FAF7F2] tabular-nums">
              {stats.indexedJournals}
            </div>
            <div className="text-[11px] font-mono text-[#8C8375] uppercase mt-1">
              Assessed Journals
            </div>
          </div>

          <div className="bg-[#12100E] border border-[#241F1A] p-5 rounded-lg text-center">
            <div className="font-mono text-2xl font-bold text-[#E3BC9A] tabular-nums">
              121
            </div>
            <div className="text-[11px] font-mono text-[#8C8375] uppercase mt-1">
              Audit Criteria
            </div>
          </div>

          <div className="bg-[#12100E] border border-[#241F1A] p-5 rounded-lg text-center">
            <div className="font-mono text-2xl font-bold text-[#14B8A6] tabular-nums">
              {stats.indexingDirectories}
            </div>
            <div className="text-[11px] font-mono text-[#8C8375] uppercase mt-1">
              Indexed Directories
            </div>
          </div>

          <div className="bg-[#12100E] border border-[#241F1A] p-5 rounded-lg text-center">
            <div className="font-mono text-2xl font-bold text-[#FAF7F2] tabular-nums">
              {stats.monitoredDois}
            </div>
            <div className="text-[11px] font-mono text-[#8C8375] uppercase mt-1">
              Monitored DOIs
            </div>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-[#15120F] border border-[#2E2720] rounded-xl p-8 sm:p-12 space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
            Know Exactly What Stands Between Your Journal and Indexing
          </h2>
          <p className="text-xs sm:text-sm text-[#A3998B] max-w-xl mx-auto leading-relaxed">
            Run an automated page-level crawler on your journal domain. Receive an itemized report of missing metadata, broken DOIs, and policy gaps.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/journal-audit" className="ss-btn-primary px-6 py-2.5 text-sm">
              Start Indexing Readiness Audit
            </Link>
            <Link to="/how-it-works" className="ss-btn-secondary px-6 py-2.5 text-sm">
              Read the Scoring Methodology
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
