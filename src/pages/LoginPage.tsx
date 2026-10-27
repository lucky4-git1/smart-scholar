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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-[#0B192C]">
      <div className="w-full max-w-md space-y-6 ss-card p-8 shadow-paper">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#0B192C] border border-[#070F1A] flex items-center justify-center text-[#E06B43] mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B192C] tracking-tight">
            Sign in to Smart Scholars
          </h1>
          <p className="text-xs text-[#475E79]">
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
            <label className="block font-mono text-[#0B192C] uppercase font-bold mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm px-3 py-2 text-sm text-[#0B192C] placeholder-[#475E79]/60 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#0B192C] uppercase font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm px-3 py-2 text-sm text-[#0B192C] placeholder-[#475E79]/60 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
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
        <div className="pt-4 border-t border-[#0B192C]/15 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#475E79] font-bold block text-center">
            Demo Credentials
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={setDemoAdmin}
              className="flex-1 py-1.5 px-2 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/20 text-[11px] font-mono font-bold text-[#0B192C] hover:bg-[#EBDDCD] transition-colors"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={setDemoAuditor}
              className="flex-1 py-1.5 px-2 rounded-sm bg-[#FAF7F2] border border-[#0B192C]/20 text-[11px] font-mono font-bold text-[#0B192C] hover:bg-[#EBDDCD] transition-colors"
            >
              Fill Auditor
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#475E79]">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-[#0B192C] hover:underline font-bold">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};
