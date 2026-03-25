import React, { useState } from "react";
import {
  Shield,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  Download,
  Server,
  Eye,
  Lightbulb,
  AlertCircle,
  Info,
  Zap,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { securityAPI } from "../../services/api";

const WebsiteSecurityAnalysis = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const analyzeWebsite = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const response = await securityAPI.analyzeWebsite(url);
      setResults(response.data);
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      const code = err.response?.data?.code;
      if (code === "URL_UNREACHABLE") {
        setError(
          serverMsg ||
            "This URL is not reachable. Please check the address and try again.",
        );
      } else {
        setError(serverMsg || err.message || "Failed to analyze website");
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreConfig = (score) => {
    if (score >= 80)
      return {
        color: "text-emerald-400",
        bar: "bg-emerald-500",
        label: "EXCELLENT",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      };
    if (score >= 60)
      return {
        color: "text-amber-400",
        bar: "bg-amber-500",
        label: "GOOD",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      };
    if (score >= 40)
      return {
        color: "text-orange-400",
        bar: "bg-orange-500",
        label: "FAIR",
        badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      };
    return {
      color: "text-red-400",
      bar: "bg-red-500",
      label: "POOR",
      badge: "bg-red-500/10 text-red-400 border-red-500/30",
    };
  };

  const getPriorityConfig = (priority) => {
    const configs = {
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
    };
    return configs[priority] || configs.low;
  };

  const getPriorityIcon = (priority) => {
    const cls = "w-4 h-4";
    if (priority === "critical") return <AlertCircle className={cls} />;
    if (priority === "high") return <AlertTriangle className={cls} />;
    if (priority === "medium") return <Info className={cls} />;
    return <Lightbulb className={cls} />;
  };

  const downloadReport = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `security-report-${results.domain}-${new Date().toISOString()}.json`;
    a.click();
  };

  const scoreConfig = results ? getScoreConfig(results.score) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Input Card */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
          Security Scanner
        </p>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 mb-6">
          <Globe className="h-6 w-6 text-blue-500" />
          Website Security Analysis
        </h1>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && analyzeWebsite()}
              placeholder="https://example.com"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
            />
          </div>
          <button
            onClick={analyzeWebsite}
            disabled={loading}
            className="px-6 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" /> Scanning...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" /> Analyze
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!results && !loading && (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-16 text-center">
          <div className="w-16 h-16 rounded-[20px] bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <Globe className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">
            Awaiting Input
          </p>
          <h3 className="text-lg font-black text-white mb-2">
            Ready to Analyze
          </h3>
          <p className="text-xs text-slate-600 mb-10">
            Enter a website URL above to begin the security scan
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              {
                icon: Lock,
                label: "SSL/TLS Check",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                icon: Shield,
                label: "Security Headers",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Server,
                label: "Reputation Check",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                icon: Eye,
                label: "Breach Detection",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all"
              >
                <div
                  className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results && scoreConfig && (
        <>
          {/* Score Card */}
          <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
                  Security Score
                </p>
                <h2 className="text-lg font-black text-white">
                  {results.domain}
                </h2>
                {results.recommendationMethod && (
                  <p className="text-[10px] text-slate-600 font-mono mt-1">
                    {results.recommendationMethod === "ai"
                      ? "🤖 AI-Powered Analysis"
                      : "📋 Standard Analysis"}
                  </p>
                )}
              </div>
              <button
                onClick={downloadReport}
                className="px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:border-purple-500/30 hover:text-purple-400 transition-all"
              >
                <Download className="h-3.5 w-3.5" /> Export Report
              </button>
            </div>

            <div className="flex items-center gap-10">
              <div>
                <div
                  className={`text-7xl font-black tracking-tighter ${scoreConfig.color}`}
                >
                  {results.score}
                  <span className="text-2xl text-slate-700 ml-1">/100</span>
                </div>
                <span
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${scoreConfig.badge}`}
                >
                  {scoreConfig.label}
                </span>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${scoreConfig.bar} transition-all duration-1000`}
                    style={{ width: `${results.score}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] text-slate-700 font-mono">0</span>
                  <span className="text-[9px] text-slate-700 font-mono">
                    100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SSL + Domain Status */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Lock,
                iconColor: "text-emerald-400",
                iconBg: "bg-emerald-500/10",
                label: "SSL/TLS Security",
                sublabel: "Grade",
                value: results.ssl_grade,
                valueColor:
                  results.ssl_grade === "A+" || results.ssl_grade === "A"
                    ? "text-emerald-400"
                    : results.ssl_grade === "B"
                      ? "text-amber-400"
                      : "text-red-400",
              },
              {
                icon: Server,
                iconColor: "text-blue-400",
                iconBg: "bg-blue-500/10",
                label: "Domain Status",
                sublabel: "Reputation",
                value: results.reputation,
                valueColor:
                  results.reputation === "Clean"
                    ? "text-emerald-400"
                    : "text-red-400",
              },
            ].map(
              ({
                icon: Icon,
                iconColor,
                iconBg,
                label,
                sublabel,
                value,
                valueColor,
              }) => (
                <div
                  key={label}
                  className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl ${iconBg}`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        {label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      {sublabel}
                    </span>
                    <span
                      className={`text-4xl font-black tracking-tighter ${valueColor}`}
                    >
                      {value}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Security Headers */}
          <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" /> Security Headers
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {results.headers.map((header, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-emerald-500/20 transition-all"
                >
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                  <span className="text-xs text-slate-400 font-mono">
                    {header}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          {results.issues?.length > 0 && (
            <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Security
                Issues
              </h3>
              <div className="space-y-3">
                {results.issues.map((issue, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl"
                  >
                    <XCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-400">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {results.recommendations?.length > 0 && (
            <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-purple-500/10">
                  <Lightbulb className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    AI-Powered
                  </p>
                  <h3 className="text-sm font-black text-white">
                    Security Recommendations
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {results.recommendations.map((rec, i) => {
                  const cfg = getPriorityConfig(rec.priority);
                  return (
                    <div
                      key={i}
                      className={`bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${cfg.dot}`}
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${cfg.badge}`}
                              >
                                {getPriorityIcon(rec.priority)}
                                {rec.priority} Priority
                              </span>
                              {rec.category && (
                                <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                  {rec.category}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-black text-white">
                              {rec.title}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="pl-4 space-y-3 border-l-2 border-slate-800">
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
                            Recommended Action
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {rec.action}
                          </p>
                        </div>
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">
                            Impact
                          </p>
                          <p className="text-xs text-slate-400">{rec.impact}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Breach Detection */}
          <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-400" /> Breach Detection
            </h3>
            <div
              className={`flex items-center gap-4 p-5 rounded-2xl border ${results.breach_status === "No leaks found" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}
            >
              {results.breach_status === "No leaks found" ? (
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              )}
              <span className="text-sm font-bold text-slate-300">
                {results.breach_status}
              </span>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-700 font-mono">
            Analysis completed · {new Date().toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
};

export default WebsiteSecurityAnalysis;
