import React from "react";
import { BookOpen, Home, ArrowRight } from "lucide-react";

const ActionButtons = ({ navigate }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up"
      style={{ animationDelay: "0.3s" }}
    >
      <button
        onClick={() =>
          navigate("/dashboard", {
            state: { view: "training", refreshData: true },
          })
        }
        className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <BookOpen className="h-5 w-5 mr-2" />
        View Recommendations & Training
        <ArrowRight className="h-5 w-5 ml-2" />
      </button>
      <button
        onClick={() => navigate("/dashboard", { state: { refreshData: true } })}
        className="flex items-center justify-center px-6 py-4 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
      >
        <Home className="h-5 w-5 mr-2" />
        Go to Dashboard
      </button>
    </div>
  );
};

export default ActionButtons;
