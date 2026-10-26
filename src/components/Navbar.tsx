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
    <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Desktop Nav Links */}
          <div className="flex items-center gap-8 lg:gap-10">
            {/* Clean Logo without live tag or tagline */}
            <Link to="/" className="flex items-center gap-2.5 group select-none">
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.015em] text-zinc-100 group-hover:text-white transition-colors">
                Smart Scholars
              </span>
            </Link>

            {/* Desktop Navigation Links - Clean, Typographic, No Pills */}
            <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium tracking-tight">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-1 transition-colors ${
                      active
                        ? 'text-white font-medium after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-emerald-400'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-5">
            {/* Clean Text-based Search */}
            <Link
              to="/journal-check"
              className="hidden md:flex items-center gap-2 text-[13px] text-zinc-400 hover:text-zinc-100 transition-colors"
              title="Search Journal Registry"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Search</span>
            </Link>

            {/* Audit Journal CTA */}
            <Link
              to="/journal-audit"
              className="ss-btn-primary text-xs font-medium py-1.5 px-3.5 tracking-tight"
            >
              Audit Journal
            </Link>

            {/* User Dropdown / Auth Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-medium text-zinc-200 hover:text-white transition-colors"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-emerald-400 font-semibold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#121215] border border-zinc-800 rounded-lg shadow-xl py-1 text-xs z-50">
                    <div className="px-4 py-2.5 border-b border-zinc-800">
                      <p className="font-semibold text-zinc-100 truncate">{user.fullName}</p>
                      <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">{user.email}</p>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                        Role: {user.role}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Research Workspace</span>
                      </Link>

                      <Link
                        to="/institution/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Institution Watchlist</span>
                      </Link>

                      <Link
                        to="/portfolio/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
                      >
                        <FolderKanban className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Portfolio Manager</span>
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-emerald-400 hover:bg-zinc-800/50 font-medium transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-zinc-800/50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-1.5 text-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-zinc-800 mt-2">
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-1.5 text-sm text-zinc-400 hover:text-zinc-100"
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
