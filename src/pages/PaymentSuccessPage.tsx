import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, Terminal, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const state = location.state || {
    receiptNumber: 'REC-RA-DEMO',
    transactionReference: 'pay_rzp_demo_success',
    amount: 0.00,
    verifiedAt: new Date().toISOString(),
    paymentMethod: 'FREE COMMUNITY PASS',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-16 sm:py-24 flex items-center justify-center px-4 antialiased">
      <div className="max-w-lg w-full space-y-8">
        
        {/* Apple Style Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF9EE] text-[#34C759] flex items-center justify-center mx-auto mb-3 shadow-apple-sm">
            <Check className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
            Welcome to RA-Java.
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73]">
            Your lifetime student access is active with 100% free curriculum access.
          </p>
        </div>

        {/* Printable Apple Store Receipt Card */}
        <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-float space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#1D1D1F] text-white font-mono font-bold flex items-center justify-center rounded-[6px] text-xs">
                RA
              </div>
              <span className="font-semibold text-xs tracking-wider text-[#1D1D1F] uppercase">
                Official Order Receipt
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 text-[11px] font-medium rounded-full">
              VERIFIED
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-[#86868B]">Student Name:</span>
              <span className="text-[#1D1D1F] font-medium">{user?.fullName || 'Enrolled Student'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868B]">Account Email:</span>
              <span className="text-[#1D1D1F] font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868B]">Receipt Number:</span>
              <span className="text-[#1D1D1F] font-mono">{state.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868B]">Gateway Reference:</span>
              <span className="text-[#1D1D1F] font-mono truncate max-w-[200px]">{state.transactionReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868B]">Payment Gateway:</span>
              <span className="text-[#1D1D1F]">Razorpay ({state.paymentMethod || 'Online'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868B]">Timestamp:</span>
              <span className="text-[#1D1D1F]">{new Date(state.verifiedAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#E5E5EA] text-base font-semibold text-[#1D1D1F]">
              <span>Total Paid:</span>
              <span className="text-[#34C759] font-bold">₹{Number(state.amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E5EA] flex items-center justify-between text-xs">
            <button
              onClick={handlePrint}
              className="text-[#0071E3] hover:underline flex items-center gap-1.5 transition-colors font-medium"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
            <span className="text-xs text-[#86868B] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
              HMAC Authenticated
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-medium text-sm py-3 px-6 rounded-full shadow-apple-sm transition-all"
          >
            <span>Open Student Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/modules"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-sm py-3 px-6 rounded-full transition-all"
          >
            <Terminal className="w-4 h-4 text-[#86868B]" />
            <span>Start Module 01</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
