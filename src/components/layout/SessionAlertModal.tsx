import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SessionAlertModal: React.FC = () => {
  const { sessionTerminatedModal, setSessionTerminatedModal } = useAuthStore();
  const navigate = useNavigate();

  if (!sessionTerminatedModal) return null;

  const handleAcknowledge = () => {
    setSessionTerminatedModal(false);
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl border border-[#E5E5EA] max-w-sm w-full p-6 rounded-2xl shadow-apple-modal text-center animate-in zoom-in-95 duration-200">
        
        {/* Apple Squircle Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#FFEBEA] border border-[#FFD0CE] text-[#FF3B30] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-[17px] font-semibold text-[#1D1D1F] tracking-tight mb-2">
          Session Transferred
        </h3>

        <p className="text-[13px] text-[#6E6E73] leading-relaxed mb-6">
          Your account was signed in on another device or browser. To protect your student progress, RA-Java permits only one active session at a time.
        </p>

        <div className="space-y-2">
          <button
            onClick={handleAcknowledge}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-medium text-[14px] py-2.5 px-4 rounded-full shadow-apple-sm transition-all"
          >
            <span>Sign In on This Device</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#86868B]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
          <span>Single-device concurrency security</span>
        </div>
      </div>
    </div>
  );
};
