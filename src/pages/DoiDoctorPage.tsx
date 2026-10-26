import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Layers,
  Archive,
  FileSpreadsheet
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { DoiInspection } from '../types';

export const DoiDoctorPage: React.FC = () => {
  const [doiInput, setDoiInput] = useState('10.1038/s41586-020-2649-2');
  const [inspection, setInspection] = useState<DoiInspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doiInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/api/v1/doi/check', {
        method: 'POST',
        body: JSON.stringify({ doi: doiInput.trim() }),
      });
      if (res.inspection) {
        setInspection(res.inspection);
      }
    } catch (err: any) {
      setError(err.message || 'Error checking DOI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[#0A3D36]">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0A3D36]/15 pb-6">
        <div>
          <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#F2E8D8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
            DOI DOCTOR · RESOLUTION DIAGNOSTIC SUITE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
            DOIs that Resolve. Metadata that Counts.
          </h1>
          <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 max-w-2xl leading-relaxed">
            Verify persistent handle resolution, inspect Crossref deposit completeness, detect broken destination landing pages, and confirm digital archive preservation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doi-doctor/census" className="ss-btn-secondary text-xs py-1.5 px-3">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#0A3D36]" />
            <span>Article Census (CSV)</span>
          </Link>
          <Link to="/doi-doctor/preservation" className="ss-btn-secondary text-xs py-1.5 px-3">
            <Archive className="w-3.5 h-3.5 text-[#0A3D36]" />
            <span>Preservation Check</span>
          </Link>
        </div>
      </div>

      {/* Single DOI Check Form */}
      <div className="ss-card p-6 shadow-paper max-w-3xl">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#0A3D36] font-bold mb-1.5">
              Enter Digital Object Identifier (DOI)
            </label>
            <div className="flex items-center bg-[#FAF6EE] border-2 border-[#0A3D36] focus-within:border-[#109C89] rounded-sm p-1.5 shadow-retro-sm">
              <input
                type="text"
                required
                value={doiInput}
                onChange={e => setDoiInput(e.target.value)}
                placeholder="10.xxxx/yyyy or https://doi.org/10.xxxx/yyyy"
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-[#0A3D36] placeholder-[#7A9891] focus:outline-none font-mono font-medium"
              />
              <button
                type="submit"
                disabled={loading}
                className="ss-btn-primary px-5 py-2 text-xs whitespace-nowrap font-bold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect DOI'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#4B635E] font-mono">
            <span>Sample records:</span>
            <button type="button" onClick={() => setDoiInput('10.1038/s41586-020-2649-2')} className="text-[#0A3D36] hover:underline font-bold">Nature ACE2</button>
            <button type="button" onClick={() => setDoiInput('10.1371/journal.pone.0245421')} className="text-[#0A3D36] hover:underline font-bold">PLOS ONE</button>
            <button type="button" onClick={() => setDoiInput('10.9999/broken-article-link-sample')} className="text-[#A81B1B] hover:underline font-bold">Broken Link Sample</button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-mono">
            {error}
          </div>
        )}
      </div>

      {/* Inspection Results Card */}
      {inspection && (
        <div className="ss-card p-6 sm:p-8 space-y-6 shadow-paper">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0A3D36]/15 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-0.5 rounded-sm border uppercase ${
                  inspection.isResolving
                    ? 'bg-[#E8F8F5] border-[#109C89] text-[#0A3D36]'
                    : 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B]'
                }`}>
                  {inspection.isResolving ? <CheckCircle2 className="w-3.5 h-3.5 text-[#109C89]" /> : <XCircle className="w-3.5 h-3.5 text-[#A81B1B]" />}
                  {inspection.isResolving ? 'Resolving (HTTP 200/301)' : 'Broken Resolution'}
                </span>
                <span className="text-xs font-mono text-[#4B635E]">
                  Latency: {inspection.latencyMs}ms
                </span>
              </div>

              <h2 className="font-serif font-bold text-xl text-[#0A3D36] mt-2">
                {inspection.title}
              </h2>
              <p className="font-mono text-xs text-[#0A3D36] mt-1">
                doi:{inspection.doi}
              </p>
            </div>

            {/* Completeness Meter */}
            <div className="bg-[#FAF6EE] border border-[#0A3D36]/20 p-4 rounded-sm text-right flex-shrink-0">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] block font-semibold">
                Metadata Completeness
              </span>
              <span className="font-mono text-3xl font-extrabold text-[#0A3D36] tabular-nums">
                {inspection.metadataCompleteness}%
              </span>
            </div>
          </div>

          {/* Resolution Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] block font-semibold">Resolved Destination URL</span>
              {inspection.resolvedUrl ? (
                <a href={inspection.resolvedUrl} target="_blank" rel="noreferrer" className="text-[#0A3D36] hover:underline font-mono break-all inline-flex items-center gap-1 font-semibold">
                  {inspection.resolvedUrl} <ExternalLink className="w-3 h-3 flex-shrink-0 text-[#109C89]" />
                </a>
              ) : (
                <span className="text-[#A81B1B] font-mono">No destination URL resolved</span>
              )}
            </div>

            <div className="p-4 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] block font-semibold">Wayback Machine Archive</span>
              <span className="font-mono text-[#0A3D36] font-semibold block">
                {inspection.hasArchivePreservation ? '✓ Archived Snapshot Confirmed' : '— No public web archive snapshot'}
              </span>
            </div>
          </div>

          {/* Crossref Metadata Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif font-bold text-base text-[#0A3D36]">
              Crossref Metadata Deposit Checklist
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm flex items-center justify-between">
                <span>Abstract:</span>
                <span className={inspection.hasAbstract ? 'text-[#109C89] font-bold' : 'text-[#A81B1B]'}>{inspection.hasAbstract ? '✓ Present' : '✗ Missing'}</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm flex items-center justify-between">
                <span>References:</span>
                <span className={inspection.hasReferences ? 'text-[#109C89] font-bold' : 'text-[#A81B1B]'}>{inspection.hasReferences ? '✓ Present' : '✗ Missing'}</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm flex items-center justify-between">
                <span>License URL:</span>
                <span className={inspection.hasLicense ? 'text-[#109C89] font-bold' : 'text-[#A81B1B]'}>{inspection.hasLicense ? '✓ Present' : '✗ Missing'}</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm flex items-center justify-between">
                <span>Funding Info:</span>
                <span className={inspection.hasFunding ? 'text-[#109C89] font-bold' : 'text-[#A81B1B]'}>{inspection.hasFunding ? '✓ Present' : '✗ Missing'}</span>
              </div>

              <div className="p-3 bg-[#FAF6EE] border border-[#0A3D36]/15 rounded-sm flex items-center justify-between">
                <span>ORCID IDs:</span>
                <span className={inspection.hasOrcid ? 'text-[#109C89] font-bold' : 'text-[#A81B1B]'}>{inspection.hasOrcid ? '✓ Present' : '✗ Missing'}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
