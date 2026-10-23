import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090807] border-t border-[#221E19] text-[#9E9486] text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#1F1B16]">
          
          {/* Col 1: Platform Brand & Mission */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-[#181512] border border-[#3E342B] flex items-center justify-center text-[#E3BC9A]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-base text-[#FAF7F2]">
                Smart Scholars
              </span>
            </div>
            <p className="text-xs text-[#8A8175] leading-relaxed max-w-sm mb-4">
              Independent journal trust ratings, page-level indexing readiness audits, DOI resolution diagnostics, and institutional publication verification. Built with verifiable registry evidence from Crossref, DOAJ, and OpenAlex.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ALL REGISTRY ADAPTERS OPERATIONAL
              </span>
              <Link to="/status" className="text-[#E3BC9A] hover:underline inline-flex items-center gap-0.5">
                Status <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Col 2: Core Workspaces */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#FAF7F2] mb-3">
              Services
            </h4>
            <ul className="space-y-2">
              <li><Link to="/journal-check" className="hover:text-[#E3BC9A] transition-colors">Journal Check</Link></li>
              <li><Link to="/journal-audit" className="hover:text-[#E3BC9A] transition-colors">Indexing Audit</Link></li>
              <li><Link to="/doi-doctor" className="hover:text-[#E3BC9A] transition-colors">DOI Doctor</Link></li>
              <li><Link to="/indexing/directory" className="hover:text-[#E3BC9A] transition-colors">GetIndexed Directory</Link></li>
              <li><Link to="/institution/dashboard" className="hover:text-[#E3BC9A] transition-colors">Research Integrity Desk</Link></li>
              <li><Link to="/portfolio/dashboard" className="hover:text-[#E3BC9A] transition-colors">Portfolio Console</Link></li>
            </ul>
          </div>

          {/* Col 3: Research & Transparency */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#FAF7F2] mb-3">
              Methodology
            </h4>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="hover:text-[#E3BC9A] transition-colors">5-Pillar Standard</Link></li>
              <li><Link to="/newsroom" className="hover:text-[#E3BC9A] transition-colors">Integrity Newsroom</Link></li>
              <li><Link to="/reviews" className="hover:text-[#E3BC9A] transition-colors">Audited Case Studies</Link></li>
              <li><Link to="/faq" className="hover:text-[#E3BC9A] transition-colors">FAQ & Scoring Rules</Link></li>
              <li><Link to="/release-notes" className="hover:text-[#E3BC9A] transition-colors">Release Notes (v1.2.0)</Link></li>
              <li><Link to="/about" className="hover:text-[#E3BC9A] transition-colors">Governance & Team</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#FAF7F2] mb-3">
              Compliance & Legal
            </h4>
            <ul className="space-y-2">
              <li><Link to="/trust-and-security" className="hover:text-[#E3BC9A] transition-colors">Trust & Security</Link></li>
              <li><Link to="/privacy" className="hover:text-[#E3BC9A] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#E3BC9A] transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-[#E3BC9A] transition-colors">Cookie Notice</Link></li>
              <li><Link to="/accessibility" className="hover:text-[#E3BC9A] transition-colors">Accessibility Statement</Link></li>
              <li><Link to="/contact" className="hover:text-[#E3BC9A] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[#7A7165]">
          <p className="leading-relaxed max-w-3xl">
            Smart Scholars provides deterministic research integrity ratings and technical website evaluations based on verifiable public metadata. Platform scores and audit findings are independent analytical indicators and do not constitute official accreditation or guaranteed indexing admission.
          </p>
          <div className="font-mono text-[11px] whitespace-nowrap">
            &copy; {new Date().getFullYear()} Smart Scholars Platform.
          </div>
        </div>

      </div>
    </footer>
  );
};
