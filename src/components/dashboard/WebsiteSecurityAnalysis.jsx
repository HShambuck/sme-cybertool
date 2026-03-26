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
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { securityAPI } from "../../services/api";

const WebsiteSecurityAnalysis = () => {
  const [url, setUrl] = useState("https://");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [expandedFinding, setExpandedFinding] = useState(null);

  const handleUrlChange = (e) => {
    const val = e.target.value;
    // Never let user delete the https:// prefix
    if (!val.startsWith("https://")) {
      setUrl("https://");
    } else {
      setUrl(val);
    }
  };

  const analyzeWebsite = async () => {
    if (!url || url === "https://") {
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

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case "critical":
        return {
          badge: "bg-red-500/10 text-red-400 border border-red-500/30",
          dot: "bg-red-500",
          icon: <AlertCircle className="w-4 h-4" />,
          bar: "bg-red-500",
          label: "Critical",
        };
      case "high":
        return {
          badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
          dot: "bg-amber-500",
          icon: <AlertTriangle className="w-4 h-4" />,
          bar: "bg-amber-500",
          label: "High",
        };
      case "medium":
        return {
          badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
          dot: "bg-yellow-500",
          icon: <Info className="w-4 h-4" />,
          bar: "bg-yellow-500",
          label: "Medium",
        };
      default:
        return {
          badge: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
          dot: "bg-blue-500",
          icon: <Lightbulb className="w-4 h-4" />,
          bar: "bg-blue-500",
          label: "Low",
        };
    }
  };

  // Plain English explanations of what each finding means for a non-technical user
  const getPlainEnglish = (finding) => {
    const map = {
      HEADER_001: "Browsers can silently switch to the insecure HTTP version of your site, allowing attackers to intercept traffic.",
      HEADER_002: "Attackers can inject malicious scripts into your pages that steal user data or hijack sessions.",
      HEADER_003: "Your site can be loaded inside a hidden iframe on a malicious website to trick users into clicking things they didn't intend to.",
      HEADER_004: "Browsers may misinterpret file types, allowing attackers to execute malicious files as scripts.",
      HEADER_005: "When users leave your site, the full URL they came from (including sensitive paths) is shared with the destination site.",
      HEADER_006: "Third-party scripts on your site could silently access the user's camera, microphone, or location.",
      HEADER_007: "Older browsers have no extra layer of protection against reflected cross-site scripting attacks.",
      TRANSPORT_001: "All data sent between your users and your server — including passwords and personal data — is visible to anyone intercepting the connection.",
      TRANSPORT_002: "Users who type your domain without https:// are never redirected to the secure version.",
      TRANSPORT_003: "Your SSL/TLS setup is weak. Attackers may be able to decrypt traffic or perform man-in-the-middle attacks.",
      TECH_003: "Your WordPress version is visible in the page source. Attackers use this to look up known vulnerabilities and target your site specifically.",
      TECH_004: "The jQuery version you are using has known security vulnerabilities that attackers can exploit to run malicious code on your pages.",
      TECH_005: "Your PHP version is no longer receiving security updates, meaning known vulnerabilities will never be patched.",
      TECH_001: "Your server software version is visible, making it easier for attackers to identify and exploit known vulnerabilities.",
      TECH_002: "Your backend technology stack is exposed, giving attackers a map of what to target.",
      CORS_001: "Any website on the internet can make requests to your server on behalf of your users.",
      CORS_002: "Your server accepts requests from any website, which can be used to steal data or perform actions on behalf of logged-in users.",
      CORS_003: "Attackers can make fully authenticated requests to your server from any website, completely bypassing your login protection.",
      COOKIE_001: "JavaScript on your page can read session cookies. If an attacker injects a script, they can steal login sessions.",
      COOKIE_002: "Session cookies can be transmitted over unencrypted connections, exposing them to interception.",
      COOKIE_003: "Your site is more vulnerable to cross-site request forgery, where a malicious site tricks users into making unintended requests.",
      REP_001: "Google has flagged this domain as dangerous. Users visiting your site see a browser warning and are advised not to proceed.",
      REP_002: "Automated analysis detected suspicious behaviour — unusual external requests, redirects, or resource loading patterns.",
    };
    return map[finding.id] || finding.description;
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

  // Sort findings: critical → high → medium → low
  const sortedFindings = results?.findings
    ? [...results.findings].sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
      })
    : [];

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
              onChange={handleUrlChange}
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
              { icon: Lock,     label: "SSL/TLS Check",     color: "text-blue-400",    bg: "bg-blue-500/10"    },
              { icon: Shield,   label: "Security Headers",  color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Server,   label: "Reputation Check",  color: "text-amber-400",   bg: "bg-amber-500/10"   },
              { icon: Eye,      label: "Breach Detection",  color: "text-purple-400",  bg: "bg-purple-500/10"  },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
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
                <h2 className="text-lg font-black text-white">{results.domain}</h2>
                {results.recommendationMethod && (
                  <p className="text-[10px] text-slate-600 font-mono mt-1">
                    {results.recommendationMethod === "ai" ? "🤖 AI-Powered Analysis" : "📋 Standard Analysis"}
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
                <div className={`text-7xl font-black tracking-tighter ${scoreConfig.color}`}>
                  {results.score}
                  <span className="text-2xl text-slate-700 ml-1">/100</span>
                </div>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${scoreConfig.badge}`}>
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
                  <span className="text-[9px] text-slate-700 font-mono">100</span>
                </div>
              </div>
            </div>

            {/* Finding summary badges */}
            {results.findingSummary && (
              <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-slate-800/50">
                {[
                  { label: "Critical", count: results.findingSummary.bySeverity?.critical, color: "text-red-400 bg-red-500/10 border-red-500/20" },
                  { label: "High",     count: results.findingSummary.bySeverity?.high,     color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                  { label: "Medium",   count: results.findingSummary.bySeverity?.medium,   color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                  { label: "Low",      count: results.findingSummary.bySeverity?.low,       color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                ].map(({ label, count, color }) =>
                  count > 0 ? (
                    <span key={label} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${color}`}>
                      {count} {label}
                    </span>
                  ) : null
                )}
                <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-800 text-slate-500">
                  {results.findingSummary.total} Total Findings
                </span>
              </div>
            )}
          </div>

          {/* SSL + Domain Status */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Lock, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10",
                label: "SSL/TLS Security", sublabel: "Grade",
                value: results.ssl_grade,
                valueColor: results.ssl_grade === "A+" || results.ssl_grade === "A" ? "text-emerald-400" : results.ssl_grade === "B" ? "text-amber-400" : "text-red-400",
              },
              {
                icon: Server, iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
                label: "Domain Status", sublabel: "Reputation",
                value: results.reputation,
                valueColor: results.reputation === "Clean" ? "text-emerald-400" : "text-red-400",
              },
            ].map(({ icon: Icon, iconColor, iconBg, label, sublabel, value, valueColor }) => (
              <div key={label} className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${iconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{label}</p>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{sublabel}</span>
                  <span className={`text-4xl font-black tracking-tighter ${valueColor}`}>{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Security Headers — present */}
          {results.headers?.length > 0 && (
            <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" /> Headers Detected
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {results.headers.map((header, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-mono">{header}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY FINDINGS — replaces the old plain issues list ── */}
          {sortedFindings.length > 0 && (
            <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-red-500/10">
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">What Was Found</p>
                  <h3 className="text-sm font-black text-white">Security Vulnerabilities</h3>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-8 ml-14">
                Each issue below was confirmed on your site. Click any finding to see what it means and how to fix it.
              </p>

              <div className="space-y-3">
                {sortedFindings.map((finding, i) => {
                  const cfg = getSeverityConfig(finding.severity);
                  const isExpanded = expandedFinding === i;

                  return (
                    <div
                      key={i}
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                        isExpanded ? "border-slate-700" : "border-slate-800/50"
                      }`}
                    >
                      {/* Header row — always visible */}
                      <button
                        onClick={() => setExpandedFinding(isExpanded ? null : i)}
                        className="w-full flex items-center justify-between p-5 bg-slate-900/50 hover:bg-slate-900 transition-all text-left"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Severity dot */}
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />

                          {/* Severity badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 flex-shrink-0 ${cfg.badge}`}>
                            {cfg.icon} {cfg.label}
                          </span>

                          {/* Title */}
                          <span className="text-sm font-black text-white truncate">{finding.title}</span>
                        </div>

                        {/* Expand toggle */}
                        <div className="flex-shrink-0 ml-4 text-slate-600">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="px-5 pb-5 bg-slate-900/20 space-y-4 border-t border-slate-800/50 pt-5">

                          {/* Plain English explanation */}
                          <div className={`p-4 rounded-xl border ${cfg.badge.includes("red") ? "bg-red-500/5 border-red-500/10" : cfg.badge.includes("amber") ? "bg-amber-500/5 border-amber-500/10" : "bg-slate-800/50 border-slate-700/50"}`}>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">What This Means</p>
                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                              {getPlainEnglish(finding)}
                            </p>
                          </div>

                          {/* Technical evidence */}
                          <div>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Evidence</p>
                            <p className="text-xs text-slate-500 font-mono bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                              {finding.evidence}
                            </p>
                          </div>

                          {/* How to fix */}
                          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">How To Fix It</p>
                            <p className="text-xs text-slate-300 leading-relaxed">{finding.recommendation}</p>
                          </div>

                          {/* OWASP + CWE tags */}
                          <div className="flex flex-wrap gap-2">
                            {finding.owasp && (
                              <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {finding.owasp}
                              </span>
                            )}
                            {finding.cwe && (
                              <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {finding.cwe}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI-Powered</p>
                  <h3 className="text-sm font-black text-white">Security Recommendations</h3>
                </div>
              </div>

              <div className="space-y-4">
                {results.recommendations.map((rec, i) => {
                  const cfg = getPriorityConfig(rec.priority);
                  return (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${cfg.dot}`} />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${cfg.badge}`}>
                                {getPriorityIcon(rec.priority)}
                                {rec.priority} Priority
                              </span>
                              {rec.category && (
                                <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                                  {rec.category}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-black text-white">{rec.title}</h4>
                          </div>
                        </div>
                      </div>

                      <div className="pl-4 space-y-3 border-l-2 border-slate-800">
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Issue</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Recommended Action</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{rec.action}</p>
                        </div>
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Impact</p>
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
            <div className={`flex items-center gap-4 p-5 rounded-2xl border ${
              results.breach_status === "No threats detected in reputation databases"
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}>
              {results.breach_status === "No threats detected in reputation databases" ? (
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              )}
              <span className="text-sm font-bold text-slate-300">{results.breach_status}</span>
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
