// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Globe,
  History,
  LayoutDashboard,
  ChevronRight,
  Activity,
  AlertTriangle,
} from "lucide-react";

// COMPONENTS
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import OverviewContent from "../components/dashboard/OverviewContent";
import AssessmentContent from "../components/dashboard/AssessmentContent";
import AssessmentResults from "../components/dashboard/AssessmentResults"; // ← now a component, not a page
import TrainingModules from "../pages/TrainingModules";
import TrainingModuleDetail from "../components/dashboard/TrainingModuleDetail";
import ThreatUpdates from "../components/dashboard/ThreatUpdates";
import WebsiteSecurityAnalysis from "../components/dashboard/WebsiteSecurityAnalysis";
import ScanHistory from "../components/dashboard/ScanHistory";
import ProfileSettings from "../components/dashboard/ProfileSettings";

// SERVICES & DATA
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threats, setThreats] = useState([]);
  const [threatsLoading, setThreatsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // ── NEW: holds assessment results so they render inside the dashboard ──
  const [assessmentData, setAssessmentData] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  };

  const fetchUserAndData = async () => {
    if (!isTokenValid()) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const [profile, data, threatData] = await Promise.all([
        getUserProfile(),
        getDashboardData(),
        getThreatUpdates(),
      ]);
      setUser(profile);
      setDashboardData(data);
      setThreats(threatData);
      setLastUpdate(new Date());
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(`Terminal Link Failure: ${err.message}`);
    } finally {
      setLoading(false);
      setThreatsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndData();
    if (location.state?.view) {
      setCurrentView(location.state.view);
      window.history.replaceState({}, document.title);
    }
  }, [navigate]);

  // ── Called by AssessmentContent when the quiz is finished ──
  const handleAssessmentComplete = (data) => {
    setAssessmentData(data);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-[3px] border-slate-800 border-t-blue-500 animate-spin" />
            <Activity className="h-6 w-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
            Establishing Secure Link...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="max-w-2xl mx-auto mt-12 bg-[#0F172A] border border-red-500/20 rounded-[32px] p-12 text-center shadow-2xl shadow-red-900/20">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white tracking-tight mb-2">
            Interface Error
          </h3>
          <p className="text-slate-400 mb-8 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-500 transition-all font-bold"
          >
            Reset Connection
          </button>
        </div>
      );
    }

    const viewProps = {
      riskData: dashboardData?.riskData || defaultRiskData,
      recommendations: dashboardData?.recommendations || defaultRecommendations,
      recentAlerts: dashboardData?.recentAlerts || defaultAlerts,
      trainingProgress:
        dashboardData?.trainingProgress || defaultTrainingProgress,
      threatUpdates: threats.length > 0 ? threats : defaultThreatUpdates,
      setCurrentView,
      user,
    };

    switch (currentView) {
      case "dashboard":
        return <OverviewContent {...viewProps} />;

      case "assessment":
        return (
          <AssessmentContent
            setCurrentView={setCurrentView}
            onAssessmentComplete={handleAssessmentComplete} // ← new prop
          />
        );

      // ── Results render inside the dashboard, same layout ──
      case "results":
        return (
          <AssessmentResults
            assessmentData={assessmentData}
            setCurrentView={setCurrentView}
          />
        );

      case "training":
        return (
          <TrainingModules
            setCurrentView={setCurrentView}
            onSelectModule={(id) => {
              setSelectedModuleId(id);
              setCurrentView("moduleDetail");
            }}
          />
        );

      case "moduleDetail":
        return (
          <TrainingModuleDetail
            moduleId={selectedModuleId}
            setCurrentView={setCurrentView}
          />
        );

      case "threats":
        return (
          <ThreatUpdates
            threats={threats}
            loading={threatsLoading}
            onRefresh={() => fetchUserAndData()}
          />
        );

      case "security":
        return (
          <WebsiteSecurityAnalysis
            title="Web Security"
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

      case "settings":
        return <ProfileSettings user={user} />;

      default:
        return <OverviewContent {...viewProps} />;
    }
  };

  // Breadcrumb label per view
  const viewLabel =
    {
      dashboard: "System Overview",
      assessment: "Risk Assessment",
      results: "Assessment Results",
      training: "Training Modules",
      moduleDetail: "Training Module",
      threats: "Threat Updates",
      security: "Web Security",
      history: "Scan History",
      settings: "Settings",
    }[currentView] || currentView.replace("-", " ");

  return (
    <div className="min-h-screen bg-[#020617] flex font-['Inter',sans-serif]">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 relative z-10 transition-all duration-500 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}
      >
        <Header
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          userDropdown={userDropdown}
          setUserDropdown={setUserDropdown}
          user={user}
          setCurrentView={setCurrentView}
        />

        <main className="p-8 pt-28 max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="h-8 w-1 bg-blue-600 rounded-full" />
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                <LayoutDashboard className="h-3 w-3" />
                <span>Network Node</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-blue-500">{currentView}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1 capitalize">
                {viewLabel}
              </h1>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
