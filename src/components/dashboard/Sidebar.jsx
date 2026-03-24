// src/components/dashboard/Sidebar.jsx
import React from "react";
import { 
  Shield, 
  BarChart3, 
  BookOpen, 
  Bell, 
  Globe, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Cpu,
  History,
  Activity
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
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "assessment", label: "Risk Assessment", icon: Shield },
    { id: "training", label: "Training Modules", icon: BookOpen },
    { id: "threats", label: "Threat Updates", icon: Bell },
    { id: "security", label: "Web Security", icon: Globe },
    { id: "history", label: "Scan History", icon: History },
  ];

  const handleItemClick = (id) => {
    setCurrentView(id);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <>
      {/* 1. MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. MAIN SIDEBAR CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] bg-[#020617] border-r border-white/[0.05] shadow-2xl transition-all duration-500 ease-in-out flex flex-col
        ${collapsed ? "w-20" : "w-72"} 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        
        {/* HEADER SECTION (Logo & Toggle) */}
        <div className="h-24 flex-shrink-0 flex items-center justify-between px-4 lg:px-7 relative overflow-hidden border-b border-white/[0.03]">
          {/* Subtle Glow Background */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
          
          {/* Expanded Logo */}
          {!collapsed && (
            <div className="flex items-center space-x-3 ml-2 group cursor-pointer z-10">
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl shadow-2xl shadow-blue-600/20">
                <Shield className="h-5 w-5 text-white fill-current/20" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-black tracking-tighter text-xl leading-none italic uppercase">
                  CYBER<span className="text-blue-500">SHIELD</span>
                </span>
                <span className="text-[8px] font-black text-slate-500 tracking-[0.4em] mt-1 uppercase">SME DEFENSE</span>
              </div>
            </div>
          )}
          
          {/* Toggle Button: Collapses when open, Expands when closed */}
          {collapsed ? (
            <button 
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-2xl mx-auto cursor-pointer hover:bg-blue-600/20 transition-all group/expand"
              title="Expand Sidebar"
            >
              <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-blue-600/20 text-slate-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20 z-20"
              title="Collapse Sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* NAVIGATION SECTION (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center p-4 rounded-[20px] transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white border border-blue-500/20 shadow-lg shadow-blue-900/10" 
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
              >
                {/* Active Glow Vertical Line */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_#3b82f6]" />
                )}

                <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 
                  ${isActive ? "text-blue-500 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "group-hover:text-slate-300 group-hover:scale-110"}`} 
                />
                
                {!collapsed && (
                  <span className={`ml-4 text-left font-bold text-[10px] uppercase tracking-[0.25em] transition-all duration-500 whitespace-nowrap
                    ${isActive ? "opacity-100 translate-x-0" : "opacity-60 group-hover:opacity-100"}`}>
                    {item.label}
                  </span>
                )}

                {/* Mobile Close Helper (Optional) */}
                <div className="lg:hidden absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-slate-600" />
                </div>
              </button>
            );
          })}
        </nav>

        {/* FOOTER SECTION (Fixed Status Box) */}
        <div className="p-6 border-t border-white/[0.03] flex-shrink-0 bg-[#020617]">
          {!collapsed ? (
            <div className="p-5 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[24px] border border-white/[0.05] relative group overflow-hidden">
              {/* Animated Scan Line Effect */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500/30 group-hover:animate-scan transition-all" />
              
              <div className="flex items-center space-x-3 mb-3 text-left">
                 <div className="bg-blue-500/20 p-2 rounded-lg">
                   <Cpu className="h-4 w-4 text-blue-500 animate-pulse" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white tracking-widest uppercase italic leading-none">Core Link</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                      <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                    </div>
                 </div>
              </div>
              
              <div className="space-y-1 text-left">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em]">
                  NODE: GH-ACC-V2
                </p>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.1em]">
                  ID: PI/CS/2022/002
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-2">
               <div className="h-1 w-8 bg-slate-800 rounded-full" />
               <div className="flex space-x-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1 h-3 bg-blue-500/30 rounded-full relative overflow-hidden">
                       <div className="absolute inset-0 bg-blue-500 animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </aside>

      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  );
};

export default Sidebar;