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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0A3D36]">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/indexing/directory" className="text-xs font-mono text-[#4B635E] hover:text-[#0A3D36] inline-flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Index Directory
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="ss-btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>New Application Dossier</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
          GetIndexed · Dossier Workflow Tracker
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Indexing Application Dossiers
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 max-w-2xl leading-relaxed">
          Manage preparation, policy audit attachments, verification evidence, and submission status across your journals.
        </p>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#4B635E] font-mono">
          Loading dossiers...
        </div>
      ) : applications.length === 0 ? (
        <div className="ss-card p-10 text-center space-y-3 shadow-paper">
          <FileCheck className="w-8 h-8 text-[#4B635E] mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#0A3D36]">
            No Application Dossiers Tracked Yet
          </h3>
          <p className="text-xs text-[#4B635E] max-w-md mx-auto">
            Create an application dossier to track eligibility criteria, editorial board documents, and target submission deadlines.
          </p>
          <button onClick={() => setShowModal(true)} className="ss-btn-primary text-xs font-bold py-2 px-4 mt-2">
            Start New Application Dossier
          </button>
        </div>
      ) : (
        <div className="ss-card overflow-hidden shadow-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A3D36] text-[#FAF6EE] font-mono uppercase text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Journal</th>
                  <th className="py-3 px-4 font-bold">Target Index</th>
                  <th className="py-3 px-4 font-bold">Current Status</th>
                  <th className="py-3 px-4 font-bold">Target Submit</th>
                  <th className="py-3 px-4 font-bold">Dossier Notes</th>
                  <th className="py-3 px-4 font-bold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A3D36]/10 bg-[#FFFDF9]">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-[#FAF6EE] transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#0A3D36]">
                      {a.journal.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0A3D36] font-semibold">
                      {a.indexingService.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-sm border uppercase ${
                        a.status === 'ACCEPTED'
                          ? 'bg-[#E8F8F5] border-[#109C89] text-[#0A3D36]'
                          : a.status === 'SUBMITTED'
                          ? 'bg-[#EBF5FB] border-[#2980B9] text-[#1B4F72]'
                          : 'bg-[#FEF5ED] border-[#F6AC6D] text-[#8C460C]'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#4B635E]">
                      {a.targetSubmitDate ? new Date(a.targetSubmitDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B635E] max-w-xs truncate">
                      {a.dossierNotes || 'None'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={a.status}
                        onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                        className="bg-[#FFFDF9] border border-[#0A3D36]/25 text-[11px] font-mono text-[#0A3D36] font-semibold rounded-sm px-2 py-1 focus:outline-none focus:border-[#0A3D36]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06231E]/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#0A3D36] rounded-sm max-w-lg w-full p-6 space-y-4 shadow-paper text-[#0A3D36]">
            <h3 className="font-serif font-bold text-xl text-[#0A3D36]">
              New Indexing Application Dossier
            </h3>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Select Journal</label>
                <select
                  required
                  value={selectedJournalId}
                  onChange={e => setSelectedJournalId(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm p-2 text-[#0A3D36] font-medium focus:outline-none focus:border-[#0A3D36]"
                >
                  <option value="">— Select a Journal —</option>
                  {journals.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Target Indexing Service</label>
                <select
                  required
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm p-2 text-[#0A3D36] font-medium focus:outline-none focus:border-[#0A3D36]"
                >
                  <option value="">— Select an Index —</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Target Submission Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm p-2 text-[#0A3D36] font-medium focus:outline-none focus:border-[#0A3D36]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Dossier Preparation Notes</label>
                <textarea
                  rows={3}
                  value={dossierNotes}
                  onChange={e => setDossierNotes(e.target.value)}
                  placeholder="e.g. Audit completed, updating editorial board affiliations before submitting to DOAJ."
                  className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm p-2 text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ss-btn-secondary py-1.5 px-3 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ss-btn-primary py-1.5 px-4 font-bold"
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
