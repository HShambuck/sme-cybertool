// src/components/dashboard/overview/RiskAssessmentCard.jsx
import React from "react";
import { ShieldCheck, Zap, ArrowRight, Clock, Activity } from "lucide-react";

const RiskAssessmentCard = ({ riskData, setCurrentView }) => {
  // Logic for color coding based on score
  const score = riskData?.score || 0;
  const isHighRisk = score < 50;
  const isOptimal = score >= 80;

  return (
    <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-white/10 rounded-[40px] p-10 relative overflow-hidden group shadow-2xl">
      
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Decorative Large Icon Glow */}
      <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
        <ShieldCheck className="h-80 w-80 text-blue-500 rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <div className="flex items-center space-x-3 text-blue-500 mb-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Zap className="h-4 w-4 fill-current animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Infrastructure Audit Node</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
              Risk Level: <br />
              <span className={isOptimal ? "text-emerald-400" : isHighRisk ? "text-red-500" : "text-amber-400"}>
                {riskData?.level || "STANDBY"}
              </span>
            </h2>
          </div>
          
          <button 
            onClick={() => setCurrentView('assessment')}
            className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 active:scale-95 flex items-center border border-blue-400/20"
          >
            Initialize New Scan 
            <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="space-y-6">
            <p className="text-slate-400 leading-relaxed font-medium text-lg max-w-md">
              {riskData?.message || "Your SME profile is pending a full diagnostic. Initialize the neural scanner to map potential vulnerabilities."}
            </p>
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <Clock className="h-3.5 w-3.5" />
              <span>Last Sync: {riskData?.lastAssessment || "Never Recorded"}</span>
            </div>
          </div>

          {/* High-End Score Meter */}
          <div className="relative group/meter">
            <div className="absolute -inset-4 bg-blue-600/10 rounded-[32px] blur-2xl opacity-0 group-hover/meter:opacity-100 transition-opacity"></div>
            <div className="relative bg-black/40 backdrop-blur-md rounded-[32px] p-8 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Network Score</p>
                <div className="flex items-baseline space-x-1">
                  <h4 className="text-5xl font-black text-white tracking-tighter">{score}</h4>
                  <span className="text-slate-600 font-bold text-xl">%</span>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center">
                <svg className="h-20 w-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6 - (213.6 * score) / 100}
                    className="text-blue-500 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <Activity className="h-6 w-6 text-blue-500 absolute animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentCard;