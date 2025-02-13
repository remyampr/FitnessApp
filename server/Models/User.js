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
  fitnessGoal: { type: String },
  joinDate: { type: Date, default: Date.now },
  
  isActive: { type: Boolean, default: true }, 
  subscription: {
    status: { type: String, enum: ["Active", "Inactive", "Expired"], default: "Inactive" }, 
    plan: { type: String, default: "Free" }, 
    startDate: { type: Date },
    endDate: { type: Date },
  },
  role:{type:String,default:"user"},
  image: {
    type: String,
    default: 'uploads/user.jpg' 
  },
}, { timestamps: true });

module.exports = mongoose.model("User",userSchema); 
