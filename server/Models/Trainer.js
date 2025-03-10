const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    image: { type: String, default: "" },
    specialization: { type: [String], default: [] },
    experience: { type: Number, min: 0, default: 0 },

    // rating: { type: Number, min: 1, max: 5, default: 5 },

    // *****************************

    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          
        },
        slots: [
          {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            isBooked: { type: Boolean, default: false },
          },
        ],
      },
    ],
    certifications: { type: [String], default: [] },
    bio: { type: String, trim: true },
    socialLinks: [{ platform: String, url: String }],

    isApproved: { type: Boolean, default: false }, // Whether the trainer is approved by an admin
    adminNotes: {
      type: String,
      default: "",
    },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    role: { type: String, default: "trainer", enum: ["trainer"] },
    // Ratings from clients
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, trim: true },
      },
    ],

    // Average rating (auto-calculated)
    averageRating: { type: Number, min: 1, max: 5, default: 5 },

    // revenue
    totalRevenue: { type: Number, default: 0 },
    trainerSharePercentage: { type: Number, default: 30 },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // monthly revenue tracking
    revenueHistory: [
      {
        year: { type: Number },
        month: { type: Number }, // 0-11 for Jan-Dec
        revenue: { type: Number, default: 0 },
        clientCount: { type: Number, default: 0 },
      },
    ],
    // payments: [{
    //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    //   transactionId: { type: String, required: true },
    //   amount: { type: Number, required: true },
    //   date: { type: Date, default: Date.now }
    // }],

    isVerified: { type: Boolean, default: false }, // Initially false until OTP verification
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trainer", trainerSchema);
