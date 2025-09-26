import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BookOpen, Bell, Settings } from "lucide-react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import DashboardContent from "../components/dashboard/DashboardContent";
import PlaceholderPage from "../components/dashboard/PlaceholderPage";
import { getDashboardData } from "../services/dashboard";
import {
  defaultRiskData,
  defaultRecommendations,
  defaultAlerts,
  defaultThreatUpdates,
  defaultTrainingProgress,
} from "../services/newUserData";


const Dashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token is valid
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() >= payload.exp * 1000;

      console.log("🔍 Token check:", {
        exists: true,
        expired: isExpired,
        expiresAt: new Date(payload.exp * 1000).toLocaleString(),
        currentTime: new Date().toLocaleString(),
      });

      return !isExpired;
    } catch (error) {
      console.error("🔍 Invalid token format:", error);
      return false;
    }
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🚀 Starting dashboard data fetch...");

        // Check token validity first
        if (!isTokenValid()) {
          console.log("🚨 Token invalid or expired, redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setLoading(true);
        setError(null);

        const data = await getDashboardData();
        console.log("✅ Dashboard data received:", data);

        setDashboardData(data);
        console.log("✅ Dashboard data set in state");
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);

        // Handle 401 specifically
        if (err.response?.status === 401) {
          console.log("🚨 401 Unauthorized - clearing token and redirecting");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(`Failed to load dashboard data: ${err.message}`);
      } finally {
        console.log("🏁 Setting loading to false");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Add useEffect to monitor state changes
  useEffect(() => {
    console.log(
      "📊 State update - Loading:",
      loading,
      "Error:",
      error,
      "HasData:",
      !!dashboardData
    );
  }, [loading, error, dashboardData]);

  // Default fallback values for new users
  const fallbackData = {
    riskData: {
      score: 0,
      message:
        "No assessment has been made yet. Start by taking a new assessment!",
      completed: "None",
    },
    recommendations: [],
    recentAlerts: [],
    trainingProgress: {
      percentage: 0,
      completed: 0,
      total: 0,
      message: "No training started yet. Begin with your first module!",
    },
    threatUpdates: [],
  };

  // Render function
  const renderContent = () => {
    console.log(
      "🎨 Rendering content - Loading:",
      loading,
      "Error:",
      error,
      "HasData:",
      !!dashboardData
    );

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-800 font-medium">
              Error Loading Dashboard
            </h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (currentView) {
      case "dashboard":
        return (
          <DashboardContent
            riskData={dashboardData?.riskData || defaultRiskData}
            recommendations={
              dashboardData?.recommendations || defaultRecommendations
            }
            recentAlerts={dashboardData?.recentAlerts || defaultAlerts}
            trainingProgress={
              dashboardData?.trainingProgress || defaultTrainingProgress
            }
            threatUpdates={dashboardData?.threatUpdates || defaultThreatUpdates}
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
            riskData={dashboardData?.riskData || fallbackData.riskData}
            recommendations={
              dashboardData?.recommendations || fallbackData.recommendations
            }
            recentAlerts={
              dashboardData?.recentAlerts || fallbackData.recentAlerts
            }
            trainingProgress={
              dashboardData?.trainingProgress || fallbackData.trainingProgress
            }
            threatUpdates={
              dashboardData?.threatUpdates || fallbackData.threatUpdates
            }
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
