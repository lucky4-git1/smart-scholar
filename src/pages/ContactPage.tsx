import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { apiRequest } from '../lib/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest('/api/v1/public/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.success) {
        setSuccessTicket(res.ticketId);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
          Get in Touch · Integrity Desk Support
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-100 mt-1">
          Contact Research Integrity Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-2 leading-relaxed">
          Inquiries regarding journal evaluations, methodology clarifications, or institutional partnership onboarding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact info */}
        <div className="space-y-4 text-xs text-[#9E9486]">
          <div className="bg-[#121215] border border-[#27272a] p-5 rounded-xl space-y-3">
            <h3 className="font-display font-bold text-sm text-zinc-100">Platform Integrity Office</h3>
            <p>Smart Scholars Research Integrity Desk</p>
            <div className="pt-2 border-t border-[#221D18] space-y-1 font-mono text-[11px]">
              <div>Email: <span className="text-emerald-400">support@smartscholars.in</span></div>
              <div>Crossref Mailto: <span className="text-emerald-400">integrity@smartscholars.in</span></div>
            </div>
          </div>

          <div className="bg-[#121215] border border-[#27272a] p-5 rounded-xl space-y-2">
            <h4 className="font-display font-bold text-xs text-zinc-100">Response Standards</h4>
            <p className="text-[11px]">
              Inquiries regarding score re-assessments or disputed metadata findings are typically acknowledged within 1–2 business days.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-[#121215] border border-[#27272a] rounded-xl p-6 shadow-tactile">
          {successTicket ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-display font-bold text-lg text-zinc-100">Message Received</h3>
              <p className="text-xs text-zinc-400">
                Your message has been logged in our administrative tracking system.
              </p>
              <div className="p-3 bg-[#18181b] rounded border border-[#27272a] font-mono text-xs text-emerald-400">
                Reference Ticket ID: {successTicket}
              </div>
              <button
                onClick={() => setSuccessTicket(null)}
                className="ss-btn-secondary text-xs mt-2"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#8C8375] uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#8C8375] uppercase mb-1">Academic Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#8C8375] uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Journal Re-evaluation Request for ISSN 1234-5678"
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8C8375] uppercase mb-1">Message Details</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Please describe your inquiry, including relevant journal URLs, ISSNs, or audit job IDs."
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="ss-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
