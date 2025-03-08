const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel'
    },
    recipientModel: {
      type: String,
      enum: ['User', 'Trainer'],
      required: true
    },
    type: {
      type: String,
      enum: [
        'APPOINTMENT_CANCELLED', 
        'APPOINTMENT_CONFIRMED', 
        'APPOINTMENT_REMINDER', 
        'APPOINTMENT_COMPLETED',
        'NEW_APPOINTMENT_REQUEST'
      ],
      required: true
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    additionalDetails: {
      type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, { timestamps: true });
  
  module.exports= mongoose.model('Notification', notificationSchema);
 