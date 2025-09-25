import React from "react";
import { Shield, BarChart3, BookOpen, Bell, Settings, X } from "lucide-react";

const Sidebar = ({
  currentView,
  setCurrentView,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "assessment", label: "Risk Assessment", icon: Shield },
    { id: "training", label: "Training Modules", icon: BookOpen },
    { id: "threats", label: "Threat Updates", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
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
  );
};

export default Sidebar;
