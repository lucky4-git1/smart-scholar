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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0B192C]">
      
      <div className="flex items-center justify-between">
        <Link to="/institution/dashboard" className="text-xs font-mono text-[#475E79] hover:text-[#0B192C] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Integrity Desk
        </Link>
        <Link to="/journal-check" className="ss-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold">
          <Plus className="w-4 h-4" />
          <span>Find & Add Journal</span>
        </Link>
      </div>

      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
          Research Integrity Desk · Curated Lists
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
          Institutional Journal Watchlist
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 max-w-2xl leading-relaxed">
          Authorized and restricted publication channels documented with evidence-backed rationales.
        </p>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#0B192C]/15">
          <button
            onClick={() => setFilter('ALL')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              filter === 'ALL'
                ? 'bg-[#0B192C] text-[#FAF7F2] font-bold border-[#0B192C]'
                : 'bg-[#FFFFFF] text-[#475E79] border-[#0B192C]/20 hover:bg-[#FAF7F2]'
            }`}
          >
            ALL ({entries.length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              filter === 'APPROVED'
                ? 'bg-[#167C6B] text-[#FAF7F2] font-bold border-[#167C6B]'
                : 'bg-[#FFFFFF] text-[#167C6B] border-[#167C6B]/30 hover:bg-[#FAF7F2]'
            }`}
          >
            APPROVED ({entries.filter(e => e.category === 'APPROVED').length})
          </button>
          <button
            onClick={() => setFilter('FLAGGED')}
            className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
              filter === 'FLAGGED'
                ? 'bg-[#A81B1B] text-[#FAF7F2] font-bold border-[#A81B1B]'
                : 'bg-[#FFFFFF] text-[#A81B1B] border-[#A81B1B]/30 hover:bg-[#FAF7F2]'
            }`}
          >
            FLAGGED RISK ({entries.filter(e => e.category === 'FLAGGED').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#475E79] font-mono">
          Loading watchlist...
        </div>
      ) : filtered.length === 0 ? (
        <div className="ss-card p-10 text-center space-y-3 shadow-paper">
          <BookmarkCheck className="w-8 h-8 text-[#475E79] mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#0B192C]">
            No Journals in this Category
          </h3>
          <p className="text-xs text-[#475E79] max-w-md mx-auto">
            Search for journals and click "Add to Watchlist" to save them to your institutional register.
          </p>
        </div>
      ) : (
        <div className="ss-card overflow-hidden shadow-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B192C] text-[#FAF7F2] font-mono uppercase text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Journal Title</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">ISSN</th>
                  <th className="py-3 px-4 font-bold">Trust Score</th>
                  <th className="py-3 px-4 font-bold">Committee Notes</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B192C]/10 bg-[#FFFFFF]">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#0B192C]">
                      <Link to={`/journal-check/results/${e.journal.id}`} className="hover:underline">
                        {e.journal.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-sm border uppercase ${
                        e.category === 'APPROVED'
                          ? 'bg-[#EAF5F2] border-[#167C6B] text-[#0B192C]'
                          : 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B]'
                      }`}>
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0B192C] font-semibold">
                      {e.journal.identifiers?.[0]?.value || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <GradeBadge grade={e.journal.currentGrade || 'UNVERIFIED'} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-[#475E79] max-w-xs truncate">
                      {e.notes || 'No specific notes recorded'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemove(e.id)}
                        className="text-[#A81B1B] hover:text-[#801212] p-1 rounded"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
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
