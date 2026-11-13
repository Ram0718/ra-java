import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { codingApi, learningApi } from '../api/client';
import type { QuestionSummary, CourseModule } from '../types';
import {
  isQuestionSolved,
  isTopicUnlocked,
  getTopicLockStatus,
  getTopicSolvedQuestionsCount,
  isTopicQuestionsCompleted,
} from '../utils/progressStorage';
import { Code2, CheckCircle2, ArrowRight, Terminal, RefreshCw, Clock, Filter, Lock } from 'lucide-react';

export const CodingPracticePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const topicIdParam = searchParams.get('topicId');

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(topicIdParam ? Number(topicIdParam) : 1);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learningApi.getModules().then((data) => {
      setModules(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedTopicId) return;
    setLoading(true);
    codingApi.getTopicQuestions(selectedTopicId)
      .then((data) => setQuestions(data))
      .finally(() => setLoading(false));
  }, [selectedTopicId]);

  const filteredQuestions = questions.filter(q => difficultyFilter === 'ALL' || q.difficulty === difficultyFilter);
  const topicLock = selectedTopicId ? getTopicLockStatus(selectedTopicId) : { isLocked: false, requiredTopic: null, solvedCount: 0 };

  const topicList = [
    { id: 1, name: '01. Intro & JVM Architecture' },
    { id: 2, name: '02. Variables & Data Types' },
    { id: 3, name: '03. If-Else Conditionals' },
    { id: 4, name: '04. For Loop Mastery' },
    { id: 5, name: '05. While & Do-While Loops' },
    { id: 6, name: '06. Methods & Recursion' },
    { id: 7, name: '07. Array Algorithms' },
    { id: 8, name: '08. String Internals' },
    { id: 9, name: '09. Polymorphism & OOP' },
    { id: 10, name: '10. Exceptions & Try-Catch' },
    { id: 11, name: '11. HashMap & Collections' },
    { id: 12, name: '12. Stream API & Lambdas' },
    { id: 13, name: '13. Concurrency & Deadlocks' },
    { id: 14, name: '14. JDBC & ACID Transactions' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
            Algorithmic Practice Suite
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            Curated Java Problem Repository
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Strict three-tier progression for every topic. Code solutions in Monaco Editor and verify them against both public and hidden test cases.
          </p>
        </div>

        {/* Filter Controls Bar (Apple Inset Style) */}
        <div className="apple-card p-5 sm:p-6 bg-white shadow-apple-card space-y-4">
          
          {/* Topic Select Pills */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block">
              Filter by Topic:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {topicList.map((t) => {
                const unlocked = isTopicUnlocked(t.id);
                const solved = getTopicSolvedQuestionsCount(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopicId(t.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${
                      selectedTopicId === t.id
                        ? 'bg-[#0071E3] text-white font-medium shadow-apple-sm'
                        : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] border border-[#E5E5EA]'
                    }`}
                  >
                    {!unlocked && <Lock className="w-3 h-3 text-[#86868B]" />}
                    {solved === 3 && <CheckCircle2 className="w-3 h-3 text-[#34C759]" />}
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="pt-3 border-t border-[#E5E5EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#86868B]" />
              <span className="text-xs font-medium text-[#86868B]">Difficulty:</span>
              <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-full border border-[#E5E5EA]">
                {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      difficultyFilter === diff
                        ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[#86868B] text-xs">
              {filteredQuestions.length} Problem{filteredQuestions.length === 1 ? '' : 's'} displayed
            </span>
          </div>

        </div>

        {/* Prerequisite Lock Warning Banner */}
        {topicLock.isLocked && topicLock.requiredTopic && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF8F7] border border-[#FF3B30]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#1D1D1F]">
                  Topic Locked: Prerequisite Challenges Required
                </p>
                <p className="text-xs text-[#6E6E73]">
                  Solve all 3 coding questions in Topic 0{topicLock.requiredTopic.order}: "{topicLock.requiredTopic.title}" ({topicLock.solvedCount}/3 solved) to unlock this practice suite.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTopicId(topicLock.requiredTopic?.id || 1)}
              className="inline-flex items-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium py-2 px-4 rounded-full shadow-apple-sm transition-all whitespace-nowrap"
            >
              <span>Solve Topic 0{topicLock.requiredTopic.order}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Problem Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-[#86868B] space-y-2">
            <RefreshCw className="w-5 h-5 text-[#0071E3] animate-spin mx-auto" />
            <span>Fetching problem specifications...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredQuestions.map((q) => {
              const diffBadge =
                q.difficulty === 'EASY'
                  ? 'text-[#34C759] bg-[#EBF9EE] border-[#34C759]/20'
                  : q.difficulty === 'MEDIUM'
                  ? 'text-[#FF9500] bg-[#FFF5E5] border-[#FF9500]/20'
                  : 'text-[#FF3B30] bg-[#FFEBEA] border-[#FF3B30]/20';

              const isSolved = q.solved || isQuestionSolved(q.slug);

              return (
                <div
                  key={q.id}
                  className={`apple-card p-6 bg-white shadow-apple-card flex flex-col justify-between transition-all group ${
                    topicLock.isLocked ? 'opacity-85' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${diffBadge}`}>
                        {q.difficulty}
                      </span>
                      {topicLock.isLocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[#86868B]">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      ) : isSolved ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[#34C759]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-base font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                      {q.title}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-[#86868B]">
                      <span>Time: {q.expectedTimeComplexity || 'O(N)'}</span>
                      <span>•</span>
                      <span>Space: {q.expectedSpaceComplexity || 'O(1)'}</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    {topicLock.isLocked ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F5F7] text-[#86868B] border border-[#E5E5EA] font-medium text-xs py-2.5 px-4 rounded-full opacity-60 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked (Complete Previous Topic First)</span>
                      </button>
                    ) : (
                      <Link
                        to={`/compiler?slug=${q.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2.5 px-4 rounded-full transition-all"
                      >
                        <Terminal className="w-3.5 h-3.5 text-[#0071E3]" />
                        <span>{isSolved ? 'Review in Compiler' : 'Solve in Compiler'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
