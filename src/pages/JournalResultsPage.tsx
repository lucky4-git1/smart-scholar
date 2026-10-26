import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Building, 
  Calendar,
  Share2,
  Printer,
  BookmarkPlus
} from 'lucide-react';
import { GradeBadge } from '../components/Badge';
import { apiRequest } from '../lib/api';
import { Journal, JournalAssessment } from '../types';

export const JournalResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [assessment, setAssessment] = useState<JournalAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistSuccess, setWatchlistSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiRequest(`/api/v1/journals/${id}`)
      .then(res => {
        if (res.journal) {
          setJournal(res.journal);
          if (res.journal.assessments && res.journal.assessments.length > 0) {
            setAssessment(res.journal.assessments[0]);
          }
        }
      })
      .catch(err => {
        setError(err.message || 'Error loading journal results.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToWatchlist = async () => {
    if (!journal) return;
    try {
      await apiRequest('/api/v1/institution/watchlist', {
        method: 'POST',
        body: JSON.stringify({
          journalId: journal.id,
          category: journal.currentGrade === 'RED_FLAG' ? 'FLAGGED' : 'APPROVED',
          notes: 'Saved from Journal Check evidence view',
        }),
      });
      setWatchlistSuccess(true);
      setTimeout(() => setWatchlistSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error adding to watchlist. Please sign in.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-zinc-400">
        Loading journal trust evidence...
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="font-display text-xl font-bold text-rose-400">Journal Assessment Not Found</h2>
        <p className="text-xs text-zinc-400">{error || 'The requested journal could not be located.'}</p>
        <Link to="/journal-check" className="ss-btn-primary text-xs">Return to Journal Check</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Title */}
      <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-tactile">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Methodology v1.2.0-2026
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Evaluated: {assessment?.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-50 tracking-tight">
            {journal.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span>Publisher: <strong className="text-zinc-200">{journal.publisher || 'Not Declared'}</strong></span>
            <span>ISSN: <strong className="font-mono text-zinc-200">{journal.identifiers?.[0]?.value || '—'}</strong></span>
            {journal.websiteUrl && (
              <a href={journal.websiteUrl} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white inline-flex items-center gap-1">
                Website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Big Score Card */}
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-lg self-start md:self-auto shadow-tactile">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Trust Rating</span>
            <span className="font-mono text-3xl font-extrabold text-zinc-50 tabular-nums">
              {assessment?.totalScore ?? journal.currentScore ?? '—'}
            </span>
            <span className="text-xs font-mono text-zinc-400"> / 100</span>
          </div>
          <div className="h-10 w-px bg-zinc-800"></div>
          <GradeBadge grade={assessment?.letterGrade || journal.currentGrade || 'UNVERIFIED'} size="lg" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToWatchlist}
            className="ss-btn-secondary text-xs py-1.5 px-3"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-zinc-400" />
            <span>{watchlistSuccess ? '✓ Added to Watchlist' : 'Add to Watchlist'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="ss-btn-secondary text-xs py-1.5 px-3"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Print Report</span>
          </button>
        </div>

        <Link
          to={`/journal-audit?url=${encodeURIComponent(journal.websiteUrl || '')}`}
          className="ss-btn-primary text-xs py-1.5 px-3"
        >
          <span>Run 121-Point Indexing Audit &rarr;</span>
        </Link>
      </div>

      {/* Red Flag Warning Box (if applicable) */}
      {assessment && assessment.redFlagCount > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-5 space-y-2 text-rose-300">
          <div className="flex items-center gap-2 font-display font-bold text-sm text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Integrity Red Flags Detected ({assessment.redFlagCount})</span>
          </div>
          <p className="text-xs leading-relaxed text-rose-300">
            This journal has triggered critical integrity signals based on missing bibliographic registration, lack of persistent DOIs, or unverified peer review. Review the itemized criteria below.
          </p>
        </div>
      )}

      {/* 5-Pillar Score Breakdown */}
      {assessment && (
        <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-tactile">
          <h2 className="font-display font-bold text-base text-zinc-100">
            Five Pillars Scoring Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
            
            <div className="bg-zinc-900 border border-zinc-800/90 p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">Identity</span>
                <span className="font-mono text-zinc-200 font-bold tabular-nums">
                  {assessment.identityGovernanceScore} / 25
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-sm"
                  style={{ width: `${(assessment.identityGovernanceScore / 25) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/90 p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">Editorial</span>
                <span className="font-mono text-zinc-200 font-bold tabular-nums">
                  {assessment.editorialIntegrityScore} / 25
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-sm"
                  style={{ width: `${(assessment.editorialIntegrityScore / 25) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/90 p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">Technical</span>
                <span className="font-mono text-zinc-200 font-bold tabular-nums">
                  {assessment.technicalStandingScore} / 20
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-sm"
                  style={{ width: `${(assessment.technicalStandingScore / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/90 p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">Preservation</span>
                <span className="font-mono text-zinc-200 font-bold tabular-nums">
                  {assessment.preservationAccessScore} / 15
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-sm"
                  style={{ width: `${(assessment.preservationAccessScore / 15) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/90 p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">Reach & Cite</span>
                <span className="font-mono text-zinc-200 font-bold tabular-nums">
                  {assessment.reachCitationScore} / 15
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-sm"
                  style={{ width: `${(assessment.reachCitationScore / 15) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Itemized Criteria Evidence Table */}
      {assessment && (
        <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-hidden shadow-tactile">
          <div className="p-5 border-b border-zinc-800">
            <h2 className="font-display font-bold text-base text-zinc-100">
              Itemized Evaluation Criteria & Explanations
            </h2>
            <p className="text-xs text-zinc-400">
              Every point awarded or withheld is strictly explained by deterministic rule results.
            </p>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {assessment.criteriaResults?.map((c) => {
              const isVerified = c.status === 'VERIFIED';
              const isFailed = c.status === 'FAILED';

              return (
                <div key={c.id} className="p-4 sm:p-5 hover:bg-zinc-900/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                        {c.pillar}
                      </span>
                      <h4 className="font-display font-semibold text-xs sm:text-sm text-zinc-100">
                        {c.name}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {c.explanation}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <span>Source: <strong className="text-zinc-300">{c.sourceName}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 flex-shrink-0">
                    <span className="font-mono text-xs sm:text-sm font-bold text-zinc-200 tabular-nums">
                      {c.awardedPoints} / {c.maxPoints} pts
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        isVerified
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isFailed
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400'
                      }`}
                    >
                      {isVerified ? <CheckCircle2 className="w-3 h-3" /> : isFailed ? <XCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                      {c.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Verifiable Registry Provenance Records */}
      {assessment && assessment.evidenceRecords && assessment.evidenceRecords.length > 0 && (
        <div className="bg-[#121215] border border-zinc-800 rounded-xl p-5 space-y-3 shadow-tactile">
          <h3 className="font-display font-semibold text-xs text-zinc-200 uppercase tracking-wider font-mono">
            Evidence Provenance & Registry Verification Timestamps
          </h3>
          <div className="space-y-2">
            {assessment.evidenceRecords.map((e) => (
              <div key={e.id} className="p-3 rounded bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-mono font-semibold text-zinc-200 text-[11px]">{e.sourceName}</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">{e.extractedSummary}</div>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 sm:text-right">
                  Verified: {new Date(e.verifiedAt).toISOString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
