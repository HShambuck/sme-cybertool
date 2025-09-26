import React from "react";
import { CheckCircle, Shield } from "lucide-react";

const RiskAssessmentCard = ({ riskData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Score Section */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-500" />
          Your Latest Risk Assessment
        </h2>

        <div className="flex items-end space-x-4 mb-4">
          <div className="text-6xl font-bold text-gray-800">
            {riskData.score}
          </div>
          <div className="text-3xl font-light text-gray-400 pb-2">/100</div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                riskData.score >= 80
                  ? "bg-green-500"
                  : riskData.score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${riskData.score}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span
              className={`font-medium ${
                riskData.level.includes("LOW")
                  ? "text-green-600"
                  : riskData.level.includes("MEDIUM")
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {riskData.level}
            </span>
            <span className="text-gray-500">
              Completed on {riskData.lastAssessment}
            </span>
          </div>
        </div>

        {/* Supportive message */}
        <p className="text-sm text-gray-600 mt-4">
          {riskData.score >= 80
            ? "✅ Great job! Your business is showing strong resilience against risks. Keep following best practices."
            : riskData.score >= 50
            ? "⚠️ You're in the medium risk zone. Addressing key recommendations will significantly boost your protection."
            : "🚨 High risk detected! Immediate action is recommended to secure your business and data."}
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
        <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">Assessment Status</h3>
          <p className="text-gray-600">
            {riskData.completedWeeksAgo === "N/A"
              ? "No recent assessments"
              : `Last check: ${riskData.completedWeeksAgo} weeks ago`}
          </p>
          <p className="text-sm text-blue-600 font-medium mt-1">
            Run a new assessment anytime to stay protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentCard;
