import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { dashboardApi } from '../api/client';
import type { DashboardStats } from '../types';
import {
  getLocalDashboardStats,
  getSolvedQuestions,
  getCompletedTopics,
} from '../utils/progressStorage';
import {
  Flame,
  Award,
  BookOpen,
  Code2,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  Clock,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(() =>
    getLocalDashboardStats(user?.fullName || 'Student', user?.email || 'student@rajava.dev')
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setErrorMsg(null);
      const data = await dashboardApi.getSummary();
      const localSolved = getSolvedQuestions();
      const localCompleted = getCompletedTopics();
      const totalTopics = data.totalTopics || 14;
      const completedCount = Math.max(data.completedTopics, localCompleted.length);
      const alignedPct = Math.min(100, Math.round((completedCount / totalTopics) * 100));

      data.solvedQuestions = Math.max(data.solvedQuestions, localSolved.length);
      data.completedTopics = completedCount;
      data.totalTopics = totalTopics;
      data.pendingTopics = Math.max(0, totalTopics - completedCount);
      data.coreJavaCompletionPercentage = alignedPct;
      data.overallProgressPercentage = alignedPct;
      setStats(data);
    } catch (err: any) {
      if (err.response?.status === 402) {
        navigate('/pricing');
      } else {
        // Gracefully use local progress stats so dashboard never crashes
        const localStats = getLocalDashboardStats(
          user?.fullName || 'Student',
          user?.email || 'student@rajava.dev'
        );
        setStats(localStats);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/dashboard');
      return;
    }
    fetchStats();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-[#86868B] animate-spin mx-auto" />
          <p className="text-xs text-[#86868B]">Loading your student workspace...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !stats) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-4">
        <div className="apple-card p-8 max-w-sm w-full text-center space-y-4 bg-white">
          <p className="text-sm text-[#FF3B30]">{errorMsg || 'Unable to retrieve workspace data'}</p>
          <button
            onClick={fetchStats}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-4 rounded-full shadow-apple-sm transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-8 sm:py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. TOP EXECUTIVE HEADER BAR */}
        <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                Active Student Session
              </span>
              <span className="text-[#86868B]">•</span>
              <span className="text-[#6E6E73]">{user?.email}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Welcome back, {stats.studentName}.
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Track your Core Java curriculum progress, compiler activity, and placement exam readiness.
            </p>
          </div>

          {/* Right Status Counters (Apple Style Widgets) */}
          <div className="flex items-center gap-4 bg-[#F5F5F7] border border-[#E5E5EA] px-5 py-3 rounded-2xl shadow-apple-sm">
            {/* Streak */}
            <div className="flex items-center gap-2.5 pr-4 border-r border-[#E5E5EA]">
              <div className="w-8 h-8 rounded-full bg-[#FFF5E5] text-[#FF9500] flex items-center justify-center shadow-apple-sm">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1D1D1F]">
                  {stats.currentLearningStreakDays} {stats.currentLearningStreakDays === 1 ? 'Day' : 'Days'}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#86868B]">Daily Streak</div>
              </div>
            </div>

            {/* Overall Syllabus Progress */}
            <div>
              <div className="text-sm font-semibold text-[#34C759]">
                {stats.coreJavaCompletionPercentage}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[#86868B]">Mastery</div>
            </div>
          </div>
        </div>

        {/* 2. TABULAR METRICS SCORECARD (Apple Summary Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="apple-card p-5 sm:p-6 bg-white space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
              Solved Challenges
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">{stats.solvedQuestions}</span>
              <span className="text-xs text-[#86868B]">/ {stats.totalCodingQuestions}</span>
            </div>
            <div className="w-full bg-[#F5F5F7] h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#34C759] h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.totalCodingQuestions > 0 ? (stats.solvedQuestions / stats.totalCodingQuestions) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="apple-card p-5 sm:p-6 bg-white space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
              Compiler Accuracy
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-[#0071E3] tracking-tight">{stats.codingAccuracy}%</span>
              <span className="text-xs text-[#86868B]">first-pass</span>
            </div>
            <p className="text-xs text-[#86868B] mt-1">
              {stats.totalSubmissions} evaluation executions
            </p>
          </div>

          <div className="apple-card p-5 sm:p-6 bg-white space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
              Topics Mastered
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">{stats.completedTopics}</span>
              <span className="text-xs text-[#86868B]">/ {stats.totalTopics}</span>
            </div>
            <div className="w-full bg-[#F5F5F7] h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#0071E3] h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.totalTopics > 0 ? (stats.completedTopics / stats.totalTopics) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#86868B] mt-1">
              {stats.pendingTopics} topics in syllabus
            </p>
          </div>

          <div className="apple-card p-5 sm:p-6 bg-white space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
              Study Handbooks
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold text-[#FF9500] tracking-tight">{stats.downloadedStudyMaterialsCount}</span>
              <span className="text-xs text-[#86868B]">/ 14 offline</span>
            </div>
            <p className="text-xs mt-1">
              <Link to="/materials" className="text-[#0071E3] hover:underline font-medium">
                Browse PDF vault &rarr;
              </Link>
            </p>
          </div>

        </div>

        {/* 3. ASYMMETRIC MAIN CONTENT (8 cols + 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Focus Objective + Real-Time Activity Log */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Target Objective Unit */}
            {stats.recommendedNextTopic && (
              <div className="apple-card p-6 sm:p-8 bg-white space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
                  <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#0071E3]"></span>
                    <span>Recommended Objective</span>
                    <span className="text-[#86868B]">•</span>
                    <span className="text-[#1D1D1F]">{stats.recommendedNextTopic.moduleTitle}</span>
                  </div>
                  <span className="text-xs text-[#86868B]">
                    ~{stats.recommendedNextTopic.estimatedMinutes} mins
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1D1D1F]">
                      {stats.recommendedNextTopic.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 leading-relaxed">
                      Complete topic notes, evaluate the coding problems in the compiler, and pass the timed assessment.
                    </p>
                  </div>

                  <Link
                    to={`/topics/${stats.recommendedNextTopic.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-5 rounded-full shadow-apple-sm transition-all flex-shrink-0"
                  >
                    <span>Resume Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Real-Time Student Activity Stream */}
            <div className="apple-card p-6 sm:p-8 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0071E3]" />
                  <span>Real-Time Activity Audit</span>
                </h3>
                <span className="text-xs text-[#86868B]">Live Stream</span>
              </div>

              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                <div className="space-y-2.5 text-xs">
                  {stats.recentActivities.slice(0, 7).map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]"
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          act.activityType === 'CODE_SUBMIT' ? 'bg-[#34C759]' :
                          act.activityType === 'PAYMENT_SUCCESS' ? 'bg-[#FF9500]' : 'bg-[#0071E3]'
                        }`} />
                        <span className="text-[#1D1D1F] font-medium truncate">{act.description}</span>
                      </div>
                      <span className="text-xs text-[#86868B] flex-shrink-0">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#86868B] py-6 text-center">
                  No previous activity recorded. Begin by solving practice challenges!
                </p>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Master Module Index + Fast Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Module Completion Index */}
            <div className="apple-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                  Curriculum Modules (12)
                </h3>
                <Link to="/modules" className="text-xs font-medium text-[#0071E3] hover:underline">
                  All &rarr;
                </Link>
              </div>

              <div className="space-y-1.5">
                {stats.moduleProgressList && stats.moduleProgressList.map((m) => (
                  <Link
                    key={m.moduleId}
                    to={`/modules/${m.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors group"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="text-xs font-medium text-[#1D1D1F] group-hover:text-[#0071E3] truncate">
                        {m.moduleOrder}. {m.title}
                      </div>
                      <div className="text-[11px] text-[#86868B]">
                        {m.completedTopics}/{m.totalTopics} topics
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-xs font-medium ${
                        m.completionPercentage === 100 ? 'text-[#34C759]' : 'text-[#86868B]'
                      }`}>
                        {m.completionPercentage}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Developer Shortcuts (macOS Settings Style) */}
            <div className="apple-card p-6 bg-white space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-3">
                Quick Shortcuts
              </div>

              <Link
                to="/compiler"
                className="w-full p-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-xs font-medium text-[#1D1D1F] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-[#0071E3]" />
                  <span>Monaco Java Sandbox</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
              </Link>

              <Link
                to="/practice"
                className="w-full p-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-xs font-medium text-[#1D1D1F] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-[#34C759]" />
                  <span>Algorithmic Problem Set</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
              </Link>

              <Link
                to="/materials"
                className="w-full p-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-xs font-medium text-[#1D1D1F] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#FF9500]" />
                  <span>Downloadable PDF Guides</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
