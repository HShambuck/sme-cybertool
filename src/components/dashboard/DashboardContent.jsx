import React from "react";
import RiskAssessmentCard from "./overview/RiskAssessmentCard";
import RecommendationsCard from "./overview/RecommendationsCard";
import AlertsCard from "./overview/AlertsCard";
import TrainingProgressCard from "./overview/TrainingProgressCard";
import ThreatUpdatesCard from "./overview/ThreatUpdatesCard";
import ActionButtons from "./overview/ActionButtons";

const DashboardContent = ({
  riskData,
  recommendations,
  recentAlerts,
  trainingProgress,
  threatUpdates,
  setCurrentView,
}) => {
  return (
    <div className="space-y-6">
      <RiskAssessmentCard riskData={riskData} />
      <RecommendationsCard recommendations={recommendations} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AlertsCard alerts={recentAlerts} />
        <TrainingProgressCard trainingProgress={trainingProgress} />
        <ThreatUpdatesCard threatUpdates={threatUpdates} />
      </div>

      <ActionButtons setCurrentView={setCurrentView} />
    </div>
  );
};

export default DashboardContent;
