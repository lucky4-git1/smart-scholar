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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#0A3D36]">
      
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
          Get in Touch · Integrity Desk Support
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
          Contact Research Integrity Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 leading-relaxed">
          Inquiries regarding journal evaluations, methodology clarifications, or institutional partnership onboarding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact info */}
        <div className="space-y-4 text-xs text-[#4B635E]">
          <div className="ss-card p-5 space-y-3 shadow-paper">
            <h3 className="font-serif font-bold text-sm text-[#0A3D36]">Platform Integrity Office</h3>
            <p>Smart Scholars Research Integrity Desk</p>
            <div className="pt-2 border-t border-[#0A3D36]/10 space-y-1 font-mono text-[11px]">
              <div>Email: <span className="text-[#0A3D36] font-bold">support@smartscholars.in</span></div>
              <div>Crossref Mailto: <span className="text-[#0A3D36] font-bold">integrity@smartscholars.in</span></div>
            </div>
          </div>

          <div className="ss-card p-5 space-y-2 shadow-paper">
            <h4 className="font-serif font-bold text-xs text-[#0A3D36]">Response Standards</h4>
            <p className="text-[11px] leading-relaxed">
              Inquiries regarding score re-assessments or disputed metadata findings are typically acknowledged within 1–2 business days.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 ss-card p-6 shadow-paper">
          {successTicket ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#109C89] mx-auto" />
              <h3 className="font-serif font-bold text-xl text-[#0A3D36]">Message Received</h3>
              <p className="text-xs text-[#4B635E]">
                Your message has been logged in our administrative tracking system.
              </p>
              <div className="p-3 bg-[#FAF6EE] rounded-sm border border-[#0A3D36]/15 font-mono text-xs text-[#0A3D36] font-bold">
                Reference Ticket ID: {successTicket}
              </div>
              <button
                onClick={() => setSuccessTicket(null)}
                className="ss-btn-secondary text-xs mt-2 font-semibold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm px-3 py-2 text-sm text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Academic Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm px-3 py-2 text-sm text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Journal Re-evaluation Request for ISSN 1234-5678"
                  className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm px-3 py-2 text-sm text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#0A3D36] font-bold uppercase mb-1">Message Details</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Please describe your inquiry, including relevant journal URLs, ISSNs, or audit job IDs."
                  className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm px-3 py-2 text-sm text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
                />
              </div>

              {error && (
                <div className="p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-medium">
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
