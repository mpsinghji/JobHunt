import React from "react";
import { Routes, Route, BrowserRouter as Router, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/home/Home";
import Jobs from "./components/jobs/Jobs";
import JobDescription from "./components/jobs/JobDescription";
import Profile from "./components/profile/Profile";
import Status from "./components/jobs/Status";
import Companies from "./components/Recruiter/Companies";
import CompanyCreate from "./components/Recruiter/CompanyCreate";
import CompanySetup from "./components/Recruiter/CompanySetup";
import RecruiterJobs from "./components/Recruiter/RecruiterJobs";
import RecruiterJobCreate from "./components/Recruiter/RecruiterJobCreate";
import RecruiterJobSetup from "./components/Recruiter/RecruiterJobSetup";
import Applicants from "./components/Recruiter/Applicants";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import VerificationStatus from "./components/auth/VerificationStatus";
import Navbar from "./components/shared/Navbar";
import AdminSignup from "./components/admin/AdminSignup";

import { BASE_BACKEND_URL } from "./utils/constants";

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // For admin users, check if they are verified
  if (user?.role === "admin" && !user?.isVerified) {
    return <Navigate to="/verification-status" replace />;
  }

  // For Recruiter users, check if they are verified
  if (user?.role === "Recruiter" && !user?.isVerified) {
    return <Navigate to="/verification-status" replace />;
  }

  return children;
};

const App = () => {
  console.log("Current environment:", import.meta.env);
  console.log("Backend URL:", BASE_BACKEND_URL);
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/verification-status" element={<VerificationStatus />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navbar />
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <Navbar />
              <Jobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/description/:jobId"
          element={
            <PrivateRoute>
              <Navbar />
              <JobDescription />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Navbar />
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/status"
          element={
            <PrivateRoute>
              <Navbar />
              <Status />
            </PrivateRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/companies"
          element={
            <PrivateRoute roles={["Recruiter"]}>
              <Navbar />
              <Companies />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/companies/create"
          element={
            <PrivateRoute roles={["Recruiter"]}>
              <Navbar />
              <CompanyCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/companies/:id"
          element={
            <PrivateRoute roles={["Recruiter"]}>
              <Navbar />
              <CompanySetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <PrivateRoute roles={["Recruiter"]}>
              <Navbar />
              <RecruiterJobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/jobs/create"
          element={
            <PrivateRoute roles={["Recruiter"]}>
              <Navbar />
              <RecruiterJobCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id"
          element={
            <PrivateRoute roles={["Recruiter"]}>
              <Navbar />
              <RecruiterJobSetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/applicants"
          element={
            <PrivateRoute roles={["Recruiter"]}>
              <Navbar />
              <Applicants />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <Navbar />
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
