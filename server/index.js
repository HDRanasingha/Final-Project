const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const http = require('http');
// Replace ws with socket.io
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth.js');
const flowerRoutes = require('./routes/flower.js');
const productRoutes = require('./routes/product.js');
const itemRoutes = require('./routes/item.js');
const orderRoutes = require('./routes/order.js');
const paymentRoutes = require('./routes/payment.js');
const userRoutes = require('./routes/user.js');
const searchRoutes = require('./routes/search.js');
const chatbotRoutes = require('./routes/chatbot.js');
const messagesRoutes = require('./routes/messages.js');
const inventoryRoutes = require("./routes/inventory");

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/users", userRoutes);
// Add the search route
app.use('/api/search', searchRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/messages', messagesRoutes);
app.use("/api/inventory", inventoryRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust this to match your client URL
        methods: ["GET", "POST"]
    }
});

// Improved Socket.IO implementation for real-time messaging
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Listen for new messages
    socket.on('send_message', (messageData) => {
        console.log('Message received:', messageData);
        
        // Broadcast the message to ALL connected clients (including sender)
        io.emit('new_message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

/*MONGOOSE SETUP*/
const PORT = 3001;
mongoose
.connect(process.env.MONGO_URL, {
    dbName:"Flower_SCM",
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    server.listen(PORT, () => console.log(`Server Port:${PORT}`));
})
.catch((err) => console.log(`${err} did not connect`));

