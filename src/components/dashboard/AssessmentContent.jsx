// src/components/dashboard/AssessmentContent.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Lock,
  Activity,
  Zap,
  CheckCircle2,
  Layout,
  ListChecks,
  ShieldAlert,
} from "lucide-react";
import { assessmentQuestions } from "./assessment/assessmentQuestions";
import { createAssessment } from "../../services/assessment";

const AssessmentContent = ({ setCurrentView }) => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Group questions by domain for the "Solid" Sidebar look
  const domains = useMemo(() => {
    return [...new Set(assessmentQuestions.map((q) => q.domain))];
  }, []);

  const currentQuestion = assessmentQuestions[currentIdx];
  const progress = Math.round(
    ((currentIdx + 1) / assessmentQuestions.length) * 100,
  );

  const handleAnswer = (value, impact) => {
    setAnswers({ ...answers, [currentQuestion.id]: { value, impact } });
    if (currentIdx < assessmentQuestions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 300); // Smooth auto-advance
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Build payload from answers
      const questionsAnswered = assessmentQuestions
        .filter((q) => answers[q.id])
        .map((q) => ({
          questionId: q.id,
          question: q.question,
          answer: answers[q.id].value,
          scoreImpact: answers[q.id].impact,
        }));

      // Hit the backend
      const response = await createAssessment({ questionsAnswered });

      // Navigate to results with the assessment data
      navigate("/assessment/results", {
        state: { assessment: response.assessment },
      });
    } catch (err) {
      console.error("❌ Assessment submission failed:", err);
      setError(err.message || "Failed to submit assessment. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* LEFT: DOMAIN PROGRESS SIDEBAR */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center">
            <ListChecks className="h-4 w-4 mr-2 text-blue-500" /> Audit Progress
          </h3>
          <div className="space-y-3">
            {domains.map((domain, i) => {
              const isCurrent = currentQuestion.domain === domain;
              const isPast = domains.indexOf(currentQuestion.domain) > i;
              return (
                <div key={domain} className="flex items-center space-x-3">
                  <div
                    className={`h-2 w-2 rounded-full transition-all duration-500 ${
                      isCurrent
                        ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                        : isPast
                          ? "bg-emerald-500"
                          : "bg-slate-800"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      isCurrent
                        ? "text-white"
                        : isPast
                          ? "text-slate-400"
                          : "text-slate-600"
                    }`}
                  >
                    {domain}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Completion
              </span>
              <span className="text-blue-500 font-black text-xs">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: THE TERMINAL INTERFACE */}
      <div className="lg:col-span-3">
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-12 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          {isSubmitting ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-20 w-20 rounded-full border-t-2 border-blue-600 animate-spin" />
              <h2 className="text-2xl font-black text-white tracking-tight">
                Finalizing Risk Matrix...
              </h2>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                Uploading encrypted node data to SME-Cloud
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1.5 bg-blue-500/10 rounded-full text-blue-500 text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
                    Query {currentIdx + 1} of {assessmentQuestions.length}
                  </span>
                  <span className="text-slate-600 font-mono text-[10px] uppercase tracking-widest">
                    Protocol v4.0.1
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-blue-500 font-black text-[11px] uppercase tracking-[0.3em] italic">
                    {currentQuestion.domain}
                  </h4>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight max-w-3xl">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-6">
                  {currentQuestion.options.map((opt) => {
                    const isSelected =
                      answers[currentQuestion.id]?.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value, opt.scoreImpact)}
                        className={`group p-6 rounded-3xl border text-left transition-all duration-300 flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-600 border-blue-400 shadow-xl shadow-blue-900/20"
                            : "bg-slate-900/40 border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-bold transition-colors ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                          >
                            {opt.label}
                          </p>
                          <p
                            className={`text-[10px] mt-1 font-medium ${isSelected ? "text-blue-100" : "text-slate-500"}`}
                          >
                            {isSelected
                              ? "Selection confirmed"
                              : "Click to select response"}
                          </p>
                        </div>
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-white border-white"
                              : "border-slate-700 group-hover:border-slate-500"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              {/* FOOTER CONTROLS */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-800/50">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="flex items-center text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors disabled:opacity-20"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Query
                </button>

                {currentIdx === assessmentQuestions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-10 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 flex items-center"
                  >
                    Finish & Analyze <Zap className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="flex items-center text-blue-500 hover:text-blue-400 font-black text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Skip <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentContent;
