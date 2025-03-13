const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  role:{type:String,default:"admin"},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  totalRevenue: { type: Number, default: 0 },
  revenueHistory: [
    {
      year: Number,
      month: Number,
      revenue: Number,
      trainerPayouts: Number,
      newUsers: Number,
      newTrainers: Number
    }
  ],
  
  otp: { type: String }, 
  otpExpires: { type: Date } ,
});

module.exports = mongoose.model("Admin", adminSchema);
