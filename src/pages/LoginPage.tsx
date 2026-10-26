import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@smartscholars.in');
  const [password, setPassword] = useState('Admin@SmartScholars2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAdmin = () => {
    setEmail('admin@smartscholars.in');
    setPassword('Admin@SmartScholars2026');
  };

  const setDemoAuditor = () => {
    setEmail('auditor@oxford-research.ac.uk');
    setPassword('Researcher@2026');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-[#121215] border border-[#27272a] rounded-xl p-8 shadow-tactile">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-md bg-[#1D1914] border border-[#3E342B] flex items-center justify-center text-emerald-400 mx-auto shadow-tactile">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-zinc-100">
            Sign in to Smart Scholars
          </h1>
          <p className="text-xs text-[#8C8275]">
            Access saved checks, institutional watchlists, and indexing dossiers.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono text-[#8C8375] uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <div>
            <label className="block font-mono text-[#8C8375] uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary w-full py-2.5 text-xs font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="pt-4 border-t border-[#221D18] space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#7A7165] block text-center">
            Demo Credentials
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={setDemoAdmin}
              className="flex-1 py-1 px-2 rounded bg-[#1A1713] border border-[#2E2822] text-[11px] font-mono text-emerald-400 hover:border-emerald-500/40"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={setDemoAuditor}
              className="flex-1 py-1 px-2 rounded bg-[#1A1713] border border-[#2E2822] text-[11px] font-mono text-emerald-400 hover:border-emerald-500/40"
            >
              Fill Auditor
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#8C8275]">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-emerald-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
