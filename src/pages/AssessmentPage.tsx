import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { assessmentApi } from '../api/client';
import type { AssessmentResult } from '../types';
import { Award, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertCircle, RefreshCw, ArrowLeft, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AssessmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const topicId = Number(searchParams.get('topicId') || 1);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [assessment, setAssessment] = useState<any | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    assessmentApi.getTopicAssessment(topicId)
      .then((data) => {
        setAssessment(data);
        setTimeLeft(data.timeLimitMinutes * 60);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setResult(null);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [topicId, isAuthenticated, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0 || !assessment) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft, assessment]);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (isSubmitted || !assessment) return;
    setSubmitting(true);
    try {
      const res = await assessmentApi.submitAssessment(assessment.id, selectedAnswers);
      setResult(res);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center text-xs text-[#86868B]">
        <RefreshCw className="w-5 h-5 text-[#0071E3] animate-spin mr-2" />
        <span>Loading exam questions and assessment schema...</span>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-4">
        <div className="apple-card p-8 bg-white text-center max-w-sm space-y-4">
          <p className="text-sm text-[#86868B]">No examination located for this topic.</p>
          <Link
            to="/modules"
            className="inline-flex items-center justify-center gap-2 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2.5 px-5 rounded-full transition-all"
          >
            Return to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Exam Navigation Bar */}
        <div className="apple-card p-6 sm:p-8 bg-white shadow-apple-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
              Topic Assessment • {assessment.topicTitle}
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] tracking-tight">
              {assessment.title}
            </h1>
            <p className="text-xs text-[#6E6E73]">
              Passing Threshold: {assessment.passingScore}% • {assessment.totalQuestions} Questions
            </p>
          </div>

          {!isSubmitted ? (
            <div className="flex items-center gap-2 bg-[#FFF5E5] border border-[#FF9500]/20 px-4 py-2 rounded-full font-mono text-xs">
              <Clock className="w-4 h-4 text-[#FF9500]" />
              <span className={`font-semibold ${timeLeft < 180 ? 'text-[#FF3B30]' : 'text-[#FF9500]'}`}>
                {formatTimer(timeLeft)}
              </span>
            </div>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2 px-4 rounded-full transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#86868B]" />
              <span>Retake Examination</span>
            </button>
          )}
        </div>

        {/* Result Banner */}
        {isSubmitted && result && (
          <div className={`apple-card p-8 text-center space-y-3 ${
            result.passed
              ? 'bg-[#EBF9EE] border-[#34C759]/30 text-[#2FB34F]'
              : 'bg-[#FFEBEA] border-[#FF3B30]/30 text-[#FF3B30]'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {result.passed ? (
                <CheckCircle2 className="w-7 h-7 text-[#34C759]" />
              ) : (
                <XCircle className="w-7 h-7 text-[#FF3B30]" />
              )}
              <h2 className="text-xl font-semibold text-[#1D1D1F]">
                {result.passed ? 'Assessment Passed' : 'Assessment Not Passed'}
              </h2>
            </div>
            <div className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
              Score: {result.score}%
            </div>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              {result.correctAnswers} of {result.totalQuestions} questions correct (Required: {result.passingScore}%)
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {(!isSubmitted ? assessment.questions : result?.reviewItems || []).map((q: any, i: number) => {
            const selectedIdx = selectedAnswers[q.id || q.questionId];

            return (
              <div
                key={q.id || q.questionId}
                className="apple-card p-6 sm:p-8 bg-white shadow-apple-card space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-[#86868B] pb-3 border-b border-[#E5E5EA]">
                  <span className="font-semibold text-[#1D1D1F]">Question {i + 1} of {assessment.totalQuestions}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#6E6E73] text-[11px] font-medium">
                    {q.questionType}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#1D1D1F] leading-relaxed">
                  {q.questionText}
                </h3>

                {q.codeSnippet && (
                  <pre className="bg-[#F5F5F7] border border-[#E5E5EA] p-4 rounded-xl font-mono text-xs text-[#1D1D1F] overflow-x-auto shadow-apple-sm">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* Option Choices (Apple Selectable Rows) */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt: string, optIdx: number) => {
                    let optStyle = 'bg-[#F5F5F7] border-[#E5E5EA] text-[#424245] hover:bg-[#E8E8ED] hover:border-[#D2D2D7]';
                    
                    if (!isSubmitted) {
                      if (selectedIdx === optIdx) {
                        optStyle = 'bg-[#E8F2FD] text-[#0071E3] font-semibold border-[#0071E3] shadow-apple-sm';
                      }
                    } else {
                      if (optIdx === q.correctOptionIndex) {
                        optStyle = 'bg-[#EBF9EE] border-[#34C759] text-[#2FB34F] font-semibold';
                      } else if (selectedIdx === optIdx && optIdx !== q.correctOptionIndex) {
                        optStyle = 'bg-[#FFEBEA] border-[#FF3B30] text-[#FF3B30]';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm border transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && optIdx === q.correctOptionIndex && (
                          <CheckCircle2 className="w-4 h-4 text-[#34C759] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Review Mode Explanation */}
                {isSubmitted && q.explanation && (
                  <div className="mt-4 p-4 bg-[#F5F5F7] border-l-4 border-[#0071E3] rounded-r-xl text-xs text-[#424245] space-y-1">
                    <span className="font-semibold text-[#1D1D1F] block">Explanation:</span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        {!isSubmitted && (
          <div className="pt-4 text-center">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-sm py-3 px-8 rounded-full shadow-apple-sm transition-all disabled:opacity-50"
            >
              <span>{submitting ? 'Evaluating Assessment...' : 'Submit Answers for Evaluation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
