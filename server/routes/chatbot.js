const express = require('express');
const router = express.Router();
const axios = require('axios');
const Flower = require('../models/Flower');
const Product = require('../models/Product');
const Item = require('../models/Item');
const Order = require('../models/Order');
const User = require('../models/User');

// This is where you'll securely use your API key
// IMPORTANT: In production, store this in environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Updated API URL to use the correct endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

router.post('/', async (req, res) => {
  try {
    const { message, userId, role } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch data based on user role
    let dataContext = '';
    let userContext = '';

    if (role === 'seller') {
      const [products, orders] = await Promise.all([
        Product.find({ sellerId: userId }).select('name description price stock category'),
        Order.find({ sellerId: userId }).select('items status totalAmount createdAt').sort({ createdAt: -1 }).limit(5)
      ]);

      dataContext = `
        Your Products:
        ${products.map(p => `
          - ${p.name}
            * Price: Rs. ${p.price}
            * Stock: ${p.stock}
            * Category: ${p.category}
        `).join('\n')}
        
        Recent Orders:
        ${orders.map(order => `
          Order #${order._id}
          - Status: ${order.status}
          - Total: Rs. ${order.totalAmount}
          - Date: ${new Date(order.createdAt).toLocaleDateString()}
        `).join('\n')}
      `;
    } else if (role === 'grower') {
      const [flowers, orders] = await Promise.all([
        Flower.find({ growerId: userId }).select('name description price stock category careInstructions'),
        Order.find({ growerId: userId }).select('items status totalAmount createdAt').sort({ createdAt: -1 }).limit(5)
      ]);

      dataContext = `
        Your Flowers:
        ${flowers.map(f => `
          - ${f.name}
            * Price: Rs. ${f.price}
            * Stock: ${f.stock}
            * Category: ${f.category}
            * Care Instructions: ${f.careInstructions}
        `).join('\n')}
        
        Recent Orders:
        ${orders.map(order => `
          Order #${order._id}
          - Status: ${order.status}
          - Total: Rs. ${order.totalAmount}
          - Date: ${new Date(order.createdAt).toLocaleDateString()}
        `).join('\n')}
      `;
    } else if (role === 'supplier') {
      const [items, orders] = await Promise.all([
        Item.find({ supplierId: userId }).select('name description price stock category'),
        Order.find({ supplierId: userId }).select('items status totalAmount createdAt').sort({ createdAt: -1 }).limit(5)
      ]);

      dataContext = `
        Your Supply Items:
        ${items.map(i => `
          - ${i.name}
            * Price: Rs. ${i.price}
            * Stock: ${i.stock}
            * Category: ${i.category}
        `).join('\n')}
        
        Recent Orders:
        ${orders.map(order => `
          Order #${order._id}
          - Status: ${order.status}
          - Total: Rs. ${order.totalAmount}
          - Date: ${new Date(order.createdAt).toLocaleDateString()}
        `).join('\n')}
      `;
    } else {
      // For guests, show general information
      const [flowers, products] = await Promise.all([
        Flower.find().select('name description price category').limit(10),
        Product.find().select('name description price category').limit(10)
      ]);

      dataContext = `
        Available Flowers:
        ${flowers.map(f => `
          - ${f.name}
            * Price: Rs. ${f.price}
            * Category: ${f.category}
        `).join('\n')}
        
        Available Products:
        ${products.map(p => `
          - ${p.name}
            * Price: Rs. ${p.price}
            * Category: ${p.category}
        `).join('\n')}
      `;
    }

    // Create user context if user is logged in
    if (userId) {
      const user = await User.findById(userId).select('firstName lastName email role');
      userContext = `
        Current User Information:
        - Name: ${user.firstName} ${user.lastName}
        - Role: ${user.role}
        - Email: ${user.email}
      `;
    }

    // Call the Gemini API with role-specific context
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful assistant for a flower supply chain management system called FlowerSCM. 
                The user is a ${role || 'guest'} user.
                
                ${userContext}
                
                Here is the relevant data for this user:
                ${dataContext}
                
                Use this information to answer questions about:
                ${role === 'seller' ? `
                1. Product management and inventory
                2. Sales tracking and analytics
                3. Order processing and status
                ` : role === 'grower' ? `
                1. Flower production and care
                2. Supply chain management
                3. Order fulfillment
                ` : role === 'supplier' ? `
                1. Supply item management
                2. Order tracking and delivery
                3. Inventory control
                ` : `
                1. Available flowers and products
                2. General information about the business
                3. Basic customer service
                `}
                
                For ${role || 'guest'} users, focus on their specific needs and permissions.
                If asked about something outside their role's scope, politely explain the limitations.
                
                Current query: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }
    );

    const botResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error with Gemini API:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message 
    });
  }
});

module.exports = router;