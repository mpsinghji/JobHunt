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
import Companies from "./components/recruiter/Companies";
import CompanyCreate from "./components/recruiter/CompanyCreate";
import CompanySetup from "./components/recruiter/CompanySetup";
import RecruiterJobs from "./components/recruiter/RecruiterJobs";
import RecruiterJobCreate from "./components/recruiter/RecruiterJobCreate";
import RecruiterJobSetup from "./components/recruiter/RecruiterJobSetup";
import Applicants from "./components/recruiter/Applicants";
import ProtectedRoutes from "./components/recruiter/ProtectedRoutes";

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

          {/* For Recruiter */}
          <Route path="/recruiter/companies" element={<ProtectedRoutes><Companies /></ProtectedRoutes>} />
          <Route path="/recruiter/companies/create" element={<ProtectedRoutes><CompanyCreate /></ProtectedRoutes>} />
          <Route path="/recruiter/companies/:id" element={<ProtectedRoutes><CompanySetup /></ProtectedRoutes>} />
          <Route path="/recruiter/jobs" element={<ProtectedRoutes><RecruiterJobs /></ProtectedRoutes>} />
          <Route path="/recruiter/jobs/create" element={<ProtectedRoutes><RecruiterJobCreate /></ProtectedRoutes>} />
          <Route path="/recruiter/jobs/:id" element={<ProtectedRoutes><RecruiterJobSetup /></ProtectedRoutes>} />
          <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoutes><Applicants /></ProtectedRoutes>} />

          {/* saved applications abhi static hai */}
                {/* Add status in jobs if closed then show closed in saved application and also show only open jobs in filter page */}
                {/* delete saved jobs */}
                {/* Open them from here also */}
          {/* Recruiter section for managing jobs and applications */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
