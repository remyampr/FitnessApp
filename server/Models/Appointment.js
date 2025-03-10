const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    trainer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Trainer', 
        required: true 
    }, 
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },  
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending"
},
 
  notes: { type: String, default: "" },
  cancellationReason: {
    type: String,
    default: ""
  },
  cancellationReason: { 
    type: String, 
    default: "" 
  },
  bookingSource: {
    type: String,
    enum: ["User", "Trainer"],
    required: true
  },
  deletionInfo: {
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    appointmentDetails: { type: Object },
  },

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);