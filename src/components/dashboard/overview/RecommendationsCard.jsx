import React from "react";
import { Shield, FileText, Sparkles } from "lucide-react";

const RecommendationsCard = ({ recommendations = [], setCurrentView }) => {
  const hasRecs = recommendations && recommendations.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">
        Recommendations to Improve Security Posture
      </h3>

      <div className="space-y-4">
        {hasRecs ? (
          recommendations.map((rec, index) => (
            <div key={rec.id} className="flex flex-col space-y-3">
              {/* Recommendation header with number */}
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-all">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium">{rec.text}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-blue-500 transition-colors cursor-pointer"></div>
                </div>
              </div>

              {/* Optional video */}
              {rec.videoUrl && (
                <div className="ml-11">
                  <video
                    src={rec.videoUrl}
                    controls
                    className="w-full rounded-lg border border-slate-200 shadow-sm"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center bg-blue-50 border border-blue-200 rounded-xl p-10">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                No Recommendations Yet
              </h4>
              <p className="text-sm text-slate-600 max-w-md">
                Take your first{" "}
                <span className="font-semibold text-slate-900">
                  risk assessment
                </span>{" "}
                to unlock{" "}
                <span className="font-semibold text-blue-600">
                  AI-powered insights
                </span>{" "}
                on how to strengthen your business security.
              </p>
              <p className="text-sm text-slate-500">
                Or jump right in with our{" "}
                <span className="font-semibold text-slate-700">
                  training modules
                </span>{" "}
                below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mt-8 justify-between">
        <button
          onClick={() => setCurrentView("training")}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm font-semibold cursor-pointer ease-in"
        >
          <Shield className="h-5 w-5 mr-2" />
          Start Training Modules
        </button>
        <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer ease-in font-semibold shadow-sm">
          <FileText className="h-5 w-5 mr-2" />
          View Detailed Report
        </button>
      </div>
    </div>
  );
};

export default RecommendationsCard;
