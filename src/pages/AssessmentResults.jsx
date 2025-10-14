import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  TrendingUp,
  Award,
  CheckCircle,
  AlertTriangle,
  Brain,
  Sparkles,
  Home,
  BookOpen,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";

const AssessmentResults = ({assessment, setCurrentView}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);

  // Get assessment data from navigation state
  const assessmentData = assessment || location.state?.assessment;

  // DEBUG: Log what we received
  useEffect(() => {
    console.log("🔍 Assessment Results Debug:");
    console.log("Props assessment:", assessment);
    console.log("Location state:", location.state);
    console.log("Final assessmentData:", assessmentData);
  }, [assessment, location.state, assessmentData]);

  useEffect(() => {
    // If no assessment data, redirect to dashboard
    if (!assessmentData && !setCurrentView) {
      console.log("❌ No assessment data found, redirecting to dashboard");
      navigate("/dashboard");
      return;
    }

    console.log("✅ Assessment data found, showing loading animation");

    // Show loading animation then reveal results
    const timer = setTimeout(() => {
      console.log("✅ Showing results now");
      setShowResults(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [assessmentData, navigate, setCurrentView]);

  // If no data, show nothing (will redirect)
  if (!assessmentData && !setCurrentView) {
    console.log("⏳ Waiting for data or redirecting...");
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  // If no data but embedded (shouldn't happen), return null
  if (!assessmentData) {
    return null;
  }

  const getRiskColor = (level) => {
    switch (level) {
      case "LOW RISK":
        return {
          bg: "from-green-50 to-emerald-50",
          border: "border-green-200",
          text: "text-green-800",
          badge: "bg-green-100 text-green-800",
          progress: "bg-green-500",
        };
      case "MEDIUM RISK":
        return {
          bg: "from-yellow-50 to-amber-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          badge: "bg-yellow-100 text-yellow-800",
          progress: "bg-yellow-500",
        };
      case "HIGH RISK":
        return {
          bg: "from-orange-50 to-red-50",
          border: "border-orange-200",
          text: "text-orange-800",
          badge: "bg-orange-100 text-orange-800",
          progress: "bg-orange-500",
        };
      case "CRITICAL RISK":
        return {
          bg: "from-red-50 to-rose-50",
          border: "border-red-200",
          text: "text-red-800",
          badge: "bg-red-100 text-red-800",
          progress: "bg-red-500",
        };
      default:
        return {
          bg: "from-blue-50 to-indigo-50",
          border: "border-blue-200",
          text: "text-blue-800",
          badge: "bg-blue-100 text-blue-800",
          progress: "bg-blue-500",
        };
    }
  };

  const colors = getRiskColor(assessmentData.level);
  const recommendationCount = assessmentData.recommendationIds?.length || 0;

  console.log("📊 Rendering with:", {
    showResults,
    score: assessmentData.score,
    level: assessmentData.level,
    recommendationCount,
  });

  // Loading Animation
  if (!showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Brain className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                AI Analysis Complete
              </h3>
              <p className="text-slate-600 mb-6">
                Preparing your personalized security assessment...
              </p>
              <div className="flex justify-center space-x-2">
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Display
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
            <Award className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Assessment Complete!
          </h1>
          <p className="text-slate-600">
            Here's your comprehensive cybersecurity risk analysis
          </p>
        </div>

        {/* Risk Score Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6 animate-slide-up">
          <div
            className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-8 mb-6`}
          >
            <div className="text-center mb-4">
              <div className="text-6xl font-bold text-slate-900 mb-3">
                {assessmentData.score}
                <span className="text-3xl text-slate-500">/100</span>
              </div>
              <div
                className={`inline-block px-6 py-2 rounded-full text-sm font-bold ${colors.badge}`}
              >
                {assessmentData.level}
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
              <div
                className={`${colors.progress} h-4 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${assessmentData.score}%` }}
              ></div>
            </div>
          </div>

          {/* AI Explanation */}
          {assessmentData.explanation && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start space-x-3 mb-3">
                <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {assessmentData.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Summary */}
        <div
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Action Plan
                </h2>
                <p className="text-slate-600">
                  Personalized security improvements
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">
                {recommendationCount}
              </div>
              <div className="text-sm text-slate-600">
                {recommendationCount === 1
                  ? "Recommendation"
                  : "Recommendations"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {Math.round((assessmentData.score / 100) * 10)}/10
                  </div>
                  <div className="text-sm text-blue-700">Security Score</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">
                    {recommendationCount > 15
                      ? "High"
                      : recommendationCount > 8
                      ? "Medium"
                      : "Low"}
                  </div>
                  <div className="text-sm text-purple-700">Priority Level</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">
                    {100 - assessmentData.score}%
                  </div>
                  <div className="text-sm text-green-700">Growth Potential</div>
                </div>
              </div>
            </div>
          </div>

          {recommendationCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Action Required
                  </p>
                  <p className="text-sm text-amber-800">
                    We've identified {recommendationCount} specific area
                    {recommendationCount !== 1 ? "s" : ""} where you can
                    strengthen your security posture. Each recommendation
                    includes guided training to help you implement improvements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            What's Next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Review Your Recommendations
                </p>
                <p className="text-sm text-slate-600">
                  Explore personalized security improvements tailored to your
                  organization
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Complete Training Modules
                </p>
                <p className="text-sm text-slate-600">
                  Access step-by-step guides to implement each recommendation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Track Your Progress
                </p>
                <p className="text-sm text-slate-600">
                  Monitor improvements and retake assessments to measure growth
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={() =>
              navigate("/dashboard", {
                state: { view: "training", refreshData: true },
              })
            }
            className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            View Recommendations & Training
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
          <button
            onClick={() =>
              navigate("/dashboard", { state: { refreshData: true } })
            }
            className="flex items-center justify-center px-6 py-4 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Dashboard
          </button>
        </div>

        {/* Assessment Date */}
        <div className="text-center mt-8 text-sm text-slate-500">
          Assessment completed on{" "}
          {new Date(assessmentData.assessmentDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default AssessmentResults;
