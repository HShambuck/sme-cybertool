import React from "react";

const AlertsCard = ({ alerts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Alerts
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3">
            <alert.icon
              className={`h-5 w-5 mt-0.5 ${
                alert.type === "success" ? "text-green-500" : "text-orange-500"
              }`}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{alert.title}</p>
              <p className="text-sm text-gray-500">{alert.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsCard;
