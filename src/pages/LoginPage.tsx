import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/client';
import { Sparkles, AlertCircle, ArrowRight, UserCheck, Lock, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = studentName.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter your name to proceed.');
      return;
    }

    // Auto-derive email if not explicitly provided
    let derivedEmail = studentEmail.trim().toLowerCase();
    if (!derivedEmail) {
      const sanitized = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '');
      derivedEmail = `${sanitized || 'learner'}.${Math.floor(100 + Math.random() * 900)}@rajava.dev`;
    }

    try {
      setIsLoading(true);
      const res = await authApi.googleLogin({
        fullName: trimmedName,
        email: derivedEmail,
        deviceInfo: `${navigator.platform || 'macOS / Windows'} • Web Client`,
        profileImageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
      });

      // Grant full free access automatically
      login(res.token, { ...res.user, courseAccess: true, paymentStatus: 'FREE' });
      navigate(redirectUrl);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Authentication error. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoName = (name: string, email: string) => {
    setStudentName(name);
    setStudentEmail(email);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex items-center justify-center px-4 py-16 antialiased">
      <div className="max-w-md w-full">
        
        {/* Apple ID Style Centered Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 bg-[#1D1D1F] text-white font-mono font-bold flex items-center justify-center rounded-2xl mx-auto shadow-apple-sm text-sm">
            RA
          </div>
          <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">
            Start Learning on RA-Java
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73]">
            Random Access Java • 100% Free Open Platform for All Students
          </p>
        </div>

        {/* Apple Modal Card */}
        <div className="bg-white border border-[#E5E5EA] rounded-2xl p-6 sm:p-8 shadow-apple-float">
          
          {/* Free Badge Banner */}
          <div className="mb-6 p-3 bg-[#EBF9EE] border border-[#34C759]/20 rounded-xl text-xs text-[#2E7D32] flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#34C759] flex-shrink-0" />
            <span>Full Free Access • All 12 Modules, Compiler &amp; Practice Unlocked</span>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 bg-[#FFEBEA] border border-[#FFD0CE] rounded-xl text-[#FF3B30] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                <span>Your Name</span>
                <span className="text-[10px] text-[#0071E3] font-medium">Required</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-[#F5F5F7] focus:bg-white border border-[#D2D2D7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-[#86868B]">Optional</span>
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Optional (auto-generated if empty)"
                className="w-full bg-[#F5F5F7] focus:bg-white border border-[#D2D2D7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-medium text-sm py-3 px-6 rounded-full shadow-apple-sm transition-all mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating Free Session...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Quick Demo Learner Chips */}
            <div className="pt-4 border-t border-[#E5E5EA]">
              <div className="flex items-center justify-between text-xs text-[#86868B] mb-2">
                <span>Quick Fill Student:</span>
                <span className="text-[#0071E3]">Tap to Apply</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoName('Aarav Patel', 'aarav.patel@rajava.dev')}
                  className="text-xs bg-[#F5F5F7] hover:bg-[#E8F2FD] text-[#1D1D1F] hover:text-[#0071E3] px-3 py-2 rounded-xl border border-[#E5E5EA] text-left truncate transition-colors font-medium"
                >
                  • Aarav Patel
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoName('Priya Sharma', 'priya.sharma@rajava.dev')}
                  className="text-xs bg-[#F5F5F7] hover:bg-[#E8F2FD] text-[#1D1D1F] hover:text-[#0071E3] px-3 py-2 rounded-xl border border-[#E5E5EA] text-left truncate transition-colors font-medium"
                >
                  • Priya Sharma
                </button>
              </div>
            </div>
          </form>

          {/* Dedicated Admin Portal Link */}
          <div className="mt-6 pt-4 border-t border-[#E5E5EA] text-center">
            <Link
              to="/admin/login"
              className="text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Platform Operator? Go to Admin Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
