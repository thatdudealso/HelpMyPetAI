import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp > currentTime) {
          setUserRole(parsedUser.role);
        } else {
          console.warn("🔴 Token expired! Logging out...");
          handleLogout();
        }
      } catch (error) {
        console.error("Error parsing user data or token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg py-4 px-6 flex justify-between items-center z-50">
      <div 
        className="text-2xl font-extrabold text-white cursor-pointer tracking-wide"
        onClick={() => navigate("/")}
      >
        HelpMyPet.ai
      </div>

      <div className="hidden md:flex space-x-6">
        <button onClick={() => navigate("/")} className="text-white hover:text-gray-200 transition">Home</button>
        <button onClick={() => navigate("/about")} className="text-white hover:text-gray-200 transition">About</button>
      </div>

      <div className="hidden md:flex">
        {userRole ? (
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition shadow-md"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition shadow-md"
          >
            Login
          </button>
        )}
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-indigo-700 bg-opacity-95 flex flex-col items-center justify-center space-y-6 text-xl z-40">
          <button onClick={() => { navigate("/"); setIsOpen(false); }} className="text-white hover:text-gray-200 transition">Home</button>
          <button onClick={() => { navigate("/about"); setIsOpen(false); }} className="text-white hover:text-gray-200 transition">About</button>
          {userRole ? (
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => { navigate("/login"); setIsOpen(false); }}
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition shadow-md"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
