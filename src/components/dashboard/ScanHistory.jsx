import React, { useState, useEffect } from "react";
import {
  History,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Shield,
  Eye,
  ChevronDown,
  Loader,
  Lock,
  Server,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyRes, statsRes] = await Promise.all([
        fetch("/api/security/history?limit=20"),
        fetch("/api/security/stats"),
      ]);
      const historyData = await historyRes.json();
      const statsData = await statsRes.json();
      if (historyData.success) setScans(historyData.scans);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreConfig = (score) => {
    if (score >= 80)
      return {
        color: "text-emerald-400",
        bar: "bg-emerald-500",
        dot: "bg-emerald-500",
        border: "hover:border-emerald-500/20",
      };
    if (score >= 60)
      return {
        color: "text-amber-400",
        bar: "bg-amber-500",
        dot: "bg-amber-500",
        border: "hover:border-amber-500/20",
      };
    return {
      color: "text-red-400",
      bar: "bg-red-500",
      dot: "bg-red-500",
      border: "hover:border-red-500/20",
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTrend = (curr, prev) => {
    if (!prev) return null;
    const diff = curr - prev;
    return {
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
      value: Math.abs(diff),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
            Loading scan history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
          Audit Trail
        </p>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          <History className="h-6 w-6 text-blue-500" />
          Scan History
        </h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Scans",
              value: stats.totalScans,
              icon: BarChart3,
              iconColor: "text-blue-400",
              iconBg: "bg-blue-500/10",
            },
            {
              label: "Average Score",
              value: stats.averageScore,
              icon: TrendingUp,
              iconColor: "text-emerald-400",
              iconBg: "bg-emerald-500/10",
            },
            {
              label: "Sites Analyzed",
              value: stats.uniqueDomains,
              icon: Globe,
              iconColor: "text-purple-400",
              iconBg: "bg-purple-500/10",
            },
          ].map(({ label, value, icon: Icon, iconColor, iconBg }) => (
            <div
              key={label}
              className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className={`h-24 w-24 ${iconColor}`} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
                {label}
              </p>
              <h2 className="text-6xl font-black text-white tracking-tighter">
                {value}
              </h2>
              <div
                className={`mt-4 w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}
              >
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scan List */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-800/50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Recent Activity
          </p>
          <h2 className="text-sm font-black text-white mt-1">Security Scans</h2>
        </div>

        {scans.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-slate-900/50 border border-slate-800 flex items-center justify-center mx-auto mb-6">
              <History className="h-8 w-8 text-slate-700" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">
              No Scans Yet
            </h3>
            <p className="text-xs text-slate-600">
              Run a security scan to populate your audit trail
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {scans.map((scan, index) => {
              const prevScan = scans[index + 1];
              const trend = prevScan
                ? getTrend(scan.score, prevScan.score)
                : null;
              const cfg = getScoreConfig(scan.score);
              const isExpanded = selectedScan?._id === scan._id;

              return (
                <div
                  key={scan._id}
                  className={`px-10 py-7 cursor-pointer transition-all ${cfg.border} hover:bg-slate-900/30`}
                  onClick={() => setSelectedScan(isExpanded ? null : scan)}
                >
                  {/* Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      {/* Score Circle */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center`}
                        >
                          <Shield className={`h-5 w-5 ${cfg.color}`} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-black text-white truncate">
                            {scan.domain}
                          </h3>
                          {trend && trend.value > 0 && (
                            <span
                              className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${trend.direction === "up" ? "text-emerald-400" : "text-red-400"}`}
                            >
                              {trend.direction === "up" ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {trend.value}pts
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-600 font-mono">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(scan.scanDate)}
                          </span>
                          <span>SSL: {scan.sslGrade}</span>
                          <span>{scan.securityHeaders.length} headers</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0 ml-4">
                      <div className="text-right">
                        <div
                          className={`text-3xl font-black tracking-tighter ${cfg.color}`}
                        >
                          {scan.score}
                        </div>
                        <div className="text-[9px] text-slate-700 font-mono">
                          /100
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Score bar */}
                  <div
                    className="mt-3 ml-17 h-1 bg-slate-900 rounded-full overflow-hidden"
                    style={{ marginLeft: "68px" }}
                  >
                    <div
                      className={`h-1 rounded-full ${cfg.bar}`}
                      style={{ width: `${scan.score}%` }}
                    />
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div
                      className="mt-6 pt-6 border-t border-slate-800/50 space-y-5"
                      style={{ marginLeft: "68px" }}
                    >
                      {/* Security Headers */}
                      <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">
                          Security Headers
                        </p>
                        <div className="grid md:grid-cols-2 gap-2">
                          {scan.securityHeaders.map((header, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 border border-slate-800 p-3 rounded-xl font-mono"
                            >
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                              {header}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Issues */}
                      {scan.issues?.length > 0 && (
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">
                            Issues Found
                          </p>
                          <div className="space-y-2">
                            {scan.issues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-slate-400 bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl"
                              >
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                                {issue}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reputation + Breach */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          {
                            label: "Reputation",
                            value: scan.reputation,
                            icon: Server,
                            positive: scan.reputation === "Clean",
                          },
                          {
                            label: "Breach Status",
                            value: scan.breachStatus,
                            icon: Eye,
                            positive: scan.breachStatus === "No leaks found",
                          },
                        ].map(({ label, value, icon: Icon, positive }) => (
                          <div
                            key={label}
                            className={`p-4 rounded-2xl border ${positive ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10"}`}
                          >
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1 text-slate-600">
                              {label}
                            </p>
                            <div className="flex items-center gap-2">
                              {positive ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                              )}
                              <span className="text-xs font-bold text-slate-300">
                                {value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanHistory;
