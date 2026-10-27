import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('RESEARCHER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        email,
        password,
        fullName,
        institution,
        role,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-[#0B192C]">
      <div className="w-full max-w-md space-y-6 ss-card p-8 shadow-paper">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#0B192C] border border-[#070F1A] flex items-center justify-center text-[#E06B43] mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0B192C] tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-[#475E79]">
            Join the research integrity network for verified journal assessments.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-sm bg-[#FDF2F2] border border-[#E05252] text-[#A81B1B] text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-mono text-[#0B192C] uppercase font-bold mb-1">
              Full Name & Title
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Dr. Jordan Smith"
              className="w-full bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm px-3 py-2 text-sm text-[#0B192C] placeholder-[#475E79]/60 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#0B192C] uppercase font-bold mb-1">
              Academic Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jordan.smith@university.edu"
              className="w-full bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm px-3 py-2 text-sm text-[#0B192C] placeholder-[#475E79]/60 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#0B192C] uppercase font-bold mb-1">
              Institution / Affiliation
            </label>
            <input
              type="text"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              placeholder="e.g. Stanford University or Independent Scholar"
              className="w-full bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm px-3 py-2 text-sm text-[#0B192C] placeholder-[#475E79]/60 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#0B192C] uppercase font-bold mb-1">
              Primary Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm px-3 py-2 text-sm text-[#0B192C] font-medium focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            >
              <option value="RESEARCHER">Researcher / Author</option>
              <option value="EDITOR">Journal Editor / Publisher</option>
              <option value="INSTITUTION_ADMIN">University Integrity Official / Librarian</option>
              <option value="PORTFOLIO_MGR">Portfolio Manager / Society Publisher</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[#0B192C] uppercase font-bold mb-1">
              Password (min. 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#0B192C]/25 rounded-sm px-3 py-2 text-sm text-[#0B192C] placeholder-[#475E79]/60 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary w-full py-2.5 text-xs font-bold mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#475E79]">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-[#0B192C] hover:underline font-bold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
