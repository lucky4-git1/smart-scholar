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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0B192C]">
      
      {/* Header Profile Box */}
      <div className="ss-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-paper">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-[#0B192C] border border-[#070F1A] flex items-center justify-center text-lg font-bold font-mono text-[#E06B43]">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B192C] tracking-tight">
              {user?.fullName}
            </h1>
            <p className="text-xs text-[#475E79] font-mono">
              {user?.email} · {user?.institution || 'Independent Research Affiliation'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15 font-bold">
                Role: {user?.role}
              </span>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-[10px] font-mono uppercase tracking-wider text-[#0B192C] bg-[#EAF5F2] px-2 py-0.5 rounded-sm border border-[#167C6B] font-bold hover:underline">
                  Open Admin Console &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/journal-check" className="ss-btn-primary text-xs py-2 px-4 font-bold">
            <span>Check a Journal</span>
          </Link>
          <Link to="/journal-audit" className="ss-btn-secondary text-xs py-2 px-4 font-semibold">
            <span>New Audit</span>
          </Link>
        </div>
      </div>

      {/* Primary Workspace Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <Link to="/journal-check" className="ss-card p-5 group hover:border-[#0B192C] shadow-paper">
          <div className="w-8 h-8 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/20 flex items-center justify-center text-[#0B192C] mb-3 group-hover:bg-[#0B192C] group-hover:text-[#FAF7F2] transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#0B192C] mb-1">
            Journal Check
          </h3>
          <p className="text-xs text-[#475E79] leading-relaxed">
            Search journals across Crossref, OpenAlex, and DOAJ with 5-pillar scoring.
          </p>
        </Link>

        <Link to="/journal-audit" className="ss-card p-5 group hover:border-[#0B192C] shadow-paper">
          <div className="w-8 h-8 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/20 flex items-center justify-center text-[#0B192C] mb-3 group-hover:bg-[#0B192C] group-hover:text-[#FAF7F2] transition-colors">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#0B192C] mb-1">
            Indexing Readiness
          </h3>
          <p className="text-xs text-[#475E79] leading-relaxed">
            Run page-level technical scans against Scopus and DOAJ requirements.
          </p>
        </Link>

        <Link to="/doi-doctor" className="ss-card p-5 group hover:border-[#0B192C] shadow-paper">
          <div className="w-8 h-8 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/20 flex items-center justify-center text-[#0B192C] mb-3 group-hover:bg-[#0B192C] group-hover:text-[#FAF7F2] transition-colors">
            <Stethoscope className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#0B192C] mb-1">
            DOI Doctor
          </h3>
          <p className="text-xs text-[#475E79] leading-relaxed">
            Inspect handle resolution, detect broken links, and reconcile metadata.
          </p>
        </Link>

        <Link to="/institution/watchlist" className="ss-card p-5 group hover:border-[#0B192C] shadow-paper">
          <div className="w-8 h-8 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/20 flex items-center justify-center text-[#0B192C] mb-3 group-hover:bg-[#0B192C] group-hover:text-[#FAF7F2] transition-colors">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#0B192C] mb-1">
            Institutional Watchlist
          </h3>
          <p className="text-xs text-[#475E79] leading-relaxed">
            Maintain approved publication lists and monitor high-risk serials.
          </p>
        </Link>

      </div>

      {/* Two-Column Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Indexing Applications */}
        <div className="ss-card p-5 space-y-4 shadow-paper">
          <div className="flex items-center justify-between border-b border-[#0B192C]/10 pb-3">
            <h3 className="font-serif font-bold text-base text-[#0B192C]">
              Tracked Indexing Applications
            </h3>
            <Link to="/indexing/applications" className="text-xs font-bold text-[#0B192C] hover:underline">
              View All &rarr;
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="text-xs text-[#475E79]">No active indexing application dossiers.</p>
          ) : (
            <div className="space-y-2">
              {applications.map(a => (
                <div key={a.id} className="p-3 bg-[#FAF7F2] border border-[#0B192C]/10 rounded-sm flex items-center justify-between text-xs">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#0B192C]">{a.journal.title}</div>
                    <div className="text-[11px] font-mono text-[#167C6B] font-semibold">{a.indexingService.name}</div>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#FFFFFF] text-[#0B192C] border border-[#0B192C]/20">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist Quick Summary */}
        <div className="ss-card p-5 space-y-4 shadow-paper">
          <div className="flex items-center justify-between border-b border-[#0B192C]/10 pb-3">
            <h3 className="font-serif font-bold text-base text-[#0B192C]">
              Institutional Watchlist Preview
            </h3>
            <Link to="/institution/watchlist" className="text-xs font-bold text-[#0B192C] hover:underline">
              Full List &rarr;
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <p className="text-xs text-[#475E79]">No journals added to watchlist yet.</p>
          ) : (
            <div className="space-y-2">
              {watchlist.map(w => (
                <div key={w.id} className="p-3 bg-[#FAF7F2] border border-[#0B192C]/10 rounded-sm flex items-center justify-between text-xs">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#0B192C]">{w.journal.title}</div>
                    <div className="text-[11px] font-mono text-[#475E79]">{w.journal.publisher}</div>
                  </div>
                  <span className={`font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-sm border uppercase ${
                    w.category === 'APPROVED' ? 'bg-[#EAF5F2] text-[#0B192C] border-[#167C6B]' : 'bg-[#FDF2F2] text-[#A81B1B] border-[#E05252]'
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
