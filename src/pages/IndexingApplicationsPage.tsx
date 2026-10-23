import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Plus, ArrowLeft, Loader2, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { IndexingApplication, IndexingService, Journal } from '../types';

export const IndexingApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<IndexingApplication[]>([]);
  const [services, setServices] = useState<IndexingService[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedJournalId, setSelectedJournalId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [dossierNotes, setDossierNotes] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, srvRes, jRes] = await Promise.all([
        apiRequest('/api/v1/indexing/applications').catch(() => ({ applications: [] })),
        apiRequest('/api/v1/indexing/directory'),
        apiRequest('/api/v1/journals/search'),
      ]);

      if (appsRes.applications) setApplications(appsRes.applications);
      if (srvRes.services) setServices(srvRes.services);
      if (jRes.results) setJournals(jRes.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJournalId || !selectedServiceId) return;

    try {
      await apiRequest('/api/v1/indexing/applications', {
        method: 'POST',
        body: JSON.stringify({
          journalId: selectedJournalId,
          indexingServiceId: selectedServiceId,
          dossierNotes,
          targetSubmitDate: targetDate || undefined,
        }),
      });
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert('Error creating dossier: ' + (err.message || 'Please log in'));
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await apiRequest(`/api/v1/indexing/applications/${appId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/indexing/directory" className="text-xs font-mono text-[#A89F91] hover:text-[#FAF7F2] inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Index Directory
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="ss-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Application Dossier</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
          GetIndexed · Dossier Workflow Tracker
        </span>
        <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
          Indexing Application Dossiers
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
          Manage preparation, policy audit attachments, verification evidence, and submission status across your journals.
        </p>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#9E9486]">
          Loading dossiers...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-[#14120F] border border-[#27211B] rounded-xl p-10 text-center space-y-3">
          <FileCheck className="w-8 h-8 text-[#8C8274] mx-auto" />
          <h3 className="font-display font-bold text-base text-[#FAF7F2]">
            No Application Dossiers Tracked Yet
          </h3>
          <p className="text-xs text-[#8C8274] max-w-md mx-auto">
            Create an application dossier to track eligibility criteria, editorial board documents, and target submission deadlines.
          </p>
          <button onClick={() => setShowModal(true)} className="ss-btn-primary text-xs">
            Start New Application Dossier
          </button>
        </div>
      ) : (
        <div className="bg-[#14120F] border border-[#26201B] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181512] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Journal</th>
                  <th className="py-3 px-4">Target Index</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Target Submit</th>
                  <th className="py-3 px-4">Dossier Notes</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201B17]">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-[#181512] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#FAF7F2]">
                      {a.journal.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#E3BC9A]">
                      {a.indexingService.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                        a.status === 'ACCEPTED'
                          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-400'
                          : a.status === 'SUBMITTED'
                          ? 'bg-sky-950/70 border-sky-500/50 text-sky-300'
                          : 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#9E9486]">
                      {a.targetSubmitDate ? new Date(a.targetSubmitDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[#A89F91] max-w-xs truncate">
                      {a.dossierNotes || 'None'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={a.status}
                        onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                        className="bg-[#100E0C] border border-[#2E2822] text-[11px] font-mono text-[#FAF7F2] rounded px-2 py-1"
                      >
                        <option value="PREPARING">PREPARING</option>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="UNDER_REVIEW">UNDER REVIEW</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#14120F] border border-[#2E2721] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-[#FAF7F2]">
              New Indexing Application Dossier
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-[#8C8375] uppercase mb-1">Select Journal</label>
                <select
                  required
                  value={selectedJournalId}
                  onChange={e => setSelectedJournalId(e.target.value)}
                  className="w-full bg-[#0E0C0A] border border-[#2A241E] rounded p-2 text-[#FAF7F2]"
                >
                  <option value="">— Select a Journal —</option>
                  {journals.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[#8C8375] uppercase mb-1">Target Indexing Service</label>
                <select
                  required
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  className="w-full bg-[#0E0C0A] border border-[#2A241E] rounded p-2 text-[#FAF7F2]"
                >
                  <option value="">— Select an Index —</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[#8C8375] uppercase mb-1">Target Submission Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full bg-[#0E0C0A] border border-[#2A241E] rounded p-2 text-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8C8375] uppercase mb-1">Dossier Preparation Notes</label>
                <textarea
                  rows={3}
                  value={dossierNotes}
                  onChange={e => setDossierNotes(e.target.value)}
                  placeholder="e.g. Audit completed, updating editorial board affiliations before submitting to DOAJ."
                  className="w-full bg-[#0E0C0A] border border-[#2A241E] rounded p-2 text-[#FAF7F2]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ss-btn-secondary py-1.5 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ss-btn-primary py-1.5 px-4"
                >
                  Create Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
