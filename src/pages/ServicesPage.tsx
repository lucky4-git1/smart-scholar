import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck2, Stethoscope, Building2, Layers, Archive, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Scholar Shield · Journal Check',
      description: 'Search journals using title, ISSN, or DOI prefix. Evaluates public evidence against our 5-pillar standard and highlights integrity red flags before submission.',
      link: '/journal-check',
      action: 'Check a Journal',
      icon: ShieldCheck,
      badge: 'Public & Free',
    },
    {
      title: 'Journal Indexing Readiness Audit',
      description: 'Crawls journal landing pages against 121 criteria required by Scopus, DOAJ, and Web of Science. Generates itemized findings and code-ready repair blueprints.',
      link: '/journal-audit',
      action: 'Start Readiness Audit',
      icon: FileCheck2,
      badge: 'Editors & Publishers',
    },
    {
      title: 'DOI Doctor & Metadata Repair',
      description: 'Automated handle resolution verification, Crossref XML schema completeness scoring, dead article URL detection, and reconciliation of back-catalog volume inventories.',
      link: '/doi-doctor',
      action: 'Launch DOI Doctor',
      icon: Stethoscope,
      badge: 'Diagnostic Layer',
    },
    {
      title: 'Research Integrity Desk',
      description: 'Designed for university integrity officers and deans. Maintain authorized journal watchlists, run batch publication checks, and export committee reports.',
      link: '/institution/dashboard',
      action: 'Open Integrity Desk',
      icon: Building2,
      badge: 'Institutional Workspace',
    },
    {
      title: 'Portfolio Console',
      description: 'Surveillance and health monitoring across multi-journal society presses, university publishers, and sponsors on a single executive screen.',
      link: '/portfolio/dashboard',
      action: 'Portfolio Console',
      icon: Layers,
      badge: 'Portfolio Oversight',
    },
    {
      title: 'GetIndexed Directory & Dossiers',
      description: 'Searchable directory of global indices (DOAJ, Scopus, PMC, WoS). Create and track dossier preparation stages, attach audit findings, and manage deadlines.',
      link: '/indexing/directory',
      action: 'Browse Directory',
      icon: Archive,
      badge: 'Indexing Workflow',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#0B192C]">
      
      <div className="max-w-2xl">
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
          Smart Scholars · Product Ecosystem
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
          Complete Research Integrity & Indexing Services
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 leading-relaxed">
          Six interconnected tools providing deterministic journal trustworthiness ratings, technical website readiness scans, DOI resolution maintenance, and institutional governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="ss-card p-6 flex flex-col justify-between space-y-4 shadow-paper">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/20 flex items-center justify-center text-[#0B192C]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0B192C] font-bold px-2 py-0.5 rounded-sm bg-[#EBDDCD] border border-[#0B192C]/15">
                    {s.badge}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#0B192C] mt-4">
                  {s.title}
                </h3>

                <p className="text-xs text-[#475E79] leading-relaxed mt-2">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#0B192C]/10">
                <Link to={s.link} className="ss-btn-primary text-xs py-2 px-4 w-full text-center block font-bold">
                  <span>{s.action} &rarr;</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
