import React from "react";
import {
  Shield,
  BarChart3,
  BookOpen,
  Bell,
  History,
  Globe,
  X,
  ChevronLeft,
  Menu,
} from "lucide-react";

const Sidebar = ({
  currentView,
  setCurrentView,
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      action: () => setCurrentView("dashboard"),
    },
    {
      id: "assessment",
      label: "Risk Assessment",
      icon: Shield,
      action: () => setCurrentView("assessment"),
    },
    {
      id: "training",
      label: "Training Modules",
      icon: BookOpen,
      action: () => setCurrentView("training"),
    },
    {
      id: "threats",
      label: "Threat Updates",
      icon: Bell,
      action: () => setCurrentView("threats"),
    },
    {
      id: "security",
      label: "Web Security Analysis",
      icon: Globe,
      action: () => setCurrentView("security"),
    },
    // {
    //   id: "history",
    //   label: "Scan History",
    //   icon: History,
    //   action: () => setCurrentView("history"),
    // },
  ];

  const handleItemClick = (item) => {
    item.action();
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-800 via-blue-800 to-gray-900 shadow-2xl transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700/50">
          {!collapsed && (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-white">
                SME Security
              </span>
            </div>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl shadow-lg mx-auto cursor-pointer ease-in"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-blue-200 hover:text-white transition-colors cursor-pointer ease-in ${
              collapsed ? "hidden" : ""
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center cursor-pointer ease-in ${
                collapsed ? "justify-center" : ""
              } px-4 py-3 mb-2 text-left rounded-xl transition-all ${
                currentView === item.id
                  ? "bg-white/15 text-white shadow-lg border border-white/10"
                  : "text-blue-200 hover:bg-white/10"
              }`}
              title={collapsed ? item.label : ""}
            >
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-800 via-blue-800 to-gray-900 shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700/50">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-lg font-bold text-white">
              SME Security
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer ease-in"
          >
            <X className="h-6 w-6 text-blue-200" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center px-4 py-3 mb-2 text-left rounded-xl transition-all cursor-pointer ease-in ${
                currentView === item.id
                  ? "bg-white/15 text-white shadow-lg border border-white/10"
                  : "text-blue-200 hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
