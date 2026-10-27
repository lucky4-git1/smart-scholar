import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArrowLeft, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { apiRequest } from '../lib/api';

export const DoiPreservationPage: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://www.nature.com/nature');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/api/v1/doi/preservation', {
        method: 'POST',
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      if (res.result) {
        setResult(res.result);
      }
    } catch (err: any) {
      setError(err.message || 'Preservation check failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0B192C]">
      
      <div className="flex items-center justify-between">
        <Link to="/doi-doctor" className="text-xs font-mono text-[#475E79] hover:text-[#0B192C] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to DOI Doctor
        </Link>
      </div>

      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0B192C] bg-[#EBDDCD] px-2 py-0.5 rounded-sm border border-[#0B192C]/15">
          DOI Doctor · Digital Preservation Registry Ping
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-2">
          Digital Archival Preservation Verifier
        </h1>
        <p className="text-xs sm:text-sm text-[#475E79] mt-1.5 max-w-2xl leading-relaxed">
          Verify whether a journal landing page or article full-text is preserved in the Internet Archive (Wayback Machine). Permanent archiving guarantees scholarly access in perpetuity.
        </p>
      </div>

      <div className="ss-card p-6 shadow-paper max-w-3xl">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#0B192C] font-bold mb-1.5">
              Journal or Article Landing URL
            </label>
            <div className="flex items-center bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm p-1.5 focus-within:border-[#0B192C] focus-within:ring-1 focus-within:ring-[#0B192C]">
              <input
                type="url"
                required
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://your-journal.org/article/123"
                className="w-full bg-transparent px-3 py-2 text-sm text-[#0B192C] placeholder-[#475E79]/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="ss-btn-primary px-5 py-2 text-xs whitespace-nowrap font-bold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check Archive'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-medium">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="ss-card p-6 max-w-3xl space-y-4 shadow-paper">
          <div className="flex items-center justify-between">
            <span className={`inline-block font-mono text-xs font-bold px-2.5 py-0.5 rounded-sm border uppercase ${
              result.isArchived
                ? 'bg-[#EAF5F2] border-[#167C6B] text-[#0B192C]'
                : 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B]'
            }`}>
              {result.isArchived ? 'Preserved in Archive' : 'No Archival Snapshot Found'}
            </span>
            <span className="text-xs font-mono text-[#475E79] font-semibold">
              {result.preservationService}
            </span>
          </div>

          <div className="text-xs space-y-2.5">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#475E79] font-bold block">Target URL</span>
              <span className="font-mono text-[#0B192C] break-all font-semibold">{result.url}</span>
            </div>

            {result.archiveUrl && (
              <div>
                <span className="text-[10px] font-mono uppercase text-[#475E79] font-bold block">Internet Archive Permanent Link</span>
                <a
                  href={result.archiveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#0B192C] underline hover:text-[#167C6B] inline-flex items-center gap-1.5 break-all font-semibold"
                >
                  {result.archiveUrl} <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
