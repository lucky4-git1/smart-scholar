import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Menu, 
  X, 
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0A0908]/95 backdrop-blur-md border-b border-[#241F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-[#191613] border border-[#3E342B] flex items-center justify-center text-[#E3BC9A] shadow-tactile group-hover:border-[#E3BC9A]/60 transition-colors">
                <ShieldCheck className="w-5 h-5 text-[#E3BC9A]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg tracking-tight text-[#FAF7F2] leading-none">
                  Smart Scholars
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9E9486] leading-tight">
                  Journal Trust Rating
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/journal-check"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/journal-check')
                    ? 'text-[#E3BC9A] bg-[#191613]'
                    : 'text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#151310]'
                }`}
              >
                Journal Check
              </Link>
              <Link
                to="/journal-audit"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/journal-audit')
                    ? 'text-[#E3BC9A] bg-[#191613]'
                    : 'text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#151310]'
                }`}
              >
                Journal Audit
              </Link>
              <Link
                to="/doi-doctor"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/doi-doctor')
                    ? 'text-[#E3BC9A] bg-[#191613]'
                    : 'text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#151310]'
                }`}
              >
                DOI Doctor
              </Link>
              <Link
                to="/indexing/directory"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/indexing/directory')
                    ? 'text-[#E3BC9A] bg-[#191613]'
                    : 'text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#151310]'
                }`}
              >
                GetIndexed
              </Link>
              <Link
                to="/institution/dashboard"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/institution/dashboard')
                    ? 'text-[#E3BC9A] bg-[#191613]'
                    : 'text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#151310]'
                }`}
              >
                Institution Desk
              </Link>
              <Link
                to="/portfolio/dashboard"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/portfolio/dashboard')
                    ? 'text-[#E3BC9A] bg-[#191613]'
                    : 'text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#151310]'
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
              className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded bg-[#161411] border border-[#2B2520] text-[#A89F91] hover:border-[#3E362F] hover:text-[#FAF7F2] transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#E3BC9A]" />
              <span>Search ISSN / DOI...</span>
            </Link>

            {/* Start Audit CTA */}
            <Link
              to="/journal-audit"
              className="ss-btn-primary text-xs py-1.5 px-3.5"
            >
              <span>Audit a Journal</span>
            </Link>

            {/* Auth User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#161411] border border-[#2B2520] text-sm text-[#FAF7F2] hover:border-[#3D352D]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E3BC9A]/20 border border-[#E3BC9A]/40 flex items-center justify-center text-xs font-mono text-[#E3BC9A]">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-xs font-medium max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161411] border border-[#2E2822] rounded-lg shadow-xl py-1 text-sm z-50">
                    <div className="px-4 py-2 border-b border-[#241F1A]">
                      <p className="text-xs font-semibold text-[#FAF7F2] truncate">{user.fullName}</p>
                      <p className="text-[11px] font-mono text-[#9E9486] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#221D18] text-[#E3BC9A] border border-[#3E342B]">
                        ROLE: {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#1E1A16]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#E3BC9A]" />
                      My Workspace
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#E3BC9A] hover:bg-[#1E1A16]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#E3BC9A]" />
                        Admin Console
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-[#1E1A16] border-t border-[#241F1A]"
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
                  className="text-xs font-medium px-3 py-1.5 text-[#C7BFB3] hover:text-[#FAF7F2]"
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
              className="lg:hidden p-1.5 rounded-md text-[#A89F91] hover:text-[#FAF7F2] hover:bg-[#1C1814]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#241F1A] py-3 space-y-1">
            <Link
              to="/journal-check"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#161411]"
            >
              Journal Check
            </Link>
            <Link
              to="/journal-audit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#161411]"
            >
              Journal Audit
            </Link>
            <Link
              to="/doi-doctor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#161411]"
            >
              DOI Doctor
            </Link>
            <Link
              to="/indexing/directory"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#161411]"
            >
              GetIndexed
            </Link>
            <Link
              to="/institution/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#161411]"
            >
              Institution Desk
            </Link>
            <Link
              to="/portfolio/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#161411]"
            >
              Portfolio Console
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#C7BFB3] hover:text-[#FAF7F2] hover:bg-[#161411]"
            >
              Services Directory
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
