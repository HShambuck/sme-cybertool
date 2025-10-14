import React from "react";
import { Brain } from "lucide-react";

const LoadingModal = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            AI Analysis in Progress
          </h3>
          <p className="text-slate-600 mb-6">
            Our AI is analyzing your responses and generating personalized
            insights...
          </p>
          <div className="flex justify-center space-x-2 mb-4">
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
          <p className="text-sm text-slate-500">
            This may take up to 60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
