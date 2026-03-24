// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import {
  Shield,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!loginForm.email || !loginForm.password) {
      setErrors({ form: "Please provide all security credentials." });
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(loginForm.email.trim().toLowerCase(), loginForm.password);
      
      // Persistence logic
      if (loginForm.rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrors({ form: err.response?.data?.message || "Access Denied: Invalid credentials." });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-['Inter',sans-serif]">
      
      {/* LEFT SIDE: Professional Branding Panel */}
      <div className="hidden md:flex md:w-[45%] bg-[#0F172A] relative overflow-hidden flex-col justify-between p-16">
        {/* Subtle UI Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Logo Section */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-light text-white tracking-tighter">
              Cyber<span className="font-black text-blue-500">Shield</span>
            </span>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Security for the <br /> 
            <span className="text-blue-500 italic">Next Generation</span> <br /> 
            of SMEs.
          </h2>
          <div className="space-y-6">
            {[
              "Real-time Threat Monitoring",
              "AI-Powered Vulnerability Analysis",
              "Regulatory Compliance Automation"
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-4 group">
                <div className="h-6 w-6 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-slate-300 font-medium tracking-wide text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Authorized Access Only // Port 443 Secured
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Clean, High-Contrast Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-slate-50">
        <div className="max-w-md w-full">
          
          {/* Mobile Only Logo */}
          <div className="md:hidden flex items-center space-x-2 mb-12">
             <Shield className="h-8 w-8 text-blue-600" />
             <span className="text-2xl font-black text-slate-900 tracking-tighter">CyberShield</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Console Login
            </h1>
            <p className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] ml-0.5">
              Enter your infrastructure credentials
            </p>
          </div>

          <form className="space-y-7" onSubmit={handleLogin}>
            <div className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Enterprise Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    placeholder="e.acheampong@palm.edu"
                    className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-300 shadow-sm shadow-slate-200/50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Security Key</label>
                  <button type="button" className="text-[11px] text-blue-600 hover:text-blue-700 font-black uppercase tracking-wider">Forgot?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <LockKeyhole className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-300 shadow-sm shadow-slate-200/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer transition-all"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none">
                Maintain Secure Session
              </label>
            </div>

            {/* Error Message Display */}
            {errors.form && (
              <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in fade-in duration-300">
                <AlertCircle className="h-4 w-4 mr-3 shrink-0" />
                {errors.form}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4.5 px-4 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-slate-900/10"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center">
                  Initialize Console Access <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Bottom Navigation */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs font-medium tracking-tight">
              New to CyberShield?{" "}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-black transition-colors underline underline-offset-4 decoration-2">
                Deploy SME Node
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;