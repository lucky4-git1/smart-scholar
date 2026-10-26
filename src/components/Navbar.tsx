import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-7">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow-tactile group-hover:border-zinc-700 transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-tight text-zinc-100 leading-none">
                  Smart Scholars
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-tight mt-0.5">
                  Research Integrity OS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
              <Link
                to="/journal-check"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/journal-check')
                    ? 'text-zinc-100 bg-zinc-800/70'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                Journal Check
              </Link>
              <Link
                to="/journal-audit"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/journal-audit')
                    ? 'text-zinc-100 bg-zinc-800/70'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                Journal Audit
              </Link>
              <Link
                to="/doi-doctor"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/doi-doctor')
                    ? 'text-zinc-100 bg-zinc-800/70'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                DOI Doctor
              </Link>
              <Link
                to="/indexing/directory"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/indexing/directory')
                    ? 'text-zinc-100 bg-zinc-800/70'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                GetIndexed
              </Link>
              <Link
                to="/institution/dashboard"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/institution/dashboard')
                    ? 'text-zinc-100 bg-zinc-800/70'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                Institution Desk
              </Link>
              <Link
                to="/portfolio/dashboard"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/portfolio/dashboard')
                    ? 'text-zinc-100 bg-zinc-800/70'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                Portfolio
              </Link>
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/journal-check"
              className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Search ISSN / DOI...</span>
            </Link>

            {/* Start Audit CTA */}
            <Link
              to="/journal-audit"
              className="ss-btn-primary text-xs py-1.5 px-3.5"
            >
              <span>Audit Journal</span>
            </Link>

            {/* Auth User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 hover:border-zinc-700"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono text-emerald-400 font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-xs font-medium max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#121215] border border-zinc-800 rounded-lg shadow-elevated py-1 text-xs z-50">
                    <div className="px-4 py-2 border-b border-zinc-800/80">
                      <p className="font-semibold text-zinc-100 truncate">{user.fullName}</p>
                      <p className="text-[11px] font-mono text-zinc-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60"
                    >
                      <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                      Workspace
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:bg-zinc-800/60"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Admin Console
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-zinc-800/60 border-t border-zinc-800/80"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-xs font-medium px-3 py-1.5 text-zinc-400 hover:text-zinc-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="ss-btn-secondary text-xs py-1.5 px-3"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800 py-3 space-y-1">
            <Link
              to="/journal-check"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
            >
              Journal Check
            </Link>
            <Link
              to="/journal-audit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
            >
              Journal Audit
            </Link>
            <Link
              to="/doi-doctor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
            >
              DOI Doctor
            </Link>
            <Link
              to="/indexing/directory"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
            >
              GetIndexed
            </Link>
            <Link
              to="/institution/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
            >
              Institution Desk
            </Link>
            <Link
              to="/portfolio/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
            >
              Portfolio Console
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
            >
              Services Directory
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
