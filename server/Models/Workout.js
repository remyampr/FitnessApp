const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    fitnessGoal: {
      type: String,
      enum: [
        "Weight Loss",
        "Weight Gain",
        "Muscle Gain",
        "Maintenance",
        "Endurance Improvement",
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    duration: { type: Number, required: true, min: 1 },
    schedule: [
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
        exercises: [
          {
            name: String,
            sets: Number,
            reps: Number,
            restTime: Number,
            notes: String,
          },
        ],
      },
    ],
    image: { type: String, default: "" }, // Store image URL
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be Trainer or Admin
    createdByType: { type: String, enum: ["trainer", "admin"], required: true }, // Distinguish creator type
    status: { type: String, default: "active", enum: ["active", "inactive"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
