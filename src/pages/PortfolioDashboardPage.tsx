import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Stethoscope, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Portfolio Console · Multi-Journal Governance
          </span>
          <h1 className="font-display text-3xl font-extrabold text-zinc-100 tracking-tight mt-1">
            Every Journal You are Responsible For, On One Screen
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Designed for society publishers, university presses, and portfolio managers. Monitor ratings, track dead article URLs, and reconcile metadata across all active titles.
          </p>
        </div>

        <Link to="/journal-audit" className="ss-btn-primary text-xs py-2 px-3.5">
          <span>Audit Portfolio Journal</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Monitored Journals</span>
          <span className="font-mono text-3xl font-extrabold text-zinc-100 mt-1 block tabular-nums">
            {data?.metrics?.totalJournals ?? 0}
          </span>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Average Trust Score</span>
          <span className="font-mono text-3xl font-extrabold text-zinc-100 mt-1 block tabular-nums">
            {data?.metrics?.averageTrustScore ?? 0}
            <span className="text-xs font-mono text-zinc-400"> / 100</span>
          </span>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">DOI Resolution Health</span>
          <span className="font-mono text-3xl font-extrabold text-emerald-400 mt-1 block tabular-nums">
            {data?.metrics?.resolutionHealthRate ?? 100}%
          </span>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-rose-400 uppercase block">Dead DOI Alerts</span>
          <span className="font-mono text-3xl font-extrabold text-rose-400 mt-1 block tabular-nums">
            {data?.metrics?.brokenDois ?? 0}
          </span>
        </div>

      </div>

      {/* Monitored Journals Table */}
      <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-hidden shadow-tactile">
        <div className="p-5 border-b border-zinc-800">
          <h3 className="font-display font-semibold text-sm text-zinc-100">
            Active Portfolio Serials
          </h3>
          <p className="text-xs text-zinc-400">
            Continuous surveillance of indexing readiness, DOI persistence, and editorial integrity.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Journal Title</th>
                <th className="py-3 px-4 font-semibold">Publisher</th>
                <th className="py-3 px-4 font-semibold">Primary ISSN</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Grade</th>
                <th className="py-3 px-4 font-semibold">Last Checked</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {data?.journals?.map((j: any) => (
                <tr key={j.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-100">
                    {j.title}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {j.publisher || 'Unknown'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {j.identifiers?.[0]?.value || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-zinc-200">
                    {j.currentScore !== null ? `${j.currentScore} / 100` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <GradeBadge grade={j.currentGrade || 'UNVERIFIED'} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    {j.lastAssessedAt ? new Date(j.lastAssessedAt).toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/journal-check/results/${j.id}`}
                      className="ss-btn-secondary text-[11px] py-1 px-2.5 mr-2"
                    >
                      Evidence
                    </Link>
                    <Link
                      to={`/journal-audit?url=${encodeURIComponent(j.websiteUrl || '')}`}
                      className="ss-btn-primary text-[11px] py-1 px-2.5"
                    >
                      Audit
                    </Link>
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
