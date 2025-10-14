import React from "react";
import { CheckCircle } from "lucide-react";

const NextStepsCard = () => {
  const steps = [
    {
      number: 1,
      color: "blue",
      title: "Review Your Recommendations",
      description:
        "Explore personalized security improvements tailored to your organization",
    },
    {
      number: 2,
      color: "purple",
      title: "Complete Training Modules",
      description:
        "Access step-by-step guides to implement each recommendation",
    },
    {
      number: 3,
      color: "green",
      title: "Track Your Progress",
      description:
        "Monitor improvements and retake assessments to measure growth",
    },
  ];

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6 animate-slide-up"
      style={{ animationDelay: "0.2s" }}
    >
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
        What's Next?
      </h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg"
          >
            <div
              className={`w-8 h-8 bg-${step.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <span className={`text-${step.color}-600 font-bold text-sm`}>
                {step.number}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{step.title}</p>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextStepsCard;
