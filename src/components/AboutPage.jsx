import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons

const AboutPage = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 shadow-lg py-4 px-6 flex justify-between items-center z-50">
        
        {/* Logo */}
        <div 
          className="text-2xl font-extrabold text-cyan-300 cursor-pointer tracking-wide"
          onClick={() => navigate("/")}
        >
          HelpMyPet.ai
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <button onClick={() => navigate("/")} className="text-gray-300 hover:text-cyan-300 transition duration-300">
            Home
          </button>
          <button onClick={() => navigate("/about")} className="text-gray-300 hover:text-cyan-300 transition duration-300">
            About
          </button>
        </div>

        {/* Desktop Login Button */}
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
            {isOpen ? <FaTimes /> : <FaBars />}
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

      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?ai,technology,veterinary')",
        }}
      ></div>

      {/* Content Card */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-grow">
        <div className="max-w-4xl text-center p-10 bg-white bg-opacity-10 backdrop-blur-xl shadow-2xl rounded-xl border border-gray-200">
          <h1 className="text-5xl font-extrabold text-cyan-300 mb-6">About HelpMyPet.ai</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            At <span className="font-bold text-white">HelpMyPet.ai</span>, we empower <strong>doctors, technicians, and students</strong> 
            with <strong>AI-driven tools</strong> to assist in their day-to-day veterinary practice. 
            Whether you're diagnosing a patient, analyzing medical records, or preparing for exams, our AI is here to help.
          </p>

          {/* Features Section */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-cyan-300">For Doctors</h2>
              <p className="text-gray-400 mt-2">
                AI-powered <strong>diagnostic support</strong> and <strong>treatment recommendations</strong>.
              </p>
            </div>
            <div className="p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-cyan-300">For Technicians</h2>
              <p className="text-gray-400 mt-2">
                Seamless <strong>image & document analysis</strong> to assist with medical procedures and patient records.
              </p>
            </div>
            <div className="p-6 bg-gray-800 bg-opacity-70 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-cyan-300">For Students</h2>
              <p className="text-gray-400 mt-2">
                AI-driven <strong>learning tools</strong> to create better <strong>study materials</strong> and ace your exams.
              </p>
            </div>
          </div>

          {/* Call-to-Action */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-lg font-semibold bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;