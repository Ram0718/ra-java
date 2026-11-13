import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If authenticated, automatically redirect to dashboard since everything is free
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex items-center justify-center px-4 py-16 antialiased">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EBF9EE] text-[#34C759] flex items-center justify-center mx-auto shadow-apple-sm">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
            RA-Java is 100% Free
          </h1>
          <p className="text-sm text-[#6E6E73] leading-relaxed">
            All 12 modules, 42+ coding challenges, and the compiler sandbox are completely free with zero fees or payment required.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-sm py-3 px-6 rounded-full shadow-apple-sm transition-all"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
