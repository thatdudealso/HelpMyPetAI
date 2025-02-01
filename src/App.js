import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AboutPage from "./components/AboutPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage"; 
import DoctorLoginPage from "./components/DoctorLoginPage";
import TechnicianLoginPage from "./components/TechnicianLoginPage";
import StudentLoginPage from "./components/StudentLoginPage";
import DoctorDashboard from "./components/DoctorDashboard";
import TechnicianDashboard from "./components/TechnicianDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Footer from "./components/Footer";  //  Import Footer Component


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />  {/* Add Sign-Up Page */}
            <Route path="/doctor-login" element={<DoctorLoginPage />} />
            <Route path="/technician-login" element={<TechnicianLoginPage />} />
            <Route path="/student-login" element={<StudentLoginPage />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            
          </Routes>
        </div>

        {/*  Add Footer Below */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;