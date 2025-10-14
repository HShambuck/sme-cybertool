import RiskAssessmentCard from "./overview/RiskAssessmentCard";
import AlertsCard from "./overview/AlertsCard";
import RecommendationsCard from "./overview/RecommendationsCard";
import ThreatUpdatesCard from "./overview/ThreatUpdatesCard";
import TrainingProgressCard from "./overview/TrainingProgressCard";
import ActionButtons from "./overview/ActionButtons";

const OverviewContent = ({
  riskData,
  recommendations,
  recentAlerts,
  trainingProgress,
  threatUpdates,
  setCurrentView,
}) => {
  return (
    <div className="space-y-6">
      {/* Risk Assessment */}
      <RiskAssessmentCard
        riskData={
          riskData || { score: null, level: "N/A", lastAssessment: null }
        }
        setCurrentView={setCurrentView}
      />

      {/* Recommendations */}
      <RecommendationsCard recommendations={recommendations || []} setCurrentView={setCurrentView} />

      {/* Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AlertsCard alerts={recentAlerts || []} />
        <TrainingProgressCard
          trainingProgress={
            trainingProgress || { percentage: 0, completed: 0, total: 0 }
          }
        />
        <ThreatUpdatesCard threatUpdates={threatUpdates || []} />
      </div>

      {/* Action Buttons */}
      <ActionButtons setCurrentView={setCurrentView} />
    </div>
  );
};

export default OverviewContent;
