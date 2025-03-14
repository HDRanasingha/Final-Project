import React, { useState, useRef, useEffect } from "react";
import { Send, SmartToy } from "@mui/icons-material";
import "../styles/ChatBot.scss";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm FlowerSCM Assistant. How can I help you today with your flower supply chain needs?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      // Make API call to your backend which will handle the Gemini API
      const response = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
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
              <li>Learn about flower varieties and care</li>
              <li>Get information about ordering and delivery</li>
              <li>Find out about our services and products</li>
              <li>Get assistance with your account</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Quick Tips</h3>
            <p>Be specific with your questions for better answers.</p>
            <p>You can ask about seasonal flowers, care instructions, or order status.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatBot;