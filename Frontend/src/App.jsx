import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/home/Home";
import Jobs from "./components/jobs/Jobs";
import JobDescription from "./components/jobs/JobDescription";
import Profile from "./components/profile/Profile";
import About from "./components/shared/About";
import Status from "./components/jobs/Status";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import AdminJobCreate from "./components/admin/AdminJobCreate";
import AdminJobSetup from "./components/admin/AdminJobSetup";
import Applicants from "./components/admin/Applicants";
import ProtectedRoutes from "./components/admin/ProtectedRoutes";

import { BASE_BACKEND_URL } from "./utils/constants";

const App = () => {
  console.log("Current environment:", import.meta.env);
  console.log("Backend URL:", BASE_BACKEND_URL);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/description/:id" element={<JobDescription />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/status" element={<Status />} />

          {/* For Admin */}
          <Route path="/admin/companies" element={<ProtectedRoutes><Companies /></ProtectedRoutes>} />
          <Route path="/admin/companies/create" element={<ProtectedRoutes><CompanyCreate /></ProtectedRoutes>} />
          <Route path="/admin/companies/:id" element={<ProtectedRoutes><CompanySetup /></ProtectedRoutes>} />
          <Route path="/admin/jobs" element={<ProtectedRoutes><AdminJobs /></ProtectedRoutes>} />
          <Route path="/admin/jobs/create" element={<ProtectedRoutes><AdminJobCreate /></ProtectedRoutes>} />
          <Route path="/admin/jobs/:id" element={<ProtectedRoutes><AdminJobSetup /></ProtectedRoutes>} />
          <Route path="/admin/jobs/:id/applicants" element={<ProtectedRoutes><Applicants /></ProtectedRoutes>} />

          {/* saved applications abhi static hai */}
                {/* Add status in jobs if closed then show closed in saved application and also show only open jobs in filter page */}
                {/* delete saved jobs */}
                {/* Open them from here also */}
          {/* browser by category homepage */}
          {/* Admin section for approving Recruiters accounts */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
