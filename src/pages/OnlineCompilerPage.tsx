import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { codingApi } from '../api/client';
import type { QuestionDetails, CodeRunResult, CodeSubmitResult } from '../types';
import { useAuthStore } from '../store/authStore';
import {
  saveCodeDraft,
  saveCodeDraftImmediate,
  getCodeDraft,
  clearCodeDraft,
  recordSubmission,
  isQuestionSolved,
  markQuestionSolved,
  getTopicByQuestionSlug,
  isTopicUnlocked,
  isTopicQuestionsCompleted,
} from '../utils/progressStorage';
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  Clock,
  Cpu,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Lock,
  ChevronRight,
  Sparkles,
  Check,
  Lightbulb,
  Copy,
} from 'lucide-react';

const PLAYGROUND_QUESTION: QuestionDetails = {
  id: '0',
  slug: 'playground',
  title: 'Java Free-Form Scratchpad (Playground)',
  difficulty: 'EASY',
  solved: false,
  moduleTitle: 'Interactive Workspace',
  topicTitle: 'Open Playground',
  topicSlug: 'playground',
  problemStatement: `Welcome to the RA-Java Scratchpad! 🧪

Here you can write, compile, and run any Java code without problem constraints, hidden test cases, or grading rules.

Use this open playground to:
• Test quick ideas from theory notes (e.g. "What does 0.1 + 0.2 print?")
• Try out methods, loops, and data structures
• Practice small snippets before building bigger programs
• Print outputs using System.out.println()`,
  inputFormat: 'Type any custom inputs into the "Custom Input" tab below if your code reads from Scanner or System.in.',
  outputFormat: 'Standard console outputs will be displayed in the Terminal tab.',
  constraints: 'OpenJDK 21 • Subprocess Sandbox • 10-second max execution time.',
  starterCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello from the RA-Java Scratchpad!");

        // Try any Java code here!
        int a = 15;
        int b = 30;
        int sum = a + b;
        System.out.println("Sum of " + a + " and " + b + " = " + sum);

        String message = "Java is simple and powerful";
        System.out.println("Uppercase: " + message.toUpperCase());
    }
}`,
  sampleTestCases: [],
  hints: 'This is an open playground! Write your code, click "Run" (or press Ctrl+Enter), and view instant console output.'
};

export const OnlineCompilerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const slugParam = searchParams.get('slug') || 'print-welcome-message';
  const isPlayground = slugParam === 'playground';
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [question, setQuestion] = useState<QuestionDetails | null>(null);
  const currentTopic = getTopicByQuestionSlug(slugParam);
  const [code, setCode] = useState<string>('public class Solution {\n    public static void main(String[] args) {\n        // Write code here\n    }\n}');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeBottomTab, setActiveBottomTab] = useState<'console' | 'testcases' | 'editorial'>('console');
  const [mobileView, setMobileView] = useState<'problem' | 'editor' | 'results'>('editor');
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<CodeSubmitResult | null>(null);
  const [showEditorial, setShowEditorial] = useState(false);
  const [editorialData, setEditorialData] = useState<{ editorialSolution: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (slugParam === 'playground') {
      setQuestion(PLAYGROUND_QUESTION);
      const savedDraft = getCodeDraft('playground');
      if (savedDraft) {
        setCode(savedDraft);
        setIsSavedLocally(true);
      } else {
        setCode(PLAYGROUND_QUESTION.starterCode || '');
        setIsSavedLocally(false);
      }
      setLoading(false);
      return;
    }

    codingApi.getQuestionDetails(slugParam)
      .then((data) => {
        const solvedLocally = isQuestionSolved(slugParam);
        setQuestion({ ...data, solved: data.solved || solvedLocally });

        // Restore saved draft or fallback to starter code
        const savedDraft = getCodeDraft(slugParam);
        if (savedDraft) {
          setCode(savedDraft);
          setIsSavedLocally(true);
        } else {
          setCode(data.starterCode || '');
          setIsSavedLocally(false);
        }

        if (data.sampleTestCases && data.sampleTestCases.length > 0) {
          setCustomInput(data.sampleTestCases[0].inputData);
        }
      })
      .catch(() => {
        const savedDraft = getCodeDraft(slugParam);
        if (savedDraft) {
          setCode(savedDraft);
          setIsSavedLocally(true);
        }
        setErrorMsg('Failed to load coding problem specifications.');
      })
      .finally(() => setLoading(false));
  }, [slugParam]);

  const handleCodeChange = (val: string | undefined) => {
    const newCode = val || '';
    setCode(newCode);
    setIsSavedLocally(false);
    saveCodeDraft(slugParam, newCode, () => {
      setIsSavedLocally(true);
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveBottomTab('console');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileView('results');
    }
    setErrorMsg(null);
    try {
      const res = await codingApi.runCode(code, customInput);
      setRunResult(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    if (!question) return;
    setIsSubmitting(true);
    setActiveBottomTab('testcases');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileView('results');
    }
    setErrorMsg(null);
    saveCodeDraftImmediate(slugParam, code);

    try {
      const res = await codingApi.submitCode(question.id, code);
      setSubmitResult(res);

      recordSubmission({
        slug: slugParam,
        questionTitle: question.title,
        passed: res.solved,
        passedTestCases: res.passedTestCases,
        totalTestCases: res.totalTestCases,
      });

      if (res.solved) {
        setQuestion({ ...question, solved: true });
        markQuestionSolved(slugParam);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (question) {
      clearCodeDraft(slugParam);
      setCode(question.starterCode);
      setRunResult(null);
      setSubmitResult(null);
      setIsSavedLocally(false);
    }
  };

  const handleRevealEditorial = async () => {
    try {
      const res = await codingApi.getEditorial(slugParam);
      setEditorialData(res);
      setShowEditorial(true);
    } catch (err) {
      // Safe fallback editorial from question details or default explanation
      setEditorialData({
        editorialSolution: question?.starterCode || '// Reference solution',
        explanation: question?.hints || 'Break down the problem step by step and test with sample inputs.'
      });
      setShowEditorial(true);
    }
  };

  // Keyboard shortcut listener: Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (e.shiftKey) {
          e.preventDefault();
          handleSubmitCode();
        } else {
          e.preventDefault();
          handleRunCode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, customInput, question, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center text-xs text-[#86868B]">
        <RefreshCw className="w-5 h-5 text-[#0071E3] animate-spin mr-2" />
        <span>Booting Monaco Sandbox &amp; Loading Test Cases...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] bg-[#FBFBFD] text-[#1D1D1F] antialiased">
      
      {/* 1. IDE TOP CONTROL BAR (macOS / Xcode Toolbar) */}
      <div className="h-12 border-b border-[#E5E5EA] bg-white px-3 sm:px-4 flex items-center justify-between text-xs flex-shrink-0 shadow-apple-sm">
        
        {/* Left: Window Chrome & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <div className="hidden sm:flex items-center gap-1.5 mr-1">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></span>
          </div>

          <Link
            to="/practice"
            className="text-[#86868B] hover:text-[#0071E3] text-xs flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          <span className="text-[#D2D2D7]">/</span>

          <span className="font-semibold text-[#1D1D1F] text-xs sm:text-sm truncate max-w-[120px] sm:max-w-xs">
            {question?.title}
          </span>

          {isPlayground ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#E8F2FD] text-[#0071E3] border border-[#0071E3]/20 flex-shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Playground
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium flex-shrink-0 ${
              question?.difficulty === 'EASY'
                ? 'bg-[#EBF9EE] text-[#34C759] border border-[#34C759]/20'
                : question?.difficulty === 'MEDIUM'
                ? 'bg-[#FFF5E5] text-[#FF9500] border border-[#FF9500]/20'
                : 'bg-[#FFEBEA] text-[#FF3B30] border border-[#FF3B30]/20'
            }`}>
              {question?.difficulty}
            </span>
          )}

          {!isPlayground && question?.solved && (
            <span className="text-[#34C759] hidden md:inline-flex items-center gap-1 text-xs font-medium flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Solved
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          <button
            onClick={handleResetCode}
            title="Reset code template"
            className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-full transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-1.5 px-2.5 sm:px-3.5 rounded-full shadow-apple-sm transition-all disabled:opacity-50"
            title="Ctrl + Enter"
          >
            <Play className={`w-3 h-3 ${isRunning ? 'animate-spin text-[#0071E3]' : 'text-[#0071E3]'}`} />
            <span>{isRunning ? 'Compiling...' : 'Run'}</span>
            <span className="text-[10px] text-[#86868B] hidden lg:inline">^↵</span>
          </button>

          {/* Submit Solution Button (Hidden in playground mode) */}
          {!isPlayground && (
            <button
              onClick={handleSubmitCode}
              disabled={isRunning || isSubmitting}
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-1.5 px-3 sm:px-4 rounded-full shadow-apple-sm transition-all disabled:opacity-50"
              title="Ctrl + Shift + Enter"
            >
              <Send className="w-3 h-3" />
              <span>{isSubmitting ? 'Grading...' : 'Submit'}</span>
              <span className="text-[10px] text-white/70 hidden lg:inline">⇧^↵</span>
            </button>
          )}

        </div>
      </div>

      {/* MOBILE SEGMENTED VIEW SWITCHER (< md) */}
      <div className="md:hidden flex items-center bg-[#F5F5F7] border-b border-[#E5E5EA] px-3 py-1.5 gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => setMobileView('problem')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium text-center transition-all ${
            mobileView === 'problem'
              ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          Problem
        </button>
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium text-center transition-all ${
            mobileView === 'editor'
              ? 'bg-white text-[#0071E3] font-semibold shadow-apple-sm'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          Code Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileView('results')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium text-center transition-all relative ${
            mobileView === 'results'
              ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          <span>Console &amp; Tests</span>
          {submitResult && (
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ml-1.5 ${
                submitResult.solved ? 'bg-[#34C759]' : 'bg-[#FF3B30]'
              }`}
            />
          )}
        </button>
      </div>

      {/* 2. DUAL-PANE WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* Left Pane (40% Desktop / Full on Mobile): Problem Specifications */}
        <div
          className={`w-full md:w-5/12 border-r border-[#E5E5EA] bg-white overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-[#424245] ${
            mobileView === 'problem' ? 'flex flex-col flex-1' : 'hidden md:block'
          }`}
        >
          {currentTopic && !isTopicUnlocked(currentTopic.id) && (
            <div className="p-3.5 rounded-xl bg-[#FFF8F7] border border-[#FF3B30]/20 text-[#B45309] text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
              <span>
                <strong>Prerequisite Topic Locked:</strong> Solve all 3 coding challenges in Topic 0{currentTopic.order - 1} to unlock this topic in order.
              </span>
            </div>
          )}
          
          <div className="pb-4 border-b border-[#E5E5EA] space-y-1">
            <span className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">
              {question?.moduleTitle} • {question?.topicTitle}
            </span>
            <h1 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">
              {question?.title}
            </h1>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Problem Statement</h2>
            <p className="leading-relaxed whitespace-pre-line text-sm text-[#424245]">
              {question?.problemStatement}
            </p>
          </div>

          {/* Input & Output Format */}
          <div className="grid grid-cols-1 gap-4">
            <div className="apple-card p-4 bg-[#F5F5F7] space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Input Format</h2>
              <p className="text-xs text-[#6E6E73] leading-relaxed">{question?.inputFormat}</p>
            </div>
            <div className="apple-card p-4 bg-[#F5F5F7] space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Output Format</h2>
              <p className="text-xs text-[#6E6E73] leading-relaxed">{question?.outputFormat}</p>
            </div>
          </div>

          {/* Constraints & Complexity */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Constraints &amp; Complexity</h2>
            <div className="apple-card p-4 bg-[#F5F5F7] text-xs text-[#424245] space-y-1.5 font-mono">
              <div className="text-[#1D1D1F]">{question?.constraints}</div>
              {question?.expectedTimeComplexity && (
                <div className="text-[#6E6E73] pt-1.5 border-t border-[#E5E5EA]">
                  Expected Time: <span className="text-[#1D1D1F] font-semibold">{question.expectedTimeComplexity}</span>
                </div>
              )}
              {question?.expectedSpaceComplexity && (
                <div className="text-[#6E6E73]">
                  Expected Space: <span className="text-[#1D1D1F] font-semibold">{question.expectedSpaceComplexity}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sample Test Cases */}
          {question?.sampleTestCases && question.sampleTestCases.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">Sample Test Cases</h2>
              <div className="space-y-3">
                {question.sampleTestCases.map((tc, idx) => (
                  <div key={tc.id} className="apple-card p-4 bg-[#F5F5F7] text-xs font-mono space-y-2">
                    <span className="text-[11px] font-semibold text-[#0071E3]">Case 0{idx + 1}</span>
                    <div>
                      <span className="text-[#86868B] text-[10px] block">Input:</span>
                      <pre className="text-[#1D1D1F] bg-white border border-[#E5E5EA] p-2 rounded-lg mt-0.5 whitespace-pre-wrap">{tc.inputData}</pre>
                    </div>
                    <div>
                      <span className="text-[#86868B] text-[10px] block">Expected Output:</span>
                      <pre className="text-[#1D1D1F] bg-white border border-[#E5E5EA] p-2 rounded-lg mt-0.5 whitespace-pre-wrap">{tc.expectedOutput}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3-Step Problem Hints & Solution Lifeline */}
          {!isPlayground && (
            <div className="apple-card p-4 bg-[#F9F9FB] border border-[#E5E5EA] rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5EA]">
                <span className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#FF9500]" />
                  <span>Hints &amp; Solution Lifeline</span>
                </span>
                <span className="text-[10px] text-[#86868B] bg-white px-2 py-0.5 rounded-full border border-[#E5E5EA]">
                  Never get stuck
                </span>
              </div>

              {/* Step 1: Conceptual Clue */}
              <details className="cursor-pointer group">
                <summary className="text-xs font-medium text-[#0071E3] flex items-center justify-between hover:underline">
                  <span>1. Conceptual Clue (How to think)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#86868B] transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-[#424245] text-xs leading-relaxed bg-white p-3 rounded-xl border border-[#E5E5EA]">
                  {question?.hints || 'Read the inputs carefully and check if simple conditional checks or loops can solve this step by step.'}
                </p>
              </details>

              {/* Step 2: Step-by-Step Logic */}
              <details className="cursor-pointer group">
                <summary className="text-xs font-medium text-[#0071E3] flex items-center justify-between hover:underline">
                  <span>2. Algorithm Steps (Plain English)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#86868B] transition-transform group-open:rotate-90" />
                </summary>
                <div className="mt-2 text-[#424245] text-xs leading-relaxed bg-white p-3 rounded-xl border border-[#E5E5EA] space-y-1">
                  <p>• <strong>Step 1</strong>: Read inputs using \`Scanner\` or method parameters.</p>
                  <p>• <strong>Step 2</strong>: Process data using loops or simple arithmetic conditions.</p>
                  <p>• <strong>Step 3</strong>: Print results using \`System.out.println()\` matching expected output.</p>
                </div>
              </details>

              {/* Step 3: Reveal Verified Solution */}
              <div className="pt-2 border-t border-[#E5E5EA]">
                <button
                  type="button"
                  onClick={() => {
                    handleRevealEditorial();
                    setActiveBottomTab('editorial');
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      setMobileView('results');
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2 px-3 rounded-xl transition-all shadow-apple-sm"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#FF9500]" />
                  <span>Stuck? Inspect Solution &amp; Explanation</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile CTA to proceed directly to Code Editor */}
          <div className="md:hidden pt-4 pb-2 border-t border-[#E5E5EA]">
            <button
              onClick={() => setMobileView('editor')}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-4 rounded-full shadow-apple-sm transition-all"
            >
              <span>Proceed to Code Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Pane (60% Desktop / Full on Mobile): Monaco Editor + Drawer */}
        <div
          className={`w-full md:w-7/12 flex flex-col min-h-0 bg-white ${
            mobileView !== 'problem' ? 'flex flex-col flex-1' : 'hidden md:flex'
          }`}
        >
          
          {/* Editor Header Bar & Monaco Editor */}
          <div
            className={`flex flex-col min-h-0 ${
              mobileView === 'results' ? 'hidden md:flex md:flex-1' : 'flex-1'
            }`}
          >
            <div className="h-8 bg-[#F5F5F7] border-b border-[#E5E5EA] px-4 flex items-center justify-between text-xs text-[#86868B] flex-shrink-0">
              <span className="flex items-center gap-1.5 text-[#1D1D1F] font-medium font-mono text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Solution.java</span>
              </span>
              <div className="flex items-center gap-3">
                {isSavedLocally && (
                  <span className="flex items-center gap-1 text-[10px] text-[#34C759] font-medium">
                    <Check className="w-3 h-3" /> Saved locally
                  </span>
                )}
                <span className="text-[11px] hidden sm:inline">OpenJDK 21 • Subprocess Sandbox</span>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 min-h-[220px]">
              <Editor
                height="100%"
                defaultLanguage="java"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: '"JetBrains Mono", Consolas, monospace',
                  tabSize: 4,
                  lineNumbers: 'on',
                  lineNumbersMinChars: 3,
                  wordWrap: 'on',
                  wrappingIndent: 'indent',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>
          </div>

          {/* 3. BOTTOM DRAWER / TEST RUNNER */}
          <div
            className={`border-t border-[#E5E5EA] bg-white flex flex-col shadow-apple-card ${
              mobileView === 'results'
                ? 'flex-1 min-h-0'
                : 'hidden md:flex md:h-64 md:flex-shrink-0'
            }`}
          >
            
            {/* Drawer Tabs (Apple Segmented Style) */}
            <div className="flex items-center justify-between px-3 sm:px-4 bg-[#F5F5F7] border-b border-[#E5E5EA] text-xs flex-shrink-0">
              <div className="flex gap-1 py-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveBottomTab('console')}
                  className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                    activeBottomTab === 'console'
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Custom Console
                </button>
                <button
                  onClick={() => setActiveBottomTab('testcases')}
                  className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                    activeBottomTab === 'testcases'
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Test Results {submitResult && `(${submitResult.passedTestCases}/${submitResult.totalTestCases})`}
                </button>
                <button
                  onClick={() => setActiveBottomTab('editorial')}
                  className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                    activeBottomTab === 'editorial'
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Editorial
                </button>
              </div>

              <div className="flex items-center gap-2">
                {submitResult && (
                  <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#86868B] pr-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#0071E3]" /> {submitResult.executionTimeMs}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-[#34C759]" /> {submitResult.memoryUsedKb}KB
                    </span>
                  </div>
                )}
                {/* Quick jump back to Editor button on mobile */}
                <button
                  type="button"
                  onClick={() => setMobileView('editor')}
                  className="md:hidden text-xs text-[#0071E3] font-medium py-1 px-2.5 rounded-full hover:bg-white transition-all flex items-center gap-1"
                >
                  <span>Editor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 text-xs text-[#1D1D1F]">
              
              {/* Tab 1: Custom Console */}
              {activeBottomTab === 'console' && (
                <div className="space-y-3 font-mono">
                  <div>
                    <label className="text-[11px] text-[#86868B] uppercase tracking-wider block mb-1">
                      Standard Input (System.in):
                    </label>
                    <textarea
                      rows={2}
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Input data to feed into Scanner"
                      className="w-full bg-[#F5F5F7] border border-[#D2D2D7] rounded-xl p-2.5 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15"
                    />
                  </div>

                  {runResult ? (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#86868B] uppercase text-[10px]">Standard Output (stdout):</span>
                        <span className={runResult.status === 'ACCEPTED' ? 'text-[#34C759] font-semibold' : 'text-[#FF3B30] font-semibold'}>
                          {runResult.status} ({runResult.executionTimeMs}ms)
                        </span>
                      </div>
                      <pre className="bg-[#F5F5F7] border border-[#E5E5EA] p-3 rounded-xl text-[#1D1D1F] overflow-x-auto whitespace-pre-wrap">
                        {runResult.compileOutput || runResult.stderr || runResult.stdout || '[No Output]'}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-[#86868B] text-xs font-sans">
                      Click &quot;Run&quot; (Ctrl+Enter) to evaluate your code against the custom standard input above.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 2: Test Case Evaluation Results */}
              {activeBottomTab === 'testcases' && (
                <div className="space-y-3">
                  {submitResult ? (
                    <div>
                      {submitResult.solved && currentTopic && isTopicQuestionsCompleted(currentTopic.id) && (
                        <div className="p-3.5 rounded-xl bg-[#EBF9EE] border border-[#34C759]/30 text-[#2FB34F] text-xs font-semibold flex items-center justify-between mb-3 animate-in fade-in">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#34C759]" />
                            <span>All 3 Coding Questions Solved! Next Topic Unlocked.</span>
                          </div>
                          <Link
                            to="/modules"
                            className="bg-[#34C759] hover:bg-[#2FB34F] text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-apple-sm transition-all"
                          >
                            Explore Syllabus &rarr;
                          </Link>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] mb-3">
                        <div className="flex items-center gap-2.5">
                          {submitResult.solved ? (
                            <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#FF3B30]" />
                          )}
                          <div>
                            <p className="font-semibold text-[#1D1D1F] text-xs">{submitResult.status}</p>
                            <p className="text-[11px] text-[#6E6E73]">{submitResult.message}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#1D1D1F]">
                          {submitResult.passedTestCases} / {submitResult.totalTestCases} Passed
                        </span>
                      </div>

                      {/* Individual Test Cases */}
                      <div className="space-y-2">
                        {submitResult.testCaseResults.map((tc, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs font-mono ${
                              tc.passed
                                ? 'bg-[#EBF9EE] border-[#34C759]/30 text-[#2FB34F]'
                                : 'bg-[#FFEBEA] border-[#FF3B30]/30 text-[#FF3B30]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">
                                Test Case #{tc.testOrder} {tc.hidden && '(Concealed Evaluation Suite)'}
                              </span>
                              <span className="font-bold">{tc.passed ? 'PASSED' : 'FAILED'}</span>
                            </div>

                            {!tc.hidden && !tc.passed && (
                              <div className="mt-2 text-[11px] text-[#1D1D1F] space-y-2 bg-white p-3 rounded-xl border border-[#E5E5EA]">
                                <div>
                                  <span className="text-[10px] uppercase font-semibold text-[#86868B] block mb-0.5">Input</span>
                                  <pre className="p-2 bg-[#F5F5F7] rounded-lg font-mono text-xs whitespace-pre-wrap break-all text-[#1D1D1F]">{tc.inputData}</pre>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-semibold text-[#86868B] block mb-0.5">
                                    Expected Output {tc.expectedOutput?.includes('\n') ? `(${tc.expectedOutput.split('\n').length} lines)` : '(1 line)'}
                                  </span>
                                  <pre className="p-2 bg-[#EBF9EE] border border-[#34C759]/20 rounded-lg font-mono text-xs whitespace-pre-wrap break-all text-[#2FB34F]">{tc.expectedOutput}</pre>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-semibold text-[#86868B] block mb-0.5">
                                    Actual Output {tc.actualOutput?.includes('\n') ? `(${tc.actualOutput.split('\n').length} lines)` : '(1 line)'}
                                  </span>
                                  <pre className="p-2 bg-[#FFEBEA] border border-[#FF3B30]/20 rounded-lg font-mono text-xs whitespace-pre-wrap break-all text-[#FF3B30]">{tc.actualOutput || '(No stdout)'}</pre>
                                </div>
                                {tc.expectedOutput?.replace(/\s+/g, ' ').trim() === tc.actualOutput?.replace(/\s+/g, ' ').trim() && (
                                  <div className="p-2 bg-[#FFF5E5] border border-[#FF9500]/30 rounded-lg text-[11px] text-[#B45309] font-sans font-medium">
                                    ⚠️ Line-break difference: Your code printed on a single line, but the problem requires each item on a separate new line (using System.out.println).
                                  </div>
                                )}
                              </div>
                            )}

                            {tc.hidden && !tc.passed && (
                              <p className="text-[11px] text-[#86868B] mt-1 font-sans">
                                [Hidden test cases are protected to enforce algorithmic rigor]
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#86868B] text-xs">
                      Click &quot;Submit&quot; (Ctrl+Shift+Enter) to evaluate all sample and hidden test cases.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 3: Editorial Solution */}
              {activeBottomTab === 'editorial' && (
                <div>
                  {!showEditorial ? (
                    <div className="text-center py-6 space-y-3">
                      <p className="text-xs text-[#6E6E73]">
                        Stuck on this problem? Inspect the optimal reference solution and line-by-line explanation.
                      </p>
                      <button
                        onClick={handleRevealEditorial}
                        className="inline-flex items-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium py-2 px-5 rounded-full shadow-apple-sm transition-all"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Inspect Reference Solution &amp; Editorial</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E5E5EA]">
                        <span className="text-xs font-semibold text-[#1D1D1F]">
                          Optimal Reference Solution
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (editorialData?.editorialSolution) {
                              setCode(editorialData.editorialSolution);
                              saveCodeDraftImmediate(slugParam, editorialData.editorialSolution);
                              setIsSavedLocally(true);
                              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                setMobileView('editor');
                              }
                            }
                          }}
                          className="inline-flex items-center gap-1.5 bg-[#E8F2FD] hover:bg-[#D0E6FC] text-[#0071E3] text-xs font-medium py-1 px-3 rounded-full transition-all"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Load into Editor</span>
                        </button>
                      </div>
                      <p className="text-[#6E6E73] text-xs leading-relaxed">{editorialData?.explanation}</p>
                      <pre className="bg-[#F5F5F7] border border-[#E5E5EA] p-4 rounded-xl text-[#1D1D1F] overflow-x-auto whitespace-pre font-mono text-xs">
                        <code>{editorialData?.editorialSolution}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
