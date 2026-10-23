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
      <div className="py-20 text-center text-xs text-[#9E9486]">
        Loading journal trust evidence...
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="font-display text-xl font-bold text-rose-400">Journal Assessment Not Found</h2>
        <p className="text-xs text-[#8A8173]">{error || 'The requested journal could not be located.'}</p>
        <Link to="/journal-check" className="ss-btn-primary text-xs">Return to Journal Check</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Title */}
      <div className="bg-[#14120F] border border-[#26201B] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-tactile">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E3BC9A] bg-[#221D18] px-2 py-0.5 rounded border border-[#3E342B]">
              Methodology v1.2.0-2026
            </span>
            <span className="text-xs text-[#82786B] font-mono">
              Evaluated: {assessment?.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#FAF7F2]">
            {journal.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#A89F91]">
            <span>Publisher: <strong className="text-[#FAF7F2]">{journal.publisher || 'Not Declared'}</strong></span>
            <span>ISSN: <strong className="font-mono text-[#E3BC9A]">{journal.identifiers?.[0]?.value || '—'}</strong></span>
            {journal.websiteUrl && (
              <a href={journal.websiteUrl} target="_blank" rel="noreferrer" className="text-[#E3BC9A] hover:underline inline-flex items-center gap-1">
                Website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Big Score Card */}
        <div className="flex items-center gap-4 bg-[#1A1713] border border-[#332B23] p-4 rounded-lg self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-[#8A8072] block">Trust Rating</span>
            <span className="font-mono text-3xl font-extrabold text-[#FAF7F2] tabular-nums">
              {assessment?.totalScore ?? journal.currentScore ?? '—'}
            </span>
            <span className="text-xs font-mono text-[#8A8072]"> / 100</span>
          </div>
          <div className="h-10 w-px bg-[#2E2720]"></div>
          <GradeBadge grade={assessment?.letterGrade || journal.currentGrade || 'UNVERIFIED'} size="lg" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#221D18]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToWatchlist}
            className="ss-btn-secondary text-xs py-1.5 px-3"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-[#E3BC9A]" />
            <span>{watchlistSuccess ? '✓ Added to Watchlist' : 'Add to Watchlist'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="ss-btn-secondary text-xs py-1.5 px-3"
          >
            <Printer className="w-3.5 h-3.5 text-[#E3BC9A]" />
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
        <div className="bg-rose-950/40 border border-rose-800 rounded-lg p-5 space-y-2 text-rose-300">
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
        <div className="bg-[#14120F] border border-[#26201B] rounded-xl p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-[#FAF7F2]">
            Five Pillars Scoring Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            
            <div className="bg-[#191613] border border-[#29231D] p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#A89F91]">Identity</span>
                <span className="font-mono text-[#E3BC9A] font-bold">
                  {assessment.identityGovernanceScore} / 25
                </span>
              </div>
              <div className="w-full bg-[#0E0C0A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E3BC9A] h-full rounded-full"
                  style={{ width: `${(assessment.identityGovernanceScore / 25) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-[#191613] border border-[#29231D] p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#A89F91]">Editorial</span>
                <span className="font-mono text-[#E3BC9A] font-bold">
                  {assessment.editorialIntegrityScore} / 25
                </span>
              </div>
              <div className="w-full bg-[#0E0C0A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E3BC9A] h-full rounded-full"
                  style={{ width: `${(assessment.editorialIntegrityScore / 25) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-[#191613] border border-[#29231D] p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#A89F91]">Technical</span>
                <span className="font-mono text-[#E3BC9A] font-bold">
                  {assessment.technicalStandingScore} / 20
                </span>
              </div>
              <div className="w-full bg-[#0E0C0A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E3BC9A] h-full rounded-full"
                  style={{ width: `${(assessment.technicalStandingScore / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-[#191613] border border-[#29231D] p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#A89F91]">Preservation</span>
                <span className="font-mono text-[#E3BC9A] font-bold">
                  {assessment.preservationAccessScore} / 15
                </span>
              </div>
              <div className="w-full bg-[#0E0C0A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E3BC9A] h-full rounded-full"
                  style={{ width: `${(assessment.preservationAccessScore / 15) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-[#191613] border border-[#29231D] p-3.5 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#A89F91]">Reach & Cite</span>
                <span className="font-mono text-[#E3BC9A] font-bold">
                  {assessment.reachCitationScore} / 15
                </span>
              </div>
              <div className="w-full bg-[#0E0C0A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E3BC9A] h-full rounded-full"
                  style={{ width: `${(assessment.reachCitationScore / 15) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Itemized Criteria Evidence Table */}
      {assessment && (
        <div className="bg-[#14120F] border border-[#26201B] rounded-xl overflow-hidden space-y-0">
          <div className="p-5 border-b border-[#241F1A]">
            <h2 className="font-display font-bold text-lg text-[#FAF7F2]">
              Itemized Evaluation Criteria & Explanations
            </h2>
            <p className="text-xs text-[#8A8174]">
              Every point awarded or withheld is strictly explained by deterministic rule results.
            </p>
          </div>

          <div className="divide-y divide-[#201B17]">
            {assessment.criteriaResults?.map((c) => {
              const isVerified = c.status === 'VERIFIED';
              const isFailed = c.status === 'FAILED';

              return (
                <div key={c.id} className="p-4 sm:p-5 hover:bg-[#181512] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8072] px-1.5 py-0.5 rounded bg-[#1C1814] border border-[#2C2620]">
                        {c.pillar}
                      </span>
                      <h4 className="font-display font-bold text-sm text-[#FAF7F2]">
                        {c.name}
                      </h4>
                    </div>

                    <p className="text-xs text-[#A89F91] leading-relaxed">
                      {c.explanation}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#7A7165]">
                      <span>Source: <strong>{c.sourceName}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 flex-shrink-0">
                    <span className="font-mono text-sm font-bold text-[#E3BC9A]">
                      {c.awardedPoints} / {c.maxPoints} pts
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        isVerified
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                          : isFailed
                          ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400'
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
        <div className="bg-[#14120F] border border-[#26201B] rounded-xl p-5 space-y-3">
          <h3 className="font-display font-bold text-sm text-[#FAF7F2]">
            Evidence Provenance & Registry Verification Timestamps
          </h3>
          <div className="space-y-2">
            {assessment.evidenceRecords.map((e) => (
              <div key={e.id} className="p-3 rounded bg-[#181512] border border-[#28221B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-mono font-semibold text-[#E3BC9A] text-[11px]">{e.sourceName}</div>
                  <div className="text-[#C7BFB3] text-[11px] mt-0.5">{e.extractedSummary}</div>
                </div>
                <div className="text-[10px] font-mono text-[#7A7062] sm:text-right">
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
