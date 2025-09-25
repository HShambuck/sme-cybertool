import React, { useState } from "react";
import { Shield, BookOpen, Bell, Settings } from "lucide-react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import DashboardContent from "../components/dashboard/DashboardContent";
import PlaceholderPage from "../components/dashboard/PlaceholderPage";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  // Mock data for the dashboard
  const riskData = {
    score: 78,
    level: "MEDIUM RISK",
    lastAssessment: "Oct 27, 2023",
    completedWeeksAgo: 2,
  };

  const recommendations = [
    {
      id: 1,
      text: 'Complete the "Phishing Awareness" training module.',
      completed: false,
      priority: "high",
    },
    {
      id: 2,
      text: "Implement multi-factor authentication on all business accounts.",
      completed: false,
      priority: "high",
    },
    {
      id: 3,
      text: "Regularly backup critical data offline",
      completed: false,
      priority: "medium",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "success",
      title: "Phishing attempt blocked",
      date: "Oct 26, 2023",
      icon: CheckCircle,
    },
    {
      id: 2,
      type: "warning",
      title: "Suspicious login attempt",
      date: "Oct 25, 2023",
      icon: AlertTriangle,
    },
  ];

  const threatUpdates = [
    {
      id: 1,
      type: "critical",
      title: "New Ransomware targets local businesses",
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "warning",
      title: "Beware of fake invoices via email",
      icon: AlertTriangle,
    },
  ];

  const trainingProgress = {
    percentage: 60,
    completed: 3,
    total: 5,
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardContent
            riskData={riskData}
            recommendations={recommendations}
            recentAlerts={recentAlerts}
            trainingProgress={trainingProgress}
            threatUpdates={threatUpdates}
            setCurrentView={setCurrentView}
          />
        );
      case "assessment":
        return (
          <PlaceholderPage
            title="Risk Assessment"
            icon={Shield}
            setCurrentView={setCurrentView}
          />
        );
      case "training":
        return (
          <PlaceholderPage
            title="Training Modules"
            icon={BookOpen}
            setCurrentView={setCurrentView}
          />
        );
      case "threats":
        return (
          <PlaceholderPage
            title="Threat Updates"
            icon={Bell}
            setCurrentView={setCurrentView}
          />
        );
      case "settings":
        return (
          <PlaceholderPage
            title="Settings"
            icon={Settings}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <DashboardContent
            riskData={riskData}
            recommendations={recommendations}
            recentAlerts={recentAlerts}
            trainingProgress={trainingProgress}
            threatUpdates={threatUpdates}
            setCurrentView={setCurrentView}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-0">
        <Header
          setSidebarOpen={setSidebarOpen}
          userDropdown={userDropdown}
          setUserDropdown={setUserDropdown}
        />

        <main className="p-6">{renderContent()}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
