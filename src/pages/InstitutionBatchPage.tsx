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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0A3D36]">
      
      <div className="flex items-center justify-between">
        <Link to="/institution/dashboard" className="text-xs font-mono text-[#4B635E] hover:text-[#0A3D36] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Integrity Desk
        </Link>
      </div>

      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
          Research Integrity Desk · Batch Faculty Publication Screening
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Batch Publication Compliance Screening
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 max-w-2xl leading-relaxed">
          Upload faculty publications or tenure dossiers in CSV format. The engine cross-references each serial against bibliographic indices and flags high-risk or unverified venues.
        </p>
      </div>

      {/* CSV Input Form */}
      <div className="ss-card p-6 shadow-paper max-w-3xl">
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#0A3D36] font-bold mb-1.5">
              Paste Faculty Publications CSV (articleTitle, journalTitle, issn, publisher)
            </label>
            <textarea
              rows={6}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm p-3 text-xs font-mono text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary px-5 py-2.5 text-xs flex items-center gap-2 font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>Run Batch Publication Evaluation</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] font-bold block">Screened Articles</span>
              <span className="font-mono text-2xl font-bold text-[#0A3D36] tabular-nums mt-1 block">{results.totalEvaluated}</span>
            </div>

            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#109C89] font-bold block">Compliant Venues</span>
              <span className="font-mono text-2xl font-bold text-[#109C89] tabular-nums mt-1 block">{results.compliantCount}</span>
            </div>

            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#A81B1B] font-bold block">Flagged Venues</span>
              <span className="font-mono text-2xl font-bold text-[#A81B1B] tabular-nums mt-1 block">{results.flaggedCount}</span>
            </div>

            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#0A3D36] font-bold block">Faculty Compliance Rate</span>
              <span className="font-mono text-2xl font-bold text-[#109C89] tabular-nums mt-1 block">{results.complianceRate}%</span>
            </div>

          </div>

          {/* Results Table */}
          <div className="ss-card overflow-hidden shadow-paper">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A3D36] text-[#FAF6EE] font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Publication Title</th>
                    <th className="py-3 px-4 font-bold">Journal</th>
                    <th className="py-3 px-4 font-bold">ISSN</th>
                    <th className="py-3 px-4 font-bold">Score</th>
                    <th className="py-3 px-4 font-bold">Rating Grade</th>
                    <th className="py-3 px-4 font-bold">Flags & Integrity Signals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A3D36]/10 bg-[#FFFDF9]">
                  {results.results?.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#FAF6EE] transition-colors">
                      <td className="py-3 px-4 font-serif font-bold text-sm text-[#0A3D36] max-w-xs truncate">
                        {r.articleTitle}
                      </td>
                      <td className="py-3 px-4 text-[#4B635E]">
                        {r.journalTitle}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#0A3D36] font-semibold">
                        {r.issn || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0A3D36] tabular-nums">
                        {r.score} / 100
                      </td>
                      <td className="py-3 px-4">
                        <GradeBadge grade={r.grade} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {r.redFlags && r.redFlags.length > 0 ? (
                          <span className="text-[#A81B1B] font-mono text-[11px] font-bold">
                            ⚠ {r.redFlags.join('; ')}
                          </span>
                        ) : (
                          <span className="text-[#109C89] font-mono text-[11px] font-bold">
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
