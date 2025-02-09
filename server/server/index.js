const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const promptRoutes = require("./routes/promptRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure MONGO_URI is defined
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("🔴 MONGO_URI is missing in .env file");
  process.exit(1); // Exit process if MongoDB URI is missing
}

// Ensure JWT_SECRET is defined
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("🔴 JWT_SECRET is missing in .env file");
  process.exit(1); // Exit process if JWT secret is missing
}

// MongoDB Connection
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("🔴 MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  });

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend requests
app.use(express.json()); // Enable JSON Parsing

// **Debugging Middleware: Log requests to track API calls**
app.use((req, res, next) => {
  console.log(`📢 Incoming Request: ${req.method} ${req.url}`);
  console.log("📢 Headers:", req.headers);
  console.log("📢 Body:", req.body);
  next();
});

// API Routes
app.use("/api/prompt", promptRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);

// Root Route (Test if server is running)
app.get("/", (req, res) => {
  res.send("HelpMyPet API is running!");
});

// Error Handling Middleware (Log Errors)
app.use((err, req, res, next) => {
  console.error("🔴 Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));