import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Loader2 } from 'lucide-react';
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
        className="fixed bottom-6 right-6 z-40 bg-zinc-900 border border-zinc-700/80 text-zinc-100 py-2 px-3.5 rounded-md shadow-elevated flex items-center gap-2 hover:border-zinc-500 hover:bg-zinc-800 transition-all text-xs font-semibold"
        aria-label="Ask Research Integrity Assistant"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Ask Integrity Assistant</span>
      </button>

      {/* Slide-over Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e0e11] border-l border-zinc-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-zinc-100">
                    Research Integrity Assistant
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Grounded in 5-Pillar Methodology
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
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
                    <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex-shrink-0 flex items-center justify-center text-emerald-400 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-zinc-100 text-zinc-950 font-medium'
                        : 'bg-zinc-900 text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {m.content}
                    {m.source && (
                      <div className="mt-2 pt-2 border-t border-zinc-800/80 text-[9px] font-mono text-zinc-400">
                        Source: {m.source}
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex-shrink-0 flex items-center justify-center text-zinc-300 mt-1 text-[10px] font-mono">
                      U
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-zinc-400 p-2 bg-zinc-900 rounded border border-zinc-800 max-w-[200px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Consulting registries...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/80">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-[11px] px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
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
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
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
