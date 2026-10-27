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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0B192C]">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0B192C]/15 pb-6">
        <div>
          <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
            RESEARCH INTEGRITY DESK · INSTITUTIONAL WORKSPACE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
            University & Institutional Integrity Oversight
          </h1>
          <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 max-w-2xl leading-relaxed">
            Maintain authorized journal watchlists, evaluate faculty publication submissions against evidence rather than static blacklists, and produce committee reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/institution/watchlist" className="ss-btn-secondary text-xs py-2 px-3.5 font-semibold">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#0B192C]" />
            <span>Journal Watchlist</span>
          </Link>
          <Link to="/institution/batch-evaluation" className="ss-btn-primary text-xs py-2 px-4 font-bold">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Batch Evaluate CSV</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#475E79] uppercase font-bold block">Watchlist Serials</span>
          <span className="font-mono text-3xl font-extrabold text-[#0B192C] mt-1 block tabular-nums">
            {data?.metrics?.totalWatchlist ?? 0}
          </span>
        </div>

        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#167C6B] uppercase font-bold block">Approved Serials</span>
          <span className="font-mono text-3xl font-extrabold text-[#167C6B] mt-1 block tabular-nums">
            {data?.metrics?.approvedCount ?? 0}
          </span>
        </div>

        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#A81B1B] uppercase font-bold block">Flagged Risk Serials</span>
          <span className="font-mono text-3xl font-extrabold text-[#A81B1B] mt-1 block tabular-nums">
            {data?.metrics?.flaggedCount ?? 0}
          </span>
        </div>

        <div className="ss-card p-5 shadow-paper">
          <span className="text-[10px] font-mono text-[#0B192C] uppercase font-bold block">Institutional Compliance</span>
          <span className="font-mono text-3xl font-extrabold text-[#0B192C] mt-1 block tabular-nums">
            {data?.metrics?.complianceRate ?? 100}%
          </span>
        </div>

      </div>

      {/* Recent Evaluations Table */}
      <div className="ss-card overflow-hidden shadow-paper">
        <div className="p-5 border-b border-[#0B192C]/15 bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0B192C]">
              Recent Institutional Assessments
            </h3>
            <p className="text-xs text-[#475E79]">
              Latest evaluation history conducted for committee review
            </p>
          </div>
          <Link to="/institution/watchlist" className="text-xs font-mono font-bold text-[#0B192C] hover:underline">
            Manage Full Watchlist &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B192C] text-[#FAF7F2] font-mono uppercase text-[10.5px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Journal Title</th>
                <th className="py-3.5 px-4 font-bold">Evaluation Date</th>
                <th className="py-3.5 px-4 font-bold">Score</th>
                <th className="py-3.5 px-4 font-bold">Trust Grade</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B192C]/10 bg-[#FFFFFF]">
              {data?.recentAssessments?.map((a: any) => (
                <tr key={a.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#0B192C]">
                    {a.journal.title}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#475E79]">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B192C] tabular-nums">
                    {a.totalScore} / 100
                  </td>
                  <td className="py-3.5 px-4">
                    <GradeBadge grade={a.letterGrade} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/journal-check/results/${a.journalId}`}
                      className="ss-btn-secondary text-[11px] py-1 px-3 font-semibold whitespace-nowrap"
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
