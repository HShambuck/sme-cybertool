// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

// Stable InputField outside component
const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  showPasswordToggle = false,
  onTogglePassword,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? "border-red-500" : ""
      }`}
    />
    {showPasswordToggle && (
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ease-in"
        onClick={onTogglePassword}
      >
        {type === "password" ? (
          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        ) : (
          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    )}
    {error && (
      <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-sm">
        <AlertCircle className="h-4 w-4 mr-1" />
        {error}
      </div>
    )}
  </div>
);

// Password input wrapper
const PasswordInput = ({ value, onChange, error }) => {
  const [show, setShow] = useState(false);
  return (
    <InputField
      type={show ? "text" : "password"}
      placeholder="Enter your password"
      value={value}
      onChange={onChange}
      error={error}
      icon={Lock}
      showPasswordToggle
      onTogglePassword={() => setShow(!show)}
    />
  );
};

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!loginForm.email) newErrors.email = "Email is required";
    if (!loginForm.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(
        loginForm.email.trim().toLowerCase(),
        loginForm.password
      );

      // Store token based on remember me
      if (loginForm.rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      setLoading(false);
      // redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrors({ form: err.response?.data?.message || "Login failed" });
    }
  };

  // Functional state updates to prevent re-render bugs
  const updateLoginForm = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your SME Security Dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <InputField
            type="email"
            placeholder="Enter your email"
            value={loginForm.email}
            onChange={(e) => updateLoginForm("email", e.target.value)}
            icon={Mail}
            error={errors.email}
          />
          <PasswordInput
            value={loginForm.password}
            onChange={(e) => updateLoginForm("password", e.target.value)}
            error={errors.password}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={loginForm.rememberMe}
                onChange={(e) =>
                  updateLoginForm("rememberMe", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer ease-in"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer ease-in"
            >
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ease-in"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" /> Signing In...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up for free
              </a>
            </p>
          </div>
        </div>

        {errors.form && (
          <div className="text-red-500 text-sm flex items-center mb-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.form}
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <Shield className="h-4 w-4 mr-2" />
            Your data is protected with enterprise-grade security
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
