const mongoose = require('mongoose');

const appointmentDeletionLogSchema = new mongoose.Schema({
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
    required: true 
  },
  deletedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'deletedByModel', //  for dynamic reference
    required: true 
  },
  deletedByModel: {  // Dynamically refer to either 'User' or 'Admin'
    type: String,
    enum: ['User', 'Admin'],
    required: true
  },
  deletedByRole: { 
    type: String, 
    enum: ['admin', 'user'], 
    required: true 
  },
  deletedAt: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  appointmentDetails: { 
    type: Object, 
    required: true 
  }
});

const AppointmentDeletionLog = mongoose.model('AppointmentDeletionLog', appointmentDeletionLogSchema);

module.exports = AppointmentDeletionLog;
