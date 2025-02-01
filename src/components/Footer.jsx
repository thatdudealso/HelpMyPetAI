import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Logo */}
        <div className="text-2xl font-extrabold text-cyan-300 cursor-pointer tracking-wide" onClick={() => navigate("/")}>
          HelpMyPet.ai
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start space-x-6 mt-4 md:mt-0">
          <button onClick={() => navigate("/")} className="hover:text-cyan-300 transition">Home</button>
          <button onClick={() => navigate("/about")} className="hover:text-cyan-300 transition">About</button>
          <button onClick={() => navigate("/login")} className="hover:text-cyan-300 transition">Login</button>
          <button onClick={() => navigate("/signup")} className="hover:text-cyan-300 transition">Sign Up</button>
        </div>

        {/* Copyright & Socials */}
        <div className="text-sm mt-4 md:mt-0">
          <p>© {new Date().getFullYear()} HelpMyPet.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;