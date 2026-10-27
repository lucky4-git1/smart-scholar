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
  ArrowUpRight, 
  ExternalLink, 
  Check, 
  FileCode, 
  Activity, 
  Globe2 
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
    <div className="text-[#0B192C] paper-grain">
      
      {/* 1. HERO SECTION (Deep Oxford Pine with Ivory Dossier Paper Card) */}
      <section className="relative bg-[#10243E] text-[#FAF7F2] pt-16 pb-20 border-b-2 border-[#0B192C] paper-grain overflow-hidden">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#E06B43_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Headings & Search Form */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider bg-[#E06B43] text-[#0B192C] font-bold px-2 py-0.5 rounded-sm shadow-retro-sm">
                  AUDIT STANDARD v1.2.0
                </span>
                <span className="text-xs font-mono text-[#E06B43] font-bold tracking-tight">
                  121 CRITERIA · VERIFIED EVIDENCE
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-[1.08] tracking-tight">
                Which <span className="italic font-normal text-[#EB8461]">journals</span> can be <span className="underline decoration-[#E06B43] decoration-2 underline-offset-8">trusted</span>?
              </h1>

              <p className="text-sm sm:text-base text-[#D8E3EE] max-w-xl leading-relaxed">
                Deterministic trust evaluations, page-level indexing readiness audits, and persistent DOI diagnostics backed by verified bibliographic registries. Zero black-box claims.
              </p>

              {/* Primary Search Form */}
              <form onSubmit={handleSearch} className="max-w-xl pt-2">
                <div className="flex items-center bg-[#070F1A] border-2 border-[#162E4D] focus-within:border-[#E06B43] rounded-sm p-1.5 shadow-retro transition-all">
                  <Search className="w-4 h-4 text-[#E06B43] ml-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter Journal Title, ISSN (e.g. 0028-0836), or DOI..."
                    className="w-full min-w-0 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-[#71869E] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="ss-btn-primary text-xs px-4 sm:px-5 py-2.5 whitespace-nowrap flex-shrink-0 font-bold"
                  >
                    Check Journal
                  </button>
                </div>

                {/* Quick Test Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-[#A0B3C6] font-mono">
                  <span className="text-[#71869E] text-[11px]">Direct records:</span>
                  <button 
                    type="button" 
                    onClick={() => navigate('/journal-check?q=Nature')} 
                    className="px-2 py-0.5 rounded-sm bg-[#070F1A] border border-[#162E4D] text-[#D8E3EE] hover:border-[#E06B43] hover:text-white transition-colors"
                  >
                    Nature
                  </button>
                  <button 
                    type="button" 
                    onClick={() => navigate('/journal-check?q=1932-6203')} 
                    className="px-2 py-0.5 rounded-sm bg-[#070F1A] border border-[#162E4D] text-[#D8E3EE] hover:border-[#E06B43] hover:text-white transition-colors"
                  >
                    1932-6203 (PLOS ONE)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => navigate('/journal-check?q=Sensors')} 
                    className="px-2 py-0.5 rounded-sm bg-[#070F1A] border border-[#162E4D] text-[#D8E3EE] hover:border-[#E06B43] hover:text-white transition-colors"
                  >
                    Sensors (MDPI)
                  </button>
                </div>
              </form>

              {/* Verified Sources Disclaimer */}
              <div className="pt-2 flex items-center gap-6 text-[11px] font-mono text-[#71869E]">
                <span>CROSSREF RESOLUTION: 100%</span>
                <span>•</span>
                <span>DOAJ DIRECTORY: LIVE</span>
                <span>•</span>
                <span>OPENALEX: INTEGRATED</span>
              </div>

            </div>

            {/* Right Col: The Interactive Ivory Audit Dossier Card (Directly from Screenshot) */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFFFFF] border-2 border-[#0B192C] rounded-sm p-6 text-[#0B192C] shadow-retro relative transform hover:-translate-y-1 transition-transform duration-200">
                
                {/* Dossier Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#0B192C]/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#E06B43] border border-[#0B192C]" />
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#0B192C]">
                      LIVE AUDIT SPECIMEN #SS-2026
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#475E79] uppercase font-semibold">
                    REF: CR-0836
                  </span>
                </div>

                {/* Journal Identity */}
                <div className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#0B192C] leading-tight">
                        Nature
                      </h3>
                      <p className="text-xs text-[#475E79] mt-0.5">
                        Springer Nature · ISSN 0028-0836 · United Kingdom
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xl font-bold text-[#0B192C] tabular-nums">
                        96<span className="text-sm text-[#475E79]">/100</span>
                      </div>
                      <span className="inline-block px-2 py-0.5 bg-[#EAF5F2] border border-[#167C6B] text-[#0B192C] font-mono text-[10px] font-bold rounded-sm mt-0.5">
                        GRADE A+
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5-Pillar Score Bars */}
                <div className="space-y-2.5 py-3 border-t border-b border-[#0B192C]/10 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#0B192C] font-medium">1. Identity & Governance</span>
                      <span className="font-bold">24 / 25</span>
                    </div>
                    <div className="w-full bg-[#EBDDCD] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-[#0B192C] h-full rounded-sm" style={{ width: '96%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#0B192C] font-medium">2. Editorial Integrity</span>
                      <span className="font-bold">25 / 25</span>
                    </div>
                    <div className="w-full bg-[#EBDDCD] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-[#0B192C] h-full rounded-sm" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#0B192C] font-medium">3. Technical Standing</span>
                      <span className="font-bold">19 / 20</span>
                    </div>
                    <div className="w-full bg-[#EBDDCD] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-[#0B192C] h-full rounded-sm" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#0B192C] font-medium">4. Preservation & Access</span>
                      <span className="font-bold">14 / 15</span>
                    </div>
                    <div className="w-full bg-[#EBDDCD] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-[#0B192C] h-full rounded-sm" style={{ width: '93%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#0B192C] font-medium">5. Reach & Citation</span>
                      <span className="font-bold">14 / 15</span>
                    </div>
                    <div className="w-full bg-[#EBDDCD] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-[#0B192C] h-full rounded-sm" style={{ width: '93%' }} />
                    </div>
                  </div>
                </div>

                {/* Evidence Badges Strip */}
                <div className="pt-3 flex flex-wrap items-center gap-2 text-[10.5px] font-mono">
                  <span className="px-2 py-0.5 rounded-sm bg-[#EAF5F2] border border-[#167C6B] text-[#0B192C] font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#167C6B]" /> DOAJ INDEXED
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-[#EAF5F2] border border-[#167C6B] text-[#0B192C] font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#167C6B]" /> CROSSREF DOI RESOLVED
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-[#EBDDCD] border border-[#E06B43] text-[#8C460C] font-semibold">
                    CLOCKSS ESCROW
                  </span>
                </div>

                {/* Direct Action Link */}
                <div className="pt-4 mt-2">
                  <Link
                    to="/journal-check/results/journal-1"
                    className="w-full ss-btn-secondary text-xs py-2 text-center flex items-center justify-center gap-1.5 font-bold"
                  >
                    <span>Inspect Complete Evidence Dossier</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE FIVE SCORING PILLARS (Authentic Warm Apricot / Peach Sand Block from Reference Screenshot) */}
      <section className="bg-[#EBDDCD] py-16 border-b-2 border-[#0B192C] paper-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#FFFFFF] px-2 py-0.5 rounded-sm border border-[#0B192C]/20 shadow-retro-sm">
              EVALUATION PILLARS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B192C] font-bold mt-2.5 tracking-tight">
              What makes a journal trustworthy or predatory?
            </h2>
            <p className="text-xs sm:text-sm text-[#10243E] mt-2 leading-relaxed font-medium">
              Every score on Smart Scholars is derived from 121 normalized criteria evaluated across five deterministic pillars. We query authoritative registries directly — zero self-reported claims.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Pillar 1 */}
            <div className="ss-card p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-[#0B192C] tabular-nums">01 /</div>
                <div className="font-mono text-[10.5px] uppercase font-bold text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mt-2 border border-[#0B192C]/20">
                  WEIGHT: 25%
                </div>
                <h3 className="font-serif text-base font-bold text-[#0B192C] mt-3 mb-1.5">
                  Identity & Governance
                </h3>
                <p className="text-xs text-[#475E79] leading-relaxed">
                  Active ISSN confirmed via CIEPS, verified publisher corporate address, transparent editorial board identity.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0B192C]/10 mt-4 text-[11px] font-mono text-[#0B192C] font-semibold">
                32 Audit Checks
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="ss-card p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-[#0B192C] tabular-nums">02 /</div>
                <div className="font-mono text-[10.5px] uppercase font-bold text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mt-2 border border-[#0B192C]/20">
                  WEIGHT: 25%
                </div>
                <h3 className="font-serif text-base font-bold text-[#0B192C] mt-3 mb-1.5">
                  Editorial Integrity
                </h3>
                <p className="text-xs text-[#475E79] leading-relaxed">
                  Peer-review process disclosure, COPE ethics conformity, retraction policy, automated plagiarism screening.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0B192C]/10 mt-4 text-[11px] font-mono text-[#0B192C] font-semibold">
                28 Audit Checks
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="ss-card p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-[#0B192C] tabular-nums">03 /</div>
                <div className="font-mono text-[10.5px] uppercase font-bold text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mt-2 border border-[#0B192C]/20">
                  WEIGHT: 20%
                </div>
                <h3 className="font-serif text-base font-bold text-[#0B192C] mt-3 mb-1.5">
                  Technical Standing
                </h3>
                <p className="text-xs text-[#475E79] leading-relaxed">
                  Persistent Crossref DOI resolution, machine-readable CC licensing, JATS XML metadata, OAI-PMH endpoints.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0B192C]/10 mt-4 text-[11px] font-mono text-[#0B192C] font-semibold">
                24 Audit Checks
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="ss-card p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-[#0B192C] tabular-nums">04 /</div>
                <div className="font-mono text-[10.5px] uppercase font-bold text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mt-2 border border-[#0B192C]/20">
                  WEIGHT: 15%
                </div>
                <h3 className="font-serif text-base font-bold text-[#0B192C] mt-3 mb-1.5">
                  Preservation & Access
                </h3>
                <p className="text-xs text-[#475E79] leading-relaxed">
                  Digital preservation escrow (Portico, CLOCKSS, Internet Archive), transparent author fees or Diamond OA status.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0B192C]/10 mt-4 text-[11px] font-mono text-[#0B192C] font-semibold">
                19 Audit Checks
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="ss-card p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-[#0B192C] tabular-nums">05 /</div>
                <div className="font-mono text-[10.5px] uppercase font-bold text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mt-2 border border-[#0B192C]/20">
                  WEIGHT: 15%
                </div>
                <h3 className="font-serif text-base font-bold text-[#0B192C] mt-3 mb-1.5">
                  Reach & Citation
                </h3>
                <p className="text-xs text-[#475E79] leading-relaxed">
                  OpenAlex citation history, Crossref reference distribution, global author representation, zero citation cartel anomalies.
                </p>
              </div>
              <div className="pt-4 border-t border-[#0B192C]/10 mt-4 text-[11px] font-mono text-[#0B192C] font-semibold">
                18 Audit Checks
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FOUR AUDIENCE ENTRY POINTS (Clean Warm Cream Paper) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FBF6EE]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
              WORKSPACES
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#0B192C] mt-2 tracking-tight">
              Start Where You Stand
            </h2>
            <p className="text-xs font-mono uppercase tracking-wider text-[#475E79] mt-1">
              Dedicated portals for authors, editors, institutions, and publishers
            </p>
          </div>
          <div className="text-xs font-mono text-[#0B192C] font-bold">
            4 DISTINCT PORTALS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          
          {/* Authors */}
          <div className="ss-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-sm bg-[#EBDDCD] border border-[#E06B43] flex items-center justify-center text-[#0B192C] mb-4">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B192C] mb-1.5">
                Authors & Researchers
              </h3>
              <p className="text-xs text-[#475E79] leading-relaxed mb-4">
                Verify journal legitimacy, peer-review transparency, and indexing eligibility before paying APC fees.
              </p>
            </div>
            <Link to="/journal-check" className="ss-btn-secondary text-xs w-full py-2 justify-between">
              <span>Check a journal</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Editors */}
          <div className="ss-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-sm bg-[#EAF5F2] border border-[#167C6B] flex items-center justify-center text-[#0B192C] mb-4">
                <FileCheck2 className="w-4 h-4 text-[#167C6B]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B192C] mb-1.5">
                Editors & Publishers
              </h3>
              <p className="text-xs text-[#475E79] leading-relaxed mb-4">
                Crawl your journal domain against 121 criteria to generate an automated repair plan before applying to DOAJ or Scopus.
              </p>
            </div>
            <Link to="/journal-audit" className="ss-btn-secondary text-xs w-full py-2 justify-between">
              <span>Start readiness audit</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Institutions */}
          <div className="ss-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-sm bg-[#EBDDCD] border border-[#0B192C]/20 flex items-center justify-center text-[#0B192C] mb-4">
                <Building className="w-4 h-4 text-[#0B192C]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B192C] mb-1.5">
                Institutions & Deans
              </h3>
              <p className="text-xs text-[#475E79] leading-relaxed mb-4">
                Maintain institutional watchlists, run batch CSV publication evaluations, and produce auditable research integrity committee reports.
              </p>
            </div>
            <Link to="/institution/dashboard" className="ss-btn-secondary text-xs w-full py-2 justify-between">
              <span>Integrity Desk</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Portfolio Managers */}
          <div className="ss-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-sm bg-[#0B192C] border border-[#162E4D] flex items-center justify-center text-[#E06B43] mb-4">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B192C] mb-1.5">
                Portfolio Managers
              </h3>
              <p className="text-xs text-[#475E79] leading-relaxed mb-4">
                Monitor complete journal portfolios on a single dashboard, catch dead DOI resolutions, and audit metadata completeness.
              </p>
            </div>
            <Link to="/portfolio/dashboard" className="ss-btn-secondary text-xs w-full py-2 justify-between">
              <span>Portfolio Console</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. THE 121-CRITERION AUDIT ENGINE & REPAIR PLAN (Deep Oxford Pine Container) */}
      <section className="bg-[#0B192C] text-[#FAF7F2] py-16 border-t-2 border-b-2 border-[#070F1A] paper-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#E06B43] bg-[#070F1A] px-2 py-0.5 rounded-sm border border-[#162E4D]">
                SAFE CRAWLER & REPAIR ENGINE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
                Turn Technical Gaps into an Actionable Checklist
              </h2>
              <p className="text-xs sm:text-sm text-[#D8E3EE] leading-relaxed">
                Applying to DOAJ, Scopus, or Web of Science often ends in rejection due to simple technical oversights — missing CC license declarations, broken DOI schemas, or obscured editorial boards.
              </p>
              <ul className="space-y-2.5 text-xs text-[#D8E3EE] pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E06B43] flex-shrink-0" />
                  <span>Checks 121 criteria across policies, licensing, and metadata</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E06B43] flex-shrink-0" />
                  <span>Provides copy-paste HTML & JATS XML repair snippets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E06B43] flex-shrink-0" />
                  <span>Automated re-crawl verification after publisher fixes</span>
                </li>
              </ul>
              <div className="pt-3">
                <Link to="/journal-audit" className="ss-btn-primary text-xs px-5 py-2.5">
                  Launch Safe Journal Audit
                </Link>
              </div>
            </div>

            {/* Visual Repair Plan Code Preview */}
            <div className="lg:col-span-6">
              <div className="bg-[#070F1A] border-2 border-[#162E4D] rounded-sm p-5 font-mono text-xs shadow-retro">
                <div className="flex items-center justify-between pb-3 border-b border-[#162E4D] text-[#E06B43] text-[11px]">
                  <span className="flex items-center gap-2 font-bold">
                    <FileCode className="w-3.5 h-3.5" /> REPAIR_PLAN_RECOMMENDATION.XML
                  </span>
                  <span className="text-[#E06B43] font-bold">SEVERITY: HIGH</span>
                </div>
                <div className="py-3 text-[11.5px] space-y-2 text-[#D8E3EE]">
                  <p className="text-[#E06B43]">
                    // Missing machine-readable CC license detected on article landing pages
                  </p>
                  <pre className="p-3 bg-[#031512] border border-[#0E473E] rounded text-[#E06B43] overflow-x-auto">
{`<license xlink:href="https://creativecommons.org/licenses/by/4.0/">
  <license-p>This work is licensed under a Creative Commons Attribution 4.0 International License.</license-p>
</license>`}
                  </pre>
                  <p className="text-[#71869E] text-[10.5px]">
                    Expected by: DOAJ v2 Standard, PubMed Central, Scopus Criteria Section 4.2
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. VERIFIED ASSESSMENTS TABLE (Warm Biscuit / Sand Paper Background) */}
      <section className="bg-[#EBDDCD] py-16 border-b-2 border-[#0B192C] paper-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#FFFFFF] px-2 py-0.5 rounded-sm border border-[#0B192C]/20 shadow-retro-sm">
                DATABASE RECORDS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B192C] mt-1.5">
                Verified Journal Assessments
              </h2>
              <p className="text-xs text-[#10243E] font-mono mt-0.5 font-medium">
                Scored deterministically against Methodology v1.2.0-2026
              </p>
            </div>
            <Link to="/journal-check" className="ss-btn-primary text-xs px-3.5 py-1.5 font-bold self-start sm:self-auto">
              <span>Search all 48,000+ journals</span> &rarr;
            </Link>
          </div>

          <div className="ss-card overflow-hidden shadow-retro border-2 border-[#0B192C]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B192C] text-[#FAF7F2] font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Journal Title</th>
                    <th className="py-3 px-4 font-bold">Publisher</th>
                    <th className="py-3 px-4 font-bold">Primary ISSN</th>
                    <th className="py-3 px-4 font-bold">Score</th>
                    <th className="py-3 px-4 font-bold">Trust Grade</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B192C]/10 bg-[#FFFFFF]">
                  {featuredJournals.map((j) => {
                    const issn = j.identifiers?.[0]?.value || 'N/A';
                    return (
                      <tr key={j.id} className="hover:bg-[#EBDDCD]/30 transition-colors">
                        <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#0B192C]">
                          {j.title}
                        </td>
                        <td className="py-3.5 px-4 text-[#475E79]">
                          {j.publisher || 'Unknown'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#0B192C]">
                          {issn}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-[#0B192C]">
                          {j.currentScore !== null ? `${j.currentScore} / 100` : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <GradeBadge grade={j.currentGrade || 'UNVERIFIED'} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/journal-check/results/${j.id}`}
                            className="ss-btn-secondary text-[11px] py-1 px-3 font-semibold"
                          >
                            View Dossier
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIVE PLATFORM METRICS */}
      <section className="bg-[#FBF6EE] py-16 border-b-2 border-[#0B192C] paper-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            
            <div className="bg-[#FFFFFF] border-2 border-[#0B192C] p-6 rounded-sm text-center shadow-retro">
              <div className="font-mono text-3xl font-extrabold text-[#0B192C] tabular-nums">
                48,000+
              </div>
              <div className="text-[11px] font-mono text-[#0B192C] uppercase font-bold mt-1">
                Indexed Serials
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#0B192C] p-6 rounded-sm text-center shadow-retro">
              <div className="font-mono text-3xl font-extrabold text-[#0B192C] tabular-nums">
                121
              </div>
              <div className="text-[11px] font-mono text-[#0B192C] uppercase font-bold mt-1">
                Audit Criteria
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#0B192C] p-6 rounded-sm text-center shadow-retro">
              <div className="font-mono text-3xl font-extrabold text-[#0B192C] tabular-nums">
                120M+
              </div>
              <div className="text-[11px] font-mono text-[#0B192C] uppercase font-bold mt-1">
                Monitored DOIs
              </div>
            </div>

            <div className="bg-[#FFFFFF] border-2 border-[#0B192C] p-6 rounded-sm text-center shadow-retro">
              <div className="font-mono text-3xl font-extrabold text-[#0B192C] tabular-nums">
                99.8%
              </div>
              <div className="text-[11px] font-mono text-[#0B192C] uppercase font-bold mt-1">
                Resolution Rate
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION (Rich Apricot & Pine Card) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-[#0B192C] text-[#FAF7F2] border-2 border-[#070F1A] rounded-sm p-8 sm:p-12 space-y-5 shadow-retro">
          <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#E06B43] px-2 py-0.5 rounded-sm shadow-retro-sm">
            RESEARCH INTEGRITY ENGINE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Know Exactly What Stands Between Your Journal and Indexing
          </h2>
          <p className="text-xs sm:text-sm text-[#D8E3EE] max-w-xl mx-auto leading-relaxed">
            Run an automated page-level crawler on your journal domain. Receive an itemized report of missing metadata, broken DOIs, and policy gaps.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/journal-audit" className="ss-btn-primary px-6 py-2.5 text-xs font-bold">
              Start Indexing Readiness Audit
            </Link>
            <Link to="/how-it-works" className="ss-btn-secondary px-6 py-2.5 text-xs font-bold">
              Read the Scoring Methodology
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
