import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token"); // ✅ Ensure token exists

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // ✅ Decode JWT token & check expiration
        const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp > currentTime) {
          setUserRole(parsedUser.role);
        } else {
          console.warn("🔴 Token expired! Logging out...");
          handleLogout(); // Auto-logout if token expired
        }
      } catch (error) {
        console.error("Error parsing user data or token:", error);
        handleLogout(); // Logout on error
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to Landing Page
  };

  return (
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

      {/* Logout/Login Button for Desktop */}
      <div className="hidden md:flex">
        {userRole ? (
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center space-y-8 text-xl z-40 transition-all">
          <button onClick={() => { navigate("/"); setIsOpen(false); }} className="text-white hover:text-cyan-300 transition duration-300">
            Home
          </button>
          <button onClick={() => { navigate("/about"); setIsOpen(false); }} className="text-white hover:text-cyan-300 transition duration-300">
            About
          </button>
          {userRole ? (
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-orange font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => { navigate("/login"); setIsOpen(false); }}
              className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md"
            >
              Logout   {/* 🔹 FIXED: Changed Login -> Logout */}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;