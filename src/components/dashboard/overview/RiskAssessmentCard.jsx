import React from "react";
import { CheckCircle } from "lucide-react";

const RiskAssessmentCard = ({ riskData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Latest Risk Assessment Results
        </h2>
        <div className="flex items-end space-x-4 mb-4">
          <div className="text-6xl font-bold text-gray-800">
            {riskData.score}
          </div>
          <div className="text-3xl font-light text-gray-400 pb-2">/100</div>
        </div>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${riskData.score}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{riskData.level}</span>
            <span className="text-green-600">
              Assessment Completed: {riskData.lastAssessment}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
        <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">Risk Assessment</h3>
          <p className="text-gray-600">
            Completed: {riskData.completedWeeksAgo} weeks ago
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentCard;
