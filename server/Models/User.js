const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true},

  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },

  password: { type: String, required: true },
  phone: { type: Number }, 
  height: { type: Number, min: 1 }, 
  weight: { type: Number, min: 1 }, 
  age: { type: Number, min: 1 }, 
  gender: { type: String, enum: ["Male", "Female", "Other"] }, 
  fitnessGoal: { type: String, enum:["Weight Loss","Weight Gain","Muscle Gain","Maintenance","Endurance Improvement"] },
  joinDate: { type: Date, default: Date.now },
  
  isActive: { type: Boolean, default: true }, 
  
  subscription: {
    status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Inactive" }, 
    plan: { type: String, default: "Free" }, 
    amount: { type: Number, default: 0 },  
    startDate: { type: Date },
    endDate: { type: Date },
  },
  paymentHistory: [{
    transactionId: { type: String, required: true }, 
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Success", "Failed"], required: true },
    paymentDate: { type: Date, default: Date.now }
  }],

  isVerified: { type: Boolean, default: false },  // Initially false until OTP verification
  otp: { type: String }, 
  otpExpires: { type: Date } ,

  role:{type:String,default:"user"},
  image: {
    type: String,
    default: 'Uploads/user.jpg' 
  },
  isProfileComplete:{type: Boolean, default: false},
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("User",userSchema); 
