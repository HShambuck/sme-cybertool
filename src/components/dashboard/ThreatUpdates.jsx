import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  RefreshCw,
  Filter,
  Clock,
  Globe,
  ChevronDown,
  X,
  Search,
  Bell,
  BellOff,
  Plus,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { getThreatUpdates } from "../../services/threats";

const ThreatUpdates = () => {
  const [threats, setThreats] = useState([]);
  const [filteredThreats, setFilteredThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedThreat, setExpandedThreat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [newThreatsCount, setNewThreatsCount] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const fetchThreats = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const data = await getThreatUpdates();

      if (threats.length > 0 && data.length > threats.length) {
        const newCount = data.length - threats.length;
        setNewThreatsCount(newCount);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }

      setThreats(data);
      setFilteredThreats(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Failed to fetch threat updates. Please try again.");
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchThreats(true), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, threats]);

  useEffect(() => {
    let filtered = threats;
    if (selectedSeverity !== "all")
      filtered = filtered.filter((t) => t.severity === selectedSeverity);
    if (selectedCategory !== "all")
      filtered = filtered.filter((t) => t.category === selectedCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          (t.source && t.source.toLowerCase().includes(query)),
      );
    }
    setFilteredThreats(filtered);
  }, [selectedSeverity, selectedCategory, threats, searchQuery]);

  // Severity config: colors matching the dark dashboard palette
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        badge: "bg-red-500/10 text-red-400 border border-red-500/30",
        dot: "bg-red-500",
        glow: "hover:border-red-500/30",
      },
      high: {
        badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
        dot: "bg-amber-500",
        glow: "hover:border-amber-500/30",
      },
      warning: {
        badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
        dot: "bg-yellow-500",
        glow: "hover:border-yellow-500/30",
      },
      low: {
        badge: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
        dot: "bg-blue-500",
        glow: "hover:border-blue-500/30",
      },
      info: {
        badge: "bg-slate-500/10 text-slate-400 border border-slate-500/30",
        dot: "bg-slate-500",
        glow: "hover:border-slate-500/30",
      },
    };
    return configs[severity] || configs.info;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days === 0) {
      if (hours === 0) return "Just now";
      return `${hours}h ago`;
    }
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const clearFilters = () => {
    setSelectedSeverity("all");
    setSelectedCategory("all");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
            Fetching threat data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-8">
        <div className="flex items-center mb-3">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
          <h3 className="text-red-400 font-black uppercase tracking-widest text-sm">
            Error Loading Threats
          </h3>
        </div>
        <p className="text-slate-500 mb-4 text-sm">{error}</p>
        <button
          onClick={() => fetchThreats()}
          className="px-6 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* New Threats Notification */}
      {showNotification && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-[24px] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-black text-white uppercase tracking-widest">
                {newThreatsCount} New Threat{newThreatsCount > 1 ? "s" : ""}{" "}
                Detected
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Intelligence feed updated
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowNotification(false);
              setNewThreatsCount(0);
            }}
            className="text-slate-600 hover:text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
            Intelligence Feed
          </p>

          {lastUpdate && (
            <p className="text-[10px] text-slate-600 mt-1 font-mono">
              Last sync: {formatDate(lastUpdate)}
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${
              autoRefresh
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-slate-800/40 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            {autoRefresh ? (
              <Bell className="h-3.5 w-3.5" />
            ) : (
              <BellOff className="h-3.5 w-3.5" />
            )}
            {autoRefresh ? "Live" : "Paused"}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${
              showFilters
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>

          <button
            onClick={() => fetchThreats()}
            className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white hover:bg-blue-500 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>

          <button
            onClick={() => setShowAdminModal(true)}
            className="px-4 py-2 bg-[#0F172A] border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400 hover:border-purple-500/50 hover:text-purple-400 transition-all group"
          >
            <div className="p-0.5 rounded bg-purple-500/10 group-hover:bg-purple-500/20 transition-all">
              <Plus className="h-3 w-3 text-purple-400" />
            </div>
            Add Threat
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
        <input
          type="text"
          placeholder="Search threats by title, description, or source..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3.5 bg-[#0F172A] border border-slate-800 rounded-2xl text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Filter Threats
            </h3>
            {(selectedSeverity !== "all" ||
              selectedCategory !== "all" ||
              searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-black uppercase tracking-widest"
              >
                <X className="h-3 w-3" /> Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Severity Level",
                value: selectedSeverity,
                onChange: setSelectedSeverity,
                options: [
                  { value: "all", label: "All Severities" },
                  { value: "critical", label: "Critical" },
                  { value: "high", label: "High" },
                  { value: "warning", label: "Warning" },
                  { value: "low", label: "Low" },
                  { value: "info", label: "Info" },
                ],
              },
              {
                label: "Category",
                value: selectedCategory,
                onChange: setSelectedCategory,
                options: [
                  { value: "all", label: "All Categories" },
                  { value: "phishing", label: "Phishing" },
                  { value: "ransomware", label: "Ransomware" },
                  { value: "vulnerability", label: "Vulnerability" },
                  { value: "malware", label: "Malware" },
                  { value: "data_breach", label: "Data Breach" },
                  { value: "policy", label: "Policy" },
                  { value: "general", label: "General" },
                ],
              },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
                  {field.label}
                </label>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  {field.options.map((o) => (
                    <option
                      key={o.value}
                      value={o.value}
                      className="bg-slate-900"
                    >
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Showing {filteredThreats.length} / {threats.length} threats
        </span>
        {autoRefresh && (
          <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Updates Enabled
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredThreats.length === 0 ? (
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-16 text-center">
          <Shield className="h-10 w-10 text-slate-700 mx-auto mb-4" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">
            No Threats Found
          </h3>
          <p className="text-xs text-slate-600">
            {searchQuery ||
            selectedSeverity !== "all" ||
            selectedCategory !== "all"
              ? "No threat updates match your current filters."
              : "No threat updates available at this time."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreats.map((threat) => {
            const cfg = getSeverityConfig(threat.severity);
            const isExpanded = expandedThreat === threat._id;
            return (
              <div
                key={threat._id}
                className={`bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8 transition-all duration-200 ${cfg.glow} hover:shadow-2xl`}
              >
                {/* Threat Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Severity dot */}
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}
                  ></div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${cfg.badge}`}
                      >
                        {(threat.severity === "critical" ||
                          threat.severity === "high") && (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {threat.severity}
                      </span>
                      {threat.category && (
                        <span className="px-3 py-1 bg-slate-900/50 border border-slate-800 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                          {threat.category.replace("_", " ")}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-white tracking-tight mb-2 leading-snug">
                      {threat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {threat.description}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-5 text-[10px] text-slate-600 font-mono mb-4 pl-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {formatDate(threat.publishedAt)}
                  </div>
                  {threat.source && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      {threat.source}
                    </div>
                  )}
                  {threat.affectedRegions?.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span>📍</span>
                      {threat.affectedRegions.join(", ")}
                    </div>
                  )}
                </div>

                {/* Recommendations Toggle */}
                {threat.recommendations?.length > 0 && (
                  <div className="pl-6">
                    <button
                      onClick={() =>
                        setExpandedThreat(isExpanded ? null : threat._id)
                      }
                      className="flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                      {isExpanded ? "Hide" : "View"} Recommendations (
                      {threat.recommendations.length})
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-2 border-l-2 border-blue-500/20 pl-4">
                        {threat.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-[11px] text-slate-400"
                          >
                            <span className="text-blue-500 font-black mt-0.5 text-[9px] uppercase tracking-widest">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <AdminThreatModal
          onClose={() => setShowAdminModal(false)}
          onSuccess={() => {
            setShowAdminModal(false);
            fetchThreats();
          }}
        />
      )}
    </div>
  );
};

/* ── Admin Modal ── */
const AdminThreatModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "warning",
    category: "general",
    source: "",
    affectedRegions: "",
    recommendations: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const API = (await import("../../services/api")).default;
      const payload = {
        ...formData,
        affectedRegions: formData.affectedRegions
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        recommendations: formData.recommendations.split("\n").filter(Boolean),
      };
      await API.post("/threats", payload);
      onSuccess();
    } catch (err) {
      setError("Failed to create threat update. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all";
  const labelClass =
    "block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A1628] border border-slate-800/50 rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between sticky top-0 bg-[#0A1628] z-10 rounded-t-[40px]">
          <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">
              Admin Console
            </p>
            <h2 className="text-lg font-black text-white tracking-tight">
              Create Threat Update
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-800 text-slate-600 hover:text-white hover:border-slate-700 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-5">
          {error && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={inputClass}
              placeholder="Brief threat title"
            />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`${inputClass} resize-none`}
              rows="4"
              placeholder="Detailed description of the threat"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                key: "severity",
                label: "Severity *",
                options: ["info", "low", "warning", "high", "critical"],
              },
              {
                key: "category",
                label: "Category",
                options: [
                  "general",
                  "phishing",
                  "ransomware",
                  "vulnerability",
                  "malware",
                  "data_breach",
                  "policy",
                ],
              },
            ].map((field) => (
              <div key={field.key}>
                <label className={labelClass}>{field.label}</label>
                <select
                  value={formData[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {field.options.map((o) => (
                    <option
                      key={o}
                      value={o}
                      className="bg-slate-900 capitalize"
                    >
                      {o.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className={labelClass}>Source</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              className={inputClass}
              placeholder="e.g., CISA, CERT-GH"
            />
          </div>

          <div>
            <label className={labelClass}>
              Affected Regions (comma-separated)
            </label>
            <input
              type="text"
              value={formData.affectedRegions}
              onChange={(e) =>
                setFormData({ ...formData, affectedRegions: e.target.value })
              }
              className={inputClass}
              placeholder="Ghana, Nigeria, West Africa"
            />
          </div>

          <div>
            <label className={labelClass}>Recommendations (one per line)</label>
            <textarea
              value={formData.recommendations}
              onChange={(e) =>
                setFormData({ ...formData, recommendations: e.target.value })
              }
              className={`${inputClass} resize-none`}
              rows="5"
              placeholder="Enter each recommendation on a new line"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-700 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" /> Create Threat
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatUpdates;
