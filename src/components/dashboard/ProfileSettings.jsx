// src/components/dashboard/ProfileSettings.jsx
import React from 'react';
import { User, Mail, Shield, ShieldCheck, Key } from 'lucide-react';

const ProfileSettings = ({ user }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: Identity Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          <div className="h-24 w-24 bg-slate-800 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-slate-700">
            <User className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            System Administrator
          </p>
          
          <div className="mt-8 pt-8 border-t border-slate-800/50 flex items-center justify-center space-x-2 text-blue-500">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Profile Verified</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Security Details */}
      <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-10">
        <h3 className="text-lg font-black text-white tracking-tight mb-8 flex items-center">
          <Key className="h-5 w-5 mr-3 text-blue-500" /> Security Credentials
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 text-sm font-medium flex items-center">
                <Mail className="h-4 w-4 mr-3 text-slate-500" /> {user?.email}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Node</label>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-3 text-slate-500" /> SME-CyberShield-Main
              </div>
            </div>
          </div>
          
          <button className="px-8 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
            Reset Security Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;