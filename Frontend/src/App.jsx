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

const App = () => {
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
          <Route path="/admin/companies" element={<Companies />} />
          <Route path="/admin/companies/create" element={<CompanyCreate />} />
          <Route path="/admin/companies/:id" element={<CompanySetup />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<AdminJobCreate />} />
          <Route path="/admin/jobs/:id" element={<AdminJobSetup />} />

          {/* saved applications abhi static hai */}
          {/* show expired in jobs */}
          {/* withdraw application */}
          {/* delete saved jobs */}
          {/* browser by category */}
          {/* Implement Applicant Page */}
          {/* Implement Update Status of Applicant */}
          {/* Fetching Get All Applied Jobs */}
          {/* Implement Filter Jobs Logic */}
          {/* Adding Framer-motion */}
          {/* Protecting Our Routes */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
