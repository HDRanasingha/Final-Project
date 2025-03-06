const express = require('express');
const router = express.Router();
const axios = require('axios');

// This is where you'll securely use your API key
// IMPORTANT: In production, store this in environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Updated API URL to use the correct endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

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
                Answer questions about flowers, flower care, ordering, delivery, and related topics.
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