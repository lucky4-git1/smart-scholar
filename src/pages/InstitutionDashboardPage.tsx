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
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Research Integrity Desk · Institutional Workspace
          </span>
          <h1 className="font-display text-3xl font-extrabold text-zinc-100 tracking-tight mt-1">
            University & Institutional Integrity Oversight
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Maintain authorized journal watchlists, evaluate faculty publication submissions against evidence rather than static blacklists, and produce committee reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/institution/watchlist" className="ss-btn-secondary text-xs py-1.5 px-3">
            <BookmarkCheck className="w-3.5 h-3.5 text-zinc-400" />
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
        
        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Watchlist Serials</span>
          <span className="font-mono text-3xl font-extrabold text-zinc-100 mt-1 block tabular-nums">
            {data?.metrics?.totalWatchlist ?? 0}
          </span>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-emerald-400 uppercase block">Approved Serials</span>
          <span className="font-mono text-3xl font-extrabold text-emerald-400 mt-1 block tabular-nums">
            {data?.metrics?.approvedCount ?? 0}
          </span>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-rose-400 uppercase block">Flagged Risk Serials</span>
          <span className="font-mono text-3xl font-extrabold text-rose-400 mt-1 block tabular-nums">
            {data?.metrics?.flaggedCount ?? 0}
          </span>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-5 rounded-xl shadow-tactile">
          <span className="text-[10px] font-mono text-zinc-300 uppercase block">Institutional Compliance</span>
          <span className="font-mono text-3xl font-extrabold text-zinc-100 mt-1 block tabular-nums">
            {data?.metrics?.complianceRate ?? 100}%
          </span>
        </div>

      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-hidden shadow-tactile">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-sm text-zinc-100">
              Recent Institutional Assessments
            </h3>
            <p className="text-xs text-zinc-400">
              Latest evaluation history conducted for committee review
            </p>
          </div>
          <Link to="/institution/watchlist" className="text-xs font-medium text-zinc-300 hover:text-white">
            Manage Full Watchlist &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Journal Title</th>
                <th className="py-3 px-4 font-semibold">Evaluation Date</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Trust Grade</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {data?.recentAssessments?.map((a: any) => (
                <tr key={a.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-100">
                    {a.journal.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-200 tabular-nums">
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
