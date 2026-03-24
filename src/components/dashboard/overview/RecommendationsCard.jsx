// src/components/dashboard/overview/RecommendationsCard.jsx
import React from "react";
import { Shield, FileText, Sparkles, ChevronRight, PlayCircle } from "lucide-react";

const RecommendationsCard = ({ recommendations = [], setCurrentView }) => {
  const hasRecs = recommendations && recommendations.length > 0;

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center">
          <Shield className="h-5 w-5 mr-3 text-blue-500" />
          Security Posture Recommendations
        </h3>
        {hasRecs && (
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {recommendations.length} Actions Required
          </span>
        )}
      </div>

      <div className="space-y-4">
        {hasRecs ? (
          recommendations.map((rec, index) => (
            <div key={rec.id || index} className="group flex flex-col space-y-4">
              {/* Recommendation Row */}
              <div className="flex items-start space-x-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-blue-600/20">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-slate-200 font-bold tracking-tight leading-relaxed">{rec.text}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                   <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>

              {/* Optional Video with Midnight Styling */}
              {rec.videoUrl && (
                <div className="ml-14 relative group/video">
                  <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-xl opacity-0 group-hover/video:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center space-x-3 mb-2">
                    <PlayCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Tutorial Session</span>
                  </div>
                  <video
                    src={rec.videoUrl}
                    controls
                    className="w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl relative z-10"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center bg-blue-600/5 border border-blue-500/10 rounded-[32px] p-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-2">
                <Sparkles className="h-10 w-10 text-blue-500 animate-pulse" />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight">
                No Recommendations Yet
              </h4>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed font-medium">
                Initialize your first <span className="text-white">risk assessment</span> to unlock AI-powered insights on how to strengthen your SME defense.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Solid Midnight Style */}
      <div className="flex flex-wrap gap-4 mt-10">
        <button
          onClick={() => setCurrentView("training")}
          className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 font-black text-[11px] uppercase tracking-widest active:scale-95"
        >
          <Shield className="h-4 w-4 mr-2" />
          Initialize Training
        </button>
        <button className="flex items-center px-8 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all font-black text-[11px] uppercase tracking-widest active:scale-95 border border-white/5">
          <FileText className="h-4 w-4 mr-2" />
          Export Intelligence Report
        </button>
      </div>
    </div>
  );
};

export default RecommendationsCard;