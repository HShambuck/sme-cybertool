import React from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, FileText, 
  Printer, Fingerprint, Search, Zap, ArrowUpRight,
  ShieldAlert, Download, Activity
} from 'lucide-react';

const OverviewContent = ({ riskData, threatUpdates, recentAlerts, setCurrentView }) => {
  
  // Hardcoded Logic for the Interactive Buttons
  const handleGenerateReport = () => {
    alert("Initializing Executive Security Summary... Generating encrypted PDF.");
  };

  const handlePrintThreats = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. THE TOP INTEL CARDS (Risk, Threats, Scan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <div className="bg-[#0F172A] p-8 rounded-[32px] border border-slate-800/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield className="h-32 w-32 text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Security Index</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-6xl font-black text-white tracking-tighter">{riskData?.score || '84'}</h2>
            <span className="text-blue-500 font-bold text-xl">%</span>
          </div>
          <div className="mt-4 flex items-center text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Protocol: Optimized
          </div>
        </div>

        {/* Active Threats Card */}
        <div className="bg-[#0F172A] p-8 rounded-[32px] border border-slate-800/50 shadow-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Threat Nodes</p>
          <h2 className="text-6xl font-black text-white tracking-tighter">03</h2>
          <div className="mt-4 flex items-center text-amber-500 text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle className="h-3.5 w-3.5 mr-2" /> Status: Action Required
          </div>
        </div>

        {/* Quick Scan Action Card */}
        <div 
          onClick={() => setCurrentView('security')}
          className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-900/20 flex flex-col justify-between group cursor-pointer hover:bg-blue-500 transition-all active:scale-[0.98]"
        >
          <div>
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em] mb-2">Rapid Deployment</p>
            <h2 className="text-2xl font-black text-white leading-tight">Initialize <br/>Network Scan</h2>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Zap className="h-6 w-6 text-white animate-pulse" />
            <ArrowUpRight className="h-5 w-5 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* 2. THE UTILITY HUB (The 4 Big Interactive Buttons) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button 
          onClick={handleGenerateReport}
          className="flex flex-col items-center justify-center p-8 bg-[#0F172A] border border-slate-800/50 rounded-[32px] hover:border-blue-500/50 hover:bg-slate-800/40 transition-all group"
        >
          <div className="p-4 rounded-2xl bg-blue-500/10 mb-4 group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Generate Report</span>
        </button>

        <button 
          onClick={handlePrintThreats}
          className="flex flex-col items-center justify-center p-8 bg-[#0F172A] border border-slate-800/50 rounded-[32px] hover:border-emerald-500/50 hover:bg-slate-800/40 transition-all group"
        >
          <div className="p-4 rounded-2xl bg-emerald-500/10 mb-4 group-hover:scale-110 transition-transform">
            <Printer className="h-6 w-6 text-emerald-500" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Print Threats</span>
        </button>

        <button 
          onClick={() => setCurrentView('history')}
          className="flex flex-col items-center justify-center p-8 bg-[#0F172A] border border-slate-800/50 rounded-[32px] hover:border-amber-500/50 hover:bg-slate-800/40 transition-all group"
        >
          <div className="p-4 rounded-2xl bg-amber-500/10 mb-4 group-hover:scale-110 transition-transform">
            <Search className="h-6 w-6 text-amber-500" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Deep Audit</span>
        </button>

        <button 
          onClick={handleGenerateReport}
          className="flex flex-col items-center justify-center p-8 bg-[#0F172A] border border-slate-800/50 rounded-[32px] hover:border-purple-500/50 hover:bg-slate-800/40 transition-all group"
        >
          <div className="p-4 rounded-2xl bg-purple-500/10 mb-4 group-hover:scale-110 transition-transform">
            <Download className="h-6 w-6 text-purple-500" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Export Data</span>
        </button>
      </div>

      {/* 3. RECOMMENDATIONS & ACTIVITY LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommendations Column */}
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center">
            <ShieldAlert className="h-5 w-5 mr-3 text-blue-500" /> Strategic Recommendations
          </h3>
          <div className="space-y-4">
            {[
              { t: 'Update Firewall Protocols', s: 'Critical' },
              { t: 'Enable MFA for Admin Nodes', s: 'High' },
              { t: 'Rotate Encryption Keys', s: 'Medium' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 text-blue-500 font-black text-xs">
                    {i+1}
                  </div>
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white">{item.t}</span>
                </div>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${item.s === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {item.s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log Column */}
        <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-10 relative overflow-hidden">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center">
            <Activity className="h-5 w-5 mr-3 text-blue-500" /> Live Activity Log
          </h3>
          <div className="space-y-4 font-mono text-[10px] text-slate-500 leading-relaxed">
            <p className="flex items-center"><span className="text-emerald-500 mr-2">●</span> [SYSTEM] Integrity check complete.</p>
            <p className="flex items-center"><span className="text-blue-500 mr-2">●</span> [NETWORK] Node 04 linked via E. Legon.</p>
            <p className="flex items-center"><span className="text-amber-500 mr-2">●</span> [THREAT] Minor latency detected in port 8080.</p>
            <p className="flex items-center animate-pulse"><span className="text-slate-600 mr-2">●</span> [SCAN] Background analysis running...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;