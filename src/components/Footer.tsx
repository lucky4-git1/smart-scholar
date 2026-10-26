import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#09090b] border-t border-zinc-800/80 text-zinc-400 text-xs pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-zinc-800/80">
          
          {/* Col 1: Platform Brand & Mission */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-zinc-100">
                Smart Scholars
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mb-4">
              Independent journal trust ratings, page-level indexing readiness audits, DOI resolution diagnostics, and institutional publication verification. Powered by verified evidence from Crossref, DOAJ, and OpenAlex.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                ALL REGISTRIES OPERATIONAL
              </span>
              <span className="text-zinc-600">/</span>
              <Link to="/status" className="text-zinc-400 hover:text-white inline-flex items-center gap-0.5 font-mono text-[11px]">
                Status <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Col 2: Core Workspaces */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-200 mb-3.5">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/journal-check" className="text-zinc-400 hover:text-zinc-100 transition-colors">Journal Check</Link></li>
              <li><Link to="/journal-audit" className="text-zinc-400 hover:text-zinc-100 transition-colors">Indexing Audit</Link></li>
              <li><Link to="/doi-doctor" className="text-zinc-400 hover:text-zinc-100 transition-colors">DOI Doctor</Link></li>
              <li><Link to="/indexing/directory" className="text-zinc-400 hover:text-zinc-100 transition-colors">GetIndexed Directory</Link></li>
              <li><Link to="/institution/dashboard" className="text-zinc-400 hover:text-zinc-100 transition-colors">Research Integrity Desk</Link></li>
              <li><Link to="/portfolio/dashboard" className="text-zinc-400 hover:text-zinc-100 transition-colors">Portfolio Console</Link></li>
            </ul>
          </div>

          {/* Col 3: Research & Transparency */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-200 mb-3.5">
              Methodology
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/how-it-works" className="text-zinc-400 hover:text-zinc-100 transition-colors">5-Pillar Standard</Link></li>
              <li><Link to="/newsroom" className="text-zinc-400 hover:text-zinc-100 transition-colors">Integrity Newsroom</Link></li>
              <li><Link to="/reviews" className="text-zinc-400 hover:text-zinc-100 transition-colors">Audited Case Studies</Link></li>
              <li><Link to="/faq" className="text-zinc-400 hover:text-zinc-100 transition-colors">FAQ & Scoring Rules</Link></li>
              <li><Link to="/release-notes" className="text-zinc-400 hover:text-zinc-100 transition-colors">Release Notes (v1.2.0)</Link></li>
              <li><Link to="/about" className="text-zinc-400 hover:text-zinc-100 transition-colors">Governance & Team</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-200 mb-3.5">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/trust-and-security" className="text-zinc-400 hover:text-zinc-100 transition-colors">Trust & Security</Link></li>
              <li><Link to="/privacy" className="text-zinc-400 hover:text-zinc-100 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-zinc-400 hover:text-zinc-100 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-zinc-400 hover:text-zinc-100 transition-colors">Cookie Notice</Link></li>
              <li><Link to="/accessibility" className="text-zinc-400 hover:text-zinc-100 transition-colors">Accessibility Statement</Link></li>
              <li><Link to="/contact" className="text-zinc-400 hover:text-zinc-100 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-400">
          <p className="leading-relaxed max-w-3xl text-[11px]">
            Smart Scholars provides deterministic research integrity ratings and technical website evaluations based on verifiable public metadata. Platform scores and audit findings are independent analytical indicators and do not constitute official accreditation or guaranteed indexing admission.
          </p>
          <div className="font-mono text-[11px] whitespace-nowrap text-zinc-400">
            &copy; {new Date().getFullYear()} Smart Scholars Platform.
          </div>
        </div>

      </div>
    </footer>
  );
};
