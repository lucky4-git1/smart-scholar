import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  ShieldCheck, 
  FileCheck, 
  BookmarkCheck, 
  Stethoscope, 
  Building2, 
  Layers, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);

  useEffect(() => {
    apiRequest('/api/v1/indexing/applications')
      .then(res => {
        if (res.applications) setApplications(res.applications.slice(0, 3));
      })
      .catch(() => {});

    apiRequest('/api/v1/institution/watchlist')
      .then(res => {
        if (res.entries) setWatchlist(res.entries.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Box */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-tactile">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg font-bold font-mono text-emerald-400">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-2xl text-zinc-100">
              {user?.fullName}
            </h1>
            <p className="text-xs text-[#9E9486] font-mono">
              {user?.email} · {user?.institution || 'Independent Research Affiliation'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-[#201B16] px-2 py-0.5 rounded border border-[#3A3026]">
                Role: {user?.role}
              </span>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 hover:underline">
                  Open Admin Console &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/journal-check" className="ss-btn-primary text-xs py-2 px-3.5">
            <span>Check a Journal</span>
          </Link>
          <Link to="/journal-audit" className="ss-btn-secondary text-xs py-2 px-3.5">
            <span>New Audit</span>
          </Link>
        </div>
      </div>

      {/* Primary Workspace Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <Link to="/journal-check" className="ss-card p-5 group hover:border-emerald-500/40/60">
          <div className="w-8 h-8 rounded bg-[#1D1914] border border-[#3A3026] flex items-center justify-center text-emerald-400 mb-3 group-hover:border-emerald-500/40">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-zinc-100 mb-1">
            Journal Check
          </h3>
          <p className="text-xs text-[#8C8275]">
            Search journals across Crossref, OpenAlex, and DOAJ with 5-pillar scoring.
          </p>
        </Link>

        <Link to="/journal-audit" className="ss-card p-5 group hover:border-emerald-500/40/60">
          <div className="w-8 h-8 rounded bg-[#1D1914] border border-[#3A3026] flex items-center justify-center text-emerald-400 mb-3 group-hover:border-emerald-500/40">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-zinc-100 mb-1">
            Indexing Readiness
          </h3>
          <p className="text-xs text-[#8C8275]">
            Run page-level technical scans against Scopus and DOAJ requirements.
          </p>
        </Link>

        <Link to="/doi-doctor" className="ss-card p-5 group hover:border-emerald-500/40/60">
          <div className="w-8 h-8 rounded bg-[#1D1914] border border-[#3A3026] flex items-center justify-center text-emerald-400 mb-3 group-hover:border-emerald-500/40">
            <Stethoscope className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-zinc-100 mb-1">
            DOI Doctor
          </h3>
          <p className="text-xs text-[#8C8275]">
            Inspect handle resolution, detect broken links, and reconcile metadata.
          </p>
        </Link>

        <Link to="/institution/watchlist" className="ss-card p-5 group hover:border-emerald-500/40/60">
          <div className="w-8 h-8 rounded bg-[#1D1914] border border-[#3A3026] flex items-center justify-center text-emerald-400 mb-3 group-hover:border-emerald-500/40">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-zinc-100 mb-1">
            Institutional Watchlist
          </h3>
          <p className="text-xs text-[#8C8275]">
            Maintain approved publication lists and monitor high-risk serials.
          </p>
        </Link>

      </div>

      {/* Two-Column Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Indexing Applications */}
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-zinc-100">
              Tracked Indexing Applications
            </h3>
            <Link to="/indexing/applications" className="text-xs font-semibold text-emerald-400 hover:underline">
              View All &rarr;
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="text-xs text-[#8A8174]">No active indexing application dossiers.</p>
          ) : (
            <div className="space-y-2">
              {applications.map(a => (
                <div key={a.id} className="p-3 bg-[#18181b] border border-[#27201A] rounded flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-100">{a.journal.title}</div>
                    <div className="text-[11px] font-mono text-emerald-400">{a.indexingService.name}</div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#201B16] text-zinc-100 border border-[#352C23]">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist Quick Summary */}
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-zinc-100">
              Institutional Watchlist Preview
            </h3>
            <Link to="/institution/watchlist" className="text-xs font-semibold text-emerald-400 hover:underline">
              Full List &rarr;
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <p className="text-xs text-[#8A8174]">No journals added to watchlist yet.</p>
          ) : (
            <div className="space-y-2">
              {watchlist.map(w => (
                <div key={w.id} className="p-3 bg-[#18181b] border border-[#27201A] rounded flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-100">{w.journal.title}</div>
                    <div className="text-[11px] font-mono text-[#8C8375]">{w.journal.publisher}</div>
                  </div>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase ${
                    w.category === 'APPROVED' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                  }`}>
                    {w.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
