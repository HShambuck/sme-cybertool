import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Clock, CheckCircle, Circle, Play,
  Award, BookOpen, Video, FileText, Star, Loader2,
} from "lucide-react";
import {
  getModuleById, startModule, updateProgress,
  completeModule, submitQuiz, rateModule,
} from "../../services/training";

const TrainingModuleDetail = ({ moduleId, setCurrentView }) => {
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState("overview");
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (moduleId) fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const data = await getModuleById(moduleId);
      setModule(data.module);
      setProgress(data.progress);
      if (data.module.quiz?.questions) {
        setQuizAnswers(new Array(data.module.quiz.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Error fetching module:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartModule = async () => {
    try {
      const updated = await startModule(moduleId);
      setProgress(updated);
    } catch (error) {
      console.error("Error starting module:", error);
    }
  };

  const handleCompleteStep = async (stepNumber) => {
    try {
      const updated = await updateProgress(moduleId, { stepNumber, timeSpent: 5 });
      setProgress(updated);
    } catch (error) {
      console.error("Error completing step:", error);
    }
  };

  const handleCompleteModule = async () => {
    try {
      setSubmitting(true);
      await completeModule(moduleId);
      await fetchModule();
      setCurrentSection("completed");
    } catch (error) {
      console.error("Error completing module:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      const result = await submitQuiz(moduleId, quizAnswers);
      setQuizResult(result);
      if (result.passed) await fetchModule();
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRating = async () => {
    try {
      setSubmitting(true);
      await rateModule(moduleId, rating, feedback);
      await fetchModule();
    } catch (error) {
      console.error("Error rating module:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isStepCompleted = (stepNumber) =>
    progress?.completedSteps?.some((s) => s.stepNumber === stepNumber);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-[3px] border-slate-800 border-t-blue-500 animate-spin" />
          <Loader2 className="h-6 w-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
          Loading Module...
        </p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-20 bg-[#0F172A] border border-slate-800 rounded-[40px]">
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs mb-6">
          Module not found
        </p>
        <button
          onClick={() => setCurrentView("training")}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
        >
          Back to Modules
        </button>
      </div>
    );
  }

  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Video */}
      {module.videoUrl && (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={module.videoUrl.replace("watch?v=", "embed/")}
              className="w-full h-full rounded-[32px]"
              allowFullScreen
              title={module.title}
            />
          </div>
        </div>
      )}

      {/* Overview */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
          Overview
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm mb-6">
          {module.content.overview}
        </p>
        {module.content.learningObjectives?.length > 0 && (
          <>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
              What You'll Learn
            </h4>
            <ul className="space-y-3">
              {module.content.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{obj}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Steps */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">
          Training Steps
        </h3>
        <div className="space-y-4">
          {module.content.steps.map((step, idx) => {
            const completed = isStepCompleted(step.stepNumber);
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  completed
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-slate-900/50 border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {completed ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-black text-white mb-1">
                        Step {step.stepNumber}: {step.title}
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {step.description}
                      </p>
                      {step.resources?.map((resource, ridx) => (
                        <a
                          key={ridx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
                        >
                          {resource.type === "video" ? (
                            <Video className="h-3.5 w-3.5" />
                          ) : (
                            <FileText className="h-3.5 w-3.5" />
                          )}
                          View Resource
                        </a>
                      ))}
                    </div>
                  </div>
                  {!completed && progress?.status !== "not_started" && (
                    <button
                      onClick={() => handleCompleteStep(step.stepNumber)}
                      className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all flex-shrink-0"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist */}
      {module.content.checklistItems?.length > 0 && (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">
            Implementation Checklist
          </h3>
          <div className="space-y-3">
            {module.content.checklistItems.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-slate-900/50 transition-all"
              >
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
                />
                <span className="text-slate-300 text-sm">{item.item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {module.quiz?.questions?.length > 0 && (
          <button
            onClick={() => setCurrentSection("quiz")}
            className="flex-1 px-6 py-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" /> Take Quiz
          </button>
        )}
        {progress?.status !== "completed" && (
          <button
            onClick={handleCompleteModule}
            disabled={submitting}
            className="flex-1 px-6 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <><Award className="h-4 w-4" /> Complete Module</>
            )}
          </button>
        )}
      </div>
    </div>
  );

  const QuizSection = () => (
    <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8 space-y-8">
      <div>
        <h3 className="text-lg font-black text-white mb-1">Knowledge Check</h3>
        <p className="text-slate-500 text-xs">
          You need {module.quiz.passingScore}% to pass.
        </p>
      </div>

      {!quizResult ? (
        <>
          {module.quiz.questions.map((question, qIdx) => (
            <div key={qIdx} className="space-y-3">
              <h4 className="text-sm font-black text-white">
                {qIdx + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option, oIdx) => (
                  <label
                    key={oIdx}
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      quizAnswers[qIdx] === oIdx
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${qIdx}`}
                      checked={quizAnswers[qIdx] === oIdx}
                      onChange={() => {
                        const updated = [...quizAnswers];
                        updated[qIdx] = oIdx;
                        setQuizAnswers(updated);
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-slate-300 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setCurrentSection("overview")}
              className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:border-slate-700 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleSubmitQuiz}
              disabled={quizAnswers.includes(null) || submitting}
              className="flex-1 px-6 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div
            className={`p-8 rounded-2xl ${
              quizResult.passed
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}
          >
            <div
              className={`text-6xl font-black mb-3 ${
                quizResult.passed ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {quizResult.score}%
            </div>
            <p className={`text-sm font-black uppercase tracking-widest ${
              quizResult.passed ? "text-emerald-400" : "text-red-400"
            }`}>
              {quizResult.passed ? "Passed" : "Not Passed"}
            </p>
            <p className="text-slate-400 text-xs mt-2">
              {quizResult.correctCount} of {quizResult.totalQuestions} correct
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setQuizResult(null);
                setQuizAnswers(new Array(module.quiz.questions.length).fill(null));
              }}
              className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:border-slate-700 transition-all"
            >
              Retake
            </button>
            <button
              onClick={() =>
                setCurrentSection(quizResult.passed ? "completed" : "overview")
              }
              className="flex-1 px-6 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all"
            >
              {quizResult.passed ? "Finish" : "Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const CompletedSection = () => (
    <div className="space-y-6">
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] p-12 text-center">
        <Award className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Module Complete</h2>
        <p className="text-slate-400 text-sm">
          You have completed this training module.
        </p>
      </div>

      {!progress?.rating && (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">
            Rate This Module
          </h3>
          <div className="flex gap-2 justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="p-1">
                <Star
                  className={`h-8 w-8 transition-all ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-700 hover:text-slate-500"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 text-sm placeholder-slate-600 outline-none focus:border-blue-500/50 mb-4 resize-none"
            rows="3"
          />
          <button
            onClick={handleSubmitRating}
            disabled={rating === 0 || submitting}
            className="w-full px-6 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      )}

      <button
        onClick={() => setCurrentView("training")}
        className="w-full px-6 py-4 bg-slate-900/50 border border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:border-slate-700 transition-all"
      >
        Back to Modules
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
        <button
          onClick={() => setCurrentView("training")}
          className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Modules
        </button>

        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              {module.title}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              {module.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 text-slate-500">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
            <Clock className="h-3.5 w-3.5" /> {module.estimatedDuration} min
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest capitalize">
            {module.difficulty}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {module.content.steps?.length || 0} steps
          </span>
        </div>

        {progress && progress.status !== "not_started" && (
          <div className="mt-6">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">
              <span>Progress</span>
              <span className="text-blue-500">{progress.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-1000"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {progress?.status === "not_started" && (
          <button
            onClick={handleStartModule}
            className="mt-6 px-8 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all flex items-center gap-2"
          >
            <Play className="h-4 w-4 fill-white" /> Start Training
          </button>
        )}
      </div>

      {/* Content */}
      {progress?.status === "not_started" ? (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-12 text-center">
          <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-600 font-black uppercase tracking-widest text-xs">
            Click Start Training to begin
          </p>
        </div>
      ) : currentSection === "overview" ? (
        <OverviewSection />
      ) : currentSection === "quiz" ? (
        <QuizSection />
      ) : (
        <CompletedSection />
      )}
    </div>
  );
};

export default TrainingModuleDetail;