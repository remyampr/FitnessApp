const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  date: { type: Date, default: Date.now, required: true },
  weight: { type: Number, min: 0 },
  measurements: {
    chest: { type: Number, min: 0 },
    waist: { type: Number, min: 0 },
    arms: { type: Number, min: 0 },
    legs: { type: Number, min: 0 }
  },
  
  workoutCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
  
  workoutDetails: [{
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
    completed: { type: Boolean, default: false },
    duration: { type: Number },
    exercises: [{
      name: { type: String },
      sets: { type: Number },
      reps: { type: Number },
      restTime: { type: Number },
      notes: { type: String },
      completedAt: { type: Date },
      weight: { type: Number },
      measurements: {
        chest: { type: Number },
        waist: { type: Number },
        arms: { type: Number },
        legs: { type: Number }
      }
    }],
    completedAt: { type: Date }
  }],
  
  nutritionFollowed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Nutrition' }],
  
  nutritionDetails: [{
    nutritionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutrition' },
    completed: { type: Boolean, default: false },
    details: { type: Object, default: {} },
    waterIntake: { type: Number, default: 0 },
    completedAt: { type: Date }
  }],
  
  trainerNotes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);