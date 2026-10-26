import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, ArrowLeft, Trash2, ExternalLink, Plus } from 'lucide-react';
import { GradeBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';

export const InstitutionWatchlistPage: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/v1/institution/watchlist');
      if (res.entries) setEntries(res.entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this journal from the institutional watchlist?')) return;
    try {
      await apiRequest(`/api/v1/institution/watchlist/${id}`, { method: 'DELETE' });
      loadWatchlist();
    } catch (err: any) {
      alert('Error removing: ' + err.message);
    }
  };

  const filtered = entries.filter(e => {
    if (filter === 'ALL') return true;
    return e.category === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link to="/institution/dashboard" className="text-xs font-mono text-zinc-400 hover:text-zinc-100 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Integrity Desk
        </Link>
        <Link to="/journal-check" className="ss-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Find & Add Journal</span>
        </Link>
      </div>

      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
          Research Integrity Desk · Curated Lists
        </span>
        <h1 className="font-display text-3xl font-extrabold text-zinc-100 mt-1">
          Institutional Journal Watchlist
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
          Authorized and restricted publication channels documented with evidence-backed rationales.
        </p>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#221D18]">
          <button
            onClick={() => setFilter('ALL')}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
              filter === 'ALL' ? 'bg-white text-zinc-950 font-semibold border-emerald-500/40 font-bold' : 'bg-[#18181b] text-[#9E9486] border-[#2C251F]'
            }`}
          >
            ALL ({entries.length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
              filter === 'APPROVED' ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold' : 'bg-[#18181b] text-emerald-400 border-[#2C251F]'
            }`}
          >
            APPROVED ({entries.filter(e => e.category === 'APPROVED').length})
          </button>
          <button
            onClick={() => setFilter('FLAGGED')}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
              filter === 'FLAGGED' ? 'bg-rose-950 border-rose-600 text-rose-300 font-bold' : 'bg-[#18181b] text-rose-400 border-[#2C251F]'
            }`}
          >
            FLAGGED RISK ({entries.filter(e => e.category === 'FLAGGED').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#9E9486]">
          Loading watchlist...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-10 text-center space-y-3">
          <BookmarkCheck className="w-8 h-8 text-[#8C8274] mx-auto" />
          <h3 className="font-display font-bold text-base text-zinc-100">
            No Journals in this Category
          </h3>
          <p className="text-xs text-[#8C8274] max-w-md mx-auto">
            Search for journals and click "Add to Watchlist" to save them to your institutional register.
          </p>
        </div>
      ) : (
        <div className="bg-[#121215] border border-[#26201B] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18181b] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Journal Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">ISSN</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">Committee Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201B17]">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-[#18181b] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-100">
                      <Link to={`/journal-check/results/${e.journal.id}`} className="hover:text-emerald-400">
                        {e.journal.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border uppercase ${
                        e.category === 'APPROVED'
                          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400'
                          : 'bg-rose-950/70 border-rose-600 text-rose-300'
                      }`}>
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">
                      {e.journal.identifiers?.[0]?.value || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <GradeBadge grade={e.journal.currentGrade || 'UNVERIFIED'} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                      {e.notes || 'No specific notes recorded'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemove(e.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
