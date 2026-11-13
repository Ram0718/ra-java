import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Terminal,
  Shield,
  LogOut,
  User as UserIcon,
  BookOpen,
  Code2,
  Award,
  FileText,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Play,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Curriculum', href: '/modules', icon: BookOpen },
    { label: 'Compiler', href: '/compiler', icon: Terminal },
    { label: 'Playground', href: '/compiler?slug=playground', icon: Play },
    { label: 'Practice', href: '/practice', icon: Code2 },
    { label: 'Assessments', href: '/assessments', icon: Award },
    { label: 'Guides', href: '/materials', icon: FileText },
    { label: 'Interview Prep', href: '/interview', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FBFBFD]/85 backdrop-blur-xl border-b border-[#E5E5EA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        
        {/* Brand: Apple-grade restrained elegance */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-[#1D1D1F] text-white flex items-center justify-center font-mono font-bold text-[11px] rounded-[6px] tracking-tight shadow-sm transition-transform group-hover:scale-105">
              RA
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-[13px] tracking-tight text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                RA-Java
              </span>
              <span className="text-[10px] text-[#86868B] hidden sm:inline px-1.5 py-0.2 bg-[#F5F5F7] border border-[#E5E5EA] rounded-[4px] font-medium">
                Random Access Java
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links: Clean, spacious typography */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-1 text-[13px] rounded-full flex items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-[#E8F2FD] text-[#0071E3] font-medium'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-[13px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] px-3 py-1 rounded-full transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-medium px-3.5 py-1.2 rounded-full shadow-sm hover:shadow transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Free</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Access status badge: All users have free lifetime access */}
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#EBF9EE] border border-[#34C759]/30 text-[#2FB34F] text-[11px] font-medium px-2.5 py-0.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse"></span>
                Free Lifetime Pass
              </Link>

              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  className="hidden md:inline-flex items-center text-[#1D1D1F] hover:text-[#0071E3] text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] transition-colors"
                >
                  Admin Console
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#F5F5F7] p-1 pr-2 rounded-full border border-[#E5E5EA] text-xs text-[#1D1D1F] shadow-sm transition-all focus:outline-none"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.fullName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] flex items-center justify-center font-bold text-[10px]">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate text-[#1D1D1F] font-medium hidden sm:inline text-xs">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#86868B]" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E5EA] shadow-apple-float rounded-xl py-1.5 z-50 text-[13px] animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-[#E5E5EA]">
                      <p className="font-semibold text-[#1D1D1F] truncate">{user?.fullName}</p>
                      <p className="text-[#86868B] text-[11px] truncate font-mono mt-0.5">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#424245] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <Terminal className="w-4 h-4 text-[#86868B]" />
                      <span>Student Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#424245] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#86868B]" />
                      <span>Account &amp; Security</span>
                    </Link>

                    {user?.role === 'ROLE_ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-[#424245] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border-t border-[#E5E5EA] transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#86868B]" />
                        <span>Platform Administration</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[#FF3B30] hover:bg-[#FFEBEA] border-t border-[#E5E5EA] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#6E6E73] hover:text-[#1D1D1F] rounded-md transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-[#E5E5EA] shadow-apple-card px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* User Status Banner on Mobile */}
          {isAuthenticated && user && (
            <div className="p-3 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white text-[#1D1D1F] border border-[#D2D2D7] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#1D1D1F] truncate">{user.fullName}</p>
                  <p className="text-[10px] text-[#86868B] truncate font-mono">{user.email}</p>
                </div>
              </div>
              <span className="flex-shrink-0 text-[10px] font-medium bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 px-2 py-0.5 rounded-full">
                Free Pass
              </span>
            </div>
          )}

          {/* Navigation Links Grid */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] px-3">
              Explore Curriculum
            </span>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl transition-colors ${
                    active
                      ? 'bg-[#E8F2FD] text-[#0071E3] font-semibold'
                      : 'text-[#424245] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Account & Administration Quick Access */}
          {isAuthenticated ? (
            <div className="pt-2 border-t border-[#E5E5EA] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868B] px-3">
                Workspace &amp; Account
              </span>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#424245] hover:bg-[#F5F5F7] rounded-xl transition-colors"
              >
                <Terminal className="w-4 h-4 text-[#86868B]" />
                <span>Student Dashboard</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#424245] hover:bg-[#F5F5F7] rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4 text-[#86868B]" />
                <span>Account &amp; Security</span>
              </Link>
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#0071E3] hover:bg-[#E8F2FD] rounded-xl transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Platform Administration</span>
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-[#FF3B30] hover:bg-[#FFEBEA] rounded-xl transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#E5E5EA] flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full border border-[#D2D2D7] text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium shadow-apple-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Free Pass</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
