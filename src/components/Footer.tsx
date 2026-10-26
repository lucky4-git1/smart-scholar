import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Database, CheckSquare, FileText, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#072E27] text-[#FAF6EE] text-xs pt-16 pb-12 border-t-4 border-[#22D0B9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Registry Trust Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-md bg-[#0A3D36] border border-[#166054]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#06231E] border border-[#22D0B9]/40 flex items-center justify-center text-[#22D0B9]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#22D0B9] block font-bold">Registry 01</span>
              <span className="font-semibold text-[13px] text-white">Crossref API</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#06231E] border border-[#22D0B9]/40 flex items-center justify-center text-[#22D0B9]">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#22D0B9] block font-bold">Registry 02</span>
              <span className="font-semibold text-white text-[13px]">DOAJ v2</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#06231E] border border-[#22D0B9]/40 flex items-center justify-center text-[#22D0B9]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#22D0B9] block font-bold">Registry 03</span>
              <span className="font-semibold text-white text-[13px]">OpenAlex Works</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#06231E] border border-[#22D0B9]/40 flex items-center justify-center text-[#22D0B9]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#22D0B9] block font-bold">Preservation</span>
              <span className="font-semibold text-white text-[13px]">Wayback Machine</span>
            </div>
          </div>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-[#115E53]/60">
          
          {/* Col 1: Platform Brand & Mission */}
          <div className="col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-[#06231E] border border-[#22D0B9] flex items-center justify-center text-[#22D0B9] shadow-retro-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-white">
                Smart Scholars
              </span>
            </div>
            <p className="text-xs text-[#CFE7E2] leading-relaxed max-w-sm">
              Deterministic journal trustworthiness scoring, page-level indexing readiness audits, DOI resolution diagnostics, and institutional publication verification. Powered by verified public registries.
            </p>
            <div className="pt-2 flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#22D0B9] font-bold uppercase tracking-wider">
                ALL REGISTRIES OPERATIONAL
              </span>
              <span className="text-[#166054]">/</span>
              <Link to="/status" className="text-[#FAF6EE] underline hover:text-[#22D0B9] inline-flex items-center gap-0.5">
                Live Status <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Col 2: Core Workspaces */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#22D0B9] mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/journal-check" className="text-[#CFE7E2] hover:text-white transition-colors">Journal Check</Link></li>
              <li><Link to="/journal-audit" className="text-[#CFE7E2] hover:text-white transition-colors">Indexing Audit</Link></li>
              <li><Link to="/doi-doctor" className="text-[#CFE7E2] hover:text-white transition-colors">DOI Doctor</Link></li>
              <li><Link to="/indexing/directory" className="text-[#CFE7E2] hover:text-white transition-colors">GetIndexed Directory</Link></li>
              <li><Link to="/institution/dashboard" className="text-[#CFE7E2] hover:text-white transition-colors">Research Integrity Desk</Link></li>
              <li><Link to="/portfolio/dashboard" className="text-[#CFE7E2] hover:text-white transition-colors">Portfolio Console</Link></li>
            </ul>
          </div>

          {/* Col 3: Research & Transparency */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#22D0B9] mb-4">
              Methodology
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/how-it-works" className="text-[#CFE7E2] hover:text-white transition-colors">5-Pillar Standard</Link></li>
              <li><Link to="/newsroom" className="text-[#CFE7E2] hover:text-white transition-colors">Integrity Newsroom</Link></li>
              <li><Link to="/reviews" className="text-[#CFE7E2] hover:text-white transition-colors">Audited Case Studies</Link></li>
              <li><Link to="/faq" className="text-[#CFE7E2] hover:text-white transition-colors">FAQ & Scoring Rules</Link></li>
              <li><Link to="/release-notes" className="text-[#CFE7E2] hover:text-white transition-colors">Release Notes (v1.2.0)</Link></li>
              <li><Link to="/about" className="text-[#CFE7E2] hover:text-white transition-colors">Governance & Methodology</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#22D0B9] mb-4">
              Compliance & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/trust-and-security" className="text-[#CFE7E2] hover:text-white transition-colors">Trust & Security</Link></li>
              <li><Link to="/privacy" className="text-[#CFE7E2] hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[#CFE7E2] hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-[#CFE7E2] hover:text-white transition-colors">Cookie Notice</Link></li>
              <li><Link to="/accessibility" className="text-[#CFE7E2] hover:text-white transition-colors">Accessibility Statement</Link></li>
              <li><Link to="/contact" className="text-[#CFE7E2] hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#A7CCC5] text-[11px]">
          <p className="leading-relaxed max-w-3xl">
            Smart Scholars provides deterministic research integrity ratings and technical evaluations based on verifiable public metadata. Platform scores are independent analytical indicators and do not constitute official accreditation.
          </p>
          <div className="font-mono whitespace-nowrap text-[#22D0B9] font-medium">
            &copy; {new Date().getFullYear()} Smart Scholars Platform.
          </div>
        </div>

      </div>
    </footer>
  );
};
