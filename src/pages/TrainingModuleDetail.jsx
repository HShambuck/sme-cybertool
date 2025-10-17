import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  Play,
  Award,
  BookOpen,
  Video,
  FileText,
  Star,
  Loader2,
} from "lucide-react";
import {
  getModuleById,
  startModule,
  updateProgress,
  completeModule,
  submitQuiz,
  rateModule,
} from "../services/training";

const TrainingModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("overview"); // overview, quiz, completed
  const [selectedStep, setSelectedStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchModule();
  }, [id]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const data = await getModuleById(id);
      setModule(data.module);
      setProgress(data.progress);

      // Initialize quiz answers if quiz exists
      if (data.module.quiz && data.module.quiz.questions) {
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
      const updatedProgress = await startModule(id);
      setProgress(updatedProgress);
    } catch (error) {
      console.error("Error starting module:", error);
    }
  };

  const handleCompleteStep = async (stepNumber) => {
    try {
      const updatedProgress = await updateProgress(id, {
        stepNumber,
        timeSpent: 5, // Track time if needed
      });
      setProgress(updatedProgress);
    } catch (error) {
      console.error("Error completing step:", error);
    }
  };

  const handleCompleteModule = async () => {
    try {
      setSubmitting(true);
      await completeModule(id);
      await fetchModule();
      setCurrentView("completed");
    } catch (error) {
      console.error("Error completing module:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      const result = await submitQuiz(id, quizAnswers);
      setQuizResult(result);

      if (result.passed) {
        await fetchModule(); // Refresh to get updated completion status
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRating = async () => {
    try {
      setSubmitting(true);
      await rateModule(id, rating, feedback);
      await fetchModule();
      alert("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isStepCompleted = (stepNumber) => {
    return progress?.completedSteps?.some((s) => s.stepNumber === stepNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Module not found</p>
          <button
            onClick={() => setCurrentView("training")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  // Overview View
  const OverviewView = () => (
    <div className="space-y-6">
      {/* Video */}
      {module.videoUrl && (
        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={module.videoUrl.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allowFullScreen
              title={module.title}
            ></iframe>
          </div>
        </div>
      )}

      {/* Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Overview</h3>
        <p className="text-slate-700 mb-6">{module.content.overview}</p>

        {/* Learning Objectives */}
        {module.content.learningObjectives && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">
              What You'll Learn
            </h4>
            <ul className="space-y-2">
              {module.content.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Training Steps
        </h3>
        <div className="space-y-4">
          {module.content.steps.map((step, idx) => {
            const completed = isStepCompleted(step.stepNumber);
            return (
              <div
                key={idx}
                className={`border-l-4 pl-4 py-3 ${
                  completed
                    ? "border-green-500 bg-green-50"
                    : selectedStep === idx
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400 mr-2" />
                      )}
                      <h4 className="font-semibold text-slate-900">
                        Step {step.stepNumber}: {step.title}
                      </h4>
                    </div>
                    <p className="text-slate-700 ml-7">{step.description}</p>

                    {/* Resources */}
                    {step.resources && step.resources.length > 0 && (
                      <div className="ml-7 mt-2 space-y-1">
                        {step.resources.map((resource, ridx) => (
                          <a
                            key={ridx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            {resource.resourceType === "video" ? (
                              <Video className="h-4 w-4 mr-1" />
                            ) : (
                              <FileText className="h-4 w-4 mr-1" />
                            )}
                            View Resource
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {!completed && (
                    <button
                      onClick={() => handleCompleteStep(step.stepNumber)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist */}
      {module.content.checklistItems &&
        module.content.checklistItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Implementation Checklist
            </h3>
            <div className="space-y-2">
              {module.content.checklistItems.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-start cursor-pointer hover:bg-slate-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    defaultChecked={item.completed}
                  />
                  <span className="ml-3 text-slate-700">{item.item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {module.quiz && module.quiz.questions && (
          <button
            onClick={() => setCurrentView("quiz")}
            className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Take Quiz
          </button>
        )}
        {progress?.status !== "completed" && (
          <button
            onClick={handleCompleteModule}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Award className="h-5 w-5 mr-2" />
                Complete Module
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  // Quiz View
  const QuizView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          Knowledge Check
        </h3>
        <p className="text-slate-600 mb-6">
          Test your understanding with this quiz. You need{" "}
          {module.quiz.passingScore}% to pass.
        </p>

        {!quizResult ? (
          <div className="space-y-8">
            {module.quiz.questions.map((question, qIdx) => (
              <div
                key={qIdx}
                className="border-b border-slate-200 pb-6 last:border-0"
              >
                <h4 className="font-semibold text-slate-900 mb-3">
                  {qIdx + 1}. {question.question}
                </h4>
                <div className="space-y-2">
                  {question.options.map((option, oIdx) => (
                    <label
                      key={oIdx}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        quizAnswers[qIdx] === oIdx
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        checked={quizAnswers[qIdx] === oIdx}
                        onChange={() => {
                          const newAnswers = [...quizAnswers];
                          newAnswers[qIdx] = oIdx;
                          setQuizAnswers(newAnswers);
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView("overview")}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300"
              >
                Back to Module
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={quizAnswers.includes(null) || submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              className={`text-center p-8 rounded-xl ${
                quizResult.passed ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div
                className={`text-6xl font-bold mb-4 ${
                  quizResult.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {quizResult.score}%
              </div>
              <p
                className={`text-xl font-semibold mb-2 ${
                  quizResult.passed ? "text-green-800" : "text-red-800"
                }`}
              >
                {quizResult.passed
                  ? "Congratulations! You Passed!"
                  : "Keep Learning"}
              </p>
              <p className="text-slate-600">
                You got {quizResult.correctCount} out of{" "}
                {quizResult.totalQuestions} questions correct
              </p>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  setQuizResult(null);
                  setQuizAnswers(
                    new Array(module.quiz.questions.length).fill(null)
                  );
                }}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300"
              >
                Retake Quiz
              </button>
              <button
                onClick={() =>
                  setCurrentView(quizResult.passed ? "completed" : "overview")
                }
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                {quizResult.passed ? "Finish Module" : "Review Content"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Completed View
  const CompletedView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-8 text-center">
        <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Module Completed!
        </h2>
        <p className="text-slate-600">
          Great job completing this training module
        </p>
      </div>

      {/* Rating */}
      {!progress?.rating && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Rate This Module
          </h3>
          <div className="flex gap-2 mb-4 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-2"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg mb-4"
            rows="3"
          ></textarea>
          <button
            onClick={handleSubmitRating}
            disabled={rating === 0 || submitting}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300"
      >
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("../dashboard")}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {module.title}
              </h1>
              <p className="text-slate-600">{module.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {module.estimatedDuration} min
            </span>
            <span className="capitalize">{module.difficulty}</span>
            <span>{module.content.steps?.length || 0} steps</span>
          </div>

          {/* Progress Bar */}
          {progress && progress.status !== "not_started" && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">
                  Your Progress
                </span>
                <span className="text-slate-600">{progress.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Start Button */}
          {progress?.status === "not_started" && (
            <button
              onClick={handleStartModule}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Training
            </button>
          )}
        </div>

        {/* Content */}
        {progress?.status === "not_started" ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">
              Click "Start Training" to begin this module
            </p>
          </div>
        ) : currentView === "overview" ? (
          <OverviewView />
        ) : currentView === "quiz" ? (
          <QuizView />
        ) : (
          <CompletedView />
        )}
      </div>
    </div>
  );
};

export default TrainingModuleDetail;
