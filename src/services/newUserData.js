import { CheckCircle, AlertTriangle } from "lucide-react";

export const defaultRiskData = {
  score: 0,
  level: "No Assessment Yet",
  lastAssessment: "N/A",
  completedWeeksAgo: "N/A",
};

export const defaultRecommendations = [
  {
    id: 1,
    text: "No recommendations yet. Start your first risk assessment to see suggestions.",
    completed: false,
    priority: "low",
  },
];

export const defaultAlerts = [
  {
    id: 1,
    type: "info",
    title: "No recent alerts.",
    date: "",
    icon: CheckCircle,
  },
];

export const defaultThreatUpdates = [
  {
    id: 1,
    type: "info",
    title: "No local threat updates available.",
    icon: AlertTriangle,
  },
];

export const defaultTrainingProgress = {
  percentage: 0,
  completed: 0,
  total: 0,
};
