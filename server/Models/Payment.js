const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now }, 
  type: { type: String, enum: ["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallet"], required: true }, 
  status: { type: String, enum: ["Pending", "Completed", "Failed"], required: true }, 
  plan: { type: String, required: true },
  transactionId: { type: String, unique: true, required: true } 
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
