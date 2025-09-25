import React from "react";

const ThreatUpdatesCard = ({ threatUpdates }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Local Threat Updates
      </h3>
      <div className="space-y-3">
        {threatUpdates.map((threat) => (
          <div key={threat.id} className="flex items-start space-x-3">
            <threat.icon
              className={`h-5 w-5 mt-0.5 ${
                threat.type === "critical" ? "text-red-500" : "text-yellow-500"
              }`}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {threat.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatUpdatesCard;
