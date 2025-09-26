import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

const ThreatUpdatesCard = ({ threatUpdates = [] }) => {
  const hasThreats = threatUpdates && threatUpdates.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Local Threat Updates
      </h3>

      {hasThreats ? (
        <div className="space-y-3">
          {threatUpdates.map((threat) => (
            <div key={threat.id} className="flex items-start space-x-3">
              <threat.icon
                className={`h-5 w-5 mt-0.5 ${
                  threat.type === "critical"
                    ? "text-red-500"
                    : "text-yellow-500"
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
      ) : (
        <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <ShieldAlert className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="text-md font-semibold text-gray-800">
            No Threat Updates
          </h4>
          <p className="text-sm text-gray-600">
            You’re all clear for now. New local or global threat alerts will
            appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ThreatUpdatesCard;
