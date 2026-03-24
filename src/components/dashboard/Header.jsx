// src/components/dashboard/Header.jsx
import React, { useEffect, useRef } from "react";
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings, 
  ShieldCheck,
  Search,
  Command,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ 
  setSidebarOpen, 
  collapsed, 
  userDropdown, 
  setUserDropdown, 
  user, 
  setCurrentView 
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // Safely get names from your user object
  const fullName = user?.contactPerson || user?.name || "Authorized User";
  const firstName = fullName.split(" ")[0];
  
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const initials = getInitials(fullName);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    if (userDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdown, setUserDropdown]);

  return (
    <header className={`fixed top-0 right-0 z-40 transition-all duration-500 ease-in-out h-20 
      ${collapsed ? "left-20" : "left-0 lg:left-72"} 
      bg-[#020617]/80 backdrop-blur-xl border-b border-white/[0.05] px-4 lg:px-8 flex items-center justify-between`}>
      
      {/* 1. LEFT SIDE: SEARCH & MOBILE TOGGLE */}
      <div className="flex items-center space-x-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-2 group focus-within:border-blue-500/40 transition-all w-80">
          <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-white placeholder:text-slate-600 ml-3 w-full uppercase tracking-[0.2em]"
          />
          <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 shadow-inner">
             <Command size={10} className="text-slate-500" />
             <span className="text-[9px] font-black text-slate-500">K</span>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: NOTIFICATIONS & PROFILE */}
      <div className="flex items-center space-x-4 lg:space-x-8">
        
        {/* Network Vitality HUD */}
        <div className="hidden xl:flex items-center space-x-3 px-4 py-2 bg-white/[0.02] rounded-xl border border-white/[0.05]">
           <Activity className="h-3 w-3 text-blue-500 animate-pulse" />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none pt-0.5">Link Secure</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/10 transition-all group shadow-inner">
          <Bell size={18} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            className="flex items-center space-x-4 p-1 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
          >
            {/* Avatar / Company Logo Box */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl shadow-blue-900/40 relative overflow-hidden ring-1 ring-white/10">
               <div className="absolute inset-0 bg-white/10 -translate-x-full animate-[shimmer_3s_infinite] skew-x-12" />
               
               {/* Show Logo if available, else show Initials */}
               {user?.logoUrl ? (
                 <img src={user.logoUrl} alt="Logo" className="h-full w-full object-cover relative z-10" />
               ) : (
                 <span className="text-white font-black text-xs tracking-tighter relative z-10">{initials}</span>
               )}
            </div>
            
            <div className="hidden sm:block text-left">
              <p className="text-[11px] font-black text-white uppercase tracking-[0.15em] leading-none mb-1">
                {firstName}
              </p>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-500 drop-shadow-[0_0_3px_#10b981]" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Authorized Admin</span>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-all duration-500 ${userDropdown ? "rotate-180 text-blue-500" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {userDropdown && (
            <div className="absolute right-0 mt-4 w-64 bg-[#0F172A] border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-2xl">
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] mb-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 opacity-50">Current Identity</p>
                <p className="text-xs font-bold text-white truncate">{user?.companyName || "SME Enterprise"}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email || "admin@cybershield.io"}</p>
              </div>
              
              <div className="space-y-1">
                {/* Profile Identity Button (Triggers the new view) */}
                <button 
                  onClick={() => { setCurrentView('settings'); setUserDropdown(false); }}
                  className="w-full flex items-center space-x-3 p-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-blue-600 transition-all group"
                >
                  <User className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Profile Identity</span>
                </button>

                <button 
                  onClick={() => { setCurrentView('settings'); setUserDropdown(false); }}
                  className="w-full flex items-center space-x-3 p-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                >
                  <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Config</span>
                </button>
                
                <hr className="border-white/5 my-2 mx-2" />

                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 p-3.5 rounded-xl text-red-500 hover:text-white hover:bg-red-600 transition-all group"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(250%); }
        }
      `}} />
    </header>
  );
};

export default Header;