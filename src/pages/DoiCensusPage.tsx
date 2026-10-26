import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, ArrowLeft, Loader2, CheckCircle2, AlertTriangle, XCircle, Download } from 'lucide-react';
import { apiRequest } from '../lib/api';

export const DoiCensusPage: React.FC = () => {
  const [csvInput, setCsvInput] = useState(
`title,doi,volume,issue
Structural basis of SARS-CoV-2 entry,10.1038/s41586-020-2649-2,584,7819
Digital behavioral intervention for stress management,10.1371/journal.pone.0245421,16,1
Preliminary Study on Synthetic Materials,10.9999/broken-article-link-sample,2,4
Manuscript without assigned handle,,3,1`
  );
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReconcile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse CSV
      const lines = csvInput.trim().split('\n');
      if (lines.length < 2) throw new Error('Please supply at least a header and one data row.');

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const titleIdx = headers.indexOf('title');
      const doiIdx = headers.indexOf('doi');

      const items = lines.slice(1).map(line => {
        const parts = line.split(',');
        return {
          title: parts[titleIdx] || 'Untitled',
          doi: parts[doiIdx] || '',
        };
      });

      const res = await apiRequest('/api/v1/doi/census', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });

      if (res.report) {
        setReport(res.report);
      }
    } catch (err: any) {
      setError(err.message || 'Reconciliation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/doi-doctor" className="text-xs font-mono text-zinc-400 hover:text-zinc-100 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to DOI Doctor
        </Link>
      </div>

      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
          DOI Census · Journal Inventory Reconciliation
        </span>
        <h1 className="font-display text-3xl font-extrabold text-zinc-100 mt-1">
          Article Census & DOI Reconciliation
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
          Reconcile your complete published article inventory against live Crossref handle deposits. Detect non-resolving DOIs, missing metadata fields, and unregistered back-catalog volumes.
        </p>
      </div>

      {/* CSV Input Form */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 shadow-tactile max-w-3xl">
        <form onSubmit={handleReconcile} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-100 mb-1.5">
              Paste Article Inventory CSV (Title, DOI, Volume, Issue)
            </label>
            <textarea
              rows={6}
              value={csvInput}
              onChange={e => setCsvInput(e.target.value)}
              className="w-full bg-[#09090b] border border-[#2B241D] rounded-md p-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary px-5 py-2 text-xs flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>Reconcile Article Inventory</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Reconciliation Summary Report */}
      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-[#121215] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-[#8A8174] block">Total Articles</span>
              <span className="font-mono text-2xl font-bold text-zinc-100">{report.totalRecords}</span>
            </div>

            <div className="bg-[#121215] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block">Resolving DOIs</span>
              <span className="font-mono text-2xl font-bold text-emerald-400">{report.resolvedCount}</span>
            </div>

            <div className="bg-[#121215] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-rose-400 block">Broken DOIs</span>
              <span className="font-mono text-2xl font-bold text-rose-400">{report.brokenCount}</span>
            </div>

            <div className="bg-[#121215] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block">Healthy Rate</span>
              <span className="font-mono text-2xl font-bold text-emerald-400">{report.healthyRate}%</span>
            </div>

          </div>

          {/* Reconciliation Rows Table */}
          <div className="bg-[#121215] border border-[#26201A] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181b] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Article Title</th>
                    <th className="py-3 px-4">Registered DOI</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Metadata</th>
                    <th className="py-3 px-4">Actionable Repair Step</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#201B17]">
                  {report.rows?.map((r: any, idx: number) => {
                    const isResolving = r.status === 'RESOLVING';
                    const isBroken = r.status === 'BROKEN_RESOLUTION';

                    return (
                      <tr key={idx} className="hover:bg-[#18181b] transition-colors">
                        <td className="py-3 px-4 font-semibold text-zinc-100 max-w-xs truncate">
                          {r.title}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-400">
                          {r.doi || '— None —'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border ${
                            isResolving
                              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400'
                              : isBroken
                              ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                              : 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {r.completeness}%
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {r.remediation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
