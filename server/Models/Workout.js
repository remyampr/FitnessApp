const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  workoutType: {type: String,  enum: ['weightLoss', 'muscleGain', 'maintenance', 'strength', 'endurance'],
required: true
  },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  duration: { type: Number, required: true, min: 1 },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, required: true, min: 1 },
    reps: { type: Number, min: 1 }, 
    duration: { type: Number, min: 1 }, 
    restPeriod: { type: Number, min: 0, default: 30 } 
  }],
image: { type: String, default: "" }, // Store image URL
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be Trainer or Admin
  createdByType: { type: String, enum: ['trainer', 'admin'], required: true } // Distinguish creator type
}, { timestamps: true });

module.exports = mongoose.model("Workout", workoutSchema); 
