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
  CheckCircle,
  AlertTriangle,
  Lock,
  Server,
  Lightbulb,
  AlertCircle,
  Info,
  RefreshCw,
  Activity,
  ShieldAlert,
  Zap,
  Code,
  Cpu,
  Tag,
  ExternalLink,
} from "lucide-react";

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
const getScoreConfig = (score) => {
  if (score >= 80)
    return {
      color: "text-emerald-400",
      bar: "bg-emerald-500",
      dot: "bg-emerald-500",
      border: "hover:border-emerald-500/20",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      label: "Secure",
    };
  if (score >= 60)
    return {
      color: "text-amber-400",
      bar: "bg-amber-500",
      dot: "bg-amber-500",
      border: "hover:border-amber-500/20",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      label: "Moderately Secure",
    };
  if (score >= 40)
    return {
      color: "text-orange-400",
      bar: "bg-orange-500",
      dot: "bg-orange-500",
      border: "hover:border-orange-500/20",
      badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      label: "At Risk",
    };
  return {
    color: "text-red-400",
    bar: "bg-red-500",
    dot: "bg-red-500",
    border: "hover:border-red-500/20",
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
    label: "Highly Vulnerable",
  };
};

const getRepConfig = (rep) => {
  if (rep === "Clean")
    return {
      color: "text-emerald-400",
      bg: "bg-emerald-500/5 border-emerald-500/20",
      Icon: CheckCircle,
    };
  if (rep === "Warning")
    return {
      color: "text-red-400",
      bg: "bg-red-500/5 border-red-500/20",
      Icon: AlertTriangle,
    };
  return {
    color: "text-slate-400",
    bg: "bg-slate-800/50 border-slate-700",
    Icon: Info,
  };
};

const getSeverityConfig = (sev) =>
  ({
    critical: {
      badge: "bg-red-500/10 text-red-400 border border-red-500/30",
      dot: "bg-red-500",
      glow: "hover:border-red-500/20",
    },
    high: {
      badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      dot: "bg-amber-500",
      glow: "hover:border-amber-500/20",
    },
    medium: {
      badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
      dot: "bg-yellow-500",
      glow: "hover:border-yellow-500/20",
    },
    low: {
      badge: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
      dot: "bg-blue-500",
      glow: "hover:border-blue-500/20",
    },
  })[sev] || {
    badge: "bg-slate-800 text-slate-500 border-slate-700",
    dot: "bg-slate-600",
    glow: "",
  };

