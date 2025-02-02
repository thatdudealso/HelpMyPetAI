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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(`/${data.user.role}-dashboard`);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500 text-gray-900 flex flex-col justify-center items-center">
      <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 shadow-lg py-4 px-6 flex justify-between items-center z-50 rounded-b-lg">
        <div className="text-2xl font-extrabold text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>HelpMyPet.ai</div>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-indigo-600 transition">Home</button>
          <button onClick={() => navigate("/about")} className="text-gray-700 hover:text-indigo-600 transition">About</button>
        </div>
        <div className="hidden md:flex">
          <button onClick={() => navigate("/login")} className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition">Login</button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-white bg-opacity-95 flex flex-col items-center justify-center space-y-6 text-xl z-40">
          <button onClick={() => { navigate("/"); setIsOpen(false); }} className="text-gray-800 hover:text-indigo-600">Home</button>
          <button onClick={() => { navigate("/about"); setIsOpen(false); }} className="text-gray-800 hover:text-indigo-600">About</button>
          <button onClick={() => { navigate("/login"); setIsOpen(false); }} className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition">Login</button>
        </div>
      )}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Login or Sign Up!</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400" required>
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
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400" required />
              </div>
            </>
          )}
          <button type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition">
            {role === "signup" ? "Continue to Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
