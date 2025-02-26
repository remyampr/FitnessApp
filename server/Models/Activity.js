const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  activityType: {
    type: String,
    enum: [
      "NEW_USER",
      "NEW_TRAINER",
      "NEW_APPOINTMENT",
      "NEW_WORKOUT",
      "NEW_NUTRITION_PLAN",
      "PAYMENT_RECEIVED",
      "PENDING_APPROVAL",
    ],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  entityType: {
    type: String,
    enum: ["user", "trainer", "appointment", "workout", "nutritionPlan", "payment"],
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
    
  }
});




module.exports = mongoose.model('Activity', activitySchema);
