const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// **User Registration**
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    country,
    countryCode,
    phoneNumber,
    password, // Will be hashed in User model
    role,
    practiceType,
    licenseNumber,
    experience,
    certificationID,
    clinicName,
    university,
    graduationYear,
  } = req.body;

  try {
    // **Normalize Email**
    const normalizedEmail = email.trim().toLowerCase();

    // **Check required fields**
    if (!firstName || !lastName || !email || !phoneNumber || !password || !role || !practiceType) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    // **Validate phone number length**
    if (phoneNumber.length !== 10) {
      return res.status(400).json({ error: "Phone number must be 10 digits." });
    }

    if (role === "doctor" && (!licenseNumber || !experience)) {
      return res.status(400).json({ error: "Doctors must provide License Number and Experience." });
    }

    if (role === "technician" && (!certificationID || !clinicName)) {
      return res.status(400).json({ error: "Technicians must provide Certification ID and Clinic Name." });
    }

    if (role === "student" && (!university || !graduationYear)) {
      return res.status(400).json({ error: "Students must provide University and Graduation Year." });
    }

    // **Check if user already exists**
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ error: "User already exists." });

    // **Create User Object**
    const newUser = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      phoneNumber,
      password, // Plain password (will be hashed in User.js)
      role,
      practiceType,
      country,
      countryCode,
      ...(role === "doctor" && { licenseNumber, experience }),
      ...(role === "technician" && { certificationID, clinicName }),
      ...(role === "student" && { university, graduationYear }),
    });

    // **Save User to Database**
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// **User Login**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // **Normalize Email**
    const normalizedEmail = email.trim().toLowerCase();

    // **Find User By Email**
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // **Check Password**
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // **Ensure JWT_SECRET is set**
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env file.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    // **Generate JWT Token**
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;