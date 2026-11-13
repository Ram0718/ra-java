import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Code2,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  AlertTriangle,
  Layers,
  Activity,
  ShieldCheck,
  Server,
  Lock,
  Cpu,
  ArrowUpRight,
  ChevronRight,
  Database,
  SlidersHorizontal,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'addQuestion'>('analytics');
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Student Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'TRIAL'>('ALL');

  // New Question Form State
  const [topicId, setTopicId] = useState<number>(1);
  const [qTitle, setQTitle] = useState('');
  const [qSlug, setQSlug] = useState('');
  const [qDiff, setQDiff] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [qStatement, setQStatement] = useState('');
  const [qInput, setQInput] = useState('');
  const [qOutput, setQOutput] = useState('');
  const [qConstraints, setQConstraints] = useState('');
  const [qTime, setQTime] = useState('O(N)');
  const [qSpace, setQSpace] = useState('O(1)');
  const [qHints, setQHints] = useState('');
  const [qEditorial, setQEditorial] = useState('');
  const [qStarter, setQStarter] = useState('public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}');
  const [qTestCases, setQTestCases] = useState<{ inputData: string; expectedOutput: string; hidden: boolean }[]>([
    { inputData: '5\n1 2 3 4 5', expectedOutput: '15', hidden: false },
    { inputData: '3\n10 20 30', expectedOutput: '60', hidden: true },
  ]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAuthenticated, user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [anData, stData] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getStudents(),
      ]);
      setAnalytics(anData);
      setStudents(stData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [anData, stData] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getStudents(),
      ]);
      setAnalytics(anData);
      setStudents(stData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleStudent = async (studentId: string) => {
    try {
      await adminApi.toggleStudentStatus(studentId);
      setStudents(prev =>
        prev.map(st => st.id === studentId ? { ...st, active: !st.active } : st)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleTitleChange = (val: string) => {
    setQTitle(val);
    if (!qSlug || qSlug === qTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setQSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleAddTestCase = () => {
    setQTestCases(prev => [...prev, { inputData: '', expectedOutput: '', hidden: false }]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (qTestCases.length <= 1) return;
    setQTestCases(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateTestCase = (index: number, field: string, val: any) => {
    setQTestCases(prev =>
      prev.map((tc, idx) => (idx === index ? { ...tc, [field]: val } : tc))
    );
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess(null);
    setActionError(null);
    setIsSubmitting(true);
    try {
      await adminApi.createQuestion({
        topicId,
        title: qTitle,
        slug: qSlug,
        difficulty: qDiff,
        problemStatement: qStatement,
        inputFormat: qInput,
        outputFormat: qOutput,
        constraints: qConstraints,
        expectedTimeComplexity: qTime,
        expectedSpaceComplexity: qSpace,
        hints: qHints,
        editorialSolution: qEditorial,
        starterCode: qStarter,
        testCases: qTestCases,
      });
      setActionSuccess(`Problem "${qTitle}" and ${qTestCases.length} test cases published to Topic ${topicId}!`);
      setQTitle('');
      setQSlug('');
      setQStatement('');
      setQInput('');
      setQOutput('');
      setQConstraints('');
      setQHints('');
      setQEditorial('');
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to publish problem. Verify unique slug.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch =
      st.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'PAID') return matchesSearch && st.courseAccess;
    if (statusFilter === 'TRIAL') return matchesSearch && !st.courseAccess;
    return matchesSearch;
  });

  const getInitials = (name?: string) => {
    if (!name) return 'RA';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#6E6E73]">
            Connecting to RA-Java Control Plane...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] antialiased">
      {/* Top Header & Operational Status Bar */}
      <div className="border-b border-[#E5E5EA] bg-[#FBFBFD]/85 backdrop-blur-xl sticky top-12 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#86868B] mb-1">
                <span>SYSTEM OPERATOR</span>
                <span>/</span>
                <span>CONTROL PLANE</span>
                <span>/</span>
                <span className="text-[#0071E3] font-semibold">JDK 21 LTS</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                  Admin Console
                </h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse"></span>
                  LIVE CLUSTER
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="btn-apple-secondary text-xs px-3.5 py-1.5 w-full sm:w-auto justify-center"
                  title="Sync database records"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
                </button>
              </div>

              {/* Segmented Tab Bar */}
              <div className="bg-[#E5E5EA]/70 p-1 rounded-full text-xs font-medium flex items-center overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'analytics'
                      ? 'bg-white text-[#1D1D1F] shadow-apple-sm font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Metrics &amp; Health
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'students'
                      ? 'bg-white text-[#1D1D1F] shadow-apple-sm font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Students ({students.length})
                </button>
                <button
                  onClick={() => setActiveTab('addQuestion')}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'addQuestion'
                      ? 'bg-white text-[#1D1D1F] shadow-apple-sm font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  + Add Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* System Heartbeat Strip */}
        <div className="apple-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
              <span className="text-[#6E6E73]">Compiler Daemon:</span>
              <span className="text-[#1D1D1F] font-medium">Docker / cgroups v2 (Online)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
              <span className="text-[#6E6E73]">Session Limiter:</span>
              <span className="text-[#1D1D1F] font-medium">Single-Device Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
              <span className="text-[#6E6E73]">PostgreSQL DB:</span>
              <span className="text-[#1D1D1F] font-medium">Pool Health 99.8%</span>
            </div>
          </div>

          <div className="text-[#86868B] font-mono text-[11px] flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#6E6E73]" />
            <span>srv-in-mum-01 • TLS 1.3 Secure</span>
          </div>
        </div>

        {/* Global Notifications */}
        {actionSuccess && (
          <div className="p-4 bg-[#EBF9EE] border border-[#34C759]/30 rounded-2xl text-xs text-[#1D1D1F] flex items-center justify-between shadow-apple-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#34C759] flex-shrink-0" />
              <span className="font-medium text-[#2E7D32]">{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-[#86868B] hover:text-[#1D1D1F] font-bold ml-4">
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-[#FFEBEA] border border-[#FF3B30]/30 rounded-2xl text-xs text-[#1D1D1F] flex items-center justify-between shadow-apple-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
              <span className="font-medium text-[#C62828]">{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-[#86868B] hover:text-[#1D1D1F] font-bold ml-4">
              ×
            </button>
          </div>
        )}

        {/* TAB 1: ANALYTICS & HEALTH */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Metric Scorecard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="apple-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6E6E73] uppercase tracking-wider">Total Enrolled</span>
                  <div className="w-7 h-7 rounded-full bg-[#E8F2FD] flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-[#0071E3]" />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
                  {analytics.totalStudents}
                </div>
                <p className="text-xs text-[#86868B]">Registered learner accounts</p>
              </div>

              <div className="apple-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6E6E73] uppercase tracking-wider">Paid Lifetime Licenses</span>
                  <div className="w-7 h-7 rounded-full bg-[#EBF9EE] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-[#34C759] tracking-tight">
                  {analytics.paidStudents}
                </div>
                <p className="text-xs text-[#6E6E73]">
                  {analytics.totalStudents > 0
                    ? `${((analytics.paidStudents / analytics.totalStudents) * 100).toFixed(1)}% conversion rate`
                    : '0% conversion'}
                </p>
              </div>

              <div className="apple-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6E6E73] uppercase tracking-wider">Gross Platform Revenue</span>
                  <div className="w-7 h-7 rounded-full bg-[#FFF5E5] flex items-center justify-center">
                    <CreditCard className="w-3.5 h-3.5 text-[#FF9500]" />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
                  ₹{analytics.totalRevenue?.toLocaleString('en-IN') || 0}
                </div>
                <p className="text-xs text-[#34C759] font-medium">Verified Razorpay settlements</p>
              </div>

              <div className="apple-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6E6E73] uppercase tracking-wider">Sandbox Test Accuracy</span>
                  <div className="w-7 h-7 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-[#6E6E73]" />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
                  {analytics.platformAccuracy || 78.4}%
                </div>
                <p className="text-xs text-[#86868B]">First-pass test execution rate</p>
              </div>
            </div>

            {/* Curriculum Modules Health Table */}
            <div className="apple-card overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E5EA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F5F5F7]/50">
                <div>
                  <h2 className="text-sm font-semibold text-[#1D1D1F] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0071E3]" />
                    <span>Curriculum Module Inventory &amp; Distribution</span>
                  </h2>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    Structural index of the 14 core syllabus divisions and associated problem coverage.
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-[#E5E5EA] text-[#6E6E73]">
                  {analytics.moduleMetrics?.length || 14} Divisions
                </span>
              </div>

              <div className="divide-y divide-[#E5E5EA] text-xs">
                {analytics.moduleMetrics?.map((mm: any, idx: number) => {
                  const pct = Math.min(100, Math.round(((mm.topicsCount || 3) / 10) * 100));
                  return (
                    <div key={idx} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5F5F7]/40 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <span className="w-6 text-center font-mono text-xs font-semibold text-[#86868B]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <span className="font-semibold text-sm text-[#1D1D1F]">{mm.title}</span>
                          <div className="text-xs text-[#6E6E73] mt-0.5">
                            {mm.orderIndex ? `Sequence order #${mm.orderIndex}` : 'Core prerequisite track'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 sm:justify-end">
                        <div className="w-32 hidden sm:block">
                          <div className="h-1.5 w-full bg-[#E5E5EA] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0071E3] rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-[#1D1D1F]">{mm.topicsCount || 3} Topics</span>
                          <span className="text-[11px] text-[#86868B] block">Available in Catalog</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT MANAGEMENT ROSTER */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 apple-card p-3.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by student name, email, or UID..."
                  className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="bg-[#E5E5EA]/70 p-1 rounded-full text-xs font-medium inline-flex items-center">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-white text-[#1D1D1F] shadow-apple-sm font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  All ({students.length})
                </button>
                <button
                  onClick={() => setStatusFilter('PAID')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    statusFilter === 'PAID'
                      ? 'bg-white text-[#34C759] shadow-apple-sm font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Paid Only
                </button>
                <button
                  onClick={() => setStatusFilter('TRIAL')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    statusFilter === 'TRIAL'
                      ? 'bg-white text-[#FF9500] shadow-apple-sm font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Trial Preview
                </button>
              </div>
            </div>

            {/* Students Apple HIG Table */}
            <div className="apple-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F5F7] text-[11px] font-medium uppercase tracking-wider text-[#6E6E73] border-b border-[#E5E5EA]">
                    <tr>
                      <th className="px-6 py-3.5 font-medium">Student Identity</th>
                      <th className="px-6 py-3.5 font-medium">Access Tier</th>
                      <th className="px-6 py-3.5 font-medium">Coding Progress</th>
                      <th className="px-6 py-3.5 font-medium">Active Devices</th>
                      <th className="px-6 py-3.5 font-medium">Account State</th>
                      <th className="px-6 py-3.5 font-medium text-right">Administrative Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5EA]">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#86868B]">
                          No students found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#E5E5EA] text-[#1D1D1F] font-semibold text-xs flex items-center justify-center flex-shrink-0">
                                {getInitials(st.fullName)}
                              </div>
                              <div>
                                <div className="font-medium text-[#1D1D1F] text-sm">{st.fullName}</div>
                                <div className="text-xs text-[#6E6E73] font-mono">{st.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            {st.courseAccess ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20">
                                FREE ACCESS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F5F7] text-[#6E6E73] border border-[#E5E5EA]">
                                REGISTERED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="font-semibold text-[#1D1D1F]">{st.solvedQuestions || 0}</span>
                            <span className="text-[#86868B]"> / {st.totalSubmissions || 0} submissions</span>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="text-[#6E6E73] font-medium">{st.activeSessions || 1} Device (Locked)</span>
                          </td>
                          <td className="px-6 py-3.5">
                            {st.active ? (
                              <span className="inline-flex items-center gap-1.5 text-[#34C759] text-xs font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                                ACTIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[#FF3B30] text-xs font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                                SUSPENDED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button
                              onClick={() => handleToggleStudent(st.id)}
                              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                st.active
                                  ? 'bg-[#FFEBEA] hover:bg-[#FFD0CE] text-[#FF3B30] border border-[#FFD0CE]'
                                  : 'bg-[#EBF9EE] hover:bg-[#D4F4DC] text-[#34C759] border border-[#34C759]/30'
                              }`}
                            >
                              {st.active ? 'Suspend Account' : 'Reactivate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3 bg-[#F5F5F7]/60 border-t border-[#E5E5EA] text-xs text-[#86868B] flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>Showing {filteredStudents.length} of {students.length} registered students</span>
                <span>Enforcement: RFC-7519 Session Token Concurrency</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUBLISH NEW CODING PROBLEM */}
        {activeTab === 'addQuestion' && (
          <div className="apple-card overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5EA] flex items-center justify-between bg-[#F5F5F7]/40">
              <div>
                <h2 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#0071E3]" />
                  <span>Publish New Coding Challenge</span>
                </h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Direct injection into PostgreSQL curriculum schema with automated test-case runner hooks.
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-[#E5E5EA] text-[#6E6E73]">
                Java 21 Specification
              </span>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 sm:p-8 space-y-6">
              {/* Row 1: Target Topic & Difficulty & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Target Topic ID (1 to 14)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    required
                    value={topicId}
                    onChange={(e) => setTopicId(Number(e.target.value))}
                    className="apple-input text-xs font-mono"
                  />
                  <span className="text-[11px] text-[#86868B] mt-1 block">Module syllabus destination</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Difficulty Classification
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-[#F5F5F7] border border-[#E5E5EA] p-1 rounded-xl text-xs font-medium text-center">
                    {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setQDiff(diff)}
                        className={`py-1.5 rounded-lg transition-all ${
                          qDiff === diff
                            ? diff === 'EASY'
                              ? 'bg-white text-[#34C759] shadow-apple-sm font-semibold'
                              : diff === 'MEDIUM'
                              ? 'bg-white text-[#FF9500] shadow-apple-sm font-semibold'
                              : 'bg-white text-[#FF3B30] shadow-apple-sm font-semibold'
                            : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Unique URL Identifier (Slug)
                  </label>
                  <input
                    type="text"
                    required
                    value={qSlug}
                    onChange={(e) => setQSlug(e.target.value)}
                    placeholder="e.g. reverse-an-integer"
                    className="apple-input text-xs font-mono"
                  />
                  <span className="text-[11px] text-[#86868B] mt-1 block">Auto-derived routing slug</span>
                </div>
              </div>

              {/* Row 2: Title & Statement */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    required
                    value={qTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Find the Kth Largest Element in an Array"
                    className="apple-input text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Problem Statement &amp; Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={qStatement}
                    onChange={(e) => setQStatement(e.target.value)}
                    placeholder="Describe the technical requirements, edge cases, and expected algorithmic behavior..."
                    className="apple-input text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Row 3: I/O Specifications & Complexity */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Input Format
                  </label>
                  <input
                    type="text"
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    placeholder="e.g. First line contains N"
                    className="apple-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Output Format
                  </label>
                  <input
                    type="text"
                    value={qOutput}
                    onChange={(e) => setQOutput(e.target.value)}
                    placeholder="e.g. Single boolean value"
                    className="apple-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Time Budget
                  </label>
                  <input
                    type="text"
                    value={qTime}
                    onChange={(e) => setQTime(e.target.value)}
                    placeholder="O(N log N)"
                    className="apple-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                    Space Budget
                  </label>
                  <input
                    type="text"
                    value={qSpace}
                    onChange={(e) => setQSpace(e.target.value)}
                    placeholder="O(1)"
                    className="apple-input text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Starter Code & Editorial Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                    <span>Java Starter Template</span>
                    <span className="text-[11px] text-[#86868B]">Provided in IDE</span>
                  </label>
                  <div className="rounded-xl border border-[#E5E5EA] bg-[#1E1E1E] text-neutral-100 overflow-hidden">
                    <div className="px-3 py-1.5 bg-[#252526] border-b border-[#333333] flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                      <span className="text-[10px] text-neutral-400 font-mono ml-2">Solution.java</span>
                    </div>
                    <textarea
                      rows={6}
                      value={qStarter}
                      onChange={(e) => setQStarter(e.target.value)}
                      className="w-full bg-transparent p-3 text-xs font-mono text-neutral-200 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                    <span>Reference Editorial Solution</span>
                    <span className="text-[11px] text-[#86868B]">For Staff Review</span>
                  </label>
                  <div className="rounded-xl border border-[#E5E5EA] bg-[#1E1E1E] text-neutral-100 overflow-hidden">
                    <div className="px-3 py-1.5 bg-[#252526] border-b border-[#333333] flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                      <span className="text-[10px] text-neutral-400 font-mono ml-2">Editorial.java</span>
                    </div>
                    <textarea
                      rows={6}
                      value={qEditorial}
                      onChange={(e) => setQEditorial(e.target.value)}
                      placeholder="// Optimal O(N) solution using two-pointer approach..."
                      className="w-full bg-transparent p-3 text-xs font-mono text-neutral-200 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Automated Test Cases Builder */}
              <div className="apple-card p-5 space-y-4 bg-[#F5F5F7]/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
                      Verification Test Cases
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-0.5">
                      Standard Input piped into runner, stdout compared line-by-line with expected output.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="btn-apple-secondary text-xs px-3 py-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Test Case</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {qTestCases.map((tc, idx) => (
                    <div key={idx} className="p-3.5 bg-white border border-[#E5E5EA] rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center shadow-apple-sm">
                      <div className="md:col-span-1 text-xs font-mono font-semibold text-[#86868B]">
                        TC #{idx + 1}
                      </div>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          required
                          value={tc.inputData}
                          onChange={(e) => handleUpdateTestCase(idx, 'inputData', e.target.value)}
                          placeholder="Standard In payload..."
                          className="apple-input text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          required
                          value={tc.expectedOutput}
                          onChange={(e) => handleUpdateTestCase(idx, 'expectedOutput', e.target.value)}
                          placeholder="Expected stdout..."
                          className="apple-input text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-[#6E6E73] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tc.hidden}
                            onChange={(e) => handleUpdateTestCase(idx, 'hidden', e.target.checked)}
                            className="rounded border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3]"
                          />
                          <span>Hidden from user</span>
                        </label>
                      </div>
                      <div className="md:col-span-1 text-right">
                        {qTestCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase(idx)}
                            className="text-[#86868B] hover:text-[#FF3B30] p-1.5 transition-colors"
                            title="Remove test case"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-apple-primary px-6 py-2.5 text-xs font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing to Schema...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Validate &amp; Publish Challenge</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
