import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Bell,
  History,
  BookOpen,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  Zap,
  Loader2,
  ChevronRight,
  Globe,
} from "lucide-react";
import { getTopPendingRecommendations } from "../../services/recommendations";
import { getLatestAssessment } from "../../services/assessment";

// Priority badge styling
const priorityStyles = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const OverviewContent = ({ riskData, setCurrentView }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [assessmentScore, setAssessmentScore] = useState(null);
  const [assessmentLevel, setAssessmentLevel] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRecsLoading(true);

      // Fetch latest assessment for the score display + populated recommendations
      const assessment = await getLatestAssessment();
      if (assessment) {
        setAssessmentScore(assessment.score);
        setAssessmentLevel(assessment.level);
      }

      // Pull top 3 pending recs from the assessment's recommendationIds
      const recs = await getTopPendingRecommendations(3);
      setRecommendations(recs);
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
    } finally {
      setRecsLoading(false);
    }
  };

  // Use live assessment score if available, fallback to prop, then static
  const displayScore = assessmentScore ?? riskData?.score ?? "—";
  const isLowRisk = assessmentLevel === "LOW RISK" || displayScore >= 80;

  // ─── Second-layer quick-action buttons ───────────────────────────────────
  const quickActions = [
    {
      label: "Scan Website",
      icon: Globe,
      color: "blue",
      onClick: () => setCurrentView("security"),
      tip: "Run a live scan on your business site",
    },
    {
      label: "Threat Updates",
      icon: Bell,
      color: "emerald",
      onClick: () => setCurrentView("threats"),
      tip: "See the latest active threat intelligence",
    },
    {
      label: "Scan History",
      icon: History,
      color: "amber",
      onClick: () => setCurrentView("history"),
      tip: "Review all previous scans and results",
    },
    {
      label: "Training Modules",
      icon: BookOpen,
      color: "purple",
      onClick: () => setCurrentView("training"),
      tip: "Continue your security learning path",
    },
  ];

  const colorMap = {
    blue: {
      ring: "hover:border-blue-500/50",
      icon: "bg-blue-500/10 text-blue-500",
    },
    emerald: {
      ring: "hover:border-emerald-500/50",
      icon: "bg-emerald-500/10 text-emerald-500",
    },
    amber: {
      ring: "hover:border-amber-500/50",
      icon: "bg-amber-500/10 text-amber-500",
    },
    purple: {
      ring: "hover:border-purple-500/50",
      icon: "bg-purple-500/10 text-purple-500",
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ── LAYER 1: Intel Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Index */}
        <div className="bg-[#0F172A] p-8 rounded-[32px] border border-slate-800/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield className="h-32 w-32 text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
            Security Index
          </p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-6xl font-black text-white tracking-tighter">
              {displayScore}
            </h2>
            {displayScore !== "—" && (
              <span className="text-blue-500 font-bold text-xl">%</span>
            )}
          </div>
          <div
            className={`mt-4 flex items-center text-[10px] font-black uppercase tracking-widest ${isLowRisk ? "text-emerald-500" : "text-amber-500"}`}
          >
            {isLowRisk ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Protocol:
                Optimized
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5 mr-2" />{" "}
                {assessmentLevel || "Awaiting Assessment"}
              </>
            )}
          </div>
        </div>

        {/* Active Threat Nodes */}
        <div className="bg-[#0F172A] p-8 rounded-[32px] border border-slate-800/50 shadow-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
            Threat Nodes
          </p>
          <h2 className="text-6xl font-black text-white tracking-tighter">
            {String(recommendations.length || "00").padStart(2, "0")}
          </h2>
          <div className="mt-4 flex items-center text-amber-500 text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle className="h-3.5 w-3.5 mr-2" />
            {recommendations.length > 0
              ? "Status: Action Required"
              : "Status: All Clear"}
          </div>
        </div>

        {/* CTA — Assess Your Business */}
        <div
          onClick={() => setCurrentView("assessment")}
          className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-900/20 flex flex-col justify-between group cursor-pointer hover:bg-blue-500 transition-all active:scale-[0.98]"
        >
          <div>
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em] mb-2">
              Risk Intelligence
            </p>
            <h2 className="text-2xl font-black text-white leading-tight">
              Assess Your
              <br />
              Business Now
            </h2>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Zap className="h-6 w-6 text-white animate-pulse" />
            <ArrowUpRight className="h-5 w-5 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* ── LAYER 2: Quick Actions ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickActions.map(({ label, icon: Icon, color, onClick, tip }) => (
          <button
            key={label}
            onClick={onClick}
            title={tip}
            className={`flex flex-col items-center justify-center p-8 bg-[#0F172A] border border-slate-800/50 rounded-[32px] ${colorMap[color].ring} hover:bg-slate-800/40 transition-all group`}
          >
            <div
              className={`p-4 rounded-2xl ${colorMap[color].icon} mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-white text-center">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── LAYER 3: Recommendations + Activity Log ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strategic Recommendations — real data from assessment */}
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center">
            <ShieldAlert className="h-5 w-5 mr-3 text-blue-500" /> Strategic
            Recommendations
          </h3>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-8">
            Based on your latest risk assessment
          </p>

          {recsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-800 rounded-2xl">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                No pending actions —<br />
                complete an assessment to get recommendations
              </p>
              <button
                onClick={() => setCurrentView("assessment")}
                className="mt-4 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center mx-auto"
              >
                Start Assessment <ChevronRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div
                  key={rec._id || i}
                  className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 text-blue-500 font-black text-xs">
                      {i + 1}
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate pr-3">
                      {rec.text}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border shrink-0 ${priorityStyles[rec.priority] || priorityStyles.medium}`}
                  >
                    {rec.priority}
                  </span>
                </div>
              ))}

              {/* Link to full recommendations / assessment history */}
              <button
                onClick={() => setCurrentView("assessment")}
                className="w-full mt-2 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-500 transition-colors flex items-center justify-center pt-2"
              >
                View Full Assessment <ChevronRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Live Activity Log */}
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10 relative overflow-hidden">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center">
            <Activity className="h-5 w-5 mr-3 text-blue-500" /> Live Activity
            Log
          </h3>
          <div className="space-y-4 font-mono text-[10px] text-slate-500 leading-relaxed">
            <p className="flex items-center">
              <span className="text-emerald-500 mr-2">●</span> [SYSTEM]
              Integrity check complete.
            </p>
            <p className="flex items-center">
              <span className="text-blue-500 mr-2">●</span> [NETWORK] Node 04
              linked via E. Legon.
            </p>
            <p className="flex items-center">
              <span className="text-amber-500 mr-2">●</span> [THREAT] Minor
              latency detected in port 8080.
            </p>
            <p className="flex items-center animate-pulse">
              <span className="text-slate-600 mr-2">●</span> [SCAN] Background
              analysis running...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;
