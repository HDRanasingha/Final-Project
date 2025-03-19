import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../styles/Messages.scss';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Messages = () => {
  const [messages, setMessages] = useState([]); // Ensure messages is initialized as an array
  const [newMessage, setNewMessage] = useState('');
  const currentUser = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    fetchMessages();

    // Connect to Socket.io server
    socket.current = io('http://localhost:3001');

    // Listen for new messages from the server
    socket.current.on('new_message', (message) => {
      console.log('Received new message via socket:', message);
      setMessages(prevMessages => [...prevMessages, message]);
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
      console.log('Fetched messages:', response.data); // Log response data
      setMessages(Array.isArray(response.data) ? response.data : []); // Ensure response data is an array
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
        
        // Clear the input field
        setNewMessage('');
        
        // Emit the message through socket
        socket.current.emit('send_message', response.data);
        
        // Note: We don't need to add the message to the state here
        // because it will come back through the socket broadcast
    } catch (error) {
        console.error('Error sending message:', error);
    }
  };

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
              className={`message-item ${message.sender === currentUser?._id ? 'sent' : 'received'}`}
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

