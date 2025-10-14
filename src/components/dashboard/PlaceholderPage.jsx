import React from "react";

const PlaceholderPage = ({ title, icon: Icon, setCurrentView }) => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
    <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600 mb-6">
      This page is under development. Please check back later.
    </p>
    <button
      onClick={() => setCurrentView("dashboard")}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer ease-in"
    >
      Back to Dashboard
    </button>
  </div>
);

export default PlaceholderPage;