const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  specialization: { type: [String], default: [] },
  experience: { type: Number, min: 0, default: 0 },
  hourlyRate: { type: Number, min: 0, default: 0 }, 
  rating: { type: Number, min: 1, max: 5, default: 5 }, 
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  availability: [{
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
    slots: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      isBooked: { type: Boolean, default: false }
    }]
  }],
  certifications: { type: [String], default: [] },
  role:{type:String,default:"trainer"}
}, { timestamps: true });

module.exports = mongoose.model("Trainer", trainerSchema); 
