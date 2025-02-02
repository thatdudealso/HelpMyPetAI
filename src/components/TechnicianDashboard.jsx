import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar"; 

const TechnicianDashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchHistory();

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
      if (!res.ok) throw new Error("Failed to load history.");
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      setHistory([]);
    }
  };

  const handleVoiceCommand = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!prompt && !file) return;
    setIsLoading(true);

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
        if (!response.ok) throw new Error();
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
        if (!fileUploadResponse.ok) throw new Error();
      }
    } catch (error) {} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-600 to-orange-500 text-white flex flex-col">
      <DashboardNavbar />
      <div className="flex flex-col items-center p-6 pt-20 w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Technician Dashboard</h1>
        {error && <p className="bg-red-500 text-white p-2 rounded mb-4">{error}</p>}
        <textarea
          className="w-full bg-white border border-gray-300 p-4 rounded-lg text-gray-900 placeholder-gray-500 mb-4 shadow-md focus:ring-2 focus:ring-yellow-400"
          placeholder="Enter your task or request..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex space-x-4 justify-center w-full">
          <button
            onClick={handleVoiceCommand}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition shadow-md ${
              isListening ? "bg-red-500" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isListening ? "Listening..." : "Use Voice Command 🎤"}
          </button>
          <label className="px-6 py-3 text-lg font-semibold rounded-lg transition shadow-md bg-blue-500 hover:bg-blue-600 cursor-pointer">
            Upload File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleSubmit}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition shadow-md ${
              isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
        {response && (
          <div className="mt-6 p-6 w-full bg-white rounded-lg border border-gray-300 text-gray-900 shadow-md">
            <h2 className="text-xl font-semibold text-yellow-600">Technician AI Response:</h2>
            <p className="text-gray-700 mt-2">{response}</p>
          </div>
        )}
        {/* History Section */}
        <div className="mt-6 w-full max-w-3xl">
          <h2 className="text-xl font-semibold text-yellow-600">History</h2>
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
