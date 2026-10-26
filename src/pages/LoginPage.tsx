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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-[#0A3D36]">
      <div className="w-full max-w-md space-y-6 ss-card p-8 shadow-paper">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#0A3D36] border border-[#06231E] flex items-center justify-center text-[#22D0B9] mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0A3D36] tracking-tight">
            Sign in to Smart Scholars
          </h1>
          <p className="text-xs text-[#4B635E]">
            Access saved checks, institutional watchlists, and indexing dossiers.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono text-[#0A3D36] uppercase font-bold mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm px-3 py-2 text-sm text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#0A3D36] uppercase font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#0A3D36]/25 rounded-sm px-3 py-2 text-sm text-[#0A3D36] placeholder-[#4B635E]/60 focus:outline-none focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary w-full py-2.5 text-xs font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="pt-4 border-t border-[#0A3D36]/15 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#4B635E] font-bold block text-center">
            Demo Credentials
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={setDemoAdmin}
              className="flex-1 py-1.5 px-2 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/20 text-[11px] font-mono font-bold text-[#0A3D36] hover:bg-[#FEDAB8] transition-colors"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={setDemoAuditor}
              className="flex-1 py-1.5 px-2 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/20 text-[11px] font-mono font-bold text-[#0A3D36] hover:bg-[#FEDAB8] transition-colors"
            >
              Fill Auditor
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#4B635E]">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-[#0A3D36] hover:underline font-bold">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
