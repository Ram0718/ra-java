import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/client';
import type { DashboardStats } from '../types';
import { getLocalDashboardStats } from '../utils/progressStorage';
import { Award, CheckCircle2, Flame, TrendingUp, Clock, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProgressDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(() => getLocalDashboardStats());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dashboardApi.getSummary()
      .then((data) => setStats(data))
      .catch(() => {
        // Fallback to locally tracked stats
        setStats(getLocalDashboardStats());
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center text-xs text-[#86868B]">
        Loading analytics metrics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5EA] gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
              Curriculum Metrics
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Curriculum Progress Audit
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Metrics calculated directly from database submission records and topic completions.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2 px-4 rounded-full transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#86868B]" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* 3 Metric Score Cards (Apple Fitness / Summary Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="apple-card p-6 bg-white shadow-apple-card text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-semibold text-[#34C759] tracking-tight">{stats.coreJavaCompletionPercentage}%</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Core Java Complete</div>
            <p className="text-xs text-[#86868B]">{stats.completedTopics} of {stats.totalTopics} Topics Verified</p>
          </div>

          <div className="apple-card p-6 bg-white shadow-apple-card text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-semibold text-[#0071E3] tracking-tight">{stats.codingAccuracy}%</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Compiler Accuracy</div>
            <p className="text-xs text-[#86868B]">{stats.solvedQuestions} Solved / {stats.totalSubmissions} Submissions</p>
          </div>

          <div className="apple-card p-6 bg-white shadow-apple-card text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-semibold text-[#FF9500] tracking-tight">{stats.currentLearningStreakDays} Days</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Continuous Streak</div>
            <p className="text-xs text-[#86868B]">Consecutive days active</p>
          </div>
        </div>

        {/* Module Breakdown Inset Section */}
        <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
              Module-by-Module Completion Audit
            </h2>
            <span className="text-xs text-[#86868B]">12 Total Modules</span>
          </div>

          <div className="space-y-3">
            {stats.moduleProgressList.map((m) => (
              <div key={m.moduleId} className="p-4 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-[#1D1D1F]">{m.moduleOrder}. {m.title}</span>
                  <span className="text-xs text-[#6E6E73]">{m.completedTopics}/{m.totalTopics} topics ({m.completionPercentage}%)</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E5E5EA]">
                  <div
                    className={`h-full transition-all duration-500 ${m.completionPercentage === 100 ? 'bg-[#34C759]' : 'bg-[#0071E3]'}`}
                    style={{ width: `${m.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
