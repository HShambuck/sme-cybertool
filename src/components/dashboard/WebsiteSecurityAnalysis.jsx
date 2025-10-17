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
      const data = response.data;

      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to analyze website");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "EXCELLENT";
    if (score >= 60) return "GOOD";
    if (score >= 40) return "FAIR";
    return "POOR";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return styles[priority] || styles.low;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical":
        return <AlertCircle className="w-5 h-5" />;
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      case "medium":
        return <Info className="w-5 h-5" />;
      case "low":
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const downloadReport = () => {
    const reportData = JSON.stringify(results, null, 2);
    const blob = new Blob([reportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-report-${
      results.domain
    }-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Website Security Analysis
              </h1>
              <p className="text-gray-600">
                Analyze your website's security posture
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && analyzeWebsite()}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={analyzeWebsite}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <>
            {/* Score Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Security Score
                  </h2>
                  <p className="text-gray-600">{results.domain}</p>
                </div>
                <button
                  onClick={downloadReport}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>

              <div className="text-center">
                <div
                  className={`text-6xl font-bold ${getScoreColor(
                    results.score
                  )} mb-2`}
                >
                  {results.score}
                  <span className="text-2xl text-gray-400">/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className={`h-3 rounded-full ${
                      results.score >= 80
                        ? "bg-green-500"
                        : results.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${results.score}%` }}
                  />
                </div>
                <span
                  className={`font-semibold ${getScoreColor(results.score)}`}
                >
                  {getScoreLabel(results.score)}
                </span>
                {results.recommendationMethod && (
                  <p className="text-sm text-gray-500 mt-2">
                    {results.recommendationMethod === "ai"
                      ? "🤖 AI-Powered Recommendations"
                      : "📋 Standard Recommendations"}
                  </p>
                )}
              </div>
            </div>

            {/* SSL/TLS Grade */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    SSL/TLS Security
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Grade</span>
                  <span
                    className={`text-3xl font-bold ${
                      results.ssl_grade === "A+" || results.ssl_grade === "A"
                        ? "text-green-600"
                        : results.ssl_grade === "B"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {results.ssl_grade}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Domain Status
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reputation</span>
                  <span
                    className={`text-lg font-semibold ${
                      results.reputation === "Clean"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {results.reputation}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Headers */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Security Headers
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {results.headers.map((header, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-green-50 p-3 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{header}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            {results.issues && results.issues.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Security Issues
                  </h3>
                </div>
                <div className="space-y-3">
                  {results.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg"
                    >
                      <XCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <span className="text-gray-700">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI-Powered Recommendations Section */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Security Recommendations
                    </h3>
                    <p className="text-sm text-gray-600">
                      Personalized recommendations to improve your security
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {results.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg ${getPriorityBadge(
                              rec.priority
                            )}`}
                          >
                            {getPriorityIcon(rec.priority)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-lg mb-1">
                              {rec.title}
                            </h4>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityBadge(
                                rec.priority
                              )} inline-block`}
                            >
                              {rec.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {rec.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="ml-14 space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            📋 Issue:
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            ✅ Recommended Action:
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {rec.action}
                          </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-800 mb-1">
                            💡 Impact:
                          </p>
                          <p className="text-sm text-blue-700">{rec.impact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breach Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  Breach Detection
                </h3>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
                {results.breach_status === "No leaks found" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-gray-700">{results.breach_status}</span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Analysis completed on {new Date().toLocaleString()}
            </div>
          </>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your website URL above to start the security analysis
            </p>
            <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Lock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">SSL/TLS Check</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Security Headers</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Server className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Reputation Check</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Breach Detection</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteSecurityAnalysis;
