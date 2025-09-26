import React from "react";
import { Bell, Inbox } from "lucide-react";

const AlertsCard = ({ alerts = [] }) => {
  const hasAlerts = alerts && alerts.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-blue-500" />
        Recent Alerts
      </h3>

      {hasAlerts ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-3 bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm"
            >
              <alert.icon
                className={`h-5 w-5 mt-0.5 ${
                  alert.type === "success"
                    ? "text-green-600"
                    : alert.type === "warning"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {alert.title}
                </p>
                <p className="text-xs text-gray-500">{alert.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-6 shadow-sm">
          <Inbox className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <h4 className="text-md font-semibold text-gray-700">No Alerts Yet</h4>
          <p className="text-sm text-gray-600">
            Stay alert! Any important system or security notifications will show
            up here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsCard;
