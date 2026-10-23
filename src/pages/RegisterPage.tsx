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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-[#14120F] border border-[#27211B] rounded-xl p-8 shadow-tactile">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-md bg-[#1D1914] border border-[#3E342B] flex items-center justify-center text-[#E3BC9A] mx-auto shadow-tactile">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[#FAF7F2]">
            Create an Account
          </h1>
          <p className="text-xs text-[#8C8275]">
            Join the research integrity network for verified journal assessments.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-mono text-[#8C8375] uppercase mb-1">
              Full Name & Title
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Dr. Jordan Smith"
              className="w-full bg-[#0E0C0A] border border-[#2D2620] rounded-md px-3 py-2 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#E3BC9A]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#8C8375] uppercase mb-1">
              Academic Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jordan.smith@university.edu"
              className="w-full bg-[#0E0C0A] border border-[#2D2620] rounded-md px-3 py-2 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#E3BC9A]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#8C8375] uppercase mb-1">
              Institution / Affiliation
            </label>
            <input
              type="text"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              placeholder="e.g. Stanford University or Independent Scholar"
              className="w-full bg-[#0E0C0A] border border-[#2D2620] rounded-md px-3 py-2 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#E3BC9A]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#8C8375] uppercase mb-1">
              Primary Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-[#0E0C0A] border border-[#2D2620] rounded-md px-3 py-2 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#E3BC9A]"
            >
              <option value="RESEARCHER">Researcher / Author</option>
              <option value="EDITOR">Journal Editor / Publisher</option>
              <option value="INSTITUTION_ADMIN">University Integrity Official / Librarian</option>
              <option value="PORTFOLIO_MGR">Portfolio Manager / Society Publisher</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[#8C8375] uppercase mb-1">
              Password (min. 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0E0C0A] border border-[#2D2620] rounded-md px-3 py-2 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#E3BC9A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ss-btn-primary w-full py-2.5 text-xs font-bold mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#8C8275]">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-[#E3BC9A] hover:underline font-semibold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
