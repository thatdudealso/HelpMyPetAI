const express = require("express");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const User = require("../models/User"); // Import User Model
const AGENTS = require("../config/agents"); // Import AI Agent Config
require("dotenv").config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// **Middleware: Authenticate Users**
const authenticateUser = async (req, res, next) => {
  let token = req.header("Authorization");

  console.log("📢 Incoming Request:", req.method, req.originalUrl);
  console.log("📢 Authorization Header Received:", token);

  if (!token) {
    console.error("❌ No token provided in the request.");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Ensure token follows 'Bearer <token>' format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  } else {
    console.error("❌ Malformed token. Expected 'Bearer <token>'.");
    return res.status(400).json({ error: "Invalid token format." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token successfully verified:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(400).json({ error: "Invalid token." });
  }
};

// **POST: Submit AI Prompt**
router.post("/", authenticateUser, async (req, res) => {
  const { prompt, agentType } = req.body;
  const userId = req.user.id;

  console.log("📢 API Request: Submit Prompt");
  console.log("📢 User ID:", userId);
  console.log("📢 Agent Type:", agentType);
  console.log("📢 Prompt:", prompt);

  if (!prompt || !AGENTS[agentType]) {
    console.error("❌ Invalid prompt or agent type.");
    return res.status(400).json({ error: "Invalid prompt or agent type." });
  }

  const agent = AGENTS[agentType];

  try {
    // Call OpenAI API with specified AI agent
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: agent.system_message },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
    });

    const aiResponse = response.choices[0].message.content;
    console.log("📢 OpenAI Response:", aiResponse);

    // Store history in database
    const user = await User.findById(userId);
    if (user) {
      user.history.push({ prompt, response: aiResponse, agentType });
      await user.save();
      console.log("✅ User history updated successfully.");
    } else {
      console.warn("⚠️ User not found, skipping history update.");
    }

    res.json({ response: aiResponse, agent: agent.name });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    res.status(500).json({ error: "AI processing failed." });
  }
});

// **GET: Fetch AI Interaction History for User**
router.get("/history", authenticateUser, async (req, res) => {
  try {
    console.log("📢 Fetching history for User ID:", req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("❌ User not found in the database.");
      return res.status(404).json({ error: "User not found." });
    }

    console.log("✅ Successfully retrieved user history.");
    res.json(user.history);
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

module.exports = router;