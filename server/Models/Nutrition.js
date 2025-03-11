

const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  
  title: { type: String, required: true },
  fitnessGoal: { 
    type: String, 
    enum: ["Weight Loss", "Weight Gain", "Muscle Gain", "Maintenance", "Endurance Improvement"], 
    required: true 
  },
  schedule: [{
    day: { 
      type: String, 
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
      required: true 
    },
    meals: [{
      type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
      foods: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fats: { type: Number, required: true }
      }]
    }]
  }],

  waterIntake: { type: Number, default: 0 },
  image: { type: String, default: "" }, 
 createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be Trainer or Admin
   createdByType: { type: String, enum: ['trainer', 'admin'], required: true }, // Distinguish creator type

   status:{type:String,default:"active", enum:["active","inactive"]}
}, { timestamps: true });

module.exports = mongoose.model("Nutrition", nutritionSchema); 






















































