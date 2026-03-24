// src/components/dashboard/overview/TrainingProgressCard.jsx
import React from "react";
import { Target, BookOpen, ChevronRight } from "lucide-react";

const TrainingProgressCard = ({ trainingProgress }) => {
  const percentage = trainingProgress?.percentage || 0;

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[32px] p-6 h-full flex flex-col shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-black tracking-tight text-lg flex items-center italic">
          <Target className="h-5 w-5 mr-3 text-indigo-500" />
          Neural Training
        </h3>
        <BookOpen className="h-4 w-4 text-slate-600" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-6 text-center">
          <h4 className="text-4xl font-black text-white tracking-tighter">{percentage}%</h4>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Knowledge Depth</p>
        </div>

        {/* Custom Midnight Progress Bar */}
        <div className="w-full bg-black/40 rounded-full h-2 mb-6 border border-white/5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-blue-500 h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(79,70,229,0.5)]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all flex items-center justify-center group">
          Resume Modules <ChevronRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TrainingProgressCard;