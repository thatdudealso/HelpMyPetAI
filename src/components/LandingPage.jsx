import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for menu

const LandingPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to control mobile menu visibility

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-gray-900 text-white overflow-hidden">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 shadow-lg py-4 px-6 flex justify-between items-center z-50">
        
        {/* Logo */}
        <div 
          className="text-2xl font-extrabold text-cyan-300 cursor-pointer tracking-wide"
          onClick={() => navigate("/")}
        >
          HelpMyPet.ai
        </div>

        {/* Navigation Links (Hidden on mobile) */}
        <div className="hidden md:flex space-x-8">
          <button onClick={() => navigate("/")} className="text-gray-300 hover:text-cyan-300 transition duration-300">
            Home
          </button>
          <button onClick={() => navigate("/about")} className="text-gray-300 hover:text-cyan-300 transition duration-300">
            About
          </button>
        </div>

        {/* Login Button (Hidden on mobile) */}
        <div className="hidden md:flex">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />} {/* Open/Close Icons */}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center space-y-8 text-xl z-40 transition-all">
          <button onClick={() => { navigate("/"); setIsOpen(false); }} className="text-white hover:text-cyan-300 transition duration-300">
            Home
          </button>
          <button onClick={() => { navigate("/about"); setIsOpen(false); }} className="text-white hover:text-cyan-300 transition duration-300">
            About
          </button>
          <button onClick={() => { navigate("/login"); setIsOpen(false); }} className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md">
            Login
          </button>
        </div>
      )}

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* AI-Inspired Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?veterinary,technology,ai')",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-4xl p-12 bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200">
          <h1 className="text-6xl font-extrabold tracking-wide text-white drop-shadow-lg">
            Welcome to <span className="text-cyan-300">HelpMyPet.ai</span>
          </h1>
          <p className="text-lg mt-4 text-gray-300 leading-relaxed">
            HelpMyPet.ai empowers <strong>doctors, technicians, and students</strong> with 
            <strong> AI-driven tools</strong> to enhance their work and studies. Whether you’re a 
            veterinarian diagnosing a patient, a technician assisting a procedure, 
            or a student preparing for exams, we’re here to help.
          </p>

          {/* Feature Highlights */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6 text-white">
            <div className="p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-md w-60">
              <h2 className="text-xl font-bold text-cyan-300">For Doctors</h2>
              <p className="text-gray-400 mt-2">
                AI-powered <strong>diagnostic support</strong> and <strong>treatment recommendations</strong>.
              </p>
            </div>
            <div className="p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-md w-60">
              <h2 className="text-xl font-bold text-cyan-300">For Technicians</h2>
              <p className="text-gray-400 mt-2">
                Efficient <strong>image analysis</strong> and <strong>medical document processing</strong>.
              </p>
            </div>
            <div className="p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-md w-60">
              <h2 className="text-xl font-bold text-cyan-300">For Students</h2>
              <p className="text-gray-400 mt-2">
                AI-driven <strong>study materials</strong> to ace your veterinary exams.
              </p>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-lg font-semibold bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-6 py-3 text-lg font-semibold border border-gray-300 text-white rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;