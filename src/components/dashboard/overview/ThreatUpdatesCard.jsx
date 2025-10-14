import React from "react";
import { AlertTriangle, ShieldAlert, AlertOctagon, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThreatUpdatesCard = ({ threatUpdates = [] }) => {
  const navigate = useNavigate();
  const hasThreats = Array.isArray(threatUpdates) && threatUpdates.length > 0;

  // Get severity icon and color
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        icon: AlertOctagon,
        bg: "bg-red-50",
        border: "border-red-200",
        iconBg: "bg-red-500",
        label: "Critical",
      },
      high: {
        icon: AlertTriangle,
        bg: "bg-orange-50",
        border: "border-orange-200",
        iconBg: "bg-orange-500",
        label: "High",
      },
      warning: {
        icon: AlertTriangle,
        bg: "bg-amber-50",
        border: "border-amber-200",
        iconBg: "bg-amber-500",
        label: "Warning",
      },
      low: {
        icon: Shield,
        bg: "bg-blue-50",
        border: "border-blue-200",
        iconBg: "bg-blue-500",
        label: "Low",
      },
      info: {
        icon: Shield,
        bg: "bg-slate-50",
        border: "border-slate-200",
        iconBg: "bg-slate-500",
        label: "Info",
      },
    };
    return configs[severity] || configs.info;
  };

  // Format date
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

  // Get only top 3 most recent threats
  const displayedThreats = hasThreats ? threatUpdates.slice(0, 3) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900">
          Threat Intelligence Updates
        </h3>
        {hasThreats && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-slate-600">
              {threatUpdates.length} Active
            </span>
          </div>
        )}
      </div>

      {/* If there are threats */}
      {hasThreats ? (
        <div className="space-y-3">
          {displayedThreats.map((threat) => {
            const config = getSeverityConfig(threat.severity);
            const IconComponent = config.icon;

            return (
              <div
                key={threat._id}
                className={`flex items-start space-x-3 p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${config.bg} ${config.border}`}
                onClick={() => navigate("/threats")}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {config.label}
                    </span>
                    {threat.source && (
                      <span className="text-xs text-slate-400">
                        • {threat.source}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {threat.title}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {threat.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDate(threat.publishedAt)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* View All Button */}
          {threatUpdates.length > 3 && (
            <button
              onClick={() => navigate("/threats")}
              className="w-full mt-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View All {threatUpdates.length} Threats →
            </button>
          )}
        </div>
      ) : (
        /* If there are no threats */
        <div className="text-center bg-slate-50 border border-slate-200 rounded-xl p-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="h-7 w-7 text-emerald-600" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 mb-1">
            No Threat Updates
          </h4>
          <p className="text-sm text-slate-600">
            All systems secure. New threat alerts will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ThreatUpdatesCard;
