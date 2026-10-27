import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Stethoscope, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';
import { GradeBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';

export const PortfolioDashboardPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/v1/portfolio/dashboard')
      .then(res => {
        if (res.metrics) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0B192C]">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0B192C]/15 pb-6">
        <div>
          <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
            PORTFOLIO CONSOLE · MULTI-JOURNAL SURVEILLANCE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
            Every Journal You are Responsible For, On One Screen
          </h1>
          <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 max-w-2xl leading-relaxed">
            Designed for society publishers, university presses, and portfolio managers. Monitor ratings, track dead article URLs, and reconcile metadata across all active titles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/journal-audit" className="ss-btn-primary text-xs py-2 px-4 whitespace-nowrap font-bold">
            <span>Audit Portfolio Journal</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row (Crisp Paper Cards with Deep Pine Figures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#475E79] uppercase font-bold block">Monitored Journals</span>
          <span className="font-mono text-3xl font-extrabold text-[#0B192C] mt-1 block tabular-nums">
            {data?.metrics?.totalJournals ?? 0}
          </span>
        </div>

        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#475E79] uppercase font-bold block">Average Trust Score</span>
          <span className="font-mono text-3xl font-extrabold text-[#0B192C] mt-1 block tabular-nums">
            {data?.metrics?.averageTrustScore ?? 0}
            <span className="text-xs font-mono text-[#475E79]"> / 100</span>
          </span>
        </div>

        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#0B192C] uppercase font-bold block">DOI Resolution Health</span>
          <span className="font-mono text-3xl font-extrabold text-[#167C6B] mt-1 block tabular-nums">
            {data?.metrics?.resolutionHealthRate ?? 100}%
          </span>
        </div>

        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#A81B1B] uppercase font-bold block">Dead DOI Alerts</span>
          <span className="font-mono text-3xl font-extrabold text-[#A81B1B] mt-1 block tabular-nums">
            {data?.metrics?.brokenDois ?? 0}
          </span>
        </div>

      </div>

      {/* Monitored Journals Table (Paper Style with Oxford Pine Header) */}
      <div className="ss-card overflow-hidden shadow-paper">
        <div className="p-5 border-b border-[#0B192C]/15 bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0B192C]">
              Active Portfolio Serials
            </h3>
            <p className="text-xs text-[#475E79]">
              Continuous surveillance of indexing readiness, DOI persistence, and editorial integrity.
            </p>
          </div>
          <span className="text-xs font-mono text-[#0B192C] font-bold">
            {data?.journals?.length ?? 0} TITLES MONITORED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B192C] text-[#FAF7F2] font-mono uppercase text-[10.5px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Journal Title</th>
                <th className="py-3.5 px-4 font-bold">Publisher</th>
                <th className="py-3.5 px-4 font-bold">Primary ISSN</th>
                <th className="py-3.5 px-4 font-bold">Score</th>
                <th className="py-3.5 px-4 font-bold">Grade</th>
                <th className="py-3.5 px-4 font-bold">Last Checked</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B192C]/10 bg-[#FFFFFF]">
              {data?.journals?.map((j: any) => (
                <tr key={j.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#0B192C]">
                    {j.title}
                  </td>
                  <td className="py-3.5 px-4 text-[#475E79]">
                    {j.publisher || 'Unknown'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#0B192C]">
                    {j.identifiers?.[0]?.value || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-[#0B192C]">
                    {j.currentScore !== null ? `${j.currentScore} / 100` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <GradeBadge grade={j.currentGrade || 'UNVERIFIED'} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#475E79]">
                    {j.lastAssessedAt ? new Date(j.lastAssessedAt).toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <Link
                        to={`/journal-check/results/${j.id}`}
                        className="ss-btn-secondary text-[11px] py-1 px-3 font-semibold whitespace-nowrap"
                      >
                        Evidence
                      </Link>
                      <Link
                        to={`/journal-audit?url=${encodeURIComponent(j.websiteUrl || '')}`}
                        className="ss-btn-primary text-[11px] py-1 px-3 font-bold whitespace-nowrap"
                      >
                        Audit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
