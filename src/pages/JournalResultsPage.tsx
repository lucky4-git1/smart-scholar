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
  BookmarkPlus,
  ArrowLeft
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
      <div className="py-24 text-center text-xs font-mono text-[#0A3D36]">
        Retrieving verified evidence and computing 5-pillar scores...
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#A81B1B]">Journal Assessment Not Found</h2>
        <p className="text-xs text-[#4B635E]">{error || 'The requested journal record could not be located in the registry.'}</p>
        <Link to="/journal-check" className="ss-btn-primary text-xs">Return to Journal Check</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0A3D36]">
      
      {/* Back button */}
      <div>
        <Link to="/journal-check" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4B635E] hover:text-[#0A3D36]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal Check
        </Link>
      </div>

      {/* Top Banner & Title (Oxford Pine Card with Retro Shadow) */}
      <div className="bg-[#0A3D36] text-[#FAF6EE] border-2 border-[#06231E] rounded-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-retro">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#F6AC6D] px-2 py-0.5 rounded-sm">
              METHODOLOGY v1.2.0-2026
            </span>
            <span className="text-xs text-[#22D0B9] font-mono">
              Evaluated: {assessment?.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {journal.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#D1E6E2]">
            <span>Publisher: <strong className="text-white">{journal.publisher || 'Not Declared'}</strong></span>
            <span>ISSN: <strong className="font-mono text-[#22D0B9]">{journal.identifiers?.[0]?.value || '—'}</strong></span>
            {journal.websiteUrl && (
              <a href={journal.websiteUrl} target="_blank" rel="noreferrer" className="text-[#22D0B9] hover:underline inline-flex items-center gap-1">
                Website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Big Score Card */}
        <div className="flex items-center gap-4 bg-[#06231E] border border-[#166054] p-4 rounded-sm self-start md:self-auto shadow-retro-sm">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-[#8CB8B0] block font-semibold">Trust Rating</span>
            <span className="font-mono text-3xl font-extrabold text-white tabular-nums">
              {assessment?.totalScore ?? journal.currentScore ?? '—'}
            </span>
            <span className="text-xs font-mono text-[#8CB8B0]"> / 100</span>
          </div>
          <div className="h-10 w-px bg-[#166054]" />
          <GradeBadge grade={assessment?.letterGrade || journal.currentGrade || 'UNVERIFIED'} size="lg" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#0A3D36]/15">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToWatchlist}
            className="ss-btn-secondary text-xs py-1.5 px-3"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-[#0A3D36]" />
            <span>{watchlistSuccess ? '✓ Added to Watchlist' : 'Add to Watchlist'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="ss-btn-secondary text-xs py-1.5 px-3"
          >
            <Printer className="w-3.5 h-3.5 text-[#0A3D36]" />
            <span>Print Dossier</span>
          </button>
        </div>

        <Link
          to={`/journal-audit?url=${encodeURIComponent(journal.websiteUrl || '')}`}
          className="ss-btn-primary text-xs py-1.5 px-4 font-bold"
        >
          <span>Run 121-Point Technical Audit &rarr;</span>
        </Link>
      </div>

      {/* Red Flag Warning Box (if applicable) */}
      {assessment && assessment.redFlagCount > 0 && (
        <div className="bg-[#FDF2F2] border-2 border-[#E05252] rounded-sm p-5 space-y-2 text-[#A81B1B] shadow-retro-sm">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-[#A81B1B]">
            <AlertTriangle className="w-5 h-5 text-[#A81B1B]" />
            <span>Integrity Red Flags Detected ({assessment.redFlagCount})</span>
          </div>
          <p className="text-xs leading-relaxed text-[#781414]">
            This journal has triggered critical integrity signals based on missing bibliographic registration, lack of persistent DOIs, or unverified peer review. Review the itemized criteria below.
          </p>
        </div>
      )}

      {/* 5-Pillar Score Breakdown (Ivory Paper with Pine Accents) */}
      {assessment && (
        <div className="ss-card p-6 space-y-4 shadow-paper">
          <div className="flex items-center justify-between border-b border-[#0A3D36]/10 pb-3">
            <h2 className="font-serif font-bold text-xl text-[#0A3D36]">
              Five Pillars Scoring Breakdown
            </h2>
            <span className="font-mono text-xs text-[#4B635E]">
              TOTAL: {assessment.totalScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-1">
            
            <div className="bg-[#FAF6EE] border border-[#0A3D36]/15 p-4 rounded-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-serif font-bold text-[#0A3D36]">Identity</span>
                <span className="font-mono text-[#0A3D36] font-bold tabular-nums">
                  {assessment.identityGovernanceScore} / 25
                </span>
              </div>
              <div className="w-full bg-[#EADBC6] h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-[#0A3D36] h-full rounded-sm"
                  style={{ width: `${(assessment.identityGovernanceScore / 25) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#0A3D36]/15 p-4 rounded-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-serif font-bold text-[#0A3D36]">Editorial</span>
                <span className="font-mono text-[#0A3D36] font-bold tabular-nums">
                  {assessment.editorialIntegrityScore} / 25
                </span>
              </div>
              <div className="w-full bg-[#EADBC6] h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-[#0A3D36] h-full rounded-sm"
                  style={{ width: `${(assessment.editorialIntegrityScore / 25) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#0A3D36]/15 p-4 rounded-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-serif font-bold text-[#0A3D36]">Technical</span>
                <span className="font-mono text-[#0A3D36] font-bold tabular-nums">
                  {assessment.technicalStandingScore} / 20
                </span>
              </div>
              <div className="w-full bg-[#EADBC6] h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-[#0A3D36] h-full rounded-sm"
                  style={{ width: `${(assessment.technicalStandingScore / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#0A3D36]/15 p-4 rounded-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-serif font-bold text-[#0A3D36]">Preservation</span>
                <span className="font-mono text-[#0A3D36] font-bold tabular-nums">
                  {assessment.preservationAccessScore} / 15
                </span>
              </div>
              <div className="w-full bg-[#EADBC6] h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-[#0A3D36] h-full rounded-sm"
                  style={{ width: `${(assessment.preservationAccessScore / 15) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#0A3D36]/15 p-4 rounded-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-serif font-bold text-[#0A3D36]">Reach & Cite</span>
                <span className="font-mono text-[#0A3D36] font-bold tabular-nums">
                  {assessment.reachCitationScore} / 15
                </span>
              </div>
              <div className="w-full bg-[#EADBC6] h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-[#0A3D36] h-full rounded-sm"
                  style={{ width: `${(assessment.reachCitationScore / 15) * 100}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Itemized Criteria Evidence Table */}
      {assessment && (
        <div className="ss-card overflow-hidden shadow-paper">
          <div className="p-5 border-b border-[#0A3D36]/15 bg-[#FAF6EE]">
            <h2 className="font-serif font-bold text-xl text-[#0A3D36]">
              Itemized Evaluation Criteria & Explanations
            </h2>
            <p className="text-xs text-[#4B635E]">
              Every point awarded or withheld is strictly explained by deterministic rule results.
            </p>
          </div>

          <div className="divide-y divide-[#0A3D36]/10 bg-[#FFFDF9]">
            {assessment.criteriaResults?.map((c) => {
              const isVerified = c.status === 'VERIFIED';
              const isFailed = c.status === 'FAILED';

              return (
                <div key={c.id} className="p-4 sm:p-5 hover:bg-[#FAF6EE] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9.5px] uppercase font-bold tracking-wider text-[#0A3D36] px-1.5 py-0.5 rounded-sm bg-[#F2E8D8] border border-[#0A3D36]/20">
                        {c.pillar}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#0A3D36]">
                        {c.name}
                      </h4>
                    </div>

                    <p className="text-xs text-[#4B635E] leading-relaxed">
                      {c.explanation}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#0A3D36]">
                      <span>Source: <strong className="text-[#0A3D36]">{c.sourceName}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 flex-shrink-0">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#0A3D36] tabular-nums">
                      {c.awardedPoints} / {c.maxPoints} pts
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border ${
                        isVerified
                          ? 'bg-[#E8F8F5] border-[#109C89] text-[#0A3D36] font-bold'
                          : isFailed
                          ? 'bg-[#FDF2F2] border-[#E05252] text-[#A81B1B] font-bold'
                          : 'bg-[#F5EFE3] border-[#D5BA9B] text-[#4B635E]'
                      }`}
                    >
                      {isVerified ? <CheckCircle2 className="w-3 h-3 text-[#109C89]" /> : isFailed ? <XCircle className="w-3 h-3 text-[#A81B1B]" /> : <HelpCircle className="w-3 h-3" />}
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
        <div className="ss-card p-5 space-y-3 shadow-paper">
          <h3 className="font-mono font-bold text-xs text-[#0A3D36] uppercase tracking-wider">
            Evidence Provenance & Registry Verification Timestamps
          </h3>
          <div className="space-y-2">
            {assessment.evidenceRecords.map((e) => (
              <div key={e.id} className="p-3 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-mono font-bold text-[#0A3D36] text-[11px]">{e.sourceName}</div>
                  <div className="text-[#4B635E] text-[11px] mt-0.5">{e.extractedSummary}</div>
                </div>
                <div className="text-[10px] font-mono text-[#0A3D36] sm:text-right">
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
