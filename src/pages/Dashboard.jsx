import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  BarChart3,
  Settings,
  Bell,
  TrendingUp,
  Users,
  FileText,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "assessment", label: "Risk Assessment", icon: Shield },
    { id: "training", label: "Training Modules", icon: BookOpen },
    { id: "threats", label: "Threat Updates", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Risk Assessment Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Your Latest Risk Assessment Results
          </h2>
          <div className="flex items-end space-x-4 mb-4">
            <div className="text-6xl font-bold text-gray-800">
              {riskData.score}
            </div>
            <div className="text-3xl font-light text-gray-400 pb-2">/100</div>
          </div>
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${riskData.score}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">
                {riskData.level}
              </span>
              <span className="text-green-600">
                Assessment Completed: {riskData.lastAssessment}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-800">Risk Assessment</h3>
            <p className="text-gray-600">
              Completed: {riskData.completedWeeksAgo} weeks ago
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recommendations to Improve Security Posture
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{rec.text}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-4 mt-6">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Shield className="h-4 w-4 mr-2" />
            Start Training Modules
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-4 w-4 mr-2" />
            View Detailed Report
          </button>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                <alert.icon
                  className={`h-5 w-5 mt-0.5 ${
                    alert.type === "success"
                      ? "text-green-500"
                      : "text-orange-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {alert.title}
                  </p>
                  <p className="text-sm text-gray-500">{alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Training Progress
          </h3>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 36 * (1 - trainingProgress.percentage / 100)
                  }`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {trainingProgress.percentage}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Modules Completed: {trainingProgress.completed}/
              {trainingProgress.total}
            </p>
          </div>
        </div>

        {/* Local Threat Updates */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Local Threat Updates
          </h3>
          <div className="space-y-3">
            {threatUpdates.map((threat) => (
              <div key={threat.id} className="flex items-start space-x-3">
                <threat.icon
                  className={`h-5 w-5 mt-0.5 ${
                    threat.type === "critical"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {threat.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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

  const PlaceholderPage = ({ title, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">
        This page is under development. Please check back later.
      </p>
      <button
        onClick={() => setCurrentView("dashboard")}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardContent />;
      case "assessment":
        return <PlaceholderPage title="Risk Assessment" icon={Shield} />;
      case "training":
        return <PlaceholderPage title="Training Modules" icon={BookOpen} />;
      case "threats":
        return <PlaceholderPage title="Threat Updates" icon={Bell} />;
      case "settings":
        return <PlaceholderPage title="Settings" icon={Settings} />;
      default:
        return <DashboardContent />;
    }
  };

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-800">
              SME Security
            </span>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                currentView === item.id
                  ? "bg-blue-50 border-r-2 border-blue-500 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6 text-gray-500" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              <div className="relative">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setUserDropdown(!userDropdown)}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <hr className="my-2" />
                    <a
                      href="#"
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
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
