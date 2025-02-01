import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [certificationID, setCertificationID] = useState(""); // 🔹 Ensure this state exists
  const [clinicName, setClinicName] = useState(""); // 🔹 Ensure this state exists
  const [university, setUniversity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phoneNumber || !password || !role || !practiceType) {
      alert("Please fill in all required fields");
      return;
    }

    if (role === "doctor" && (!licenseNumber || !experience)) {
      alert("Doctors must provide License Number and Years of Experience");
      return;
    }

    if (role === "technician" && (!certificationID.trim() || !clinicName.trim())) { // 🔹 Fix Technician Validation
      alert("Technicians must provide Certification ID and Clinic Name");
      return;
    }

    if (role === "student" && (!university || !graduationYear)) {
      alert("Students must provide University and Graduation Year");
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      practiceType,
      ...(role === "doctor" && { licenseNumber, experience }),
      ...(role === "technician" && { certificationID, clinicName }), // 🔹 Ensure Technician Data is Sent
      ...(role === "student" && { university, graduationYear }),
    };

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        alert("Account Created Successfully!");
        navigate("/login");
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error signing up");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <h2 className="text-4xl font-bold mb-6">Create Your Account</h2>
      <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-900" onSubmit={handleSignUp}>
        
        {/* First Name */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">First Name</label>
          <input type="text" className="w-full border px-3 py-2 rounded-lg" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Last Name</label>
          <input type="text" className="w-full border px-3 py-2 rounded-lg" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Email</label>
          <input type="email" className="w-full border px-3 py-2 rounded-lg" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Phone Number</label>
          <input type="tel" className="w-full border px-3 py-2 rounded-lg" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Password</label>
          <input type="password" className="w-full border px-3 py-2 rounded-lg" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Role</label>
          <select className="w-full border px-3 py-2 rounded-lg" required value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Your Role</option>
            <option value="doctor">Doctor</option>
            <option value="technician">Technician</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* Practice Type Dropdown */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Practice Type</label>
          <select className="w-full border px-3 py-2 rounded-lg" required value={practiceType} onChange={(e) => setPracticeType(e.target.value)}>
            <option value="">Select Practice Type</option>
            <option value="small animal">Small Animal</option>
            <option value="farm">Farm</option>
            <option value="equine">Equine</option>
            <option value="lab animal">Lab Animal</option>
            <option value="industry">Industry</option>
            <option value="aquatics">Aquatics</option>
            <option value="exotics">Exotics</option>
            <option value="zoo/wildlife">Zoo/Wildlife</option>
          </select>
        </div>

        {/* Technician-Specific Fields */}
        {role === "technician" && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Certification ID</label>
              <input type="text" className="w-full border px-3 py-2 rounded-lg" required value={certificationID} onChange={(e) => setCertificationID(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Clinic Name</label>
              <input type="text" className="w-full border px-3 py-2 rounded-lg" required value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
            </div>
          </>
        )}

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full font-semibold hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;