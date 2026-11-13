import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { learningApi } from '../api/client';
import type { CourseModule } from '../types';
import {
  isTopicCompleted,
  isTopicUnlocked,
  getTopicSolvedQuestionsCount,
  isTopicQuestionsCompleted,
  isTopicTheoryRead,
  getCompletedTopics,
  MODULE_DEFINITIONS,
} from '../utils/progressStorage';
import { BookOpen, CheckCircle2, Clock, ArrowRight, RefreshCw, Terminal, Layers, ArrowLeft, FileText, Award, Lock } from 'lucide-react';

export const CourseModulesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      learningApi.getModuleDetails(slug)
        .then((data) => setSelectedModule(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      learningApi.getModules()
        .then((data) => {
          setModules(data);
          setSelectedModule(null);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center text-xs text-[#86868B]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#0071E3]" />
        <span>Loading curriculum specification...</span>
      </div>
    );
  }

  // Detailed Module View (topics list with status)
  if (slug && selectedModule) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <Link
            to="/modules"
            className="inline-flex items-center gap-1.5 text-xs text-[#0071E3] hover:underline transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All 12 Modules</span>
          </Link>

          {/* Module Header Card */}
          <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Module {selectedModule.moduleOrder.toString().padStart(2, '0')}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#6E6E73]">
                {selectedModule.topics?.length || 0} Core Topics
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              {selectedModule.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed max-w-2xl">
              {selectedModule.description}
            </p>
          </div>

          {/* Topics Inset Grouped Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] px-1">
              Topic Roadmap &amp; Assessment Requirements
            </h2>

            <div className="apple-inset-group shadow-apple-card bg-white divide-y divide-[#E5E5EA]">
              {selectedModule.topics?.map((topic: any) => {
                const unlocked = isTopicUnlocked(topic.id);
                const solvedCount = getTopicSolvedQuestionsCount(topic.id);
                const isCompleted = solvedCount === 3;
                const theoryRead = isTopicTheoryRead(topic.id) || topic.materialRead;

                return (
                <div
                  key={topic.id}
                  className={`p-5 sm:p-6 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    unlocked ? 'hover:bg-[#F5F5F7]/80' : 'bg-[#FAFAFC]/60 opacity-85'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#86868B]">
                        Topic {topic.topicOrder.toString().padStart(2, '0')}
                      </span>

                      {!unlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F5F7] text-[#86868B] border border-[#E5E5EA] flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#86868B]" /> Locked
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF5E5] text-[#FF9500] border border-[#FF9500]/20">
                          In Progress ({solvedCount}/3 Solved)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
                      {!unlocked && <Lock className="w-3.5 h-3.5 text-[#86868B]" />}
                      <span>{topic.title}</span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#86868B]">
                      <span>~{topic.estimatedMinutes} mins</span>
                      <span>•</span>
                      {!unlocked ? (
                        <span className="text-[#FF9500] font-medium">
                          Requires 3 coding questions solved in Topic 0{(topic.topicOrder - 1) || 1}
                        </span>
                      ) : (
                        <>
                          <span className={theoryRead ? 'text-[#34C759] font-medium' : 'text-[#86868B]'}>
                            {theoryRead ? 'Theory Completed' : 'Theory Pending'}
                          </span>
                          <span>•</span>
                          <span className={isCompleted ? 'text-[#34C759] font-medium' : 'text-[#86868B]'}>
                            {isCompleted ? '3/3 Exercises Solved' : `${solvedCount}/3 Exercises Solved`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!unlocked ? (
                      <button
                        disabled
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#F5F5F7] text-[#86868B] border border-[#E5E5EA] font-medium text-xs py-2 px-5 rounded-full opacity-60 cursor-not-allowed"
                        title="Solve all 3 coding questions in the previous topic to unlock this topic"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </button>
                    ) : (
                      <Link
                        to={`/topics/${topic.slug}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2 px-5 rounded-full shadow-apple-sm transition-all"
                      >
                        <span>Open Topic</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // All 12 Modules Catalog View
  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
            Curriculum Specification
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            12-Module Core Java Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            From basic memory architectures to thread safety and ACID database transactions.
          </p>
        </div>

        {/* Structured Spec Inset Grouped Section */}
        <div className="apple-inset-group shadow-apple-card bg-white divide-y divide-[#E5E5EA]">
          {modules.map((m) => {
            const def = MODULE_DEFINITIONS.find(md => md.slug === m.slug || md.moduleOrder === m.moduleOrder);
            const completedTopicIds = getCompletedTopics();
            const completedInModule = def ? def.topicIds.filter(tid => completedTopicIds.includes(tid)).length : m.completedTopics;
            const totalInModule = def ? def.topicIds.length : m.totalTopics;
            const percentage = totalInModule > 0 ? Math.round((completedInModule / totalInModule) * 100) : 0;

            return (
            <div
              key={m.id}
              className="p-6 sm:p-7 hover:bg-[#F5F5F7]/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs text-[#86868B]">
                  <span className="font-semibold text-[#1D1D1F]">
                    MODULE {m.moduleOrder.toString().padStart(2, '0')}
                  </span>
                  <span>•</span>
                  <span>{totalInModule} {totalInModule === 1 ? 'Topic' : 'Topics'}</span>
                  <span>•</span>
                  <span>3 Coding Challenges / Topic</span>
                </div>

                <h3 className="text-lg font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full md:w-auto flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E5EA]">
                <div className="text-left sm:text-right">
                  <div className="text-sm font-semibold text-[#1D1D1F]">
                    {percentage}%
                  </div>
                  <div className="text-xs text-[#86868B]">
                    {completedInModule}/{totalInModule} completed
                  </div>
                </div>

                <Link
                  to={`/modules/${m.slug}`}
                  className="inline-flex items-center gap-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs px-4 py-2 rounded-full transition-all"
                >
                  <span>Inspect Topics</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#86868B]" />
                </Link>
              </div>
            </div>
          );
        })}
        </div>

      </div>
    </div>
  );
};
