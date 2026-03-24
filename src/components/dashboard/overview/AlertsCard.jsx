// src/components/dashboard/overview/AlertsCard.jsx
import React from "react";
import { Bell, AlertCircle, Clock } from "lucide-react";

const AlertsCard = ({ alerts = [] }) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[32px] p-6 h-full flex flex-col shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-black tracking-tight text-lg flex items-center italic">
          <Bell className="h-5 w-5 mr-3 text-amber-500" />
          Live Alerts
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
      </div>

      <div className="space-y-4 flex-1">
        {alerts.length > 0 ? (
          alerts.slice(0, 3).map((alert, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group">
              <div className="flex justify-between items-start mb-1">
                <span className="text-red-400 font-black text-[9px] tracking-widest uppercase italic">Priority High</span>
                <span className="text-slate-600 text-[9px] font-bold uppercase tracking-tighter">{alert.time || 'Real-time'}</span>
              </div>
              <p className="text-slate-200 font-bold text-xs group-hover:text-red-400 transition-colors leading-tight">
                {alert.title || "Unauthorized Node Access"}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-center">No Active Violations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsCard;