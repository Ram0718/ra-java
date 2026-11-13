import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, ArrowRight, Lock, Sparkles, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const PricingPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleStartClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  const inclusions = [
    { title: 'Complete Core Java 21 Syllabus', desc: 'All 12 sequenced modules from JVM architecture to multithreading and JDBC' },
    { title: '42+ Master Algorithmic Practice Problems', desc: 'Strict three-tier problems (Easy, Medium, Hard) for every individual topic' },
    { title: 'Online Monaco Sandbox Compiler', desc: 'Unmetered Java compilation and execution in an isolated OpenJDK 21 environment' },
    { title: 'Automated Hidden Test-Case Grading', desc: 'Tests solution efficiency, edge cases, time limits (5s), and memory caps' },
    { title: '14 Downloadable PDF Study Guides', desc: 'Comprehensive offline reference notes with code snippets, syntax, and interview tips' },
    { title: '12 Topic-Wise Timed Assessments', desc: '15-minute exam simulation with instant scoring and detailed question explanations' },
    { title: 'Technical Placement Interview Bank', desc: 'Curated technical interview Q&A repository + mock interview simulation' },
    { title: 'Single Active Device Security', desc: 'Protects account and progress integrity with automated concurrency invalidation' },
    { title: 'Lifetime Community Updates', desc: 'Zero fees, zero monthly renewal costs—100% free forever for all students' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-16 sm:py-24 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Apple-Style Typographic Header */}
        <div className="max-w-2xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF9EE] text-[#34C759] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free Open Access</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight leading-tight">
            Zero Fees. Lifetime Access.
          </h1>
          <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            RA-Java (Random Access Java) is completely free. No subscription traps, no locked modules, no hidden payment walls.
          </p>
        </div>

        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Inclusions & Syllabus Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="apple-inset-group shadow-apple-card p-6 sm:p-8 space-y-6 bg-white">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] pb-3 border-b border-[#E5E5EA]">
                Complete Platform Entitlement Specification
              </h2>

              <div className="space-y-5">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#EBF9EE] text-[#34C759] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-apple-sm">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1D1D1F]">{item.title}</div>
                      <div className="text-xs text-[#6E6E73] leading-normal mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why RA-Java is Free Explainer */}
            <div className="apple-card p-6 bg-white space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0071E3] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#FF3B30]" />
                <span>Our Philosophy: Education for Everyone</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                We believe top-tier Java placement education should be accessible to every student regardless of college background or financial capability. RA-Java provides all modules, compiler resources, coding challenges, and study materials completely free of charge.
              </p>
            </div>

          </div>

          {/* Right Column (5 cols): Apple Store-Style Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <div className="apple-card p-6 sm:p-8 shadow-apple-float bg-white space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA]">
                <div>
                  <span className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">Access Tier</span>
                  <div className="text-base font-semibold text-[#1D1D1F]">RA-Java Full Access</div>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20">
                  100% FREE
                </span>
              </div>

              {/* Price Display */}
              <div className="py-2 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#34C759]">₹0</span>
                  <span className="text-xs text-[#86868B] font-medium">Free Lifetime Access</span>
                </div>
                <p className="text-xs text-[#6E6E73]">
                  All-inclusive curriculum with zero fees. Start practicing immediately.
                </p>
              </div>

              {/* Itemized Specification Breakdown */}
              <div className="py-4 border-y border-[#E5E5EA] space-y-2.5 text-xs">
                <div className="flex justify-between text-[#6E6E73]">
                  <span>12 Core Modules</span>
                  <span className="text-[#34C759] font-medium">Unlocked</span>
                </div>
                <div className="flex justify-between text-[#6E6E73]">
                  <span>Monaco Compiler Execution</span>
                  <span className="text-[#34C759] font-medium">Unlimited</span>
                </div>
                <div className="flex justify-between text-[#6E6E73]">
                  <span>14 PDF Study Handbooks</span>
                  <span className="text-[#34C759] font-medium">Unlocked</span>
                </div>
                <div className="flex justify-between text-[#6E6E73]">
                  <span>Placement Interview Bank</span>
                  <span className="text-[#34C759] font-medium">Unlocked</span>
                </div>
                <div className="flex justify-between text-[#6E6E73]">
                  <span>Single-Device Concurrency Protection</span>
                  <span className="text-[#0071E3] font-medium">Active</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartClick}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-medium text-sm py-3 px-6 rounded-full shadow-apple-sm transition-all"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 border-t border-[#E5E5EA] space-y-2 text-xs text-[#86868B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>No credit card or payment required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Instant student registration</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
