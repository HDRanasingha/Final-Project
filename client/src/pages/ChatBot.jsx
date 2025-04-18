import React, { useState, useRef, useEffect } from "react";
import { Send, SmartToy, Delete } from "@mui/icons-material";
import "../styles/ChatBot.scss";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const ChatBot = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initialize messages from localStorage based on user role
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`chatMessages_${user?.role || 'guest'}`);
    return savedMessages ? JSON.parse(savedMessages) : [{
      text: user?.role 
        ? `Hello ${user.firstName}! I'm FlowerSCM Assistant. How can I help you today with your ${user.role} needs?`
        : "Hello! I'm FlowerSCM Assistant. How can I help you today?",
      sender: "bot",
    }];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage based on user role
  useEffect(() => {
    localStorage.setItem(`chatMessages_${user?.role || 'guest'}`, JSON.stringify(messages));
  }, [messages, user]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: input,
          userId: user?._id,
          role: user?.role || 'guest'
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }

      const data = await response.json();
      
      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([{
      text: user?.role 
        ? `Hello ${user.firstName}! I'm FlowerSCM Assistant. How can I help you today with your ${user.role} needs?`
        : "Hello! I'm FlowerSCM Assistant. How can I help you today?",
      sender: "bot",
    }]);
    localStorage.removeItem(`chatMessages_${user?.role || 'guest'}`);
  };

  return (
    <div className="chatbot-page">
      <Navbar />
      <div className="chatbot-wrapper">
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-icon">
              <SmartToy fontSize="large" />
            </div>
            <div className="header-text">
              <h1>FlowerSCM Assistant</h1>
              <p>Your personal guide to flowers, orders, and services</p>
            </div>
            {user && (
              <button className="clear-chat-btn" onClick={clearChatHistory}>
                <Delete />
                <span>Clear Chat</span>
              </button>
            )}
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about flowers, orders, or services..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <Send />
            </button>
          </form>
        </div>
        
        <div className="chatbot-info">
          <div className="info-card">
            <h3>How can I help you?</h3>
            <ul>
              {user?.role === 'seller' && (
                <>
                  <li>Manage your products and inventory</li>
                  <li>Track your sales and orders</li>
                  <li>Get insights about your business</li>
                </>
              )}
              {user?.role === 'grower' && (
                <>
                  <li>Track your flower production</li>
                  <li>Manage your supply chain</li>
                  <li>Get growing tips and advice</li>
                </>
              )}
              {user?.role === 'supplier' && (
                <>
                  <li>Manage your supplies and inventory</li>
                  <li>Track your orders and deliveries</li>
                  <li>Get supplier-specific information</li>
                </>
              )}
              {!user && (
                <>
                  <li>Learn about flower varieties and care</li>
                  <li>Get information about ordering and delivery</li>
                  <li>Find out about our services and products</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Quick Tips</h3>
            <p>Be specific with your questions for better answers.</p>
            {user?.role && (
              <p>You can ask about your {user.role}-specific tasks and information.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatBot;