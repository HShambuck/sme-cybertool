import React from "react";
import { Shield, BookOpen, Bell, HelpCircle, Settings } from "lucide-react";

const ActionButtons = ({ setCurrentView }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView("assessment")}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Shield className="h-5 w-5 mr-2" />
          New Assessment
        </button>
        <button
          onClick={() => setCurrentView("training")}
          className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Training Modules
        </button>
        <button
          onClick={() => setCurrentView("threats")}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Bell className="h-5 w-5 mr-2" />
          Threat Updates
        </button>
        <button className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <HelpCircle className="h-5 w-5 mr-2" />
          Help & Support
        </button>
      </div>

      <div className="flex justify-start">
        <button
          onClick={() => setCurrentView("settings")}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
