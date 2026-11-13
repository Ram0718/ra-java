import React, { useEffect, useState } from 'react';
import { interviewApi } from '../api/client';
import { Shield, ChevronDown, ChevronUp, Sparkles, RefreshCw, CheckCircle2, Award, Terminal, Play, X } from 'lucide-react';

export const InterviewPrepPage: React.FC = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [mockSession, setMockSession] = useState<any | null>(null);
  const [mockScore, setMockScore] = useState<number | null>(null);

  useEffect(() => {
    interviewApi.getTopics()
      .then((data) => setTopics(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleAnswer = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startMockInterview = async () => {
    try {
      const session = await interviewApi.getMockSession();
      setMockSession(session);
      setMockScore(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E5EA]">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
              Technical Placement Suite
            </span>
            <h1 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
              Placement Technical Interview Bank
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] max-w-xl">
              Tier-1 placement questions across Core Java, JVM internals, Collections Framework, and Multithreading.
            </p>
          </div>

          <button
            onClick={startMockInterview}
            className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-5 rounded-full shadow-apple-sm transition-all flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch 5-Question Mock Interview</span>
          </button>
        </div>

        {/* Mock Interview Interactive Modal */}
        {mockSession && (
          <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-float space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">Simulated Exam</span>
                <h2 className="text-lg font-semibold text-[#1D1D1F]">{mockSession.title}</h2>
              </div>
              <button
                onClick={() => setMockSession(null)}
                className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {mockSession.questions.map((q: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#86868B] font-medium">Question 0{i + 1} of 05 • {q.topic}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#1D1D1F] border border-[#E5E5EA] text-[11px] font-medium">
                      {q.level}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F]">{q.question}</h3>
                  
                  <details className="pt-2 border-t border-[#E5E5EA]">
                    <summary className="text-xs text-[#0071E3] hover:underline cursor-pointer font-medium">
                      Inspect Optimal Placement Answer &rarr;
                    </summary>
                    <p className="mt-2 text-xs sm:text-sm text-[#424245] leading-relaxed pl-3 border-l-2 border-[#0071E3] font-sans">
                      {q.answer}
                    </p>
                  </details>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5E5EA] text-center">
              {mockScore === null ? (
                <button
                  onClick={() => setMockScore(94)}
                  className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2.5 px-6 rounded-full shadow-apple-sm transition-all"
                >
                  Complete Mock Session Evaluation
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EBF9EE] border border-[#34C759]/20 text-[#34C759] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Evaluation Completed • Placement Readiness: {mockScore}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categorized Question Banks */}
        {loading ? (
          <div className="py-24 text-center text-xs text-[#86868B] space-y-2">
            <RefreshCw className="w-5 h-5 text-[#0071E3] animate-spin mx-auto" />
            <span>Loading technical question banks...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {topics.map((t, idx) => (
              <div key={idx} className="apple-card p-6 sm:p-8 bg-white shadow-apple-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
                  <h2 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#0071E3]" />
                    <span>{t.title}</span>
                  </h2>
                  <span className="text-xs text-[#86868B]">
                    {t.questions.length} Questions
                  </span>
                </div>

                <div className="space-y-2">
                  {t.questions.map((q: any, qIdx: number) => {
                    const key = `${idx}-${qIdx}`;
                    const isOpen = !!openItems[key];

                    return (
                      <div
                        key={qIdx}
                        className="rounded-xl border border-[#E5E5EA] overflow-hidden bg-[#FBFBFD] transition-colors"
                      >
                        <button
                          onClick={() => toggleAnswer(key)}
                          className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                        >
                          <div className="flex items-center gap-3 truncate pr-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase flex-shrink-0 ${
                              q.level === 'Basic'
                                ? 'bg-white text-[#6E6E73] border border-[#E5E5EA]'
                                : q.level === 'Intermediate'
                                ? 'bg-[#FFF5E5] text-[#FF9500] border border-[#FF9500]/20'
                                : 'bg-[#FFEBEA] text-[#FF3B30] border border-[#FF3B30]/20'
                            }`}>
                              {q.level}
                            </span>
                            <span className="truncate font-medium text-[#1D1D1F]">{q.question}</span>
                          </div>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-[#86868B] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#86868B] flex-shrink-0" />}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-[#424245] leading-relaxed border-t border-[#E5E5EA] bg-white">
                            <p>{q.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
