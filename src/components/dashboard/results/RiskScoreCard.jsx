import React from "react";
import { Sparkles } from "lucide-react";

const RiskScoreCard = ({ assessmentData, colors }) => {
  return (
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
  );
};

export default RiskScoreCard;
