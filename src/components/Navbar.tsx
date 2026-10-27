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
  ExternalLink,
  ArrowUpRight
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <header className="sticky top-0 z-50">
      {/* 1. Top Y2K Editorial Notice Strip (Tuscan Sand / Champagne Ochre) */}
      <div className="bg-[#EBDDCD] text-[#0B192C] border-b border-[#D8C4B0] px-3 sm:px-4 py-1.5 text-[11px] font-mono font-medium">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
            <span className="font-bold uppercase tracking-wider bg-[#0B192C] text-[#E06B43] px-1.5 py-0.5 rounded-sm text-[9.5px] flex-shrink-0">
              REGISTRY v1.2
            </span>
            <span className="hidden sm:inline tracking-tight truncate">
              Independent Academic Journal Trust & Verification Platform • 121 Audit Criteria
            </span>
            <span className="sm:hidden tracking-tight truncate">
              Journal Trust Platform
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10.5px] flex-shrink-0">
            <span className="hidden md:inline text-[#0B192C]/80 font-semibold">CROSSREF · DOAJ · OPENALEX</span>
            <Link 
              to="/status" 
              className="font-bold underline text-[#0B192C] hover:text-[#E06B43] inline-flex items-center gap-0.5 transition-colors"
            >
              Status <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Deep Midnight Prussian Navy) */}
      <nav className="bg-[#0B192C] border-b border-[#070F1A] text-[#FAF7F2] shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-6">
            
            {/* Left: Brand Mark (Clean, No Tagline) */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group select-none flex-shrink-0">
              <div className="w-8 h-8 rounded-sm bg-[#070F1A] border border-[#162E4D] flex items-center justify-center text-[#E06B43] group-hover:border-[#E06B43] transition-colors shadow-retro-sm">
                <ShieldCheck className="w-4 h-4 text-[#E06B43]" />
              </div>
              <span className="text-[17px] font-serif font-bold tracking-tight text-[#FAF7F2] group-hover:text-white transition-colors">
                Smart Scholars
              </span>
            </Link>

            {/* Center: Desktop Navigation Links (Evenly Spaced & Clean Baseline Alignment) */}
            <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-[13.5px] font-medium tracking-tight h-full">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`h-full flex items-center px-1 border-b-[2px] transition-colors whitespace-nowrap ${
                      active
                        ? 'text-[#E06B43] font-bold border-[#E06B43]'
                        : 'text-[#C4D3E5] hover:text-white border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right: Header Controls */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* Search Trigger */}
              <Link
                to="/journal-check"
                className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-sm bg-[#070F1A] border border-[#162E4D] text-[#C4D3E5] hover:border-[#E06B43] hover:text-white transition-colors"
                title="Search Journal Registry"
              >
                <Search className="w-3.5 h-3.5 text-[#E06B43]" />
                <span>Search</span>
              </Link>

              {/* Audit Journal CTA Button */}
              <Link
                to="/journal-audit"
                className="ss-btn-primary text-xs py-1.5 px-3 sm:px-3.5 whitespace-nowrap font-bold"
              >
                Audit Journal
              </Link>

              {/* User Menu / Auth */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 text-xs font-medium text-[#FAF7F2] hover:text-[#E06B43] transition-colors"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-6 h-6 rounded-sm bg-[#070F1A] border border-[#162E4D] flex items-center justify-center text-[10px] font-mono text-[#E06B43] font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="hidden xl:inline max-w-[110px] truncate">
                      {user.fullName}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#C4D3E5] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border-2 border-[#0B192C] rounded-sm shadow-retro py-1 text-xs z-50 text-[#0B192C]">
                      <div className="px-4 py-2.5 border-b border-[#0B192C]/15 bg-[#FAF7F2]">
                        <p className="font-bold text-[#0B192C] truncate">{user.fullName}</p>
                        <p className="text-[11px] font-mono text-[#475E79] truncate mt-0.5">{user.email}</p>
                        <p className="text-[10px] font-mono text-[#0B192C] uppercase tracking-wider font-semibold mt-1">
                          Role: {user.role}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#0B192C] hover:bg-[#EBDDCD]/40 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#E06B43]" />
                          <span>Research Workspace</span>
                        </Link>

                        <Link
                          to="/institution/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#0B192C] hover:bg-[#EBDDCD]/40 transition-colors"
                        >
                          <Building2 className="w-3.5 h-3.5 text-[#E06B43]" />
                          <span>Institution Watchlist</span>
                        </Link>

                        <Link
                          to="/portfolio/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#0B192C] hover:bg-[#EBDDCD]/40 transition-colors"
                        >
                          <FolderKanban className="w-3.5 h-3.5 text-[#E06B43]" />
                          <span>Portfolio Manager</span>
                        </Link>

                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[#0B192C] font-bold hover:bg-[#EBDDCD]/40 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#E06B43]" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[#0B192C]/15">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-700 hover:bg-rose-50 transition-colors text-left font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    to="/auth/login"
                    className="text-xs font-medium text-[#C4D3E5] hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="ss-btn-secondary text-xs py-1.5 px-2.5 sm:px-3"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-[#C4D3E5] hover:text-white hover:bg-[#070F1A] rounded-sm transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer with Responsive Left Border Active Indicator */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#070F1A] py-3 space-y-1 bg-[#0B192C]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 px-3 text-sm transition-colors border-l-4 ${
                    isActive(link.path)
                      ? 'border-[#E06B43] text-[#E06B43] font-bold bg-[#070F1A]'
                      : 'border-transparent text-[#C4D3E5] hover:text-white hover:bg-[#070F1A]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-[#070F1A] mt-2 px-3">
                <Link
                  to="/services"
                  className="flex items-center justify-between py-2 text-sm text-[#C4D3E5] hover:text-white"
                >
                  <span>Services Directory</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C4D3E5]" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
