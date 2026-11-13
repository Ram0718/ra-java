import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { learningApi, materialApi } from '../api/client';
import type { TopicDetails, Subtopic } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  FileText,
  Clock,
  ArrowRight,
  Award,
  RefreshCw,
  Download,
  Check,
  ArrowLeft,
  Terminal,
  Printer,
  Copy,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import {
  isTopicCompleted,
  markTopicCompleted,
  isTopicUnlocked,
  getTopicLockStatus,
  getTopicSolvedQuestionsCount,
  isTopicQuestionsCompleted,
  isTopicTheoryRead,
  markTopicTheoryRead,
  isTopicQuizCompleted,
  markTopicQuizCompleted,
  getTopicQuizScore,
  getTopicDefinitionBySlug,
} from '../utils/progressStorage';
import {
  getTopicStudyNote,
  generateTopicMarkdown,
  generateTopicPrintableHtml,
  type TopicStudyNote,
} from '../data/topicNotesData';
import { downloadAsMarkdown, printNotesAsPdf } from '../utils/noteDownloader';

export const TopicLearningPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<TopicDetails | null>(null);
  const topicDef = slug ? getTopicDefinitionBySlug(slug) : undefined;
  const [activeTab, setActiveTab] = useState<'concepts' | 'interview' | 'code' | 'pitfalls' | 'quiz'>('concepts');
  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [readMarked, setReadMarked] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Retrieve rich study note from static repository
  const studyNote: TopicStudyNote | undefined = slug ? getTopicStudyNote(slug) : undefined;
  const hasQuiz = Boolean(studyNote?.quiz && studyNote.quiz.length > 0);
  const isQuizTopic = Boolean(topicDef?.requiresQuiz || hasQuiz);

  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  useEffect(() => {
    if (topicDef) {
      setQuizSubmitted(isTopicQuizCompleted(topicDef.id));
      setQuizScore(getTopicQuizScore(topicDef.id));
    }
  }, [topicDef]);

  const handleSelectQuizOption = (qId: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!studyNote?.quiz || studyNote.quiz.length === 0) return;
    let correct = 0;
    studyNote.quiz.forEach(q => {
      if (selectedQuizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const scorePct = Math.round((correct / studyNote.quiz.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);
    if (scorePct >= 60 && topicDef) {
      markTopicQuizCompleted(topicDef.id, scorePct);
      setReadMarked(true);
    }
  };

  const handleResetQuiz = () => {
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const theoryReadLocally = isTopicTheoryRead(slug);
    setReadMarked(theoryReadLocally);

    learningApi.getTopicDetails(slug)
      .then((data) => {
        setTopic(data);
        const isCompletedLocally = isTopicTheoryRead(data.id) || theoryReadLocally;
        setReadMarked(data.materialRead || isCompletedLocally);
        if (data.subtopics && data.subtopics.length > 0) {
          setActiveSubtopic(data.subtopics[0]);
        }
      })
      .catch((err) => {
        console.warn('Backend getTopicDetails failed, using offline study notes:', err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Track active time spent every 30 seconds
  useEffect(() => {
    if (!topic || !isAuthenticated) return;
    const interval = setInterval(() => {
      learningApi.trackTime(topic.id, 30).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [topic, isAuthenticated]);

  const handleMarkRead = async () => {
    const tid = topic?.id || studyNote?.id || (slug ? getTopicSolvedQuestionsCount(slug) : 1);
    markTopicTheoryRead(slug || tid);
    if (topic?.id) markTopicTheoryRead(topic.id);
    if (studyNote?.id) markTopicTheoryRead(studyNote.id);
    setReadMarked(true);
    try {
      if (isAuthenticated && topic) {
        await learningApi.markRead(topic.id);
      }
    } catch (err) {
      console.warn('Backend markRead failed, progress saved locally:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!studyNote) return;
    const markdownContent = generateTopicMarkdown(studyNote);
    downloadAsMarkdown(`${studyNote.slug}-interview-notes`, markdownContent);
  };

  const handlePrintPdf = () => {
    if (!studyNote) return;
    const printableHtml = generateTopicPrintableHtml(studyNote);
    printNotesAsPdf(studyNote.title, printableHtml);
  };

  const handleCopyCode = () => {
    if (!studyNote?.annotatedProgram.code) return;
    navigator.clipboard.writeText(studyNote.annotatedProgram.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading && !studyNote) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center text-xs text-[#86868B]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#0071E3]" />
        <span>Loading lesson notes and syllabus...</span>
      </div>
    );
  }

  // Fallback metadata if backend is offline
  const pageTitle = studyNote?.title || topic?.title || 'Topic Study Notes';
  const moduleTitle = studyNote?.moduleTitle || topic?.moduleTitle || 'Core Java';
  const moduleSlug = topic?.moduleSlug || 'java-fundamentals';
  const topicId = topic?.id || studyNote?.id || 1;

  // Prerequisite 3-question completion lock status
  const lockStatus = slug ? getTopicLockStatus(slug) : { isLocked: false, requiredTopic: null, solvedCount: 0 };
  const solvedCount = slug ? getTopicSolvedQuestionsCount(slug) : 0;

  // Render Lock Gate if previous topic's 3 coding questions are incomplete
  if (lockStatus.isLocked && lockStatus.requiredTopic) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-16 sm:py-24 antialiased">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-[#F5F5F7] border border-[#E5E5EA] rounded-full flex items-center justify-center mx-auto shadow-apple-sm text-[#86868B]">
            <Lock className="w-8 h-8 text-[#0071E3]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF9500] px-3 py-1 rounded-full bg-[#FFF5E5] border border-[#FF9500]/25 inline-block">
              Prerequisite Coding Requirement
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Topic Locked: {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
              To unlock this topic, you must solve all 3 coding challenges in{' '}
              <strong className="text-[#1D1D1F]">
                Topic 0{lockStatus.requiredTopic.order}: {lockStatus.requiredTopic.title}
              </strong>.
            </p>
          </div>

          {/* Prerequisite Progress Card */}
          <div className="apple-card p-6 bg-white shadow-apple-card max-w-sm mx-auto text-left space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1D1D1F]">
                Topic 0{lockStatus.requiredTopic.order} Coding Practice
              </span>
              <span className="font-mono text-xs font-semibold text-[#0071E3]">
                {lockStatus.solvedCount} / 3 Solved
              </span>
            </div>
            
            <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0071E3] h-full rounded-full transition-all duration-500"
                style={{ width: `${(lockStatus.solvedCount / 3) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-[#86868B]">
              {3 - lockStatus.solvedCount} more coding {3 - lockStatus.solvedCount === 1 ? 'challenge' : 'challenges'} required to unlock this lesson.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/practice?topicId=${lockStatus.requiredTopic.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-3 px-6 rounded-full shadow-apple-sm transition-all"
            >
              <Code2 className="w-4 h-4" />
              <span>Solve Topic 0{lockStatus.requiredTopic.order} Coding Challenges</span>
            </Link>

            <Link
              to="/modules"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-3 px-5 rounded-full transition-all"
            >
              <span>Curriculum Roadmap</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-8 sm:py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E5E5EA] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#86868B]">
              <Link to="/modules" className="hover:text-[#0071E3] transition-colors">Modules</Link>
              <span>/</span>
              <Link to={`/modules/${moduleSlug}`} className="hover:text-[#0071E3] transition-colors">{moduleTitle}</Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              {pageTitle}
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download Notes Dropdown / Actions */}
            {studyNote && (
              <div className="flex items-center gap-1.5 bg-[#F5F5F7] p-1 rounded-full border border-[#E5E5EA]">
                <button
                  onClick={handleDownloadMarkdown}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-medium text-xs px-3.5 py-1.5 rounded-full shadow-apple-sm transition-all"
                  title="Download complete notes as Markdown (.md)"
                >
                  <Download className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Download .MD</span>
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-medium text-xs px-3.5 py-1.5 rounded-full shadow-apple-sm transition-all"
                  title="Open formatted printable study guide (Save as PDF)"
                >
                  <Printer className="w-3.5 h-3.5 text-[#FF9500]" />
                  <span>Save as PDF</span>
                </button>
              </div>
            )}

            {readMarked ? (
              <div className="px-3.5 py-1.5 bg-[#EBF9EE] border border-[#34C759]/20 text-[#34C759] text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-apple-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Theory Completed</span>
              </div>
            ) : (
              <button
                onClick={handleMarkRead}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs px-4 py-2 rounded-full shadow-apple-sm transition-all"
              >
                <Check className="w-3.5 h-3.5 text-[#86868B]" />
                <span>Mark Theory Completed</span>
              </button>
            )}

            {isQuizTopic ? (
              <>
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 shadow-apple-sm ${
                  isTopicQuizCompleted(topicDef?.id || topicId)
                    ? 'bg-[#EBF9EE] text-[#34C759] border-[#34C759]/25'
                    : 'bg-[#FFF5E5] text-[#B45309] border-[#FF9500]/25'
                }`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>{isTopicQuizCompleted(topicDef?.id || topicId) ? 'Concept Quiz: Passed (✓)' : 'Concept Quiz: Pending'}</span>
                  {isTopicQuizCompleted(topicDef?.id || topicId) && (
                    <span className="hidden sm:inline font-normal text-xs text-[#34C759]"> • Topic 02 Unlocked</span>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className="inline-flex items-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-medium text-xs px-4 py-2 rounded-full shadow-apple-sm transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isTopicQuizCompleted(topicDef?.id || topicId) ? 'Review Quiz' : 'Take Concept Quiz'}</span>
                </button>
              </>
            ) : (
              <>
                {/* Coding Challenge Status Badge */}
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 shadow-apple-sm ${
                  solvedCount === 3
                    ? 'bg-[#EBF9EE] text-[#34C759] border-[#34C759]/25'
                    : 'bg-[#FFF5E5] text-[#B45309] border-[#FF9500]/25'
                }`}>
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{solvedCount}/3 Challenges Solved</span>
                  {solvedCount === 3 ? (
                    <span className="hidden sm:inline font-normal text-xs text-[#34C759]"> • Next Unlocked</span>
                  ) : null}
                </div>

                <Link
                  to={`/practice?topicId=${topicId}`}
                  className="inline-flex items-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-medium text-xs px-4 py-2 rounded-full shadow-apple-sm transition-all"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Practice Coding</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 2-Column Split: Navigation + Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (4 cols): Sticky Outline & Downloads (renders below Reader on mobile/tablet) */}
          <div className="order-2 lg:order-1 lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Study Note Sections Outline */}
            <div className="apple-card p-5 bg-white shadow-apple-card space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] pb-2 border-b border-[#E5E5EA]">
                Handbook Sections
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('concepts')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    activeTab === 'concepts'
                      ? 'bg-[#E8F2FD] text-[#0071E3]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>1. Core Architecture & Concepts</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('interview')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    activeTab === 'interview'
                      ? 'bg-[#E8F2FD] text-[#0071E3]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-[#FF9500]" />
                    <span>2. Interview Q&amp;A (Placement Ready)</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-[#FFF5E5] text-[#B45309] px-2 py-0.5 rounded-full">
                    {studyNote?.interviewQA.length || 3} Qs
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    activeTab === 'code'
                      ? 'bg-[#E8F2FD] text-[#0071E3]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#34C759]" />
                    <span>3. Annotated Java Program</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('pitfalls')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    activeTab === 'pitfalls'
                      ? 'bg-[#E8F2FD] text-[#0071E3]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FF3B30]" />
                    <span>4. Critical Pitfalls &amp; Traps</span>
                  </span>
                </button>

                {isQuizTopic && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === 'quiz'
                        ? 'bg-[#E8F2FD] text-[#0071E3]'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#FF9500]" />
                      <span>5. Concept Mastery Quiz</span>
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isTopicQuizCompleted(topicDef?.id || topicId)
                        ? 'bg-[#EBF9EE] text-[#34C759]'
                        : 'bg-[#FFF5E5] text-[#B45309]'
                    }`}>
                      {isTopicQuizCompleted(topicDef?.id || topicId) ? 'Passed ✓' : `${studyNote?.quiz?.length || 5} Qs`}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Offline Study Handbook Download Card */}
            {studyNote && (
              <div className="apple-card p-5 bg-white shadow-apple-card space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] pb-2 border-b border-[#E5E5EA] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Download Study Guide</span>
                </h2>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#1D1D1F] truncate">
                    {studyNote.title} Handbook
                  </p>
                  <p className="text-[11px] text-[#86868B]">
                    Includes line-by-line commented code, interview Q&amp;A, and architecture breakdowns.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleDownloadMarkdown}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2 px-3 rounded-xl transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>.MD File</span>
                    </button>
                    <button
                      onClick={handlePrintPdf}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2 px-3 rounded-xl transition-all"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#FF9500]" />
                      <span>Save PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Card */}
            <div className="apple-card p-5 bg-white shadow-apple-card text-center space-y-2">
              <Award className="w-6 h-6 text-[#0071E3] mx-auto" />
              <h3 className="text-xs font-semibold text-[#1D1D1F]">Topic Assessment Test</h3>
              <p className="text-[11px] text-[#6E6E73] leading-normal">
                15-minute timed evaluation with score recording and answer review.
              </p>
              <Link
                to={`/assessments?topicId=${topicId}`}
                className="w-full inline-flex items-center justify-center gap-1 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2 px-4 rounded-full transition-all mt-2"
              >
                <span>Launch Timed Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Right Column (8 cols): Apple Books-Style Editorial Reader (renders first on mobile/tablet) */}
          <div className="order-1 lg:order-2 lg:col-span-8 apple-card p-5 sm:p-10 bg-white shadow-apple-float space-y-8">
            
            {/* Segmented Top Pill Switcher (Smooth Horizontal Swipeable Bar on Mobile) */}
            <div className="flex items-center gap-1.5 bg-[#F5F5F7] p-1.5 rounded-2xl border border-[#E5E5EA] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('concepts')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'concepts'
                    ? 'bg-white text-[#1D1D1F] shadow-apple-sm font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Core Concepts
              </button>
              <button
                onClick={() => setActiveTab('interview')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'interview'
                    ? 'bg-white text-[#0071E3] shadow-apple-sm font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Interview Q&amp;A
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'code'
                    ? 'bg-white text-[#34C759] shadow-apple-sm font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Annotated Program
              </button>
              <button
                onClick={() => setActiveTab('pitfalls')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'pitfalls'
                    ? 'bg-white text-[#FF3B30] shadow-apple-sm font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Interview Traps
              </button>

              {isQuizTopic && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'quiz'
                      ? 'bg-white text-[#0071E3] shadow-apple-sm font-semibold'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Concept Quiz ({isTopicQuizCompleted(topicDef?.id || topicId) ? 'Passed ✓' : `${studyNote?.quiz?.length || 5} Qs`})
                </button>
              )}
            </div>

            {/* TAB 1: CORE CONCEPTS */}
            {activeTab === 'concepts' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-4 bg-[#F5F5F7] border border-[#E5E5EA] rounded-2xl">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071E3] block mb-1">
                    Executive Overview
                  </span>
                  <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                    {studyNote?.overview || 'Review core Java specifications and internal runtime architecture.'}
                  </p>
                </div>

                <div className="space-y-6">
                  {studyNote?.coreConcepts.map((concept, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E8F2FD] text-[#0071E3] text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{concept.title}</span>
                      </h3>
                      <div className="text-xs sm:text-sm text-[#424245] leading-relaxed pl-8 space-y-3 font-sans">
                        {concept.markdown.split('\n\n').map((para, pIdx) => {
                          if (para.startsWith('- ')) {
                            const items = para.split('\n');
                            return (
                              <ul key={pIdx} className="list-disc pl-4 space-y-1">
                                {items.map((item, iIdx) => (
                                  <li key={iIdx}>{item.replace('- ', '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={pIdx}>{para}</p>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: INTERVIEW Q&A */}
            {activeTab === 'interview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5EA]">
                  <div>
                    <h3 className="text-base font-semibold text-[#1D1D1F]">
                      High-Frequency Placement Questions
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      Curated interview answers tailored for technical placement rounds and freshers.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF5E5] text-[#B45309] border border-[#FF9500]/20 self-start sm:self-auto">
                    High Priority
                  </span>
                </div>

                <div className="space-y-4">
                  {studyNote?.interviewQA.map((qa, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-[#E5E5EA] shadow-apple-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs sm:text-sm font-semibold text-[#1D1D1F] flex items-center gap-2">
                          <span className="text-[#0071E3] font-mono">Q{idx + 1}.</span>
                          <span>{qa.question}</span>
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                          qa.frequency === 'CRITICAL'
                            ? 'bg-[#FFEBEA] text-[#FF3B30] border border-[#FF3B30]/20'
                            : qa.frequency === 'VERY_HIGH'
                            ? 'bg-[#FFF5E5] text-[#FF9500] border border-[#FF9500]/20'
                            : 'bg-[#E8F2FD] text-[#0071E3] border border-[#0071E3]/20'
                        }`}>
                          {qa.frequency}
                        </span>
                      </div>

                      <div className="p-3.5 bg-[#FBFBFD] border-l-2 border-[#0071E3] rounded-r-xl text-xs sm:text-sm text-[#424245] leading-relaxed">
                        <strong className="text-[#1D1D1F] block mb-1">Interview-Ready Answer:</strong>
                        {qa.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ANNOTATED EXAMPLE CODE WITH LINE-BY-LINE COMMENTS */}
            {activeTab === 'code' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5EA]">
                  <div>
                    <h3 className="text-base font-semibold text-[#1D1D1F]">
                      {studyNote?.annotatedProgram.title}
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      {studyNote?.annotatedProgram.summary}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] text-xs font-medium transition-all self-start sm:self-auto"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#34C759]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#6E6E73]" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden border border-[#E5E5EA] shadow-apple-card bg-[#1E1E1E]">
                  <div className="bg-[#2D2D2D] px-4 py-2 border-b border-[#3D3D3D] flex items-center justify-between text-xs text-[#86868B]">
                    <span className="font-mono text-[11px] text-[#CCCCCC] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#34C759]" />
                      <span>{studyNote?.annotatedProgram.filename}</span>
                    </span>
                    <span className="text-[10px] text-[#A0A0A0]">Complete Line-by-Line Commented Java 21</span>
                  </div>
                  <pre className="p-4 sm:p-5 text-[11px] sm:text-xs font-mono leading-relaxed overflow-x-auto text-[#D4D4D4]">
                    <code>{studyNote?.annotatedProgram.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: COMMON PITFALLS & INTERVIEW TRAPS */}
            {activeTab === 'pitfalls' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5EA]">
                  <div>
                    <h3 className="text-base font-semibold text-[#1D1D1F]">
                      Critical Traps &amp; Anti-Patterns
                    </h3>
                    <p className="text-xs text-[#86868B]">
                      Tricky scenarios interviewers use to test depth of understanding.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFEBEA] text-[#FF3B30] border border-[#FF3B30]/20 self-start sm:self-auto">
                    Watch Out
                  </span>
                </div>

                <div className="space-y-3">
                  {studyNote?.commonPitfalls.map((pitfall, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#FFF8F7] border border-[#FF3B30]/20 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                        <strong className="text-[#1D1D1F]">Pitfall {idx + 1}: </strong>
                        {pitfall}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CONCEPT MASTERY QUIZ (GATEWAY FOR TOPIC 01) */}
            {activeTab === 'quiz' && isQuizTopic && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5EA]">
                  <div>
                    <h3 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#0071E3]" />
                      <span>Topic 01 Concept Mastery Quiz</span>
                    </h3>
                    <p className="text-xs text-[#86868B] mt-0.5">
                      Answer the 5 foundational questions. Score 60% or higher (3/5) to unlock Topic 02: Java Program Structure &amp; The Main Method.
                    </p>
                  </div>
                  {quizSubmitted && (
                    <button
                      onClick={handleResetQuiz}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] text-xs font-medium transition-all self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>Retake Quiz</span>
                    </button>
                  )}
                </div>

                {/* Score Banner when submitted */}
                {quizSubmitted && (
                  <div className={`p-5 rounded-2xl border shadow-apple-sm ${
                    quizScore >= 60
                      ? 'bg-[#EBF9EE] border-[#34C759]/30 text-[#1D1D1F]'
                      : 'bg-[#FFF5E5] border-[#FF9500]/30 text-[#1D1D1F]'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {quizScore >= 60 ? (
                            <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-[#FF9500]" />
                          )}
                          <span className="font-semibold text-sm">
                            {quizScore >= 60
                              ? `Congratulations! You scored ${quizScore}% (Passed)`
                              : `Score: ${quizScore}% (Needs 60% to Pass)`}
                          </span>
                        </div>
                        <p className="text-xs text-[#6E6E73] pl-7">
                          {quizScore >= 60
                            ? 'You have mastered the JVM architecture fundamentals. Topic 02 is now unlocked!'
                            : 'Review the explanations below or re-read the Core Concepts tab, then retake the quiz.'}
                        </p>
                      </div>

                      {quizScore >= 60 && (
                        <Link
                          to="/topics/main-method-and-syntax"
                          className="inline-flex items-center justify-center gap-2 bg-[#34C759] hover:bg-[#2EB34F] text-white font-medium text-xs py-2.5 px-5 rounded-full shadow-apple-sm transition-all whitespace-nowrap"
                        >
                          <span>Proceed to Topic 02: Main Method</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Question Cards */}
                <div className="space-y-5">
                  {studyNote?.quiz?.map((q, qIndex) => {
                    const selectedOpt = selectedQuizAnswers[q.id];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-2xl bg-white border shadow-apple-sm transition-all space-y-3 ${
                          quizSubmitted
                            ? isCorrect
                              ? 'border-[#34C759]/40 bg-[#FAFDFB]'
                              : 'border-[#FF3B30]/30 bg-[#FFFDFD]'
                            : isAnswered
                            ? 'border-[#0071E3]/40'
                            : 'border-[#E5E5EA]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                              {qIndex + 1}
                            </span>
                            <span>{q.question}</span>
                          </h4>
                          {quizSubmitted && (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              isCorrect
                                ? 'bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20'
                                : 'bg-[#FFEBEA] text-[#FF3B30] border border-[#FF3B30]/20'
                            }`}>
                              {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                            </span>
                          )}
                        </div>

                        {/* Options */}
                        <div className="space-y-2 pt-1">
                          {q.options.map((opt, optIndex) => {
                            const isChosen = selectedOpt === optIndex;
                            const isThisCorrect = optIndex === q.correctIndex;

                            let optStyle = 'border-[#E5E5EA] bg-[#FBFBFD] hover:bg-[#F5F5F7] text-[#1D1D1F]';
                            if (quizSubmitted) {
                              if (isThisCorrect) {
                                optStyle = 'border-[#34C759] bg-[#EBF9EE] text-[#1D1D1F] font-medium';
                              } else if (isChosen && !isThisCorrect) {
                                optStyle = 'border-[#FF3B30] bg-[#FFEBEA] text-[#1D1D1F]';
                              } else {
                                optStyle = 'border-[#E5E5EA] bg-[#FBFBFD] text-[#86868B] opacity-60';
                              }
                            } else if (isChosen) {
                              optStyle = 'border-[#0071E3] bg-[#E8F2FD] text-[#0071E3] font-medium shadow-apple-sm';
                            }

                            return (
                              <button
                                key={optIndex}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleSelectQuizOption(q.id, optIndex)}
                                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 ${optStyle} ${
                                  quizSubmitted ? 'cursor-default' : 'cursor-pointer'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-full border text-[11px] font-semibold flex items-center justify-center flex-shrink-0 ${
                                  isChosen
                                    ? quizSubmitted && !isThisCorrect
                                      ? 'border-[#FF3B30] bg-[#FF3B30] text-white'
                                      : 'border-[#0071E3] bg-[#0071E3] text-white'
                                    : isThisCorrect && quizSubmitted
                                    ? 'border-[#34C759] bg-[#34C759] text-white'
                                    : 'border-[#D2D2D7] bg-white text-[#86868B]'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className="flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation when submitted */}
                        {quizSubmitted && (
                          <div className="pt-2 text-xs text-[#6E6E73] bg-[#F5F5F7] p-3 rounded-xl border border-[#E5E5EA] flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#0071E3] flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-[#1D1D1F]">Explanation: </strong>
                              {q.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit button when not submitted */}
                {!quizSubmitted && (
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E5EA]">
                    <span className="text-xs text-[#86868B]">
                      {Object.keys(selectedQuizAnswers).length} of {studyNote?.quiz?.length || 5} questions answered
                    </span>
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedQuizAnswers).length < (studyNote?.quiz?.length || 5)}
                      className={`inline-flex items-center gap-2 font-medium text-xs py-2.5 px-6 rounded-full shadow-apple-sm transition-all ${
                        Object.keys(selectedQuizAnswers).length >= (studyNote?.quiz?.length || 5)
                          ? 'bg-[#0071E3] hover:bg-[#0077ED] text-white cursor-pointer'
                          : 'bg-[#E5E5EA] text-[#86868B] cursor-not-allowed'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>Submit Quiz &amp; Check Results</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Next Step Bar */}
            <div className="pt-8 border-t border-[#E5E5EA] flex flex-col sm:flex-row items-center justify-between gap-4">
              {isQuizTopic ? (
                <>
                  <span className="text-xs text-[#6E6E73]">
                    {isTopicQuizCompleted(topicDef?.id || topicId)
                      ? 'Quiz passed! You are ready to move on to Topic 02.'
                      : 'Complete the concept mastery quiz to unlock Topic 02.'}
                  </span>
                  {isTopicQuizCompleted(topicDef?.id || topicId) ? (
                    <Link
                      to="/topics/main-method-and-syntax"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#34C759] hover:bg-[#2EB34F] text-white font-medium text-xs py-2.5 px-6 rounded-full shadow-apple-sm transition-all"
                    >
                      <span>Next: Topic 02 Main Method</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-6 rounded-full shadow-apple-sm transition-all"
                    >
                      <span>Take Concept Mastery Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="text-xs text-[#6E6E73]">
                    Ready for automated evaluation and test cases?
                  </span>
                  <Link
                    to={`/practice?topicId=${topicId}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-6 rounded-full shadow-apple-sm transition-all"
                  >
                    <span>Solve 3 Coding Problems</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
