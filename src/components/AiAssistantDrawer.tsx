import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { apiRequest } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Welcome to the Smart Scholars Research Integrity Assistant. I can help you understand the 5-pillar scoring methodology, diagnose DOI resolution errors, or interpret your journal audit findings.',
      source: 'DETERMINISTIC_ENGINE',
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiRequest('/api/v1/assistant/ask', {
        method: 'POST',
        body: JSON.stringify({ message: query }),
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply,
          source: res.source,
        },
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to connect to assistant service: ' + (err.message || 'Unknown error'),
          source: 'ERROR',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explain the 5-Pillar scoring rules',
    'What triggers a RED FLAG rating?',
    'What are the requirements for DOAJ indexing?',
    'How does DOI Doctor check resolution?',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 ss-btn-primary py-2.5 px-4 rounded-full shadow-2xl flex items-center gap-2 border border-[#FFF3E6]/30 text-xs font-semibold"
        aria-label="Ask Research Integrity Assistant"
      >
        <Sparkles className="w-4 h-4 text-[#0A0908]" />
        <span>Ask Integrity Assistant</span>
      </button>

      {/* Slide-over Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#12100E] border-l border-[#2B2520] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-[#25201A] flex items-center justify-between bg-[#161310]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#201B16] border border-[#3E342B] flex items-center justify-center text-[#E3BC9A]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#FAF7F2]">
                    Research Integrity Assistant
                  </h3>
                  <span className="text-[10px] font-mono text-[#14B8A6] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></span>
                    Grounded in 5-Pillar Methodology
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-[#9E9486] hover:text-[#FAF7F2] hover:bg-[#201C17]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#201B16] border border-[#3E342B] flex-shrink-0 flex items-center justify-center text-[#E3BC9A] mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-[#E3BC9A] text-[#0A0908] font-medium'
                        : 'bg-[#191613] text-[#FAF7F2] border border-[#2B2520]'
                    }`}
                  >
                    {m.content}
                    {m.source && (
                      <div className="mt-2 pt-2 border-t border-[#26201A] text-[9px] font-mono text-[#8C8377]">
                        Source: {m.source}
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-[#E3BC9A]/20 border border-[#E3BC9A]/40 flex-shrink-0 flex items-center justify-center text-[#E3BC9A] mt-1 text-[10px] font-mono">
                      U
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#9E9486] p-2 bg-[#191613] rounded border border-[#2B2520] max-w-[200px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E3BC9A]" />
                  <span>Consulting registries...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-[#25201A] bg-[#14120F]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#8A8173] mb-1.5">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-[11px] px-2 py-1 rounded bg-[#1C1814] border border-[#2C2620] text-[#C7BFB3] hover:border-[#E3BC9A]/60 hover:text-[#FAF7F2] transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-[#25201A] bg-[#161310]">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about journal criteria, DOAJ, or DOIs..."
                  className="flex-1 bg-[#0E0C0A] border border-[#2B2520] rounded-md px-3 py-2 text-xs text-[#FAF7F2] placeholder-[#6E6457] focus:outline-none focus:border-[#E3BC9A]"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="ss-btn-primary p-2 text-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
