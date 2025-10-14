import React from "react";
import { Shield, BookOpen, Bell, HelpCircle, Settings } from "lucide-react";

const ActionButtons = ({ setCurrentView }) => {
  return (
    <div className="space-y-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView("assessment")}
          className="flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer ease-in font-semibold shadow-sm"
        >
          <Shield className="h-5 w-5 mr-2" />
          New Assessment
        </button>
        <button
          onClick={() => setCurrentView("training")}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer ease-in font-semibold shadow-sm"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Training Modules
        </button>
        <button
          onClick={() => setCurrentView("threats")}
          className="flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer ease-in font-semibold shadow-sm"
        >
          <Bell className="h-5 w-5 mr-2" />
          Threat Updates
        </button>
        <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer ease-in font-semibold shadow-sm">
          <HelpCircle className="h-5 w-5 mr-2" />
          Help & Support
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
