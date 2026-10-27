import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Smart Scholars Research Integrity Assistant. I can clarify journal evaluation criteria, explain predatory indicators, review indexing readiness rules, or assess DOI resolution integrity.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

  try {
    const res = await apiRequest('/api/v1/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userMessage.content }),
    });

    if (res.answer) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          source: res.source,
        },
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not retrieve an answer at this time. Please try searching directly in the journal check registry.',
        },
      ]);
    }
  } catch (err: any) {
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: 'The assistant service encountered a communication error with the integrity knowledge base. Please check back shortly.',
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0B192C] text-[#E06B43] border-2 border-[#070F1A] py-2 px-3.5 rounded-sm shadow-retro flex items-center gap-2 hover:bg-[#162E4D] hover:text-white transition-all text-xs font-bold font-mono"
        aria-label="Ask Research Integrity Assistant"
      >
        <Sparkles className="w-4 h-4 text-[#E06B43]" />
        <span>Ask Integrity Assistant</span>
      </button>

      {/* Slide-over Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-[#070F1A]/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0B192C] border-l-2 border-[#070F1A] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200 text-[#FAF7F2]">
            
            {/* Header */}
            <div className="p-4 border-b border-[#162E4D] flex items-center justify-between bg-[#070F1A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-[#10243E] border border-[#E06B43] flex items-center justify-center text-[#E06B43]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Research Integrity Assistant
                  </h3>
                  <span className="text-[10px] font-mono text-[#E06B43] uppercase font-bold tracking-wider">
                    Grounded in 5-Pillar Methodology
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-[#A0B3C6] hover:text-white hover:bg-[#162E4D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A1524]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-sm bg-[#070F1A] border border-[#162E4D] flex-shrink-0 flex items-center justify-center text-[#E06B43] mt-1 font-bold text-[10px]">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-sm p-3 text-xs leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-[#FFFFFF] text-[#0B192C] font-medium border border-[#D8C4B0] shadow-sm'
                        : 'bg-[#10243E] text-[#D8E3EE] border border-[#1E3E62]'
                    }`}
                  >
                    {m.content}
                    {m.source && (
                      <div className="mt-2 pt-2 border-t border-[#1E3E62] text-[9.5px] font-mono text-[#E06B43]">
                        Reference: {m.source}
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded-sm bg-[#E06B43] text-white border border-[#C8532B] flex-shrink-0 flex items-center justify-center font-bold mt-1 text-[10px] font-mono">
                      U
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-sm bg-[#070F1A] border border-[#162E4D] flex items-center justify-center text-[#E06B43]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-[#10243E] border border-[#1E3E62] rounded-sm p-3 text-xs text-[#A0B3C6] font-mono">
                    Verifying integrity knowledge base...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#162E4D] bg-[#070F1A] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about DOAJ criteria, predatory risks..."
                className="flex-1 bg-[#050C16] border border-[#162E4D] focus:border-[#E06B43] rounded-sm px-3 py-2 text-xs text-white placeholder-[#71869E] focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#E06B43] text-white font-bold px-3 py-2 rounded-sm text-xs hover:bg-[#EB8461] disabled:opacity-50 transition-colors shadow-retro-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
