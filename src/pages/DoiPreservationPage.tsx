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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link to="/doi-doctor" className="text-xs font-mono text-[#A89F91] hover:text-[#FAF7F2] inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to DOI Doctor
        </Link>
      </div>

      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
          DOI Doctor · Digital Preservation Registry Ping
        </span>
        <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
          Digital Archival Preservation Verifier
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
          Verify whether a journal landing page or article full-text is preserved in the Internet Archive (Wayback Machine). Permanent archiving guarantees scholarly access in perpetuity.
        </p>
      </div>

      <div className="bg-[#14120F] border border-[#27211B] rounded-xl p-6 shadow-tactile max-w-3xl">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#FAF7F2] mb-1.5">
              Journal or Article Landing URL
            </label>
            <div className="flex items-center bg-[#0E0C0A] border border-[#2D2620] focus-within:border-[#E3BC9A] rounded-lg p-1.5">
              <input
                type="url"
                required
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://your-journal.org/article/123"
                className="w-full bg-transparent px-3 py-2 text-sm text-[#FAF7F2] placeholder-[#665D50] focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="ss-btn-primary px-5 py-2 text-xs whitespace-nowrap"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check Archive'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-[#14120F] border border-[#27211B] rounded-xl p-6 max-w-3xl space-y-4 shadow-tactile">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-0.5 rounded border uppercase ${
              result.isArchived
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400'
                : 'bg-rose-950/70 border-rose-600 text-rose-300'
            }`}>
              {result.isArchived ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {result.isArchived ? 'Preserved in Archive' : 'No Archival Snapshot Found'}
            </span>
            <span className="text-xs font-mono text-[#8C8375]">
              {result.preservationService}
            </span>
          </div>

          <div className="text-xs space-y-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#7A7165] block">Target URL</span>
              <span className="font-mono text-[#FAF7F2] break-all">{result.url}</span>
            </div>

            {result.archiveUrl && (
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7A7165] block">Internet Archive Permanent Link</span>
                <a
                  href={result.archiveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#E3BC9A] hover:underline inline-flex items-center gap-1 break-all"
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
