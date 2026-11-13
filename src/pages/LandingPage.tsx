import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Code2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
  Play,
  FileCode,
  Zap,
  Lock,
  Clock,
  Check,
  Laptop,
  CheckCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'bits' | 'window' | 'deadlock'>('bits');
  const [simulatedRunning, setSimulatedRunning] = useState(false);
  const [simulatedPassed, setSimulatedPassed] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'oop' | 'collections' | 'concurrency'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const runCodeSimulation = () => {
    setSimulatedRunning(true);
    setTimeout(() => {
      setSimulatedRunning(false);
      setSimulatedPassed(true);
    }, 600);
  };

  const sampleSnippets = {
    bits: {
      title: "CountSetBits.java",
      problem: "Brian Kernighan's Bit Manipulation",
      difficulty: "MEDIUM",
      time: "O(K) where K = set bits",
      code: `public class Solution {
    // Brian Kernighan's Algorithm: n & (n - 1) clears the lowest set bit
    public static int countSetBits(long n) {
        int count = 0;
        while (n > 0) {
            n = n & (n - 1);
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        long value = 1431655765L; // binary: 01010101...
        System.out.println("Set bits: " + countSetBits(value));
    }
}`,
      output: "Set bits: 16\n[Sandbox: Process completed in 12ms • Memory: 32MB]",
    },
    window: {
      title: "LongestSubstring.java",
      problem: "Sliding Window with ASCII Frequency",
      difficulty: "MEDIUM",
      time: "O(N) time • O(1) space",
      code: `public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        int[] lastIdx = new int[128];
        java.util.Arrays.fill(lastIdx, -1);
        int maxLen = 0, start = 0;

        for (int end = 0; end < s.length(); end++) {
            char ch = s.charAt(end);
            if (lastIdx[ch] >= start) {
                start = lastIdx[ch] + 1;
            }
            lastIdx[ch] = end;
            maxLen = Math.max(maxLen, end - start + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
    }
}`,
      output: "3\n[Sandbox: 3/3 Test Cases Passed (including 1 Hidden)]",
    },
    deadlock: {
      title: "DeadlockDetection.java",
      problem: "Wait-for Graph Cycle Detection (DFS)",
      difficulty: "HARD",
      time: "O(V + E) time • O(V) space",
      code: `public class Solution {
    public static boolean hasDeadlockCycle(int numThreads, int[][] waitGraph) {
        int[] visited = new int[numThreads]; // 0: unvisited, 1: visiting, 2: visited
        for (int i = 0; i < numThreads; i++) {
            if (visited[i] == 0 && dfsCycle(i, waitGraph, visited)) {
                return true;
            }
        }
        return false;
    }

    private static boolean dfsCycle(int node, int[][] graph, int[] state) {
        state[node] = 1; // Mark in recursion stack
        for (int neighbor : graph[node]) {
            if (state[neighbor] == 1) return true;
            if (state[neighbor] == 0 && dfsCycle(neighbor, graph, state)) return true;
        }
        state[node] = 2; // Visited
        return false;
    }
}`,
      output: "Cycle detected: true (Threads 2 and 4 in mutual lock wait)\n[Verdict: ACCEPTED]",
    },
  };

  const modulesData = [
    { id: 1, category: 'core', title: "Java Fundamentals & JVM Architecture", topics: 2, problems: 6, pdfs: "14 pages", time: "4.5 hrs" },
    { id: 2, category: 'core', title: "Conditional Statements & Pattern Matching", topics: 1, problems: 4, pdfs: "8 pages", time: "2.0 hrs" },
    { id: 3, category: 'core', title: "Loops, Complex Iterations & Jumps", topics: 2, problems: 8, pdfs: "16 pages", time: "5.0 hrs" },
    { id: 4, category: 'core', title: "Methods, Memory Stack & Pure Recursion", topics: 1, problems: 6, pdfs: "12 pages", time: "4.0 hrs" },
    { id: 5, category: 'core', title: "Arrays, Multi-Dimensional & Two-Pointers", topics: 1, problems: 8, pdfs: "18 pages", time: "6.0 hrs" },
    { id: 6, category: 'core', title: "Strings, Immutability & String Constant Pool", topics: 1, problems: 7, pdfs: "14 pages", time: "4.5 hrs" },
    { id: 7, category: 'oop', title: "Object-Oriented Design & Polymorphism", topics: 1, problems: 8, pdfs: "22 pages", time: "7.0 hrs" },
    { id: 8, category: 'oop', title: "Exception Handling & Try-with-Resources", topics: 1, problems: 5, pdfs: "12 pages", time: "3.5 hrs" },
    { id: 9, category: 'collections', title: "Collections Framework & HashMap Internals", topics: 1, problems: 10, pdfs: "24 pages", time: "8.0 hrs" },
    { id: 10, category: 'collections', title: "Generics, Type Erasure & Streams API", topics: 1, problems: 8, pdfs: "20 pages", time: "6.5 hrs" },
    { id: 11, category: 'concurrency', title: "Multithreading, Locks & Executors", topics: 1, problems: 6, pdfs: "26 pages", time: "9.0 hrs" },
    { id: 12, category: 'concurrency', title: "NIO.2, File Streams & JDBC Transactions", topics: 1, problems: 5, pdfs: "16 pages", time: "4.5 hrs" },
  ];

  const filteredModules = activeCategory === 'all'
    ? modulesData
    : modulesData.filter(m => m.category === activeCategory);

  const faqs = [
    {
      q: "How does the online Java compiler execute and evaluate code?",
      a: "Our compiler runs on an isolated sandboxed engine with cgroups v2 resource capping. Each program is compiled with OpenJDK 21, allocated a strict 5-second CPU limit, and evaluated against both public sample inputs and concealed automated edge cases."
    },
    {
      q: "Is RA-Java 100% free for all students?",
      a: "Yes! RA-Java (Random Access Java) provides full free access to all 12 modules, 42+ verified coding challenges with hidden test cases, 14 downloadable PDF study guides, topic examination arenas, and technical mock interview simulators with zero fees or subscriptions."
    },
    {
      q: "How does the single-device concurrency security work?",
      a: "To protect student progress and account integrity, RA-Java implements RFC-7519 cryptographic token binding. An account can have only one active device session at any time. Signing in on a new device gracefully terminates previous sessions."
    },
    {
      q: "Is this platform suitable for campus placement and corporate interviews?",
      a: "Yes. The curriculum specifically targets high-frequency interview questions asked at tier-1 product companies and enterprises, including internal memory mechanics (String Pool, HashMap hashing, Garbage Collection), Concurrency, and Stream API."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-[#0071E3] selection:text-white antialiased">
      
      {/* 1. HERO SECTION: Clean Apple Typography & Breathable Spacing */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-[#E5E5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Proposition */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] shadow-apple-sm text-xs font-medium text-[#1D1D1F]">
                <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
                <span>OpenJDK 21.0.2 Curriculum Engine</span>
                <span className="text-[#86868B]">•</span>
                <span className="text-[#0071E3]">Version 2.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1D1D1F] leading-[1.08]">
                Master Java from First Principles with RA-Java.
              </h1>

              <p className="text-base sm:text-lg text-[#6E6E73] font-normal leading-relaxed max-w-xl">
                Random Access Java (RA-Java) is a thoughtfully engineered, 100% free platform for developers who want genuine depth. Learn JVM internal mechanics, write idiomatic code in our sandboxed compiler, and conquer technical interviews.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C4] text-white font-medium text-sm px-6 py-3 rounded-full shadow-apple-sm hover:shadow-apple-card transition-all"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/modules"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5F5F7] active:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-sm px-5 py-3 rounded-full shadow-apple-sm transition-all"
                >
                  <BookOpen className="w-4 h-4 text-[#86868B]" />
                  <span>Explore 12 Modules</span>
                </Link>
              </div>

              {/* Trust Specs Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#86868B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#34C759]" />
                  <span>42+ Master Challenges</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
                  <span>100% Free Forever</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF9500]" />
                  <span>14 PDF Reference Guides</span>
                </div>
              </div>
            </div>

            {/* Right Column: Xcode-Style Live Interactive Sandbox */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-[#E5E5EA] rounded-2xl shadow-apple-float overflow-hidden">
                
                {/* macOS Window Chrome Header */}
                <div className="bg-[#F5F5F7] border-b border-[#E5E5EA] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></span>
                    <span className="text-xs font-mono text-[#86868B] ml-2">
                      {sampleSnippets[activeCodeTab].title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={runCodeSimulation}
                      disabled={simulatedRunning}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium rounded-full shadow-apple-sm transition-all disabled:opacity-50"
                    >
                      <Play className={`w-3 h-3 ${simulatedRunning ? 'animate-spin' : ''}`} />
                      <span>{simulatedRunning ? 'Compiling...' : 'Run Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="bg-[#FFFFFF] border-b border-[#E5E5EA] px-4 py-2 flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
                  {(['bits', 'window', 'deadlock'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        activeCodeTab === tab
                          ? 'bg-[#E8F2FD] text-[#0071E3] font-medium'
                          : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                      }`}
                    >
                      {sampleSnippets[tab].title}
                    </button>
                  ))}
                </div>

                {/* Code Body */}
                <div className="p-4 bg-[#FFFFFF] font-mono text-[12px] leading-relaxed text-[#1D1D1F] overflow-x-auto min-h-[220px]">
                  <pre className="text-[#1D1D1F]">
                    <code>{sampleSnippets[activeCodeTab].code}</code>
                  </pre>
                </div>

                {/* Integrated Console Drawer */}
                <div className="bg-[#F5F5F7] border-t border-[#E5E5EA] p-4 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#86868B] text-[11px] mb-1.5 uppercase tracking-wider">
                    <span>Standard Output</span>
                    <span className="text-[#34C759] font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Compiled Cleanly
                    </span>
                  </div>
                  <pre className="text-[#1D1D1F] whitespace-pre-wrap font-sans text-xs">
                    {sampleSnippets[activeCodeTab].output}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PILLARS OF MASTERY: Apple Inset Cards with Purposeful Whitespace */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
              Engineered for Depth
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F]">
              Beyond Syntax. Into System Architecture.
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              Most platforms teach what code to write. RA-Java teaches how memory is laid out, how threads schedule, and how production enterprise systems scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="apple-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F2FD] text-[#0071E3] flex items-center justify-center shadow-apple-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">
                JVM Internal Architecture
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                Step-by-step mental models for Stack and Heap allocation, Metaspace, JIT C1/C2 compilation, and Garbage Collection mechanics (G1 &amp; ZGC).
              </p>
            </div>

            <div className="apple-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF9EE] text-[#34C759] flex items-center justify-center shadow-apple-sm">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">
                Real-Time Sandboxed Compiler
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                Test your code against automated public and concealed edge cases in an authentic OpenJDK 21 execution container with millisecond profiling.
              </p>
            </div>

            <div className="apple-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5E5] text-[#FF9500] flex items-center justify-center shadow-apple-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">
                Placement Interview Rigor
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                Curated problem banks, 5-question mock interview evaluations, and topic-level time-restricted examination arenas to build true job readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STRUCTURED CURRICULUM ROADMAP: Clean Inset Grouped Table */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                12 Progressive Modules
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] mt-1">
                Complete Curriculum Specification
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                From basic primitives to distributed multithreading and NIO.2 file handling.
              </p>
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-full border border-[#E5E5EA] text-xs overflow-x-auto no-scrollbar">
              {(['all', 'core', 'oop', 'collections', 'concurrency'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full transition-all capitalize whitespace-nowrap flex-shrink-0 ${
                    activeCategory === cat
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-apple-sm'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {cat === 'all' ? 'All Modules (12)' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* High-Density Inset Grouped Table */}
          <div className="apple-inset-group shadow-apple-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F5F7] text-[11px] uppercase tracking-wider text-[#86868B] border-b border-[#E5E5EA]">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Sequence &amp; Title</th>
                    <th className="px-6 py-3.5 font-semibold">Division</th>
                    <th className="px-6 py-3.5 font-semibold">Problems</th>
                    <th className="px-6 py-3.5 font-semibold">Guide Size</th>
                    <th className="px-6 py-3.5 font-semibold">Duration</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EA]">
                  {filteredModules.map((mod) => (
                    <tr key={mod.id} className="hover:bg-[#F5F5F7]/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] flex items-center justify-center font-mono font-medium text-[11px]">
                            {mod.id}
                          </span>
                          <span className="font-semibold text-sm text-[#1D1D1F]">
                            {mod.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#E8F2FD] text-[#0071E3] font-medium text-[11px] capitalize">
                          {mod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[#1D1D1F]">
                        {mod.problems} challenges
                      </td>
                      <td className="px-6 py-4 text-[#6E6E73]">
                        {mod.pdfs}
                      </td>
                      <td className="px-6 py-4 text-[#86868B]">
                        {mod.time}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/modules"
                          className="inline-flex items-center gap-1 text-[#0071E3] hover:underline font-medium text-xs"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUE COMPARISON MATRIX: Apple Clear Table */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5EA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
              Simple &amp; Transparent
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              Why RA-Java vs. Traditional Options
            </h2>
          </div>

          <div className="apple-inset-group shadow-apple-card text-left text-xs">
            <table className="w-full">
              <thead className="bg-[#F5F5F7] text-[11px] uppercase tracking-wider text-[#86868B] border-b border-[#E5E5EA]">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Features &amp; Standards</th>
                  <th className="px-6 py-3.5 font-semibold text-[#0071E3]">RA-Java (100% Free)</th>
                  <th className="px-6 py-3.5 font-semibold text-[#86868B]">Generic LeetCode / YouTube</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5EA]">
                <tr className="hover:bg-[#F5F5F7]/60">
                  <td className="px-6 py-4 font-medium text-[#1D1D1F]">Curriculum Structure</td>
                  <td className="px-6 py-4 text-[#34C759] font-medium">12 Organized Modules with Sequential Mastery</td>
                  <td className="px-6 py-4 text-[#86868B]">Disjointed algorithms without JVM foundations</td>
                </tr>
                <tr className="hover:bg-[#F5F5F7]/60">
                  <td className="px-6 py-4 font-medium text-[#1D1D1F]">Compiler Sandbox</td>
                  <td className="px-6 py-4 text-[#34C759] font-medium">Isolated OpenJDK 21 Subprocess Execution</td>
                  <td className="px-6 py-4 text-[#86868B]">Often outdated or third-party webframes</td>
                </tr>
                <tr className="hover:bg-[#F5F5F7]/60">
                  <td className="px-6 py-4 font-medium text-[#1D1D1F]">Hidden Test Verification</td>
                  <td className="px-6 py-4 text-[#34C759] font-medium">3-Tier Automated Suite with Anti-Cheat Hidden Cases</td>
                  <td className="px-6 py-4 text-[#86868B]">Basic visible samples only</td>
                </tr>
                <tr className="hover:bg-[#F5F5F7]/60">
                  <td className="px-6 py-4 font-medium text-[#1D1D1F]">Access Model</td>
                  <td className="px-6 py-4 text-[#34C759] font-bold">100% Free Community Lifetime Access</td>
                  <td className="px-6 py-4 text-[#86868B]">₹2,500/mo subscription or fragmented videos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS: Clean Accordion */}
      <section className="py-20 sm:py-28 border-b border-[#E5E5EA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
              Clarity First
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="apple-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-sm text-[#1D1D1F]">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#0071E3] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#86868B] flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-[#6E6E73] leading-relaxed border-t border-[#E5E5EA] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER: Apple-Grade Quiet Confidence */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="apple-card p-10 sm:p-16 text-center space-y-6 shadow-apple-float bg-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF9EE] text-[#34C759] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free Lifetime Access</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
              Begin Your Java Journey with RA-Java.
            </h2>

            <p className="text-sm sm:text-base text-[#6E6E73] max-w-xl mx-auto leading-relaxed">
              Unlock the entire 12-module syllabus, 42+ coding challenges, and OpenJDK 21 compiler sandbox completely free.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-sm px-8 py-3 rounded-full shadow-apple-sm transition-all"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/modules"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-sm px-6 py-3 rounded-full transition-all"
              >
                <span>Explore Modules</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
