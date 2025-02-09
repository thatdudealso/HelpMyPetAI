const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["doctor", "technician", "student"], required: true },
    
    practiceType: { 
      type: String, 
      enum: ["small animal", "farm", "equine", "lab animal", "industry", "aquatics", "exotics", "zoo/wildlife"], 
      required: true 
    },

    // Doctor-Specific Fields
    licenseNumber: { 
      type: String, 
      required: function() { return this.role === "doctor"; }, 
      default: function() { return this.role === "doctor" ? undefined : undefined; }
    },
    experience: { 
      type: Number, 
      required: function() { return this.role === "doctor"; }, 
      default: function() { return this.role === "doctor" ? undefined : undefined; }
    },

    // Technician-Specific Fields
    certificationID: { 
      type: String, 
      required: function() { return this.role === "technician"; }, 
      default: function() { return this.role === "technician" ? undefined : undefined; }
    },
    clinicName: { 
      type: String, 
      required: function() { return this.role === "technician"; }, 
      default: function() { return this.role === "technician" ? undefined : undefined; }
    },

    // Student-Specific Fields
    university: { 
      type: String, 
      required: function() { return this.role === "student"; }, 
      default: function() { return this.role === "student" ? undefined : undefined; }
    },
    graduationYear: { 
      type: Number, 
      required: function() { return this.role === "student"; }, 
      default: function() { return this.role === "student" ? undefined : undefined; }
    },

    history: [
      {
        prompt: { type: String, required: true },
        response: { type: String, required: true },
        agentType: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// **Hash Password Before Saving (Fix Double Hashing)**
userSchema.pre("save", async function (next) {
  // **Prevent double hashing**
  if (!this.isModified("password")) {
    console.log("🔹 Password was NOT modified - Skipping hash");
    return next();
  }

  console.log("🔹 Hashing Password Before Saving:", this.password);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("🔹 Final Hashed Password Stored:", this.password);

  next();
});

// **Method to Compare Passwords**
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("🔹 Comparing Entered Password with Stored Hash");
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;