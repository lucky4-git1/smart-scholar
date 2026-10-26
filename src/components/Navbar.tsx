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
      {/* 1. Top Y2K Editorial Notice Strip (Warm Apricot / Terracotta) */}
      <div className="bg-[#F6AC6D] text-[#0A3D36] border-b border-[#DE8D48] px-4 py-1.5 text-[11px] font-mono font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-bold uppercase tracking-wider bg-[#0A3D36] text-[#F6AC6D] px-1.5 py-0.5 rounded-sm text-[9.5px]">
              REGISTRY v1.2
            </span>
            <span className="hidden sm:inline tracking-tight">
              Independent Academic Journal Trust & Verification Platform • 121 Audit Criteria
            </span>
            <span className="sm:hidden tracking-tight">
              Independent Journal Trust Platform
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10.5px]">
            <span className="hidden md:inline text-[#0A3D36]/80">CROSSREF · DOAJ · OPENALEX</span>
            <Link 
              to="/status" 
              className="font-bold underline hover:text-[#06241F] inline-flex items-center gap-0.5"
            >
              System Status <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Deep Oxford Pine Emerald) */}
      <nav className="bg-[#0A3D36] border-b border-[#072E27] text-[#FAF6EE] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            
            {/* Left: Brand & Desktop Nav Links */}
            <div className="flex items-center gap-8 lg:gap-10">
              {/* Clean Brand Mark without pills or dots */}
              <Link to="/" className="flex items-center gap-2.5 group select-none">
                <div className="w-8 h-8 rounded-sm bg-[#06231E] border border-[#166054] flex items-center justify-center text-[#22D0B9] group-hover:border-[#22D0B9] transition-colors shadow-retro-sm">
                  <ShieldCheck className="w-4 h-4 text-[#22D0B9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-serif font-bold tracking-tight text-[#FAF6EE] group-hover:text-white transition-colors leading-none">
                    Smart Scholars
                  </span>
                  <span className="text-[9.5px] font-mono tracking-widest text-[#22D0B9] uppercase mt-0.5">
                    Integrity System
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-6 text-[13.5px] font-medium tracking-tight">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative py-1 transition-colors ${
                        active
                          ? 'text-[#22D0B9] font-bold after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-[#22D0B9]'
                          : 'text-[#D1E6E2] hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-4">
              {/* Clean Search Input Trigger */}
              <Link
                to="/journal-check"
                className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-sm bg-[#06231E] border border-[#166054] text-[#B8D7D1] hover:border-[#22D0B9] hover:text-white transition-colors"
                title="Search Journal Registry"
              >
                <Search className="w-3.5 h-3.5 text-[#22D0B9]" />
                <span>Search ISSN / DOI</span>
              </Link>

              {/* Audit Journal CTA Button */}
              <Link
                to="/journal-audit"
                className="ss-btn-primary text-xs py-1.5 px-3.5"
              >
                Audit Journal
              </Link>

              {/* User Dropdown / Auth Menu */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 text-xs font-medium text-[#FAF6EE] hover:text-[#22D0B9] transition-colors"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-6 h-6 rounded-sm bg-[#06231E] border border-[#166054] flex items-center justify-center text-[10px] font-mono text-[#22D0B9] font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="hidden md:inline max-w-[120px] truncate">
                      {user.fullName}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#B8D7D1] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF9] border border-[#0A3D36]/20 rounded-md shadow-paper-lg py-1 text-xs z-50 text-[#0A3D36]">
                      <div className="px-4 py-2.5 border-b border-[#0A3D36]/10 bg-[#FAF6EE]">
                        <p className="font-bold text-[#0A3D36] truncate">{user.fullName}</p>
                        <p className="text-[11px] font-mono text-[#4B635E] truncate mt-0.5">{user.email}</p>
                        <p className="text-[10px] font-mono text-[#0A3D36] uppercase tracking-wider font-semibold mt-1">
                          Role: {user.role}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#0A3D36] hover:bg-[#F2E8D8] transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#115E53]" />
                          <span>Research Workspace</span>
                        </Link>

                        <Link
                          to="/institution/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#0A3D36] hover:bg-[#F2E8D8] transition-colors"
                        >
                          <Building2 className="w-3.5 h-3.5 text-[#115E53]" />
                          <span>Institution Watchlist</span>
                        </Link>

                        <Link
                          to="/portfolio/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#0A3D36] hover:bg-[#F2E8D8] transition-colors"
                        >
                          <FolderKanban className="w-3.5 h-3.5 text-[#115E53]" />
                          <span>Portfolio Manager</span>
                        </Link>

                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[#0A3D36] font-bold hover:bg-[#F2E8D8] transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#115E53]" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[#0A3D36]/10">
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
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth/login"
                    className="text-xs font-medium text-[#D1E6E2] hover:text-white transition-colors"
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
                className="lg:hidden p-1 text-[#D1E6E2] hover:text-white transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#072E27] py-3.5 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 text-sm transition-colors ${
                    isActive(link.path)
                      ? 'text-[#22D0B9] font-bold'
                      : 'text-[#D1E6E2] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-[#072E27] mt-2">
                <Link
                  to="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1.5 text-sm text-[#D1E6E2] hover:text-white"
                >
                  <span>Services Directory</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B8D7D1]" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
