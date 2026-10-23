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
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
            Portfolio Console · Multi-Journal Governance
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
            Every Journal You are Responsible For, On One Screen
          </h1>
          <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
            Designed for society publishers, university presses, and portfolio managers. Monitor ratings, track dead article URLs, and reconcile metadata across all active titles.
          </p>
        </div>

        <Link to="/journal-audit" className="ss-btn-primary text-xs py-2 px-3.5">
          <span>Audit a Portfolio Journal</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-[#8C8375] uppercase block">Monitored Journals</span>
          <span className="font-mono text-3xl font-extrabold text-[#FAF7F2] mt-1 block">
            {data?.metrics?.totalJournals ?? 0}
          </span>
        </div>

        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-[#E3BC9A] uppercase block">Average Trust Score</span>
          <span className="font-mono text-3xl font-extrabold text-[#E3BC9A] mt-1 block">
            {data?.metrics?.averageTrustScore ?? 0}
            <span className="text-xs font-mono text-[#8C8375]"> / 100</span>
          </span>
        </div>

        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">DOI Resolution Health</span>
          <span className="font-mono text-3xl font-extrabold text-emerald-400 mt-1 block">
            {data?.metrics?.resolutionHealthRate ?? 100}%
          </span>
        </div>

        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-rose-400 uppercase block">Dead DOI Alerts</span>
          <span className="font-mono text-3xl font-extrabold text-rose-400 mt-1 block">
            {data?.metrics?.brokenDois ?? 0}
          </span>
        </div>

      </div>

      {/* Monitored Journals Table */}
      <div className="bg-[#14120F] border border-[#26201B] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#241F1A]">
          <h3 className="font-display font-bold text-base text-[#FAF7F2]">
            Active Portfolio Serials
          </h3>
          <p className="text-xs text-[#8A8174]">
            Continuous surveillance of indexing readiness, DOI persistence, and editorial integrity.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181512] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Journal Title</th>
                <th className="py-3 px-4">Publisher</th>
                <th className="py-3 px-4">Primary ISSN</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Last Checked</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#201B17]">
              {data?.journals?.map((j: any) => (
                <tr key={j.id} className="hover:bg-[#181512] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#FAF7F2]">
                    {j.title}
                  </td>
                  <td className="py-3.5 px-4 text-[#A89F91]">
                    {j.publisher || 'Unknown'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#E3BC9A]">
                    {j.identifiers?.[0]?.value || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    {j.currentScore !== null ? `${j.currentScore} / 100` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <GradeBadge grade={j.currentGrade || 'UNVERIFIED'} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#8C8375]">
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
