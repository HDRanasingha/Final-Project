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
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch all relevant data from the database
    const [flowers, products, items, user, userOrders] = await Promise.all([
      Flower.find().select('name description price stock category careInstructions').limit(10),
      Product.find().select('name description price stock category ingredients').limit(10),
      Item.find().select('name description price stock category supplier').limit(10),
      userId ? User.findById(userId).select('firstName lastName email role') : null,
      userId ? Order.find({ userId }).select('items status totalAmount createdAt').sort({ createdAt: -1 }).limit(5) : []
    ]);

    // Create user context if user is logged in
    const userContext = user ? `
      Current User Information:
      - Name: ${user.firstName} ${user.lastName}
      - Role: ${user.role}
      - Email: ${user.email}
      
      Recent Orders:
      ${userOrders.map(order => `
        Order #${order._id}
        - Status: ${order.status}
        - Total: Rs. ${order.totalAmount}
        - Date: ${new Date(order.createdAt).toLocaleDateString()}
      `).join('\n')}
    ` : '';

    // Create detailed product context
    const projectContext = `
      This is FlowerSCM, a flower supply chain management system. Here's the current data:
      
      Available Flowers:
      ${flowers.map(f => `
        - ${f.name}
          * Price: Rs. ${f.price}
          * Stock: ${f.stock}
          * Category: ${f.category}
          * Care Instructions: ${f.careInstructions}
      `).join('\n')}
      
      Available Products:
      ${products.map(p => `
        - ${p.name}
          * Price: Rs. ${p.price}
          * Stock: ${p.stock}
          * Category: ${p.category}
          * Ingredients: ${p.ingredients}
      `).join('\n')}
      
      Available Supply Items:
      ${items.map(i => `
        - ${i.name}
          * Price: Rs. ${i.price}
          * Stock: ${i.stock}
          * Category: ${i.category}
          * Supplier: ${i.supplier}
      `).join('\n')}
    `;

    console.log('Sending request to Gemini API with message:', message);

    // Call the Gemini API with updated request format
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful assistant for a flower supply chain management system called FlowerSCM. 
                Here is the current project data:
                ${projectContext}
                
                ${userContext}
                
                Use this information to answer questions about:
                1. Inventory and stock levels
                2. Product details and prices
                3. Order status and history (if user is logged in)
                4. Care instructions for flowers
                5. Product ingredients and details
                6. Supplier information
                
                For logged-in users, you can:
                - Check their order history
                - Provide personalized recommendations
                - Help with order tracking
                
                If asked about specific items, check the provided data and give accurate information.
                For questions about flowers, flower care, ordering, or delivery, provide helpful information.
                If asked about something unrelated to flowers or the business, politely redirect to flower-related topics.
                
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

    console.log('Received response from Gemini API');
    
    // Extract the response text
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