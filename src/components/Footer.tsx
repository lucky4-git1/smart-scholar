import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Database, CheckSquare, FileText, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B192C] text-[#FAF7F2] text-xs pt-16 pb-12 border-t-2 border-[#E06B43] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Registry Trust Badges Strip (Crisp Ivory Paper on Prussian Navy) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-sm bg-[#FFFFFF] border-2 border-[#162E4D] shadow-retro-sm text-[#0B192C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#0B192C] border border-[#162E4D] flex items-center justify-center text-[#E06B43]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0B192C] block font-bold">Registry 01</span>
              <span className="font-serif font-bold text-[14px] text-[#0B192C]">Crossref API</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#0B192C] border border-[#162E4D] flex items-center justify-center text-[#E06B43]">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0B192C] block font-bold">Registry 02</span>
              <span className="font-serif font-bold text-[14px] text-[#0B192C]">DOAJ v2</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#0B192C] border border-[#162E4D] flex items-center justify-center text-[#E06B43]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0B192C] block font-bold">Registry 03</span>
              <span className="font-serif font-bold text-[14px] text-[#0B192C]">OpenAlex Works</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#0B192C] border border-[#162E4D] flex items-center justify-center text-[#E06B43]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0B192C] block font-bold">Preservation</span>
              <span className="font-serif font-bold text-[14px] text-[#0B192C]">Wayback Machine</span>
            </div>
          </div>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Platform Brand & Mission */}
          <div className="col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-[#070F1A] border border-[#162E4D] flex items-center justify-center text-[#E06B43] shadow-retro-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-[#FAF7F2]">
                Smart Scholars
              </span>
            </div>
            <p className="text-xs text-[#C4D3E5] leading-relaxed max-w-sm font-medium">
              Deterministic journal trustworthiness scoring, page-level indexing readiness audits, DOI resolution diagnostics, and institutional publication verification. Powered by verified public registries.
            </p>
            <div className="pt-2 flex items-center gap-3 font-mono text-[11px]">
              <span className="bg-[#070F1A] text-[#E06B43] border border-[#162E4D] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                ALL REGISTRIES OPERATIONAL
              </span>
              <Link to="/status" className="text-[#FAF7F2] font-bold underline hover:text-[#E06B43] inline-flex items-center gap-0.5 transition-colors">
                Live Status <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Col 2: Core Workspaces */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mb-4 border border-[#0B192C]/15">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[#C4D3E5]">
              <li><Link to="/journal-check" className="hover:text-white hover:underline transition-colors">Journal Check</Link></li>
              <li><Link to="/journal-audit" className="hover:text-white hover:underline transition-colors">Indexing Audit</Link></li>
              <li><Link to="/doi-doctor" className="hover:text-white hover:underline transition-colors">DOI Doctor</Link></li>
              <li><Link to="/indexing/directory" className="hover:text-white hover:underline transition-colors">GetIndexed Directory</Link></li>
              <li><Link to="/institution/dashboard" className="hover:text-white hover:underline transition-colors">Research Integrity Desk</Link></li>
              <li><Link to="/portfolio/dashboard" className="hover:text-white hover:underline transition-colors">Portfolio Console</Link></li>
            </ul>
          </div>

          {/* Col 3: Research & Transparency */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mb-4 border border-[#0B192C]/15">
              Methodology
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[#C4D3E5]">
              <li><Link to="/how-it-works" className="hover:text-white hover:underline transition-colors">5-Pillar Standard</Link></li>
              <li><Link to="/newsroom" className="hover:text-white hover:underline transition-colors">Integrity Newsroom</Link></li>
              <li><Link to="/reviews" className="hover:text-white hover:underline transition-colors">Audited Case Studies</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:underline transition-colors">FAQ & Scoring Rules</Link></li>
              <li><Link to="/release-notes" className="hover:text-white hover:underline transition-colors">Release Notes (v1.2.0)</Link></li>
              <li><Link to="/about" className="hover:text-white hover:underline transition-colors">Governance & Methodology</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B192C] bg-[#EBDDCD] px-1.5 py-0.5 rounded-sm inline-block mb-4 border border-[#0B192C]/15">
              Compliance
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[#C4D3E5]">
              <li><Link to="/trust-and-security" className="hover:text-white hover:underline transition-colors">Trust & Security</Link></li>
              <li><Link to="/privacy" className="hover:text-white hover:underline transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white hover:underline transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white hover:underline transition-colors">Cookie Notice</Link></li>
              <li><Link to="/accessibility" className="hover:text-white hover:underline transition-colors">Accessibility</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:underline transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#8FA5BD] text-[11px] font-medium">
          <p className="leading-relaxed max-w-3xl">
            Smart Scholars provides deterministic research integrity ratings and technical evaluations based on verifiable public metadata. Platform scores are independent analytical indicators and do not constitute official accreditation.
          </p>
          <div className="font-mono whitespace-nowrap text-[#FAF7F2] font-bold">
            &copy; {new Date().getFullYear()} Smart Scholars Platform.
          </div>
        </div>

      </div>
    </footer>
  );
};
