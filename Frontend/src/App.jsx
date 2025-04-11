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
        <Route path="/status" element={<Status/>} />

        {/* saved applications abhi static hai */}
        {/* show expired in jobs */}
        {/* withdraw application */}
        {/* delete saved jobs */}
        {/* browser by category */}
        {/* search */}
        {/*  */}
      </Routes>
    </Router>
    </>
  );
};

export default App;
