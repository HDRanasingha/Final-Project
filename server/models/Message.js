const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String
  },
  senderRole: {
    type: String
  },
  profileImage: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);