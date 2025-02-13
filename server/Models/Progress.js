const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  date: { type: Date, default: Date.now, required: true },
  weight: { type: Number, required: true, min: 0 },
  measurements: {
    chest: { type: Number, min: 0 },
    waist: { type: Number, min: 0 },
    arms: { type: Number, min: 0 },
    legs: { type: Number, min: 0 }
  },
  workoutCompleted: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }, 
  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);