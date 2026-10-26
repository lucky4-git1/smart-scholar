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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0A3D36]">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/doi-doctor" className="text-xs font-mono text-[#4B635E] hover:text-[#0A3D36] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to DOI Doctor
        </Link>
      </div>

      {/* Header */}
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
          DOI Census · Journal Inventory Reconciliation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Article Census & DOI Reconciliation
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 max-w-2xl leading-relaxed">
          Reconcile your complete published article inventory against live Crossref handle deposits. Detect non-resolving DOIs, missing metadata fields, and unregistered back-catalog volumes.
        </p>
      </div>

      {/* CSV Input Form */}
      <div className="ss-card p-6 shadow-paper max-w-3xl">
        <form onSubmit={handleReconcile} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#0A3D36] font-bold mb-1.5">
              Paste Article Inventory CSV (Title, DOI, Volume, Issue)
            </label>
            <textarea
              rows={6}
              value={csvInput}
              onChange={e => setCsvInput(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm p-3 text-xs font-mono text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary px-5 py-2.5 text-xs flex items-center gap-2 font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>Reconcile Article Inventory</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Reconciliation Summary Report */}
      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] font-bold block">Total Articles</span>
              <span className="font-mono text-2xl font-bold text-[#0A3D36] tabular-nums mt-1 block">{report.totalRecords}</span>
            </div>

            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#109C89] font-bold block">Resolving DOIs</span>
              <span className="font-mono text-2xl font-bold text-[#109C89] tabular-nums mt-1 block">{report.resolvedCount}</span>
            </div>

            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#A81B1B] font-bold block">Broken DOIs</span>
              <span className="font-mono text-2xl font-bold text-[#A81B1B] tabular-nums mt-1 block">{report.brokenCount}</span>
            </div>

            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#0A3D36] font-bold block">Healthy Rate</span>
              <span className="font-mono text-2xl font-bold text-[#109C89] tabular-nums mt-1 block">{report.healthyRate}%</span>
            </div>

          </div>

          {/* Reconciliation Rows Table */}
          <div className="ss-card overflow-hidden shadow-paper">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A3D36] text-[#FAF6EE] font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Article Title</th>
                    <th className="py-3 px-4 font-bold">Registered DOI</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Metadata</th>
                    <th className="py-3 px-4 font-bold">Actionable Repair Step</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A3D36]/10 bg-[#FFFDF9]">
                  {report.rows?.map((r: any, idx: number) => {
                    const isResolving = r.status === 'RESOLVING';
                    const isBroken = r.status === 'BROKEN_RESOLUTION';

                    return (
                      <tr key={idx} className="hover:bg-[#FAF6EE] transition-colors">
                        <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#0A3D36] max-w-xs truncate">
                          {r.title}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#0A3D36] font-semibold">
                          {r.doi || '— None —'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-sm border ${
                            isResolving
                              ? 'bg-[#E8F8F5] border-[#109C89] text-[#0A3D36]'
                              : isBroken
                              ? 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B]'
                              : 'bg-[#FEF5ED] border-[#F6AC6D] text-[#8C460C]'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0A3D36] tabular-nums">
                          {r.completeness}%
                        </td>
                        <td className="py-3.5 px-4 text-[#4B635E] text-[11px]">
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
