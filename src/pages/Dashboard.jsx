import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Settings, Globe, History } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import OverviewContent from "../components/dashboard/OverviewContent";
import AssessmentContent from "../components/dashboard/AssessmentContent";
import TrainingModules from "../pages/TrainingModules";
import PlaceholderPage from "../components/dashboard/PlaceholderPage";
import ThreatUpdates from "../components/dashboard/ThreatUpdates";
import WebsiteSecurityAnalysis from "../components/dashboard/WebsiteSecurityAnalysis";
import ScanHistory from "../components/dashboard/ScanHistory";
import { getDashboardData } from "../services/dashboard";
import { getThreatUpdates } from "../services/threats";
import {
  defaultRiskData,
  defaultRecommendations,
  defaultAlerts,
  defaultThreatUpdates,
  defaultTrainingProgress,
} from "../services/newUserData";
import { getUserProfile } from "../services/userService";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState(null);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for threat data (lifted from ThreatUpdates)
  const [threats, setThreats] = useState([]);
  const [threatsLoading, setThreatsLoading] = useState(true);
  const [threatsError, setThreatsError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check if token is valid
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() >= payload.exp * 1000;
      return !isExpired;
    } catch (error) {
      console.error("🔍 Invalid token format:", error);
      return false;
    }
  };

  // Fetch threats data
  const fetchThreats = async (silent = false) => {
    try {
      if (!silent) setThreatsLoading(true);
      setThreatsError(null);
      const data = await getThreatUpdates();
      setThreats(data);
      setLastUpdate(new Date());
    } catch (err) {
      setThreatsError("Failed to fetch threat updates.");
      console.error(err);
    } finally {
      if (!silent) setThreatsLoading(false);
    }
  };

  // Effect added to handle navigation state
  useEffect(() => {
    // Check if we're returning from assessment with instructions
    if (location.state?.view) {
      setCurrentView(location.state.view);
      // Clearing the state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch dashboard data on component mount
  // Update the useEffect in Dashboard.jsx that fetches data:

  useEffect(() => {
    const fetchUserAndData = async () => {
      // 1. Validate token
      if (!isTokenValid()) {
        console.log("🚨 Token invalid or expired, redirecting to login");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      try {
        // 2. Fetch profile
        const profile = await getUserProfile();
        console.log("👤 User profile loaded:", profile);
        setUser(profile);

        // 3. Fetch dashboard data
        console.log("🚀 Starting dashboard data fetch...");
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        console.log("✅ Dashboard data received:", data);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
        if (err.response?.status === 401) {
          console.log("🚨 401 Unauthorized - clearing token and redirecting");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        setError(`Failed to load dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchUserAndData();

    // ✅ ALSO refresh when location.state.refreshData is true
    if (location.state?.refreshData) {
      console.log("🔄 Refreshing dashboard data after assessment...");
      // Small delay to ensure backend has processed the assessment
      setTimeout(() => {
        fetchUserAndData();
      }, 500);

      // Clear the state to prevent continuous refreshing
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location.state?.refreshData]); // ✅ Adding location.state?.refreshData as dependency

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
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-red-900 font-semibold text-lg">
              Error Loading Dashboard
            </h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (currentView) {
      case "dashboard":
        return (
          <OverviewContent
            riskData={dashboardData?.riskData || defaultRiskData}
            recommendations={
              dashboardData?.recommendations || defaultRecommendations
            }
            recentAlerts={dashboardData?.recentAlerts || defaultAlerts}
            trainingProgress={
              dashboardData?.trainingProgress || defaultTrainingProgress
            }
            threatUpdates={threats.length > 0 ? threats : defaultThreatUpdates}
            setCurrentView={setCurrentView}
          />
        );
      case "assessment":
        return <AssessmentContent setCurrentView={setCurrentView} />;
      case "training":
        return <TrainingModules />;
      case "threats":
        return (
          <ThreatUpdates
            threats={threats}
            loading={threatsLoading}
            error={threatsError}
            lastUpdate={lastUpdate}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
            onRefresh={() => fetchThreats()}
          />
        );
      case "security":
        return (
          <WebsiteSecurityAnalysis
            title="Website Security"
            icon={Globe}
            setCurrentView={setCurrentView}
          />
        );
      case "history":
        return (
          <ScanHistory
            title="Scan History"
            icon={History}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <OverviewContent
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
              threats.length > 0 ? threats : fallbackData.threatUpdates
            }
            setCurrentView={setCurrentView}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <Header
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          userDropdown={userDropdown}
          setUserDropdown={setUserDropdown}
          user={user}
          setCurrentView={setCurrentView}
        />

        <main className="p-6 pt-20">{renderContent()}</main>
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
