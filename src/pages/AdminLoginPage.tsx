import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/client';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, Server, KeyRound, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [adminEmail, setAdminEmail] = useState('admin@rajava.com');
  const [adminPassword, setAdminPassword] = useState('Admin@RAJava2025!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      setIsLoading(true);
      const res = await authApi.adminLogin({
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
      });
      login(res.token, res.user);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid administrator credentials. Access restricted to authorized operators.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCredentials = (email: string, pass: string) => {
    setAdminEmail(email);
    setAdminPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex items-center justify-center px-4 py-16 antialiased">
      <div className="max-w-md w-full">
        
        {/* Apple macOS Server Centered Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 bg-[#1D1D1F] text-white font-mono font-bold flex items-center justify-center rounded-2xl mx-auto shadow-apple-sm text-sm">
            RA
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1D1D1F]/5 border border-[#E5E5EA] text-[11px] font-mono text-[#6E6E73]">
            <Server className="w-3 h-3 text-[#0071E3]" />
            <span>OPERATOR CONTROL PLANE</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">
            RA-Java Administrator Access
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73]">
            Restricted entry point for curriculum management, cluster telemetry, and student moderation.
          </p>
        </div>

        {/* Apple Elevation Card */}
        <div className="bg-white border border-[#E5E5EA] rounded-2xl p-6 sm:p-8 shadow-apple-float">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-[#FFEBEA] border border-[#FFD0CE] rounded-xl text-[#FF3B30] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                <span>Administrator Email</span>
                <span className="text-[10px] text-[#86868B] font-mono">RFC-822</span>
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@rajava.com"
                className="w-full bg-[#F5F5F7] focus:bg-white border border-[#D2D2D7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                <span>Master Passkey</span>
                <span className="text-[10px] text-[#86868B] font-mono">SHA-256</span>
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F5F5F7] focus:bg-white border border-[#D2D2D7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all font-mono"
              />
            </div>

            {/* Quick Fill Credentials Pills */}
            <div className="pt-1">
              <span className="text-[11px] text-[#86868B] block mb-1.5 font-medium">Autofill Verified Operator Persona:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFillCredentials('admin@rajava.com', 'Admin@RAJava2025!')}
                  className="px-2.5 py-1 rounded-full bg-[#F5F5F7] hover:bg-[#E8F2FD] hover:text-[#0071E3] border border-[#E5E5EA] text-[11px] text-[#6E6E73] font-mono transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3 text-[#0071E3]" />
                  <span>admin@rajava.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('admin@javamastery.com', 'Admin@JavaMastery2025!')}
                  className="px-2.5 py-1 rounded-full bg-[#F5F5F7] hover:bg-[#E8F2FD] hover:text-[#0071E3] border border-[#E5E5EA] text-[11px] text-[#6E6E73] font-mono transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3 text-[#86868B]" />
                  <span>Legacy admin</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1D1D1F] hover:bg-[#2D2D2F] active:bg-[#000000] text-white font-medium text-sm py-3 px-6 rounded-full shadow-apple-sm transition-all mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authorizing Security Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#34C759]" />
                  <span>Authenticate Operator Console</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-[#E5E5EA] text-center space-y-2">
            <p className="text-[11px] text-[#86868B]">
              Administrative sessions are cryptographically bound via RFC-7519 with single-operator concurrency enforcement.
            </p>
            <div>
              <Link
                to="/login"
                className="text-xs text-[#0071E3] hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>Switch to Student / Customer Portal</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
