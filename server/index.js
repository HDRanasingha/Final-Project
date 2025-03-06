const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const flowerRoutes = require('./routes/flower.js');
const productRoutes = require('./routes/product.js');
const itemRoutes = require('./routes/item.js');
const orderRoutes = require('./routes/order.js');
const paymentRoutes = require('./routes/payment.js');
const userRoutes = require('./routes/user.js');
const searchRoutes = require('./routes/search.js');
const chatbotRoutes = require('./routes/chatbot.js');

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









/*MONGOOSE SETUP*/
const PORT = 3001;
mongoose
.connect(process.env.MONGO_URL, {
    dbName:"Flower_SCM",
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT,()=> console.log(`Server Port:${PORT}`));
})
.catch((err) => console.log(`${err} did not connect`));

