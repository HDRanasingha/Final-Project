import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Delete } from '@mui/icons-material';
import '../styles/Messages.scss';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    fetchMessages();

    // Connect to Socket.io server
    socket.current = io('http://localhost:3001');

    // Listen for new messages from the server
    socket.current.on('new_message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Listen for deleted messages
    socket.current.on('message_deleted', (messageId) => {
      setDeletingMessageId(messageId);
      setTimeout(() => {
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        setDeletingMessageId(null);
      }, 300); // Match the animation duration
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/messages');
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        text: newMessage,
        sender: currentUser._id,
        timestamp: Date.now()
      };

      const response = await axios.post('http://localhost:3001/api/messages', messageData);
      setNewMessage('');
      socket.current.emit('send_message', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    if (message.sender === currentUser._id) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        messageId: message._id
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setDeletingMessageId(messageId);
      await axios.delete(`http://localhost:3001/api/messages/${messageId}`);
      socket.current.emit('delete_message', messageId);
      setContextMenu(null);
      
      // Remove the message from UI after animation
      setTimeout(() => {
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        setDeletingMessageId(null);
      }, 300); // Match the animation duration
    } catch (error) {
      console.error('Error deleting message:', error);
      setDeletingMessageId(null);
    }
  };

  const handleClickOutside = (e) => {
    if (contextMenu && !e.target.closest('.context-menu')) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <div className="messages-page">
      <Navbar />
      <div className="messages-container">
        <div className="messages-header">
          <h2>Chat Messages</h2>
        </div>
        
        <div className="messages-list">
          {Array.isArray(messages) && messages.map((message, index) => (
            <div 
              key={index} 
              className={`message-item ${message.sender === currentUser?._id ? 'sent' : 'received'} ${
                deletingMessageId === message._id ? 'deleting' : ''
              }`}
              onContextMenu={(e) => handleContextMenu(e, message)}
            >
              <div className="message-avatar">
                <img 
                  src={message.senderAvatar || '/default-avatar.png'} 
                  alt={message.senderName || 'User'} 
                />
              </div>
              <div className="message-content">
                <div className="message-info">
                  <span className="message-sender">{message.senderName}</span>
                  <span className="message-role">{message.senderRole}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {contextMenu && (
          <div 
            className="context-menu"
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
            }}
          >
            <button 
              className="delete-button"
              onClick={() => handleDeleteMessage(contextMenu.messageId)}
            >
              <Delete />
              <span>Delete Message</span>
            </button>
          </div>
        )}
        
        <form className="message-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;

