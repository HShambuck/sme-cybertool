// src/components/dashboard/AssessmentResults.jsx
// Renders INSIDE the dashboard layout — not a standalone page
import React, { useState, useEffect } from "react";
import {
  ShieldCheck, Target, Zap, TrendingUp, AlertTriangle,
  CheckCircle, Sparkles, RotateCcw, BookOpen, Activity,
  ArrowRight, Brain,
} from "lucide-react";

// ── Risk level config (dark palette) ──────────────────────────
const getRiskConfig = (level) => {
  switch (level) {
    case "LOW RISK":
      return {
        color:   "text-emerald-400",
        bar:     "bg-emerald-500",
        badge:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        glow:    "border-emerald-500/20",
        label:   "Low Risk",
      };
    case "MEDIUM RISK":
      return {
        color:   "text-amber-400",
        bar:     "bg-amber-500",
        badge:   "bg-amber-500/10 text-amber-400 border-amber-500/30",
        glow:    "border-amber-500/20",
        label:   "Medium Risk",
      };
    case "HIGH RISK":
      return {
        color:   "text-orange-400",
        bar:     "bg-orange-500",
        badge:   "bg-orange-500/10 text-orange-400 border-orange-500/30",
        glow:    "border-orange-500/20",
        label:   "High Risk",
      };
    case "CRITICAL RISK":
      return {
        color:   "text-red-400",
        bar:     "bg-red-500",
        badge:   "bg-red-500/10 text-red-400 border-red-500/30",
        glow:    "border-red-500/20",
        label:   "Critical Risk",
      };
    default:
      return {
        color:   "text-blue-400",
        bar:     "bg-blue-500",
        badge:   "bg-blue-500/10 text-blue-400 border-blue-500/30",
        glow:    "border-blue-500/20",
        label:   level || "Assessed",
      };
  }
};

// ── Loading screen (dark) ──────────────────────────────────────
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
    <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-[28px] flex items-center justify-center">
      <Brain className="h-12 w-12 text-blue-400 animate-pulse" />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-xl font-black text-white tracking-tight">AI Analysis Complete</h3>
      <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Preparing your security assessment...</p>
    </div>
    <div className="flex space-x-2">
      {[0, 150, 300].map((delay) => (
        <div
          key={delay}
          className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────
const AssessmentResults = ({ assessmentData, setCurrentView }) => {
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowResults(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!assessmentData) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-sm">No assessment data found.</p>
        <button
          onClick={() => setCurrentView("assessment")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  if (!showResults) return <LoadingScreen />;

  const cfg   = getRiskConfig(assessmentData.level);
  const recs  = assessmentData.recommendationIds?.length || 0;
  const priority = recs > 15 ? "High" : recs > 8 ? "Medium" : "Low";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">

      {/* ── Score Card ── */}
      <div className={`bg-[#0F172A] border ${cfg.glow} border-slate-800/50 rounded-[40px] p-10`}>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Assessment Complete</p>
        <h2 className="text-lg font-black text-white mb-8">Risk Analysis Results</h2>

        <div className="flex items-end gap-6 mb-6">
          <div>
            <div className={`text-8xl font-black tracking-tighter ${cfg.color}`}>
              {assessmentData.score}
              <span className="text-3xl text-slate-700 ml-1">/100</span>
            </div>
            <span className={`mt-3 inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-2 bg-slate-900 rounded-full overflow-hidden mb-8">
          <div
            className={`h-2 rounded-full ${cfg.bar} transition-all duration-1000`}
            style={{ width: `${assessmentData.score}%` }}
          />
        </div>

        {/* AI Explanation */}
        {assessmentData.explanation && (
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 flex-shrink-0">
                <Sparkles className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">AI-Powered Analysis</p>
                <p className="text-sm text-slate-400 leading-relaxed">{assessmentData.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Action Plan Card ── */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10">
              <Target className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Personalised</p>
              <h3 className="text-sm font-black text-white">Action Plan</h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-amber-400 tracking-tighter">{recs}</div>
            <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
              {recs === 1 ? "Recommendation" : "Recommendations"}
            </div>
          </div>
        </div>

        {/* 3 metric tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: ShieldCheck, iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
              value: `${Math.round((assessmentData.score / 100) * 10)}/10`,
              label: "Security Score",
            },
            {
              icon: Zap, iconColor: "text-purple-400", iconBg: "bg-purple-500/10",
              value: priority,
              label: "Priority Level",
            },
            {
              icon: TrendingUp, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10",
              value: `${100 - assessmentData.score}%`,
              label: "Growth Potential",
            },
          ].map(({ icon: Icon, iconColor, iconBg, value, label }) => (
            <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className={`text-2xl font-black tracking-tighter ${iconColor}`}>{value}</div>
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Action required notice */}
        {recs > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Action Required</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                We've identified {recs} specific area{recs !== 1 ? "s" : ""} where you can strengthen your security posture.
                Each recommendation includes guided training to help you implement improvements.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── What's Next Card ── */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Next Steps</p>
            <h3 className="text-sm font-black text-white">What's Next?</h3>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              num: "01", color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/10",
              title: "Review Your Recommendations",
              desc:  "Explore personalised security improvements tailored to your organisation",
            },
            {
              num: "02", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/10",
              title: "Complete Training Modules",
              desc:  "Access step-by-step guides to implement each recommendation",
            },
            {
              num: "03", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/10",
              title: "Track Your Progress",
              desc:  "Monitor improvements and retake assessments to measure growth",
            },
          ].map(({ num, color, bg, border, title, desc }) => (
            <div key={num} className={`flex items-start gap-4 p-5 bg-slate-900/50 border ${border} rounded-2xl`}>
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className={`text-xs font-black ${color}`}>{num}</span>
              </div>
              <div>
                <p className="text-sm font-black text-white">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Training */}
        <button
          onClick={() => setCurrentView("training")}
          className="group flex items-center justify-between p-6 bg-blue-600 hover:bg-blue-500 rounded-[28px] transition-all duration-300 shadow-2xl shadow-blue-600/20 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black text-blue-100 uppercase tracking-widest opacity-70 block">Initialize</span>
              <span className="text-white font-black text-sm tracking-tight">Start Training</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Retake Assessment */}
        <button
          onClick={() => setCurrentView("assessment")}
          className="group flex items-center justify-between p-6 bg-[#0F172A] border border-slate-800 hover:border-blue-500/30 rounded-[28px] transition-all duration-300 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 group-hover:bg-blue-500/10 p-2.5 rounded-xl transition-colors">
              <RotateCcw className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Restart</span>
              <span className="text-white font-black text-sm tracking-tight">Retake Assessment</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Back to Dashboard */}
        <button
          onClick={() => setCurrentView("dashboard")}
          className="group flex items-center justify-between p-6 bg-[#0F172A] border border-slate-800 hover:border-emerald-500/30 rounded-[28px] transition-all duration-300 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 group-hover:bg-emerald-500/10 p-2.5 rounded-xl transition-colors">
              <Activity className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Return</span>
              <span className="text-white font-black text-sm tracking-tight">Back to Dashboard</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Timestamp */}
      {assessmentData.assessmentDate && (
        <p className="text-center text-[10px] text-slate-700 font-mono">
          Assessment completed ·{" "}
          {new Date(assessmentData.assessmentDate).toLocaleDateString("en-GB", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
};

export default AssessmentResults;