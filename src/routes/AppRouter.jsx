import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AssessmentContent from "../components/dashboard/AssessmentContent";
import AssessmentResults from "../pages/AssessmentResults";
import TrainingModules from "../pages/TrainingModules";
import TrainingModuleDetail from "../pages/TrainingModuleDetail";

// Protected Route helper
const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/assessment/results"
  element={
    <ProtectedRoute>
      <AssessmentResults />
    </ProtectedRoute>
  }
/>
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <TrainingModules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training/:id"
          element={
            <ProtectedRoute>
              <TrainingModuleDetail />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;