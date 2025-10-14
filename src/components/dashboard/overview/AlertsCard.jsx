import React from "react";
import { Bell, Inbox } from "lucide-react";

const AlertsCard = ({ alerts = [] }) => {
  const hasAlerts = alerts && alerts.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Recent Alerts
        </h3>
        {hasAlerts && (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
            {alerts.length} New
          </span>
        )}
      </div>

      {hasAlerts ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start space-x-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                alert.type === "success"
                  ? "bg-emerald-50 border-emerald-200"
                  : alert.type === "warning"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  alert.type === "success"
                    ? "bg-emerald-500"
                    : alert.type === "warning"
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              >
                <alert.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {alert.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">{alert.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-slate-50 border border-slate-200 rounded-xl p-8">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Inbox className="h-7 w-7 text-blue-600" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 mb-1">
            No Alerts Yet
          </h4>
          <p className="text-sm text-slate-600">
            Stay alert! Any important system or security notifications will show
            up here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsCard;
