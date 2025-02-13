

const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  
  title: { type: String, required: true },
  nutritionType: {type: String,enum: ['weightLoss', 'muscleGain', 'maintenance', 'vegetarian', 'vegan'],required: true},
 
  meals: [{
    type: { type:String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
       foods: [{
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true }
    }]
  }],

  waterIntake: { type: Number, default: 0 },
  image: { type: String, default: "" }, // Store image URL
 createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be Trainer or Admin
   createdByType: { type: String, enum: ['trainer', 'admin'], required: true }, // Distinguish creator type
}, { timestamps: true });

module.exports = mongoose.model("Nutrition", nutritionSchema); 

