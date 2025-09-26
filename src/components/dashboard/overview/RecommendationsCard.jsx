import React from "react";
import { Shield, FileText, Sparkles } from "lucide-react";

const RecommendationsCard = ({ recommendations = [] }) => {
  const hasRecs = recommendations && recommendations.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recommendations to Improve Security Posture
      </h3>

      <div className="space-y-4">
        {hasRecs ? (
          recommendations.map((rec, index) => (
            <div key={rec.id} className="flex flex-col space-y-2">
              {/* Recommendation header with number */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">{rec.text}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Optional video */}
              {rec.videoUrl && (
                <div className="mt-2">
                  <video
                    src={rec.videoUrl}
                    controls
                    className="w-full rounded-md border border-gray-200"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex flex-col items-center space-y-2">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <h4 className="text-md font-semibold text-gray-800">
                No Recommendations Yet
              </h4>
              <p className="text-sm text-gray-600 max-w-md">
                Take your first{" "}
                <span className="font-semibold">risk assessment</span> to unlock
                <span className="text-blue-600"> AI-powered insights</span> on
                how to strengthen your business security.
              </p>
              <p className="text-sm text-gray-600">
                Or jump right in with our{" "}
                <span className="font-semibold">training modules</span> below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-4 mt-6 justify-between">
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ease-in">
          <Shield className="h-4 w-4 mr-2" />
          Start Training Modules
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ease-in">
          <FileText className="h-4 w-4 mr-2" />
          View Detailed Report
        </button>
      </div>
    </div>
  );
};

export default RecommendationsCard;
