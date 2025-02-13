const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },  
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" }, 
  type: { type: String, required: true },
  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
