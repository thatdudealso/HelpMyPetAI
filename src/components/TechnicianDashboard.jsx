import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar"; 

const TechnicianDashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // ✅ FIXED HERE
  const [recognition, setRecognition] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  
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
    }
  }, []);
  
  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.warn("⚠️ No token found in localStorage");

    try {
      const res = await fetch("http://localhost:5001/api/prompt/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📢 Fetching history, status:", res.status);
      if (!res.ok) throw new Error("Failed to load history.");

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
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
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing authentication token.");

      if (prompt) {
        const response = await fetch("http://localhost:5001/api/prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt, agentType: "senior_technician_ai" }),
        });

        console.log("🚀 API Response Status:", response.status);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to process AI prompt.");
        }

        const result = await response.json();
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
    <div className="min-h-screen bg-yellow-900 text-white flex flex-col">
      <DashboardNavbar /> {/* ✅ Navbar included */}
      
      <div className="flex flex-col items-center p-6 pt-20">
        <h1 className="text-4xl font-extrabold my-4">Technician Dashboard</h1>

        {/* Error Message */}
        {error && <p className="bg-red-500 text-white p-2 rounded mb-4">{error}</p>}

        {/* Prompt Input */}
        <textarea
          className="w-full max-w-2xl bg-gray-800 border border-gray-700 p-4 rounded-lg text-white placeholder-gray-400 mb-4"
          placeholder="Enter your task or request..."
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
            <h2 className="text-xl font-semibold text-cyan-400">Technician AI Response:</h2>
            <p className="text-gray-300 mt-2">{response}</p>
          </div>
        )}

        {/* History Section */}
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-cyan-400">History</h2>
          <ul className="mt-2 text-gray-300">
            {history.length > 0 ? (
              history.map((item, index) => (
                <li key={index} className="border-b border-gray-700 py-2">
                  <strong>{item.agentType}:</strong> {item.prompt} ➝ {item.response}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No history found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;