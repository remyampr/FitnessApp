const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },

    adminRevenue: { 
      type: Number, 
      required: true 
    },
    trainerRevenue: { 
      type: Number, 
      required: true 
    },


    date: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      required: true,
    },
   
    plan: { type: String, required: true },
    transactionId: { type: String, unique: true, required: true },
  
    duration: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },


  },
  


  { timestamps: true }
);

// Calculate revenue distribution before saving
paymentSchema.pre('save', function(next) {
  if (!this.trainerRevenue || !this.adminRevenue) {
    // Only calculate if not already set
    const trainerPercentage = 30; 
    this.trainerRevenue = this.amount * (trainerPercentage / 100);
    this.adminRevenue = this.amount - this.trainerRevenue;
  }
  
 
  
  next();
});


module.exports = mongoose.model("Payment", paymentSchema);
