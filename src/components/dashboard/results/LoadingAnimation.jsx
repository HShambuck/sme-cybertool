import React from "react";
import { Brain } from "lucide-react";

const LoadingAnimation = () => {
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
};

export default LoadingAnimation;
