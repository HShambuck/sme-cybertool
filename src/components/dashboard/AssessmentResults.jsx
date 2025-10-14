import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingAnimation from "./results/LoadingAnimation";
import ResultsHeader from "./results/ResultsHeader";
import RiskScoreCard from "./results/RiskScoreCard";
import ActionPlanCard from "./results/ActionPlanCard";
import NextStepsCard from "./results/NextStepsCard";
import ActionButtons from "./results/ActionButtons";
import { getRiskColor } from "./results/utils";

const AssessmentResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);

  const assessmentData = location.state?.assessment;

  useEffect(() => {
    if (!assessmentData) {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setShowResults(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [assessmentData, navigate]);

  if (!assessmentData) {
    return null;
  }

  if (!showResults) {
    return <LoadingAnimation />;
  }

  const colors = getRiskColor(assessmentData.level);
  const recommendationCount = assessmentData.recommendationIds?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ResultsHeader />

        <RiskScoreCard assessmentData={assessmentData} colors={colors} />

        <ActionPlanCard
          assessmentData={assessmentData}
          recommendationCount={recommendationCount}
          colors={colors}
        />

        <NextStepsCard />

        <ActionButtons navigate={navigate} />

        <div className="text-center mt-8 text-sm text-slate-500">
          Assessment completed on{" "}
          {new Date(assessmentData.assessmentDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default AssessmentResults;
