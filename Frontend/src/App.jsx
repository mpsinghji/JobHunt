import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/home/Home";
import Jobs from "./components/jobs/Jobs";
import JobDescription from "./components/jobs/JobDescription";
import Browse from "./components/shared/Browse";
import Profile from "./components/profile/Profile";
import About from "./components/shared/About";
import AboutUs from "./components/shared/AboutUs";
import Status from "./components/shared/Status"

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
        <Route path="/browse" element={<Browse />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/status" element={<Status/>} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
