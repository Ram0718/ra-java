import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { codingApi } from '../api/client';
import { CheckCircle2, XCircle, Clock, Cpu, ArrowRight, Terminal, ArrowLeft, ShieldCheck } from 'lucide-react';

export const SubmissionResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('questionId');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questionId) return;
    codingApi.getTopicQuestions(1).then(() => {
      setLoading(false);
    });
  }, [questionId]);

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5EA] gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
              Audit Record
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Submission Verification Ledger
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Automated grading diagnostics and runtime profile.
            </p>
          </div>

          <Link
            to="/compiler"
            className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-5 rounded-full shadow-apple-sm transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Launch Compiler</span>
          </Link>
        </div>

        {/* Ledger Panel */}
        <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-card space-y-6">
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] pb-3 border-b border-[#E5E5EA]">
            <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
            <span className="font-semibold text-[#1D1D1F]">OpenJDK 21 Sandbox Environment</span>
            <span>•</span>
            <span>5-Second Timeout Protection</span>
          </div>

          <p className="text-sm text-[#424245] leading-relaxed">
            All code submissions are compiled in an isolated Java 21 execution container. When you submit a challenge, results for each test case (runtime, memory usage, and hidden test-case validation) are recorded in the central database.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2.5 px-5 rounded-full transition-all"
            >
              <span>Inspect Dashboard Metrics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/practice"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0071E3] hover:underline font-medium text-xs py-2.5 px-4"
            >
              <span>Browse Algorithmic Questions &rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
