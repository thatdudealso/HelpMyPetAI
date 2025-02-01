import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar"; // ✅ Import Navbar

const DoctorDashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prevPrompt) => prevPrompt + " " + transcript);
      };

      recognitionInstance.onend = () => setIsListening(false);
      setRecognition(recognitionInstance);
    } else {
      console.warn("Speech Recognition is not supported in this browser.");
    }
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");

    console.log("📢 Fetching history with token:", token);

    if (!token) {
      console.error("❌ Token is missing from localStorage. User may not be authenticated.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/prompt/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🚀 API Request Sent: GET /api/prompt/history");
      console.log("🚀 Authorization Header Sent:", `Bearer ${token}`);

      if (!res.ok) {
        console.error("❌ Failed to fetch history, status:", res.status);
        return;
      }

      const data = await res.json();
      console.log("📢 API Response for History:", data);

      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.warn("⚠️ Expected an array but got:", data);
        setHistory([]);
      }
    } catch (error) {
      console.error("❌ Error fetching history:", error);
      setHistory([]);
    }
  };

  const handleVoiceCommand = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      alert("Your browser does not support voice recognition.");
    }
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!prompt && !file) {
      alert("Please provide a prompt or upload a file.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      console.log("📢 Token Before Sending Request:", token);

      if (!token) {
        console.error("❌ Token is missing from localStorage.");
        alert("Authentication Error: Token not found. Please log in again.");
        return;
      }

      if (prompt) {
        const response = await fetch("http://localhost:5001/api/prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt, agentType: "senior_doctor_ai" }),
        });

        console.log("🚀 API Request Sent: POST /api/prompt");
        console.log("🚀 Authorization Header Sent:", `Bearer ${token}`);

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("❌ API Error Response:", errorMessage);
          throw new Error(errorMessage || "Failed to process AI prompt.");
        }

        const result = await response.json();
        console.log("📢 API Response:", result);
        setResponse(result.response);
        fetchHistory();
      }

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const fileUploadResponse = await fetch("http://localhost:5001/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!fileUploadResponse.ok) {
          const errorMessage = await fileUploadResponse.text();
          console.error("❌ File Upload Error:", errorMessage);
          throw new Error(errorMessage || "Failed to upload file.");
        }

        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.error("❌ Submission error:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <DashboardNavbar /> {/* ✅ Navbar added */}
      <div className="flex flex-col items-center p-6 pt-20">
        <h1 className="text-4xl font-extrabold my-4">Doctor Dashboard</h1>

        {/* Prompt Input */}
        <textarea
          className="w-full max-w-2xl bg-gray-800 border border-gray-700 p-4 rounded-lg text-white placeholder-gray-400 mb-4"
          placeholder="Enter your question or command..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Voice Command Button */}
        <button
          onClick={handleVoiceCommand}
          className={`px-6 py-3 text-lg font-semibold rounded-lg transition duration-300 shadow-md ${
            isListening ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isListening ? "Listening..." : "Use Voice Command 🎤"}
        </button>

        {/* File Upload */}
        <input type="file" onChange={handleFileUpload} className="mb-4 text-white mt-4" />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`px-6 py-3 text-lg font-semibold rounded-lg transition duration-300 shadow-md ${
            isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>

        {/* AI Response Display */}
        {response && (
          <div className="mt-6 p-6 w-full max-w-2xl bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-cyan-400">Senior Doctor AI Response:</h2>
            <p className="text-gray-300 mt-2">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;