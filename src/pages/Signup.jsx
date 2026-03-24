// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import {
  Shield,
  User,
  Mail,
  Phone,
  LockKeyhole,
  Building2,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const updateForm = (field, value) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        password: signupForm.password,
        companyName: signupForm.companyName,
        phone: signupForm.phone,
      });
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrors({ general: err.response?.data?.message || "Registration failed." });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-['Inter',sans-serif]">
      
      {/* LEFT SIDE: Branding & Trust Panel */}
      <div className="hidden md:flex md:w-[40%] bg-[#0F172A] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/login')}>
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-light text-white tracking-tighter">
              Cyber<span className="font-black text-blue-500">Shield</span>
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Secure your <br /> 
            <span className="text-blue-500 italic">SME Infrastructure</span> <br /> 
            in minutes.
          </h2>
          <div className="space-y-6">
            {[
              { title: "Zero-Trust Architecture", desc: "Verify every access request automatically." },
              { title: "Instant Vulnerability Scans", desc: "Identify threats before they become breaches." },
              { title: "Compliance Automation", desc: "Automated GDPR and ISO reporting." }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="mt-1 h-5 w-5 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-slate-100 font-bold text-sm tracking-wide">{item.title}</h4>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Deployment Terminal v2.4 // Global Node Cluster
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Comprehensive Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-slate-50 overflow-y-auto">
        <div className="max-w-2xl w-full py-8">
          
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Initialize Profile
            </h1>
            <p className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] ml-0.5">
              Deploy your secure environment access
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSignup}>
            {/* Identity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                    placeholder="Eugene"
                    value={signupForm.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                    placeholder="Acheampong"
                    value={signupForm.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Enterprise Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    required type="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                    placeholder="e.acheampong@palm.edu"
                    value={signupForm.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                    placeholder="+233..."
                    value={signupForm.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* SME Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                    placeholder="SME Enterprise"
                    value={signupForm.companyName}
                    onChange={(e) => updateForm("companyName", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Scale</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <select
                    required
                    value={signupForm.companySize}
                    onChange={(e) => updateForm("companySize", e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">Micro (1-10)</option>
                    <option value="11-50">Small (11-50)</option>
                    <option value="51-250">Medium (51-250)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    required type={showPassword ? "text" : "password"}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    value={signupForm.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Verify Key</label>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    required type={showPassword ? "text" : "password"}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    value={signupForm.confirmPassword}
                    onChange={(e) => updateForm("confirmPassword", e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Consent */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                id="terms" required type="checkbox"
                checked={signupForm.agreeToTerms}
                onChange={(e) => updateForm("agreeToTerms", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer transition-all"
              />
              <label htmlFor="terms" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none">
                I authorize the <span className="text-blue-600 underline decoration-2">Security Protocols</span> & Privacy Policy
              </label>
            </div>

            {/* Feedback & Submission */}
            {(errors.general || errors.confirmPassword) && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center">
                <AlertCircle className="h-4 w-4 mr-3" /> {errors.general || errors.confirmPassword}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-4.5 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : (
                <span className="flex items-center justify-center">
                  Deploy Security Profile <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs font-black tracking-tight uppercase">
              Already secured? <a href="/login" className="text-blue-600 underline underline-offset-4 ml-1">Initialize Terminal Access</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;