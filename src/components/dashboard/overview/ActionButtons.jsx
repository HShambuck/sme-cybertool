import React from "react";
import { Shield, BookOpen, Bell, HelpCircle, Settings } from "lucide-react";

const ActionButtons = ({ setCurrentView }) => {
  return (
    <div className="space-y-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView("assessment")}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors c"
        >
          <Shield className="h-5 w-5 mr-2" />
          New Assessment
        </button>
        <button
          onClick={() => setCurrentView("training")}
          className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer ease-in"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Training Modules
        </button>
        <button
          onClick={() => setCurrentView("threats")}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ease-in"
        >
          <Bell className="h-5 w-5 mr-2" />
          Threat Updates
        </button>
        <button className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer ease-in">
          <HelpCircle className="h-5 w-5 mr-2" />
          Help & Support
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
