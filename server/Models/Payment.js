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
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
    plan: { type: String, required: true },
    transactionId: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

paymentSchema.pre('save', function(next) {
  // 30% goes to trainer, 70% to admin
  this.trainerRevenue = this.amount * 0.3;
  this.adminRevenue = this.amount * 0.7;
  next();
});


module.exports = mongoose.model("Payment", paymentSchema);
