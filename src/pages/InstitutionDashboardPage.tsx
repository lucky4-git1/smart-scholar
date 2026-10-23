import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, BookmarkCheck, AlertOctagon, FileSpreadsheet, ArrowRight, ShieldCheck } from 'lucide-react';
import { GradeBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';

export const InstitutionDashboardPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/v1/institution/dashboard')
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
            Research Integrity Desk · Institutional Workspace
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
            University & Institutional Integrity Oversight
          </h1>
          <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
            Maintain authorized journal watchlists, evaluate faculty publication submissions against evidence rather than static blacklists, and produce committee reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/institution/watchlist" className="ss-btn-secondary text-xs py-1.5 px-3">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#E3BC9A]" />
            <span>Journal Watchlist</span>
          </Link>
          <Link to="/institution/batch-evaluation" className="ss-btn-primary text-xs py-1.5 px-3">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Batch Evaluate CSV</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-[#8C8375] uppercase block">Watchlist Journals</span>
          <span className="font-mono text-3xl font-extrabold text-[#FAF7F2] mt-1 block">
            {data?.metrics?.totalWatchlist ?? 0}
          </span>
        </div>

        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Approved Serials</span>
          <span className="font-mono text-3xl font-extrabold text-emerald-400 mt-1 block">
            {data?.metrics?.approvedCount ?? 0}
          </span>
        </div>

        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-rose-400 uppercase block">Flagged Risk Serials</span>
          <span className="font-mono text-3xl font-extrabold text-rose-400 mt-1 block">
            {data?.metrics?.flaggedCount ?? 0}
          </span>
        </div>

        <div className="bg-[#14120F] border border-[#27211B] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-[#E3BC9A] uppercase block">Institutional Compliance</span>
          <span className="font-mono text-3xl font-extrabold text-[#E3BC9A] mt-1 block">
            {data?.metrics?.complianceRate ?? 100}%
          </span>
        </div>

      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-[#14120F] border border-[#26201B] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#241F1A] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#FAF7F2]">
              Recent Institutional Assessments
            </h3>
            <p className="text-xs text-[#8A8174]">
              Latest evaluation history conducted for committee review
            </p>
          </div>
          <Link to="/institution/watchlist" className="text-xs font-semibold text-[#E3BC9A] hover:underline">
            Manage Full Watchlist &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181512] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Journal Title</th>
                <th className="py-3 px-4">Evaluation Date</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Trust Grade</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#201B17]">
              {data?.recentAssessments?.map((a: any) => (
                <tr key={a.id} className="hover:bg-[#181512] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#FAF7F2]">
                    {a.journal.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#9E9486]">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#E3BC9A]">
                    {a.totalScore} / 100
                  </td>
                  <td className="py-3 px-4">
                    <GradeBadge grade={a.letterGrade} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/journal-check/results/${a.journalId}`}
                      className="ss-btn-secondary text-[11px] py-1 px-2.5"
                    >
                      Inspect Evidence
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