const getTypeConfig = (type) =>
  ({
    confirmed: {
      label: "Confirmed",
      badge: "bg-red-500/10 text-red-400 border-red-500/30",
    },
    probable: {
      label: "Probable",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    posture: {
      label: "Posture",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
  })[type] || {
    label: type,
    badge: "bg-slate-800 text-slate-500 border-slate-700",
  };

const getPriorityConfig = (p) =>
  ({
    critical: {
      badge: "bg-red-500/10 text-red-400 border border-red-500/30",
      dot: "bg-red-500",
    },
    high: {
      badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      dot: "bg-amber-500",
    },
    medium: {
      badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
      dot: "bg-yellow-500",
    },
    low: {
      badge: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
      dot: "bg-blue-500",
    },
  })[p] || {
    badge: "bg-slate-800 text-slate-500 border-slate-700",
    dot: "bg-slate-500",
  };

const getPriorityIcon = (p) => {
  const cls = "h-3 w-3";
  if (p === "critical") return <AlertCircle className={cls} />;
  if (p === "high") return <AlertTriangle className={cls} />;
  if (p === "medium") return <Info className={cls} />;
  return <Lightbulb className={cls} />;
};

const formatDate = (d) => {
  const date = new Date(d),
    now = new Date();
  const hours = Math.floor((now - date) / 3600000);
  const days = Math.floor(hours / 24);
  if (days === 0) return hours === 0 ? "Just now" : `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatFullDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getTrend = (curr, prev) => {
  if (prev == null) return null;
  const diff = curr - prev;
  return {
    direction: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
    value: Math.abs(diff),
  };
};

// ════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════════

// Score breakdown bar — used inside Overview tab
const BreakdownBar = ({ label, value, max, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-[9px] font-mono text-slate-500">
        {value ?? "—"}/{max}
      </span>
    </div>
    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
      <div
        className={`h-1.5 rounded-full ${color} transition-all duration-700`}
        style={{
          width:
            value != null ? `${Math.min(100, (value / max) * 100)}%` : "0%",
        }}
      />
    </div>
  </div>
);

// Tab button
const TabBtn = ({ id, label, icon: Icon, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all whitespace-nowrap ${
      active
        ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
        : "text-slate-600 hover:text-slate-400"
    }`}
  >
    <Icon className="h-3 w-3" />
    {label}
    {count != null && (
      <span
        className={`ml-1 px-1.5 py-0.5 rounded-full text-[8px] ${active ? "bg-blue-500/20" : "bg-slate-800"}`}
      >
        {count}
      </span>
    )}
  </button>
);

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════
const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [tabs, setTabs] = useState({}); // { [scanId]: activeTab }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [hRes, sRes] = await Promise.all([
        fetch("/api/security/history?limit=20"),
        fetch("/api/security/stats"),
      ]);
      const hData = await hRes.json();
      const sData = await sRes.json();
      if (hData.success) setScans(hData.scans);
      if (sData.success) setStats(sData.stats);
    } catch (err) {
      setError("Failed to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  const getTab = (id) => tabs[id] || "overview";
  const setTab = (id, t) => setTabs((p) => ({ ...p, [id]: t }));
  const toggleRow = (id) => setExpandedId((p) => (p === id ? null : id));

  // ── Loading ──
  if (loading)
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

  // ── Error ──
  if (error)
    return (
      <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-10 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 text-sm font-black uppercase tracking-widest mb-4">
          {error}
        </p>
        <button
          onClick={fetchData}
          className="px-6 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
            Audit Trail
          </p>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <History className="h-6 w-6 text-blue-500" />
            Scan History
          </h1>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2.5 bg-[#0F172A] border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:border-blue-500/30 hover:text-blue-400 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* ── Stats Cards ── */}
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
              icon: Activity,
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

      {/* ── Empty State ── */}
      {scans.length === 0 && (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-16 text-center">
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
      )}

      {/* ── Scan Cards ── */}
      {scans.map((scan, index) => {
        const prev = scans[index + 1];
        const trend = prev ? getTrend(scan.score, prev.score) : null;
        const cfg = getScoreConfig(scan.score);
        const repCfg = getRepConfig(scan.reputation);
        const RepIcon = repCfg.Icon;
        const isOpen = expandedId === scan._id;
        const tab = getTab(scan._id);

        // Counts for tab badges
        const issueCount = scan.issues?.length || 0;
        const recCount = scan.recommendations?.length || 0;
        const findCount = scan.findings?.length || 0;
        const techCount = scan.detectedTech?.length || 0;

        return (
          <div
            key={scan._id}
            className={`bg-[#0F172A] border border-slate-800/50 rounded-[32px] transition-all duration-200 ${cfg.border} overflow-hidden`}
          >
            {/* ── Collapsed Row ── */}
            <div
              className="px-8 py-6 cursor-pointer hover:bg-slate-900/30 transition-all"
              onClick={() => toggleRow(scan._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  {/* Shield icon */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center flex-shrink-0">
                    <Shield className={`h-5 w-5 ${cfg.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Domain + badges */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-sm font-black text-white truncate">
                        {scan.domain}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.badge}`}
                      >
                        {scan.securityLevel || cfg.label}
                      </span>
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

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(scan.scanDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Lock className="h-3 w-3" />
                        SSL: {scan.sslGrade || "N/A"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Shield className="h-3 w-3" />
                        {scan.securityHeaders?.length || 0}/7 headers
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${repCfg.color}`}
                      >
                        <RepIcon className="h-3 w-3" />
                        {scan.reputation || "Unknown"}
                      </span>
                      {issueCount > 0 && (
                        <span className="flex items-center gap-1.5 text-amber-500">
                          <AlertTriangle className="h-3 w-3" />
                          {issueCount} issues
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score + chevron */}
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
                    className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* Score progress bar */}
              <div className="mt-4 ml-[68px] h-1 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-1 rounded-full ${cfg.bar} transition-all duration-700`}
                  style={{ width: `${scan.score}%` }}
                />
              </div>
            </div>

            {/* ── Expanded Panel ── */}
            {isOpen && (
              <div className="border-t border-slate-800/50">
                {/* Tab Nav */}
                <div className="flex gap-1 px-8 pt-5 pb-0 overflow-x-auto">
                  <TabBtn
                    id="overview"
                    label="Overview"
                    icon={Activity}
                    active={tab === "overview"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTab(scan._id, "overview");
                    }}
                  />
                  <TabBtn
                    id="headers"
                    label="Headers"
                    icon={Shield}
                    active={tab === "headers"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTab(scan._id, "headers");
                    }}
                  />
                  <TabBtn
                    id="issues"
                    label="Issues"
                    icon={AlertTriangle}
                    active={tab === "issues"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTab(scan._id, "issues");
                    }}
                    count={issueCount}
                  />
                  {findCount > 0 && (
                    <TabBtn
                      id="findings"
                      label="Findings"
                      icon={ShieldAlert}
                      active={tab === "findings"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTab(scan._id, "findings");
                      }}
                      count={findCount}
                    />
                  )}
                  {techCount > 0 && (
                    <TabBtn
                      id="tech"
                      label="Technology"
                      icon={Cpu}
                      active={tab === "tech"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTab(scan._id, "tech");
                      }}
                      count={techCount}
                    />
                  )}
                  <TabBtn
                    id="recommendations"
                    label="Recommendations"
                    icon={Lightbulb}
                    active={tab === "recommendations"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTab(scan._id, "recommendations");
                    }}
                    count={recCount}
                  />
                </div>

                <div className="p-8 space-y-5">
                  {/* ══════════ TAB: OVERVIEW ══════════ */}
                  {tab === "overview" && (
                    <div className="space-y-6">
                      {/* Key stat tiles */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            label: "SSL Grade",
                            value: scan.sslGrade || "N/A",
                            icon: Lock,
                            color: ["A+", "A"].includes(scan.sslGrade)
                              ? "text-emerald-400"
                              : scan.sslGrade === "B"
                                ? "text-amber-400"
                                : "text-red-400",
                          },
                          {
                            label: "Reputation",
                            value: scan.reputation || "Unknown",
                            icon: Shield,
                            color: repCfg.color,
                          },
                          {
                            label: "Headers OK",
                            value: `${scan.securityHeaders?.length || 0}/7`,
                            icon: CheckCircle,
                            color: "text-blue-400",
                          },
                          {
                            label: "Issues Found",
                            value: issueCount,
                            icon: AlertTriangle,
                            color: issueCount
                              ? "text-amber-400"
                              : "text-emerald-400",
                          },
                        ].map(({ label, value, icon: Icon, color }) => (
                          <div
                            key={label}
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4"
                          >
                            <Icon className={`h-4 w-4 ${color} mb-2`} />
                            <div
                              className={`text-xl font-black tracking-tighter ${color}`}
                            >
                              {value}
                            </div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Finding summary (if from new scanner) */}
                      {scan.findings?.length > 0 && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">
                            Finding Summary
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              {
                                label: "Critical",
                                count: scan.findings.filter(
                                  (f) => f.severity === "critical",
                                ).length,
                                color: "text-red-400",
                                bg: "bg-red-500/5 border-red-500/10",
                              },
                              {
                                label: "High",
                                count: scan.findings.filter(
                                  (f) => f.severity === "high",
                                ).length,
                                color: "text-amber-400",
                                bg: "bg-amber-500/5 border-amber-500/10",
                              },
                              {
                                label: "Medium",
                                count: scan.findings.filter(
                                  (f) => f.severity === "medium",
                                ).length,
                                color: "text-yellow-400",
                                bg: "bg-yellow-500/5 border-yellow-500/10",
                              },
                              {
                                label: "Low",
                                count: scan.findings.filter(
                                  (f) => f.severity === "low",
                                ).length,
                                color: "text-blue-400",
                                bg: "bg-blue-500/5 border-blue-500/10",
                              },
                            ].map(({ label, count, color, bg }) => (
                              <div
                                key={label}
                                className={`flex flex-col items-center p-3 rounded-xl border ${bg}`}
                              >
                                <span
                                  className={`text-2xl font-black tracking-tighter ${color}`}
                                >
                                  {count}
                                </span>
                                <span
                                  className={`text-[9px] font-black uppercase tracking-widest mt-1 ${color}`}
                                >
                                  {label}
                                </span>
                              </div>
                            ))}
                          </div>
                          {/* Confirmed / Probable / Posture badges */}
                          <div className="flex gap-2 mt-4 flex-wrap">
                            {[
                              {
                                label: "Confirmed",
                                count: scan.findings.filter(
                                  (f) => f.type === "confirmed",
                                ).length,
                                style:
                                  "bg-red-500/10 text-red-400 border-red-500/30",
                              },
                              {
                                label: "Probable",
                                count: scan.findings.filter(
                                  (f) => f.type === "probable",
                                ).length,
                                style:
                                  "bg-amber-500/10 text-amber-400 border-amber-500/30",
                              },
                              {
                                label: "Posture",
                                count: scan.findings.filter(
                                  (f) => f.type === "posture",
                                ).length,
                                style:
                                  "bg-blue-500/10 text-blue-400 border-blue-500/30",
                              },
                            ].map(
                              ({ label, count, style }) =>
                                count > 0 && (
                                  <span
                                    key={label}
                                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style}`}
                                  >
                                    {count} {label}
                                  </span>
                                ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Score Breakdown (if saved from new scanner) */}
                      {scan.scoreBreakdown && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">
                            Score Breakdown
                          </p>
                          <div className="space-y-3">
                            {[
                              {
                                label: "Transport Security",
                                key: "transportSecurity",
                                max: 20,
                                color: "bg-blue-500",
                              },
                              {
                                label: "Header Security",
                                key: "headerSecurity",
                                max: 15,
                                color: "bg-purple-500",
                              },
                              {
                                label: "Application Security",
                                key: "applicationSecurity",
                                max: 25,
                                color: "bg-emerald-500",
                              },
                              {
                                label: "Technology Risk",
                                key: "technologyRisk",
                                max: 15,
                                color: "bg-amber-500",
                              },
                              {
                                label: "Infrastructure Exposure",
                                key: "infrastructureExposure",
                                max: 10,
                                color: "bg-orange-500",
                              },
                              {
                                label: "Threat Reputation",
                                key: "threatReputation",
                                max: 10,
                                color: "bg-red-500",
                              },
                              {
                                label: "Configuration Hygiene",
                                key: "configurationHygiene",
                                max: 5,
                                color: "bg-slate-500",
                              },
                            ].map(({ label, key, max, color }) => (
                              <BreakdownBar
                                key={key}
                                label={label}
                                value={scan.scoreBreakdown[key]}
                                max={max}
                                color={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scan metadata */}
                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">
                          Scan Details
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            { label: "Full URL", value: scan.url },
                            {
                              label: "Scan Date",
                              value: formatFullDate(scan.scanDate),
                            },
                            {
                              label: "Breach Status",
                              value: scan.breachStatus,
                            },
                            {
                              label: "Method",
                              value:
                                scan.recommendationMethod === "ai"
                                  ? "🤖 AI-Powered"
                                  : "📋 Standard",
                            },
                          ]
                            .filter((item) => item.value)
                            .map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                  {label}
                                </p>
                                <p className="text-xs text-slate-400 font-mono break-all">
                                  {value}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Breach status highlight */}
                      {scan.breachStatus && (
                        <div
                          className={`flex items-center gap-4 p-5 rounded-2xl border ${
                            scan.breachStatus.startsWith("No")
                              ? "bg-emerald-500/5 border-emerald-500/20"
                              : "bg-red-500/5 border-red-500/20"
                          }`}
                        >
                          {scan.breachStatus.startsWith("No") ? (
                            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-0.5">
                              Breach / Threat Status
                            </p>
                            <p className="text-xs text-slate-300">
                              {scan.breachStatus}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ══════════ TAB: HEADERS ══════════ */}
                  {tab === "headers" && (
                    <div className="space-y-5">
                      {/* Present */}
                      {scan.securityHeaders?.length > 0 && (
                        <div>
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3" /> Present (
                            {scan.securityHeaders.length})
                          </p>
                          <div className="grid md:grid-cols-2 gap-2">
                            {scan.securityHeaders.map((h, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl"
                              >
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                                <span className="text-xs text-slate-400 font-mono">
                                  {h}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing — from issues[] */}
                      {scan.issues?.filter((i) => i.startsWith("Missing"))
                        .length > 0 && (
                        <div>
                          <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <AlertTriangle className="h-3 w-3" /> Missing (
                            {
                              scan.issues.filter((i) => i.startsWith("Missing"))
                                .length
                            }
                            )
                          </p>
                          <div className="grid md:grid-cols-2 gap-2">
                            {scan.issues
                              .filter((i) => i.startsWith("Missing"))
                              .map((h, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl"
                                >
                                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                                  <span className="text-xs text-slate-400 font-mono">
                                    {h}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {!scan.securityHeaders?.length &&
                        !scan.issues?.filter((i) => i.startsWith("Missing"))
                          .length && (
                          <p className="text-xs text-slate-600 text-center py-6">
                            No header data saved for this scan.
                          </p>
                        )}
                    </div>
                  )}

                  {/* ══════════ TAB: ISSUES ══════════ */}
                  {tab === "issues" && (
                    <div>
                      {issueCount > 0 ? (
                        <div className="space-y-2">
                          {scan.issues.map((issue, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-amber-500/20 transition-all"
                            >
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0 mt-1.5" />
                              <span className="text-xs text-slate-400 font-mono leading-relaxed">
                                {issue}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                          <p className="text-xs font-black text-white uppercase tracking-widest mb-1">
                            No Issues Found
                          </p>
                          <p className="text-[10px] text-slate-600">
                            This scan returned clean on all checked points.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ══════════ TAB: FINDINGS (new scanner only) ══════════ */}
                  {tab === "findings" && (
                    <div className="space-y-3">
                      {findCount > 0 ? (
                        <>
                          {/* Group by category */}
                          {Array.from(
                            new Set(scan.findings.map((f) => f.category)),
                          ).map((cat) => {
                            const catFindings = scan.findings.filter(
                              (f) => f.category === cat,
                            );
                            return (
                              <div key={cat}>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-4 first:mt-0">
                                  {cat} ({catFindings.length})
                                </p>
                                <div className="space-y-2">
                                  {catFindings.map((finding, i) => {
                                    const sevCfg = getSeverityConfig(
                                      finding.severity,
                                    );
                                    const typeCfg = getTypeConfig(finding.type);
                                    return (
                                      <div
                                        key={i}
                                        className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-5 ${sevCfg.glow} hover:bg-slate-900/80 transition-all`}
                                      >
                                        {/* Finding header */}
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                          <div
                                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sevCfg.dot}`}
                                          />
                                          <span
                                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${sevCfg.badge}`}
                                          >
                                            {finding.severity}
                                          </span>
                                          <span
                                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${typeCfg.badge}`}
                                          >
                                            {typeCfg.label}
                                          </span>
                                          {finding.confidence && (
                                            <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                              {finding.confidence} confidence
                                            </span>
                                          )}
                                        </div>

                                        <h4 className="text-sm font-black text-white mb-3">
                                          {finding.title}
                                        </h4>

                                        <div className="space-y-2.5 border-l-2 border-slate-800 pl-4">
                                          {finding.evidence && (
                                            <div>
                                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                                Evidence
                                              </p>
                                              <p className="text-xs text-slate-500 font-mono">
                                                {finding.evidence}
                                              </p>
                                            </div>
                                          )}
                                          <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                              Description
                                            </p>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                              {finding.description}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                              Recommendation
                                            </p>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                              {finding.recommendation}
                                            </p>
                                          </div>
                                          {/* OWASP + CWE tags */}
                                          <div className="flex flex-wrap gap-2 pt-1">
                                            {finding.owasp && (
                                              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-lg text-[9px] font-mono">
                                                {finding.owasp}
                                              </span>
                                            )}
                                            {finding.cwe && (
                                              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-lg text-[9px] font-mono">
                                                {finding.cwe}
                                              </span>
                                            )}
                                            {finding.cveSample && (
                                              <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[9px] font-mono">
                                                {finding.cveSample}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <p className="text-xs text-slate-600 text-center py-6">
                          No structured findings saved for this scan.
                        </p>
                      )}
                    </div>
                  )}

                  {/* ══════════ TAB: TECHNOLOGY ══════════ */}
                  {tab === "tech" && (
                    <div className="space-y-4">
                      {techCount > 0 ? (
                        <>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {techCount} technolog{techCount === 1 ? "y" : "ies"}{" "}
                            detected
                          </p>
                          <div className="grid md:grid-cols-2 gap-3">
                            {scan.detectedTech.map((tech, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all"
                              >
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                  <Cpu className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-white">
                                    {tech.name}
                                  </p>
                                  {tech.version &&
                                    tech.version !== "Unknown" && (
                                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        v{tech.version}
                                      </p>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Tech-related findings (CVE hits) */}
                          {scan.findings?.filter(
                            (f) => f.category === "Technology Risk",
                          ).length > 0 && (
                            <div>
                              <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <AlertTriangle className="h-3 w-3" /> Technology
                                Vulnerabilities
                              </p>
                              <div className="space-y-2">
                                {scan.findings
                                  .filter(
                                    (f) => f.category === "Technology Risk",
                                  )
                                  .map((f, i) => {
                                    const sevCfg = getSeverityConfig(
                                      f.severity,
                                    );
                                    return (
                                      <div
                                        key={i}
                                        className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl"
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <div
                                            className={`w-1.5 h-1.5 rounded-full ${sevCfg.dot}`}
                                          />
                                          <span
                                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${sevCfg.badge}`}
                                          >
                                            {f.severity}
                                          </span>
                                          <span className="text-xs font-black text-white">
                                            {f.title}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed ml-3.5">
                                          {f.description}
                                        </p>
                                        {f.cveSample && (
                                          <p className="text-[9px] font-mono text-red-400 mt-2 ml-3.5">
                                            {f.cveSample}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-slate-600 text-center py-6">
                          No technology fingerprint data saved for this scan.
                        </p>
                      )}
                    </div>
                  )}

                  {/* ══════════ TAB: RECOMMENDATIONS ══════════ */}
                  {tab === "recommendations" && (
                    <div>
                      {recCount > 0 ? (
                        <div className="space-y-4">
                          {/* Method badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                scan.recommendationMethod === "ai"
                                  ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                  : "bg-slate-800 text-slate-500 border-slate-700"
                              }`}
                            >
                              {scan.recommendationMethod === "ai"
                                ? "🤖 AI Generated"
                                : "📋 Standard"}
                            </span>
                          </div>

                          {scan.recommendations.map((rec, i) => {
                            const pCfg = getPriorityConfig(rec.priority);
                            return (
                              <div
                                key={i}
                                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                              >
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${pCfg.badge}`}
                                  >
                                    {getPriorityIcon(rec.priority)}{" "}
                                    {rec.priority}
                                  </span>
                                  {rec.category && (
                                    <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                      {rec.category}
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-sm font-black text-white mb-3">
                                  {rec.title}
                                </h4>

                                <div className="space-y-3 border-l-2 border-slate-800 pl-4">
                                  <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                      Issue
                                    </p>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                      {rec.description}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                                      Action
                                    </p>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                      {rec.action}
                                    </p>
                                  </div>
                                  {rec.impact && (
                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">
                                        Impact
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {rec.impact}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 text-center py-6">
                          No recommendations saved for this scan.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScanHistory;
