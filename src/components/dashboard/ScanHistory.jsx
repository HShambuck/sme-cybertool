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
  ChevronRight,
  Loader,
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

      if (historyData.success) {
        setScans(historyData.scans);
      }

      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
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

  const getTrend = (currentScore, previousScore) => {
    if (!previousScore) return null;
    const diff = currentScore - previousScore;
    if (diff > 0) return { direction: "up", value: diff };
    if (diff < 0) return { direction: "down", value: Math.abs(diff) };
    return { direction: "neutral", value: 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading scan history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Scan History</h1>
          </div>
          <p className="text-gray-600">
            Review your past website security analyses
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {stats.totalScans}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Total Scans</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {stats.averageScore}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Average Score</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {stats.uniqueDomains}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Websites Analyzed</p>
            </div>
          </div>
        )}

        {/* Scan History List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Scans</h2>
          </div>

          {scans.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Scans Yet
              </h3>
              <p className="text-gray-600">
                Start analyzing websites to see your history here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {scans.map((scan, index) => {
                const prevScan = scans[index + 1];
                const trend = prevScan
                  ? getTrend(scan.score, prevScan.score)
                  : null;

                return (
                  <div
                    key={scan._id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      setSelectedScan(
                        selectedScan?._id === scan._id ? null : scan
                      )
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`${getScoreBg(scan.score)} p-3 rounded-lg`}
                        >
                          <Shield
                            className={`w-6 h-6 ${getScoreColor(scan.score)}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {scan.domain}
                            </h3>
                            {trend && (
                              <span
                                className={`flex items-center gap-1 text-sm ${
                                  trend.direction === "up"
                                    ? "text-green-600"
                                    : trend.direction === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {trend.direction === "up" && (
                                  <TrendingUp className="w-4 h-4" />
                                )}
                                {trend.direction === "down" && (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                {trend.value > 0 && `${trend.value}pts`}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(scan.scanDate)}
                            </span>
                            <span>SSL: {scan.sslGrade}</span>
                            <span>{scan.securityHeaders.length} headers</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`text-3xl font-bold ${getScoreColor(
                              scan.score
                            )}`}
                          >
                            {scan.score}
                          </div>
                          <div className="text-sm text-gray-500">/100</div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            selectedScan?._id === scan._id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedScan?._id === scan._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {/* Security Headers */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Security Headers
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {scan.securityHeaders.map((header, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded"
                              >
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                {header}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Issues */}
                        {scan.issues && scan.issues.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Issues Found
                            </h4>
                            <div className="space-y-2">
                              {scan.issues.map((issue, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-sm text-gray-700 bg-orange-50 p-2 rounded"
                                >
                                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                  {issue}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">
                              Reputation
                            </div>
                            <div className="font-semibold text-gray-800">
                              {scan.reputation}
                            </div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">
                              Breach Status
                            </div>
                            <div className="font-semibold text-gray-800">
                              {scan.breachStatus}
                            </div>
                          </div>
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
    </div>
  );
};

export default ScanHistory;
