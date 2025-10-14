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

      // Check for new threats
      if (threats.length > 0 && data.length > threats.length) {
        const newCount = data.length - threats.length;
        setNewThreatsCount(newCount);
        setShowNotification(true);

        // Auto-hide notification after 5 seconds
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

  // Initial fetch
  useEffect(() => {
    fetchThreats();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchThreats(true); // Silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, threats]);

  // Filter and search
  useEffect(() => {
    let filtered = threats;

    // Apply severity filter
    if (selectedSeverity !== "all") {
      filtered = filtered.filter((t) => t.severity === selectedSeverity);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          (t.source && t.source.toLowerCase().includes(query))
      );
    }

    setFilteredThreats(filtered);
  }, [selectedSeverity, selectedCategory, threats, searchQuery]);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-blue-100 text-blue-800 border-blue-200",
      info: "bg-slate-100 text-slate-800 border-slate-200",
    };
    return colors[severity] || colors.info;
  };

  const getSeverityIcon = (severity) => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Shield className="h-4 w-4" />;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days === 0) {
      if (hours === 0) return "Just now";
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const clearFilters = () => {
    setSelectedSeverity("all");
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const dismissNotification = () => {
    setShowNotification(false);
    setNewThreatsCount(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading threat updates...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
          <h3 className="text-red-900 font-semibold">Error Loading Threats</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => fetchThreats()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Threats Notification */}
      {showNotification && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">
                {newThreatsCount} New Threat{newThreatsCount > 1 ? "s" : ""}{" "}
                Detected
              </p>
              <p className="text-sm text-blue-700">
                Check the latest security updates
              </p>
            </div>
          </div>
          <button
            onClick={dismissNotification}
            className="text-blue-600 hover:text-blue-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            Threat Intelligence Updates
          </h1>
          <p className="text-slate-600 mt-1">
            Stay informed about the latest cybersecurity threats
            {lastUpdate && (
              <span className="text-slate-400 ml-2">
                • Last updated {formatDate(lastUpdate)}
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
              autoRefresh
                ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
            title={
              autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"
            }
          >
            {autoRefresh ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
            Auto-refresh
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={() => fetchThreats()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowAdminModal(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search threats by title, description, or source..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Filter Threats</h3>
            {(selectedSeverity !== "all" ||
              selectedCategory !== "all" ||
              searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Severity Level
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="warning">Warning</option>
                <option value="low">Low</option>
                <option value="info">Info</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="phishing">Phishing</option>
                <option value="ransomware">Ransomware</option>
                <option value="vulnerability">Vulnerability</option>
                <option value="malware">Malware</option>
                <option value="data_breach">Data Breach</option>
                <option value="policy">Policy</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Showing {filteredThreats.length} of {threats.length} threat
          {threats.length !== 1 ? "s" : ""}
        </span>
        {autoRefresh && (
          <span className="flex items-center gap-1 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            Live updates enabled
          </span>
        )}
      </div>

      {/* Threat List */}
      {filteredThreats.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Threats Found
          </h3>
          <p className="text-slate-500">
            {searchQuery ||
            selectedSeverity !== "all" ||
            selectedCategory !== "all"
              ? "No threat updates match your current filters."
              : "No threat updates available at this time."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreats.map((threat) => (
            <div
              key={threat._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              {/* Threat Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getSeverityColor(
                        threat.severity
                      )}`}
                    >
                      {getSeverityIcon(threat.severity)}
                      {threat.severity.toUpperCase()}
                    </span>
                    {threat.category && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {threat.category.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {threat.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {threat.description}
                  </p>
                </div>
              </div>

              {/* Threat Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(threat.publishedAt)}
                </div>
                {threat.source && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    {threat.source}
                  </div>
                )}
                {threat.affectedRegions &&
                  threat.affectedRegions.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span>📍 {threat.affectedRegions.join(", ")}</span>
                    </div>
                  )}
              </div>

              {/* Recommendations */}
              {threat.recommendations && threat.recommendations.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() =>
                      setExpandedThreat(
                        expandedThreat === threat._id ? null : threat._id
                      )
                    }
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedThreat === threat._id ? "rotate-180" : ""
                      }`}
                    />
                    {expandedThreat === threat._id ? "Hide" : "View"}{" "}
                    Recommendations ({threat.recommendations.length})
                  </button>

                  {expandedThreat === threat._id && (
                    <div className="mt-3 pl-6 space-y-2">
                      {threat.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <span className="text-blue-600 font-bold mt-0.5">
                            •
                          </span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
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

// Admin Modal Component
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
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            Create New Threat Update
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief threat title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Detailed description of the threat"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Severity *
              </label>
              <select
                required
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="info">Info</option>
                <option value="low">Low</option>
                <option value="warning">Warning</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="phishing">Phishing</option>
                <option value="ransomware">Ransomware</option>
                <option value="vulnerability">Vulnerability</option>
                <option value="malware">Malware</option>
                <option value="data_breach">Data Breach</option>
                <option value="policy">Policy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., CISA, CERT-GH"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Affected Regions (comma-separated)
            </label>
            <input
              type="text"
              value={formData.affectedRegions}
              onChange={(e) =>
                setFormData({ ...formData, affectedRegions: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ghana, Nigeria, West Africa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recommendations (one per line)
            </label>
            <textarea
              value={formData.recommendations}
              onChange={(e) =>
                setFormData({ ...formData, recommendations: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="5"
              placeholder="Enter each recommendation on a new line"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Threat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThreatUpdates;
