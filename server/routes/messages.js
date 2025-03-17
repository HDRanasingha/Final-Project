const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 })
      .populate('sender', 'name firstName lastName role avatar');
    
    // Format messages to include sender information
    const formattedMessages = messages.map(message => ({
      _id: message._id,
      text: message.text,
      sender: message.sender._id,
      senderName: message.senderName || message.sender.name || `${message.sender.firstName} ${message.sender.lastName}` || 'Unknown User',
      senderRole: message.senderRole || message.sender.role || 'User',
      profileImage: { type: String },

      timestamp: message.timestamp
    }));
    
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages with pagination
router.get('/paginated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 20;
    
    const totalMessages = await Message.countDocuments();
    const totalPages = Math.ceil(totalMessages / limit);
    
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate('sender', 'name firstName lastName role avatar');
    
    // Format messages to include sender information
    const formattedMessages = messages.map(message => ({
      _id: message._id,
      text: message.text,
      sender: message.sender._id,
      senderName: message.senderName || message.sender.name || `${message.sender.firstName} ${message.sender.lastName}` || 'Unknown User',
      senderRole: message.senderRole || message.sender.role || 'User',
      senderAvatar: message.senderAvatar || message.sender.avatar || '/default-avatar.png',
      timestamp: message.timestamp
    }));
    
    res.json({
      messages: formattedMessages.reverse(), // Reverse to get chronological order
      currentPage: page,
      totalPages,
      totalMessages
    });
  } catch (error) {
    console.error('Error fetching paginated messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { text, sender, timestamp } = req.body;
    
    if (!text || !sender) {
        return res.status(400).json({ error: 'Text and sender are required' });
    }

    // Find the user to get their information
    const user = await User.findById(sender);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const newMessage = new Message({
        text,
        sender,
        senderName: user.name || `${user.firstName} ${user.lastName}`,
        senderRole: user.role,
        senderAvatar: user.avatar || '/default-avatar.png',
        timestamp: timestamp || Date.now()
    });

    await newMessage.save();

    // Format the response
    const messageResponse = {
        _id: newMessage._id,
        text: newMessage.text,
        sender: newMessage.sender,
        senderName: newMessage.senderName,
        senderRole: newMessage.senderRole,
        senderAvatar: newMessage.senderAvatar,
        timestamp: newMessage.timestamp
    };

    res.status(201).json(messageResponse);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a message (optional)
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define the POST route for messages
router.post('/', (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
    }
    // Handle the message (e.g., save to database, broadcast via WebSocket, etc.)
    console.log(`Received message: ${message}`);
    res.status(200).json({ success: true, message: 'Message received' });
});

module.exports = router;