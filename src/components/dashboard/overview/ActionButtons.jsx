// src/components/dashboard/overview/ActionButtons.jsx
import React from "react";
import { 
  ShieldCheck, 
  FileText, 
  Zap, 
  ArrowRight, 
  Download,
  Terminal
} from "lucide-react";

const ActionButtons = ({ setCurrentView }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      
      {/* Primary Action: Training */}
      <button
        onClick={() => setCurrentView("training")}
        className="group relative flex items-center justify-between p-6 bg-blue-600 hover:bg-blue-500 rounded-[28px] transition-all duration-300 shadow-2xl shadow-blue-600/20 active:scale-[0.98] overflow-hidden border border-blue-400/20"
      >
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
          <ShieldCheck className="h-24 w-24 text-white" />
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            {/* Added animate-pulse here for the "Live" feel */}
            <Zap className="h-6 w-6 text-white fill-white animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] opacity-70">Initialize</span>
            <h4 className="text-white font-black text-lg tracking-tight leading-tight">Neural Training</h4>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform relative z-10" />
      </button>

      {/* Secondary Action: Intelligence Report */}
      <button className="group relative flex items-center justify-between p-6 bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-blue-500/30 rounded-[28px] transition-all duration-300 active:scale-[0.98] shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-blue-500/10 transition-colors">
            <FileText className="h-6 w-6 text-slate-400 group-hover:text-blue-500" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Generate</span>
            <h4 className="text-white font-black text-lg tracking-tight leading-tight">Intelligence Report</h4>
          </div>
        </div>
        <Download className="h-5 w-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
      </button>

      {/* Tertiary Action: Scan History */}
      <button 
        onClick={() => setCurrentView("history")}
        className="group relative flex items-center justify-between p-6 bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-amber-500/30 rounded-[28px] transition-all duration-300 active:scale-[0.98] shadow-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-amber-500/10 transition-colors">
            <Terminal className="h-6 w-6 text-slate-400 group-hover:text-amber-500" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Access</span>
            <h4 className="text-white font-black text-lg tracking-tight leading-tight">Scan History</h4>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
      </button>

    </div>
  );
};

export default ActionButtons;