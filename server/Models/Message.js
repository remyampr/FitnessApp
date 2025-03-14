
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Trainer']
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['User', 'Trainer']
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  attachments: [{
    type: String, // URL or path to attachment
    contentType: String // Type of attachment
  }]
}, {
  timestamps: true
});

messageSchema.index({ senderId: 1, recipientId: 1 });
messageSchema.index({ recipientId: 1, read: 1 });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;