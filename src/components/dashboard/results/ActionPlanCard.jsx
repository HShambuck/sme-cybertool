import React from "react";
import { Shield, Target, Zap, TrendingUp, AlertTriangle } from "lucide-react";

const ActionPlanCard = ({ assessmentData, recommendationCount }) => {
  return (
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
            <h2 className="text-2xl font-bold text-slate-900">Action Plan</h2>
            <p className="text-slate-600">Personalized security improvements</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600">
            {recommendationCount}
          </div>
          <div className="text-sm text-slate-600">
            {recommendationCount === 1 ? "Recommendation" : "Recommendations"}
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
                {recommendationCount !== 1 ? "s" : ""} where you can strengthen
                your security posture. Each recommendation includes guided
                training to help you implement improvements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPlanCard;
