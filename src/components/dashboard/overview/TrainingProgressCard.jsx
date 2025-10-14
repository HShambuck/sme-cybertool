import React from "react";

const TrainingProgressCard = ({ trainingProgress }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-5">
        Training Progress
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#progressGradient)"
              strokeWidth="10"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${
                2 * Math.PI * 56 * (1 - trainingProgress.percentage / 100)
              }`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {trainingProgress.percentage}%
            </span>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Modules Completed: {trainingProgress.completed}/
          {trainingProgress.total}
        </p>
        <button className="mt-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm cursor-pointer ease-in">
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default TrainingProgressCard;
