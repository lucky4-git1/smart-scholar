import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Building2,
  Stethoscope,
  FolderKanban,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Journal Check', path: '/journal-check' },
    { label: 'Journal Audit', path: '/journal-audit' },
    { label: 'DOI Doctor', path: '/doi-doctor' },
    { label: 'GetIndexed', path: '/indexing/directory' },
    { label: 'Institutions', path: '/institution/dashboard' },
    { label: 'Portfolio', path: '/portfolio/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      {/* Micro-top hairline illumination */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[62px]">
          
          {/* Left: Brand Identity & Micro-Status */}
          <div className="flex items-center gap-7 lg:gap-8">
            <Link to="/" className="flex items-center gap-3 group select-none">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center group-hover:border-zinc-500 transition-all duration-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 transition-transform duration-200 group-hover:scale-105" />
                {/* Heartbeat pulse beacon */}
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-[#09090b]" />
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-semibold tracking-[-0.015em] text-zinc-100 group-hover:text-white transition-colors leading-none">
                    Smart Scholars
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-[2px] rounded text-[9px] font-mono tracking-wider font-semibold uppercase text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40">
                    LIVE
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.06em] text-zinc-400 leading-tight mt-1">
                  Research Integrity OS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium tracking-[-0.01em]">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-1.5 rounded-md transition-all duration-150 ease-out ${
                      active
                        ? 'text-zinc-100 bg-zinc-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.3)] border border-zinc-700/50'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/60 border border-transparent'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-emerald-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Command Search Trigger */}
            <Link
              to="/journal-check"
              className="hidden md:flex items-center gap-2.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all duration-150 shadow-xs group"
              title="Quick Search Journal Registry"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
              <span className="text-[12px] tracking-tight">Search ISSN / DOI</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 shadow-xs">
                ⌘K
              </kbd>
            </Link>

            {/* Audit Journal CTA */}
            <Link
              to="/journal-audit"
              className="ss-btn-primary text-xs font-medium py-1.5 px-3.5 tracking-tight flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]"
            >
              <span>Audit Journal</span>
            </Link>

            {/* User Dropdown / Auth Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850 transition-all"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono text-emerald-400 font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-xs font-medium max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#121215]/95 backdrop-blur-xl border border-zinc-800/90 rounded-xl shadow-[0_10px_38px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] py-1.5 text-xs z-50 ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-zinc-800/80">
                      <p className="font-semibold text-zinc-100 truncate">{user.fullName}</p>
                      <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/90 text-emerald-400 border border-zinc-700/60 font-medium">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Research Workspace</span>
                      </Link>

                      <Link
                        to="/institution/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Institution Watchlist</span>
                      </Link>

                      <Link
                        to="/portfolio/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
                      >
                        <FolderKanban className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Portfolio Manager</span>
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-emerald-400 hover:bg-zinc-800/60 font-medium transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-zinc-800/80">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-950/20 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-xs font-medium px-3 py-1.5 text-zinc-300 hover:text-white transition-colors tracking-tight"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="ss-btn-secondary text-xs py-1.5 px-3 tracking-tight"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800/80 py-3.5 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-zinc-100 bg-zinc-800/80 font-medium'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            ))}

            <div className="pt-2 border-t border-zinc-800/80 mt-2">
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              >
                <span>Services Directory</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
