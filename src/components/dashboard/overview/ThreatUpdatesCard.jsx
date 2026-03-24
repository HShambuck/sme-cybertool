// src/components/dashboard/overview/ThreatUpdatesCard.jsx
import React from "react";
import { AlertTriangle, ShieldAlert, AlertOctagon, Shield, ChevronRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThreatUpdatesCard = ({ threatUpdates = [] }) => {
  const navigate = useNavigate();
  const hasThreats = Array.isArray(threatUpdates) && threatUpdates.length > 0;

  // Get severity config styled for the Midnight Theme
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        icon: AlertOctagon,
        glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        text: "text-red-500",
        border: "border-red-500/20",
        bg: "bg-red-500/5",
        label: "CRITICAL",
      },
      high: {
        icon: AlertTriangle,
        glow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]",
        text: "text-orange-500",
        border: "border-orange-500/20",
        bg: "bg-orange-500/5",
        label: "HIGH RISK",
      },
      warning: {
        icon: AlertTriangle,
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
        text: "text-amber-500",
        border: "border-amber-500/20",
        bg: "bg-amber-500/5",
        label: "WARNING",
      },
      low: {
        icon: Shield,
        glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        text: "text-blue-500",
        border: "border-blue-500/20",
        bg: "bg-blue-500/5",
        label: "STABLE",
      },
    };
    return configs[severity] || configs.low;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) return "JUST NOW";
    if (hours < 24) return `${hours}H AGO`;
    return d.toLocaleDateString();
  };

  const displayedThreats = hasThreats ? threatUpdates.slice(0, 3) : [];

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[32px] p-8 h-full flex flex-col shadow-2xl relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center italic">
          <Zap className="h-5 w-5 mr-3 text-blue-500 fill-blue-500/20" />
          Threat Intelligence
        </h3>
        {hasThreats && (
          <div className="flex items-center space-x-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              {threatUpdates.length} ACTIVE
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-4 flex-1 relative z-10">
        {hasThreats ? (
          <>
            {displayedThreats.map((threat) => {
              const config = getSeverityConfig(threat.severity);
              const IconComponent = config.icon;

              return (
                <div
                  key={threat._id}
                  onClick={() => navigate("/threats")}
                  className={`flex items-start space-x-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${config.bg} ${config.border} hover:bg-white/5`}
                >
                  <div className={`p-2.5 rounded-xl ${config.glow} bg-black/20 flex-shrink-0`}>
                    <IconComponent className={`h-4 w-4 ${config.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${config.text}`}>
                        {config.label}
                      </span>
                      <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">
                        {formatDate(threat.publishedAt)}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-100 truncate tracking-tight mb-1">
                      {threat.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-medium italic">
                      {threat.source || "External Database"} // Protocol Detected
                    </p>
                  </div>
                </div>
              );
            })}

            {threatUpdates.length > 3 && (
              <button
                onClick={() => navigate("/threats")}
                className="w-full mt-2 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-500 transition-colors border-t border-white/5 flex items-center justify-center group/btn"
              >
                Access Full Intel Feed <ChevronRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
               <ShieldAlert className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Global Nodes Secure</p>
          </div>
        )}
      </div>

      {/* Decorative Branding */}
      <div className="mt-4 opacity-20 text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] text-center">
        CyberShield Logic Unit 01
      </div>
    </div>
  );
};

export default ThreatUpdatesCard;