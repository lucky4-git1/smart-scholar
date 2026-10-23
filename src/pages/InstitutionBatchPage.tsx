import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, ArrowLeft, Loader2, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { GradeBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';

export const InstitutionBatchPage: React.FC = () => {
  const [csvText, setCsvText] = useState(
`articleTitle,journalTitle,issn,publisher
Structural basis of SARS-CoV-2 entry,Nature,0028-0836,Springer Nature
A randomized controlled trial of digital behavioral intervention,PLOS ONE,1932-6203,Public Library of Science
Observational study in emergency medicine,BMJ Open,2044-6055,BMJ Publishing Group
Study on Synthetic Materials in Tropical Environments,International Journal of Advanced Multidisciplinary Research,9999-0001,Apex Global Academic Press`
  );

  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) throw new Error('Please provide a header and at least one publication row.');

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const artIdx = headers.indexOf('articletitle');
      const jIdx = headers.indexOf('journaltitle');
      const issnIdx = headers.indexOf('issn');
      const pubIdx = headers.indexOf('publisher');

      const records = lines.slice(1).map(line => {
        const parts = line.split(',');
        return {
          articleTitle: parts[artIdx] || 'Untitled Publication',
          journalTitle: parts[jIdx] || '',
          issn: parts[issnIdx] || '',
          publisher: parts[pubIdx] || '',
        };
      });

      const res = await apiRequest('/api/v1/institution/batch-evaluate', {
        method: 'POST',
        body: JSON.stringify({ records }),
      });

      if (res.results) {
        setResults(res);
      }
    } catch (err: any) {
      setError(err.message || 'Batch evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link to="/institution/dashboard" className="text-xs font-mono text-[#A89F91] hover:text-[#FAF7F2] inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Integrity Desk
        </Link>
      </div>

      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
          Research Integrity Desk · Batch Faculty Publication Screening
        </span>
        <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
          Batch Publication Compliance Screening
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
          Upload faculty publications or tenure dossiers in CSV format. The engine cross-references each serial against bibliographic indices and flags high-risk or unverified venues.
        </p>
      </div>

      {/* CSV Input Form */}
      <div className="bg-[#14120F] border border-[#27211B] rounded-xl p-6 shadow-tactile max-w-3xl">
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#FAF7F2] mb-1.5">
              Paste Faculty Publications CSV (articleTitle, journalTitle, issn, publisher)
            </label>
            <textarea
              rows={6}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              className="w-full bg-[#0E0C0A] border border-[#2B241D] rounded-md p-3 text-xs font-mono text-[#FAF7F2] focus:outline-none focus:border-[#E3BC9A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary px-5 py-2 text-xs flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>Run Batch Publication Evaluation</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-[#14120F] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-[#8A8174] block">Screened Articles</span>
              <span className="font-mono text-2xl font-bold text-[#FAF7F2]">{results.totalEvaluated}</span>
            </div>

            <div className="bg-[#14120F] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block">Compliant Venues</span>
              <span className="font-mono text-2xl font-bold text-emerald-400">{results.compliantCount}</span>
            </div>

            <div className="bg-[#14120F] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-rose-400 block">Flagged Venues</span>
              <span className="font-mono text-2xl font-bold text-rose-400">{results.flaggedCount}</span>
            </div>

            <div className="bg-[#14120F] border border-[#26201A] p-4 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-[#E3BC9A] block">Faculty Compliance Rate</span>
              <span className="font-mono text-2xl font-bold text-[#E3BC9A]">{results.complianceRate}%</span>
            </div>

          </div>

          {/* Results Table */}
          <div className="bg-[#14120F] border border-[#26201A] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181512] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Publication Title</th>
                    <th className="py-3 px-4">Journal</th>
                    <th className="py-3 px-4">ISSN</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Rating Grade</th>
                    <th className="py-3 px-4">Flags & Integrity Signals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#201B17]">
                  {results.results?.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#181512] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#FAF7F2] max-w-xs truncate">
                        {r.articleTitle}
                      </td>
                      <td className="py-3 px-4 text-[#A89F91]">
                        {r.journalTitle}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#E3BC9A]">
                        {r.issn || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {r.score} / 100
                      </td>
                      <td className="py-3 px-4">
                        <GradeBadge grade={r.grade} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {r.redFlags && r.redFlags.length > 0 ? (
                          <span className="text-rose-400 font-mono text-[11px]">
                            ⚠ {r.redFlags.join('; ')}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-mono text-[11px]">
                            ✓ Meets institutional baseline
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
