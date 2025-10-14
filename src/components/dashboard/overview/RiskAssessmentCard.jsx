import React from "react";
import { CheckCircle, Shield } from "lucide-react";

const RiskAssessmentCard = ({ riskData, setCurrentView }) => {
  // Format the date properly
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate weeks ago from lastAssessment date
  const calculateWeeksAgo = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";

    try {
      const assessmentDate = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - assessmentDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 7) {
        return { type: "days", value: diffDays };
      } else {
        const diffWeeks = Math.floor(diffDays / 7);
        return { type: "weeks", value: diffWeeks };
      }
    } catch (error) {
      return "N/A";
    }
  };

  const formattedDate = formatDate(riskData.lastAssessment);
  const weeksAgo = calculateWeeksAgo(riskData.lastAssessment);

  // Determine color scheme based on score
  const getColorScheme = (score) => {
    if (score >= 80)
      return {
        progress: "bg-emerald-500",
        text: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    if (score >= 50)
      return {
        progress: "bg-amber-500",
        text: "text-amber-600",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
      };
    return {
      progress: "bg-red-500",
      text: "text-red-600",
      badge: "bg-red-50 text-red-700 border-red-200",
    };
  };

  const colors = getColorScheme(riskData.score);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Score Section */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Your Latest Risk Assessment
          </h2>
        </div>

        <div className="flex items-end space-x-4 mb-6">
          <div className={`text-7xl font-bold ${colors.text}`}>
            {riskData.score}
          </div>
          <div className="text-4xl font-light text-slate-300 pb-3">/100</div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
            <div
              className={`${colors.progress} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${riskData.score}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${colors.badge}`}
            >
              {riskData.level}
            </span>
            <span className="text-sm text-slate-500">
              Completed: {formattedDate}
            </span>
          </div>
        </div>

        {/* Supportive message */}
        <div
          className={`mt-6 p-4 rounded-xl border ${
            riskData.score >= 80
              ? "bg-emerald-50 border-emerald-200"
              : riskData.score >= 50
              ? "bg-amber-50 border-amber-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <p className="text-sm font-medium text-slate-700 flex items-start">
            <span className="mr-2">
              {riskData.score >= 80 ? "✓" : riskData.score >= 50 ? "⚠" : "⚠"}
            </span>
            <span>
              {riskData.score >= 80
                ? "Great job! Your business is showing strong resilience against risks. Keep following best practices."
                : riskData.score >= 50
                ? "You're in the medium risk zone. Addressing key recommendations will significantly boost your protection."
                : "High risk detected! Immediate action is recommended to secure your business and data."}
            </span>
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col justify-center text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-emerald-600" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Assessment Status
        </h3>
        <p className="text-slate-600 mb-4">
          {weeksAgo === "N/A"
            ? "No recent assessments"
            : weeksAgo.type === "days"
            ? `Last checked: ${
                weeksAgo.value === 0
                  ? "today"
                  : `${weeksAgo.value} ${
                      weeksAgo.value === 1 ? "day" : "days"
                    } ago`
              }`
            : `Last checked: ${weeksAgo.value} ${
                weeksAgo.value === 1 ? "week" : "weeks"
              } ago`}
        </p>
        <button
          onClick={() => setCurrentView("assessment")}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm cursor-pointer ease-in"
        >
          Run a New Assessment
        </button>
        <p className="text-xs text-center text-slate-500 mt-3">
          Stay protected anytime
        </p>
      </div>
    </div>
  );
};

export default RiskAssessmentCard;
