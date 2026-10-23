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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
            DOI Doctor · Repair & Resolution Diagnostic Layer
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
            DOIs that Resolve. Metadata that Counts.
          </h1>
          <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
            Verify persistent handle resolution, inspect Crossref deposit completeness, detect broken destination landing pages, and confirm digital archive preservation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doi-doctor/census" className="ss-btn-secondary text-xs py-1.5 px-3">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#E3BC9A]" />
            <span>Article Census (CSV)</span>
          </Link>
          <Link to="/doi-doctor/preservation" className="ss-btn-secondary text-xs py-1.5 px-3">
            <Archive className="w-3.5 h-3.5 text-[#E3BC9A]" />
            <span>Preservation Check</span>
          </Link>
        </div>
      </div>

      {/* Single DOI Check Form */}
      <div className="bg-[#14120F] border border-[#27211B] rounded-xl p-6 shadow-tactile max-w-3xl">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#FAF7F2] mb-1.5">
              Enter Digital Object Identifier (DOI)
            </label>
            <div className="flex items-center bg-[#0E0C0A] border border-[#2D2620] focus-within:border-[#E3BC9A] rounded-lg p-1.5">
              <input
                type="text"
                required
                value={doiInput}
                onChange={e => setDoiInput(e.target.value)}
                placeholder="10.xxxx/yyyy or https://doi.org/10.xxxx/yyyy"
                className="w-full bg-transparent px-3 py-2 text-sm text-[#FAF7F2] placeholder-[#665D50] focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="ss-btn-primary px-5 py-2 text-xs whitespace-nowrap"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect DOI'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#7A7165] font-mono">
            <span>Test examples:</span>
            <button type="button" onClick={() => setDoiInput('10.1038/s41586-020-2649-2')} className="text-[#E3BC9A] hover:underline">Nature ACE2</button>
            <button type="button" onClick={() => setDoiInput('10.1371/journal.pone.0245421')} className="text-[#E3BC9A] hover:underline">PLOS ONE</button>
            <button type="button" onClick={() => setDoiInput('10.9999/broken-article-link-sample')} className="text-rose-400 hover:underline">Broken Link Sample</button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Inspection Results Card */}
      {inspection && (
        <div className="bg-[#14120F] border border-[#27211B] rounded-xl p-6 sm:p-8 space-y-6 shadow-tactile">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#221D18] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-0.5 rounded border uppercase ${
                  inspection.isResolving
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400'
                    : 'bg-rose-950/70 border-rose-600 text-rose-300'
                }`}>
                  {inspection.isResolving ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {inspection.isResolving ? 'Resolving (HTTP 200/301)' : 'Broken Resolution'}
                </span>
                <span className="text-xs font-mono text-[#8C8375]">
                  Latency: {inspection.latencyMs}ms
                </span>
              </div>

              <h2 className="font-display font-bold text-xl text-[#FAF7F2]">
                {inspection.title}
              </h2>
              <p className="font-mono text-xs text-[#E3BC9A] mt-1">
                doi:{inspection.doi}
              </p>
            </div>

            {/* Completeness Meter */}
            <div className="bg-[#181512] border border-[#2D2620] p-4 rounded-lg text-right flex-shrink-0">
              <span className="text-[10px] font-mono uppercase text-[#8A8174] block">
                Metadata Completeness
              </span>
              <span className="font-mono text-3xl font-extrabold text-[#FAF7F2] tabular-nums">
                {inspection.metadataCompleteness}%
              </span>
            </div>
          </div>

          {/* Resolution Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#181512] border border-[#28221B] rounded-lg space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#8C8274] block">Resolved Destination URL</span>
              {inspection.resolvedUrl ? (
                <a href={inspection.resolvedUrl} target="_blank" rel="noreferrer" className="text-[#E3BC9A] hover:underline font-mono break-all inline-flex items-center gap-1">
                  {inspection.resolvedUrl} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              ) : (
                <span className="text-rose-400 font-mono">None (Resolution Failed)</span>
              )}
            </div>

            <div className="p-4 bg-[#181512] border border-[#28221B] rounded-lg space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#8C8274] block">Registered Publisher</span>
              <span className="text-[#FAF7F2] font-semibold">{inspection.publisher}</span>
              <div className="text-[11px] font-mono text-[#7A7165]">
                Citations in Crossref: {inspection.citationCount ?? 0}
              </div>
            </div>
          </div>

          {/* 5-Field Metadata Health Matrix */}
          <div className="space-y-3 pt-2">
            <h3 className="font-display font-bold text-sm text-[#FAF7F2]">
              Registered Bibliographic Metadata Breakdown (Crossref)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              
              <div className={`p-3 rounded border ${inspection.checks.hasAbstract ? 'bg-[#181613] border-emerald-500/40 text-emerald-300' : 'bg-[#181613] border-rose-500/30 text-rose-300'}`}>
                <div className="font-mono text-xs font-bold">{inspection.checks.hasAbstract ? '✓ Present' : '✗ Missing'}</div>
                <div className="text-[11px] mt-0.5 text-[#9E9486]">Abstract</div>
              </div>

              <div className={`p-3 rounded border ${inspection.checks.hasReferences ? 'bg-[#181613] border-emerald-500/40 text-emerald-300' : 'bg-[#181613] border-rose-500/30 text-rose-300'}`}>
                <div className="font-mono text-xs font-bold">{inspection.checks.hasReferences ? '✓ Present' : '✗ Missing'}</div>
                <div className="text-[11px] mt-0.5 text-[#9E9486]">References (Cited)</div>
              </div>

              <div className={`p-3 rounded border ${inspection.checks.hasLicense ? 'bg-[#181613] border-emerald-500/40 text-emerald-300' : 'bg-[#181613] border-rose-500/30 text-rose-300'}`}>
                <div className="font-mono text-xs font-bold">{inspection.checks.hasLicense ? '✓ Present' : '✗ Missing'}</div>
                <div className="text-[11px] mt-0.5 text-[#9E9486]">License URL</div>
              </div>

              <div className={`p-3 rounded border ${inspection.checks.hasFunding ? 'bg-[#181613] border-emerald-500/40 text-emerald-300' : 'bg-[#181613] border-rose-500/30 text-rose-300'}`}>
                <div className="font-mono text-xs font-bold">{inspection.checks.hasFunding ? '✓ Present' : '✗ Missing'}</div>
                <div className="text-[11px] mt-0.5 text-[#9E9486]">Funding Data</div>
              </div>

              <div className={`p-3 rounded border ${inspection.checks.hasArchive ? 'bg-[#181613] border-emerald-500/40 text-emerald-300' : 'bg-[#181613] border-rose-500/30 text-rose-300'}`}>
                <div className="font-mono text-xs font-bold">{inspection.checks.hasArchive ? '✓ Present' : '✗ Missing'}</div>
                <div className="text-[11px] mt-0.5 text-[#9E9486]">Archival Escrow</div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
