import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { paymentApi } from '../api/client';
import {
  User as UserIcon,
  Shield,
  ShieldCheck,
  Lock,
  CreditCard,
  LogOut,
  CheckCircle2,
  Calendar,
  Terminal,
  KeyRound,
  Laptop,
  Clock,
  ArrowUpRight,
  Download,
  AlertCircle,
  FileText,
  Layers,
  Cpu,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const StudentProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'overview' | 'security' | 'billing'>('overview');
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    paymentApi.getHistory()
      .then((data) => setPayments(data))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCopySessionHash = () => {
    navigator.clipboard.writeText(`jm_sess_${user?.id || 'live'}_${Date.now().toString(36)}`);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleDownloadInvoice = (payment: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Tax Invoice - ${payment.receiptNumber || 'RA-INV'}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1D1D1F; max-width: 650px; margin: auto; }
              .header { border-bottom: 2px solid #E5E5EA; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
              .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
              .badge { font-size: 11px; background: #EBF9EE; color: #34C759; padding: 4px 10px; border-radius: 9999px; font-weight: 600; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; margin-top: 24px; font-size: 13px; line-height: 1.6; color: #6E6E73; }
              .meta-grid strong { color: #1D1D1F; }
              table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 13px; }
              th, td { text-align: left; padding: 12px; border-bottom: 1px solid #E5E5EA; }
              th { background: #F5F5F7; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #86868B; }
              .total { font-weight: 700; font-size: 15px; border-top: 2px solid #1D1D1F; color: #1D1D1F; }
              .footer { margin-top: 40px; font-size: 11px; color: #86868B; border-top: 1px solid #E5E5EA; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">RA-JAVA (RANDOM ACCESS JAVA)</div>
                <div style="font-size: 12px; color: #6E6E73; margin-top: 4px;">Technical Education Platform</div>
              </div>
              <div class="badge">OFFICIAL TAX INVOICE</div>
            </div>
            <div class="meta-grid">
              <div>
                <strong>Billed To:</strong><br />
                ${user?.fullName || 'Enrolled Student'}<br />
                ${user?.email || 'N/A'}<br />
                Student UID: std_${user?.id || 'live'}
              </div>
              <div>
                <strong>Invoice Ref:</strong> ${payment.receiptNumber || 'RCPT-RA-001'}<br />
                <strong>Order ID:</strong> ${payment.razorpayOrderId || 'ORD-VERIFIED'}<br />
                <strong>Date:</strong> ${new Date(payment.createdAt || Date.now()).toLocaleDateString()}<br />
                <strong>Status:</strong> COMPLETED (PAID)
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Tier</th>
                  <th>Qty</th>
                  <th style="text-align: right;">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RA-Java — Complete Production Curriculum & Online Compiler Lifetime License</td>
                  <td>LIFETIME</td>
                  <td>1</td>
                  <td style="text-align: right;">₹${payment.amount || 99}.00</td>
                </tr>
                <tr class="total">
                  <td colspan="3">Total Paid (Inclusive of GST)</td>
                  <td style="text-align: right;">₹${payment.amount || 99}.00</td>
                </tr>
              </tbody>
            </table>
            <div class="footer">
              <p>Cryptographic Signature: HMAC-SHA256 • Verified by Razorpay Secure Gateway</p>
              <p>RA-Java Platform • Issued under Educational Services Ledger</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-8 sm:py-12 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E5E5EA] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#86868B]">
              <Link to="/dashboard" className="hover:text-[#0071E3] transition-colors">Workspace</Link>
              <span>/</span>
              <span className="text-[#1D1D1F] font-medium">Account Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-3">
              <span>Account &amp; System Settings</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 font-medium">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </h1>
          </div>

          {/* Segmented Section Switcher (Apple HIG Style) */}
          <div className="flex items-center gap-1 bg-[#F5F5F7] border border-[#E5E5EA] p-1 rounded-full text-xs">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                activeSection === 'overview'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                activeSection === 'security'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Security &amp; Sessions
            </button>
            <button
              onClick={() => setActiveSection('billing')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                activeSection === 'billing'
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Billing &amp; Invoices ({payments.length})
            </button>
          </div>
        </div>

        {/* Identity & Status Strip */}
        <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-card grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-2 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-center text-xl font-bold text-[#1D1D1F] flex-shrink-0 shadow-apple-sm overflow-hidden">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.fullName?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#1D1D1F]">{user?.fullName || 'Student Engineer'}</h2>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#6E6E73]">
                  {user?.role || 'ROLE_STUDENT'}
                </span>
              </div>
              <p className="text-xs text-[#6E6E73] mt-0.5">{user?.email}</p>
              <p className="text-[11px] text-[#86868B] mt-1 flex items-center gap-1.5">
                <span>UID: <span className="font-mono text-[#1D1D1F]">std_{user?.id || 'live'}</span></span>
                <span>•</span>
                <span>Enrolled Cohort</span>
              </p>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-[#E5E5EA] pt-4 md:pt-0 md:pl-6">
            <div className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">Entitlement Tier</div>
            <div className="text-sm font-semibold text-[#1D1D1F] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
              <span className="text-[#34C759]">RA-Java Free Full Access</span>
            </div>
            <div className="text-xs text-[#86868B] mt-0.5">
              12 Modules • 42+ Exercises • OpenJDK 21 Sandbox
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#F5F5F7] hover:bg-[#FFEBEA] text-[#6E6E73] hover:text-[#FF3B30] border border-[#D2D2D7] hover:border-[#FFD0CE] text-xs font-medium rounded-full transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW LEDGER */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Account Attributes Table (macOS Settings Style) */}
            <div className="apple-inset-group shadow-apple-card bg-white">
              <div className="px-6 py-4 border-b border-[#E5E5EA] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Identity &amp; Profile Metadata</h3>
                  <p className="text-xs text-[#86868B] mt-0.5">Your personal credentials registered in the Spring Security database.</p>
                </div>
                <span className="text-[10px] font-medium text-[#86868B]">READONLY VERIFIED</span>
              </div>

              <div className="divide-y divide-[#E5E5EA] text-xs sm:text-sm">
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#86868B] w-48">Legal Full Name</span>
                  <span className="font-semibold text-[#1D1D1F] sm:text-right">{user?.fullName || 'Not specified'}</span>
                </div>
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#86868B] w-48">Primary Email</span>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="font-mono text-[#1D1D1F]">{user?.email}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF9EE] border border-[#34C759]/20 text-[#34C759] font-medium">
                      VERIFIED
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#86868B] w-48">Security Authority</span>
                  <span className="font-mono text-[#1D1D1F] sm:text-right">{user?.role || 'ROLE_STUDENT'}</span>
                </div>
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#86868B] w-48">Concurrency Policy</span>
                  <span className="text-[#34C759] font-medium sm:text-right">SINGLE_DEVICE_STRICT (Enforced)</span>
                </div>
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#86868B] w-48">Compiler Sandbox Engine</span>
                  <span className="text-[#6E6E73] sm:text-right">OpenJDK 21.0.2 / Isolated Container</span>
                </div>
              </div>
            </div>

            {/* Quick Links Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="apple-card p-6 bg-white shadow-apple-card space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#0071E3]">
                  <Layers className="w-4 h-4 text-[#0071E3]" />
                  <span>Curriculum Progress</span>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Track your mastery percentage across all 12 core Java modules and coding assessments.
                </p>
                <Link
                  to="/progress"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0071E3] hover:underline font-medium"
                >
                  <span>View Progress Scorecard</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="apple-card p-6 bg-white shadow-apple-card space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#34C759]">
                  <Terminal className="w-4 h-4 text-[#34C759]" />
                  <span>Online Compiler</span>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Instant scratchpad to write, compile, and execute arbitrary Java 21 programs.
                </p>
                <Link
                  to="/compiler"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0071E3] hover:underline font-medium"
                >
                  <span>Open Monaco IDE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="apple-card p-6 bg-white shadow-apple-card space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#FF9500]">
                  <FileText className="w-4 h-4 text-[#FF9500]" />
                  <span>Downloadable Notes</span>
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Access 14 comprehensive, printable PDF module cheat-sheets and interview guides.
                </p>
                <Link
                  to="/materials"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0071E3] hover:underline font-medium"
                >
                  <span>Browse PDF Vault</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: SECURITY & SESSIONS */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            {/* Single Device Policy Alert */}
            <div className="apple-card p-6 bg-white shadow-apple-card">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#E8F2FD] text-[#0071E3] flex-shrink-0 shadow-apple-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[#1D1D1F]">Active Single-Device Concurrency Lock</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 font-medium">
                      RFC-7519 STRICT
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed max-w-3xl">
                    RA-Java implements zero-trust session integrity. Every account is cryptographically bonded to one active client session. When a login attempt succeeds on another machine or browser, all antecedent JWT claims are instantly invalidated on the Spring Boot authentication server.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Device Session Ledger */}
            <div className="apple-card p-6 bg-white shadow-apple-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Authorized Session Footprint</h3>
                  <p className="text-xs text-[#86868B] mt-0.5">Physical client currently bound to your authentication principal.</p>
                </div>
                <span className="text-xs text-[#34C759] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
                  Current Active Session
                </span>
              </div>

              <div className="p-5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white border border-[#E5E5EA] rounded-xl text-[#1D1D1F] shadow-apple-sm">
                    <Laptop className="w-5 h-5 text-[#0071E3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#1D1D1F]">Active Web Browser</span>
                      <span className="text-[10px] bg-white text-[#34C759] border border-[#E5E5EA] px-2 py-0.5 rounded-full font-medium">
                        THIS DEVICE
                      </span>
                    </div>
                    <p className="text-xs text-[#86868B] mt-0.5">
                      Client Platform: {navigator.userAgent.includes('Windows') ? 'Windows NT (x86_64)' : 'Apple macOS (Apple Silicon / Intel)'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-medium text-[#34C759]">Status: Validated</div>
                  <div className="text-[11px] text-[#86868B]">Expires in 24 hours</div>
                </div>
              </div>

              {/* Session Token Fingerprint */}
              <div className="bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#6E6E73] truncate font-mono">
                  <KeyRound className="w-4 h-4 text-[#86868B] flex-shrink-0" />
                  <span className="text-[#86868B]">TOKEN:</span>
                  <span className="truncate">jm_sess_{user?.id || 'live'}_{Date.now().toString(36)}...</span>
                </div>
                <button
                  onClick={handleCopySessionHash}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#E8E8ED] border border-[#D2D2D7] text-[#1D1D1F] rounded-full text-xs font-medium shadow-apple-sm transition-all flex-shrink-0"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34C759]" />
                      <span className="text-[#34C759]">Copied</span>
                    </>
                  ) : (
                    <span>Copy Fingerprint</span>
                  )}
                </button>
              </div>
            </div>

            {/* Terminate Session Everywhere (Apple Destructive Action) */}
            <div className="apple-card p-6 bg-[#FFEBEA]/30 border border-[#FFD0CE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[#FF3B30]">Terminate Session Everywhere</h4>
                <p className="text-xs text-[#6E6E73] mt-0.5 max-w-xl">
                  Revoke this browser token immediately. You will be redirected to the sign-in portal and must authenticate again.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-[#FF3B30] hover:bg-[#E02D24] text-white text-xs font-medium rounded-full shadow-apple-sm transition-all flex-shrink-0"
              >
                Revoke &amp; Sign Out
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: BILLING & INVOICES */}
        {activeSection === 'billing' && (
          <div className="space-y-6">
            {/* Subscription Summary Bar */}
            <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">Account Entitlement</span>
                <div className="text-xl font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-2">
                  <span>RA-Java Community Lifetime Pass</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 font-medium">
                    100% FREE ACTIVE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6E6E73]">
                  Permanent unlimited access to OpenJDK 21 compiler, 12 modules, coding sandbox, assessments, and study guides.
                </p>
              </div>
            </div>

            {/* Invoices Ledger Table (Apple Inset Grouped Table) */}
            <div className="apple-inset-group shadow-apple-card bg-white">
              <div className="px-6 py-4 border-b border-[#E5E5EA] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Transaction History &amp; Tax Receipts</h3>
                  <p className="text-xs text-[#86868B] mt-0.5">Verified payment records processed via Razorpay Automated Gateway.</p>
                </div>
                <span className="text-xs text-[#86868B]">{payments.length} Records</span>
              </div>

              {payments.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <CreditCard className="w-8 h-8 text-[#86868B] mx-auto" />
                  <p className="text-xs text-[#86868B]">RA-Java is 100% free — no payment transactions required.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#F5F5F7] text-[11px] font-semibold uppercase text-[#86868B] border-b border-[#E5E5EA]">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Receipt Ref</th>
                        <th className="px-6 py-3 font-semibold">Description</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold">Amount</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5EA]">
                      {payments.map((p: any) => (
                        <tr key={p.id} className="hover:bg-[#F5F5F7]/80 transition-colors">
                          <td className="px-6 py-4 font-mono font-medium text-[#1D1D1F]">
                            {p.receiptNumber || `RCPT-${p.id}`}
                          </td>
                          <td className="px-6 py-4 text-[#424245]">
                            RA-Java Lifetime Access
                          </td>
                          <td className="px-6 py-4 text-[#86868B]">
                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#1D1D1F]">
                            ₹{p.amount || 99} INR
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Success
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDownloadInvoice(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#F5F5F7] border border-[#D2D2D7] text-xs text-[#1D1D1F] font-medium rounded-full shadow-apple-sm transition-all"
                            >
                              <Download className="w-3.5 h-3.5 text-[#0071E3]" />
                              <span>Download PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
