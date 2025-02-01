import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentLoginPage = () => {
  const [email, setEmail] = useState(""); // 🔹 FIXED: Changed username -> email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // 🔹 FIXED: Using email instead of username
      });

      const data = await response.json();
      if (response.ok) {
        // Store token & user role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role); // 🔹 Store user role for future use

        // Redirect student to dashboard
        navigate("/student-dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-500 to-pink-600 text-white">
      
      {/* 🔹 Navigation Bar */}
      <nav className="w-full bg-gray-900 bg-opacity-80 shadow-lg py-4 px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-cyan-300 cursor-pointer" onClick={() => navigate("/")}>
          HelpMyPet.ai
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <button onClick={() => navigate("/")} className="text-white hover:text-cyan-300 transition duration-300">
            Home
          </button>
          <button onClick={() => navigate("/about")} className="text-white hover:text-cyan-300 transition duration-300">
            About
          </button>
        </div>

        {/* Login Button */}
        <div>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition duration-300 shadow-md"
          >
            Login
          </button>
        </div>
      </nav>

      {/* 🔹 Login Section */}
      <div className="flex flex-col justify-center items-center flex-grow">
        <h2 className="text-4xl font-bold mb-6">Student Login</h2>
        <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-900" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Email</label> {/* 🔹 FIXED: Changed Username -> Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded-lg w-full font-semibold hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLoginPage;