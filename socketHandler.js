const Message = require('./server/models/Message');
const User = require('./server/models/User');

/**
 * Socket.io handler for real-time messaging
 * @param {Object} io - Socket.io server instance
 */
function setupSocketHandlers(io) {
  // Track online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Handle user login
    socket.on('user_connected', (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        io.emit('user_status_change', {
          userId,
          status: 'online'
        });
        console.log(`User ${userId} is now online`);
      }
    });

    // Handle new message
    socket.on('send_message', async (messageData) => {
      try {
        const { text, sender, timestamp } = messageData;
        
        // Find the user to get their information
        const user = await User.findById(sender);
        if (!user) {
          socket.emit('message_error', { message: 'User not found' });
          return;
        }
        
        // Create and save the new message
        const newMessage = new Message({
          text,
          sender,
          senderName: user.name || `${user.firstName} ${user.lastName}`,
          senderRole: user.role,
          senderAvatar: user.avatar || '/default-avatar.png',
          timestamp: timestamp || Date.now()
        });
        
        await newMessage.save();
        
        // Format the response to match the expected format in the client
        const messageResponse = {
          _id: newMessage._id,
          text: newMessage.text,
          sender: newMessage.sender,
          senderName: newMessage.senderName,
          senderRole: newMessage.senderRole,
          senderAvatar: newMessage.senderAvatar,
          timestamp: newMessage.timestamp
        };
        
        // Broadcast the message to all connected clients
        io.emit('new_message', messageResponse);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('message_error', { message: 'Server error' });
      }
    });

    // Handle message deletion
    socket.on('delete_message', async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        
        if (!message) {
          socket.emit('message_error', { message: 'Message not found' });
          return;
        }
        
        await Message.findByIdAndDelete(messageId);
        
        // Notify all clients about the deleted message
        io.emit('message_deleted', { messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('message_error', { message: 'Server error' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.broadcast.emit('user_typing', {
        userId: data.userId,
        userName: data.userName,
        isTyping: data.isTyping
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Find and remove the disconnected user
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('user_status_change', {
            userId,
            status: 'offline'
          });
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}

module.exports = setupSocketHandlers;