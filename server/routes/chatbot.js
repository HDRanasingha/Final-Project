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
    let specialFlowersContext = '';

    // Get special flower information regardless of user role
    const specialFlowers = await Flower.find({
      $or: [
        { name: { $regex: 'sunflower', $options: 'i' } },
        { name: { $regex: 'orange rose', $options: 'i' } },
        { name: { $regex: 'white flowers', $options: 'i' } },
        { name: { $regex: 'pink rose', $options: 'i' } },
        { name: { $regex: 'white rose', $options: 'i' } }
      ]
    }).select('name description price stock category careInstructions');

    if (specialFlowers.length > 0) {
      specialFlowersContext = `
        Special Flower Collection:
        ${specialFlowers.map(f => `
          - ${f.name}
            * Price: Rs. ${f.price}
            * Stock: ${f.stock}
            * Category: ${f.category}
            * Description: ${f.description || 'No description available'}
            * Care Instructions: ${f.careInstructions || 'Standard care recommended'}
        `).join('\n')}
      `;
    } else {
      specialFlowersContext = `
        Special Flower Collection:
        - Sunflowers: Bright yellow flowers that symbolize adoration, loyalty and longevity. Price range: Rs. 2300
        - Orange Roses: Symbolize enthusiasm, passion and energy. Price range: Rs. 3700
        - White Flowers: Represent purity, innocence and sympathy. Price range: Rs. 4350
        - Pink Roses: Express gratitude, grace, and joy. Price range: Rs. 3000
        -white rose:Flower price is Rs 4000
      `;
    }

    if (role === 'seller') {
      // Existing seller code
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
      // Existing grower code
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
            * Care Instructions: ${f.careInstructions || 'Not specified'}
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
      // Existing supplier code
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
      // For guests, show general information with enhanced flower details
      const [flowers, products] = await Promise.all([
        Flower.find().select('name description price category stock').limit(15),
        Product.find().select('name description price category').limit(10)
      ]);

      dataContext = `
        Available Flowers:
        ${flowers.map(f => `
          - ${f.name}
            * Price: Rs. ${f.price}
            * Category: ${f.category}
            * Stock: ${f.stock}
            * Description: ${f.description || 'No description available'}
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

    // Call the Gemini API with role-specific context and special flowers information
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
                
                ${specialFlowersContext}
                
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
                1. Available flowers and products, including special flowers like sunflowers, orange roses, white flowers, and pink roses
                2. General information about the business
                3. Basic customer service
                `}
                
                For ${role || 'guest'} users, focus on their specific needs and permissions.
                If asked about something outside their role's scope, politely explain the limitations.
                
                If asked about specific flowers like sunflowers, orange roses, white flowers, or pink roses, provide detailed information from the Special Flower Collection.
                
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