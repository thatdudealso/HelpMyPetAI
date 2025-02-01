import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (role === "signup") {
      navigate("/signup");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Login successful, token received:", data.token);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          console.log("🔹 Token stored successfully:", localStorage.getItem("token"));
          console.log("🔹 User stored successfully:", localStorage.getItem("user"));

          navigate(`/${data.user.role}-dashboard`);
        } else {
          console.error("❌ No token received from server.");
          alert("Login failed: No token received.");
        }
      } else {
        console.error("❌ Login error:", data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error("❌ Login request failed:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col">
      
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

      {/* Main Login Section */}
      <div className="flex flex-col justify-center items-center flex-grow mt-16">
        <h2 className="text-4xl font-bold mb-6">Login to HelpMyPet.ai</h2>
        <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-900" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            >
              <option value="">Select your role</option>
              <option value="doctor">Doctor</option>
              <option value="technician">Technician</option>
              <option value="student">Student</option>
              <option value="signup">Sign Up</option> 
            </select>
          </div>
          
          {role && role !== "signup" && (
            <>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Email</label>
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
            </>
          )}
          
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full font-semibold hover:bg-blue-700 transition">
            {role === "signup" ? "Continue to Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;