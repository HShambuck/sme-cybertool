import React from "react";

const ProgressBar = ({ currentStep, totalPages, progress }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">
          Page {currentStep} of {totalPages}
        </span>
        <span className="text-sm font-semibold text-blue-600">
          {progress}% Complete
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-700 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
