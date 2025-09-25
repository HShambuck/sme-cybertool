// src/pages/Signup.jsx
import React, { useState } from "react";
import {
  Shield,
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

// Stable InputField outside the component
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
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
const PasswordInput = ({
  value,
  onChange,
  error,
  placeholder = "Password",
}) => {
  const [show, setShow] = useState(false);
  return (
    <InputField
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      icon={Lock}
      showPasswordToggle
      onTogglePassword={() => setShow(!show)}
    />
  );
};

const Signup = () => {
  const navigate = useNavigate();
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
    agreeToNewsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateSignupForm = (field, value) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    setLoading(true);
    setErrors({});
    const newErrors = {};

    if (!signupForm.firstName) newErrors.firstName = "First name is required";
    if (!signupForm.lastName) newErrors.lastName = "Last name is required";
    if (!signupForm.email) newErrors.email = "Email is required";
    if (!signupForm.companyName)
      newErrors.companyName = "Company name is required";
    if (!signupForm.password) newErrors.password = "Password is required";
    if (signupForm.password !== signupForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!signupForm.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
    } catch (error) {
      setLoading(false);
      setErrors({
        general: error.response?.data?.message || "Signup failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join thousands of SMEs protecting their digital assets
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              placeholder="First name"
              value={signupForm.firstName}
              onChange={(e) => updateSignupForm("firstName", e.target.value)}
              icon={User}
              error={errors.firstName}
            />
            <InputField
              placeholder="Last name"
              value={signupForm.lastName}
              onChange={(e) => updateSignupForm("lastName", e.target.value)}
              icon={User}
              error={errors.lastName}
            />
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              type="email"
              placeholder="Email"
              value={signupForm.email}
              onChange={(e) => updateSignupForm("email", e.target.value)}
              icon={Mail}
              error={errors.email}
            />
            <InputField
              type="tel"
              placeholder="Phone"
              value={signupForm.phone}
              onChange={(e) => updateSignupForm("phone", e.target.value)}
              icon={Phone}
              error={errors.phone}
            />
          </div>

          {/* Company Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              placeholder="Company name"
              value={signupForm.companyName}
              onChange={(e) => updateSignupForm("companyName", e.target.value)}
              icon={User}
              error={errors.companyName}
            />
            <select
              value={signupForm.companySize}
              onChange={(e) => updateSignupForm("companySize", e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-250">51-250 employees</option>
              <option value="250+">250+ employees</option>
            </select>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput
              value={signupForm.password}
              onChange={(e) => updateSignupForm("password", e.target.value)}
              error={errors.password}
              placeholder="Password"
            />
            <PasswordInput
              value={signupForm.confirmPassword}
              onChange={(e) =>
                updateSignupForm("confirmPassword", e.target.value)
              }
              error={errors.confirmPassword}
              placeholder="Confirm Password"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={signupForm.agreeToTerms}
              onChange={(e) =>
                updateSignupForm("agreeToTerms", e.target.checked)
              }
              className="w-4 h-4 mt-1"
            />
            <span className="text-sm text-gray-700">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>
          {errors.agreeToTerms && (
            <div className="text-red-500 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.agreeToTerms}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="text-red-500 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.general}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" /> Creating
                Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
        {/* Security Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Enterprise Security
            </p>
            <p className="text-xs text-gray-600">Bank-level encryption</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">GDPR Compliant</p>
            <p className="text-xs text-gray-600">Your data is protected</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <User className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">24/7 Support</p>
            <p className="text-xs text-gray-600">Always here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
