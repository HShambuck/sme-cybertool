import React from "react";

const TrainingProgressCard = ({ trainingProgress }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Training Progress
      </h3>
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${
                2 * Math.PI * 36 * (1 - trainingProgress.percentage / 100)
              }`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {trainingProgress.percentage}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Modules Completed: {trainingProgress.completed}/
          {trainingProgress.total}
        </p>
      </div>
    </div>
  );
};

export default TrainingProgressCard;
