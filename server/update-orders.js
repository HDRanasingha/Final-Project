const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const dotenv = require('dotenv').config();

async function updateOrders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, { dbName: 'Flower_SCM' });
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Get all orders
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders`);

    // Find users by role
    const growers = users.filter(user => user.role === 'grower');
    const sellers = users.filter(user => user.role === 'seller');
    const suppliers = users.filter(user => user.role === 'supplier');

    console.log(`Found ${growers.length} growers, ${sellers.length} sellers, ${suppliers.length} suppliers`);

    // Update orders with valid listerIds
    let updatedCount = 0;
    for (const order of orders) {
      let updated = false;
      
      // Update each item in the order
      for (const item of order.items) {
        // Assign a random user based on item name pattern
        let newListerId;
        let listerRole;
        
        if (item.name.toLowerCase().includes('rose') || item.name.toLowerCase().includes('flower')) {
          // Assign to a grower
          if (growers.length > 0) {
            const randomGrowerIndex = Math.floor(Math.random() * growers.length);
            newListerId = growers[randomGrowerIndex]._id;
            listerRole = 'grower';
          }
        } else if (item.name.toLowerCase().includes('bouquet') || item.name.toLowerCase().includes('arrangement')) {
          // Assign to a seller
          if (sellers.length > 0) {
            const randomSellerIndex = Math.floor(Math.random() * sellers.length);
            newListerId = sellers[randomSellerIndex]._id;
            listerRole = 'seller';
          }
        } else {
          // Assign to a supplier
          if (suppliers.length > 0) {
            const randomSupplierIndex = Math.floor(Math.random() * suppliers.length);
            newListerId = suppliers[randomSupplierIndex]._id;
            listerRole = 'supplier';
          }
        }
        
        // If no specific match, assign to any user
        if (!newListerId) {
          const randomUserIndex = Math.floor(Math.random() * users.length);
          newListerId = users[randomUserIndex]._id;
          listerRole = users[randomUserIndex].role;
        }
        
        // Update the item
        item.listerId = newListerId;
        item.listerRole = listerRole;
        updated = true;
      }
      
      if (updated) {
        await order.save();
        updatedCount++;
        console.log(`Updated order ${order.orderId}`);
      }
    }

    console.log(`Updated ${updatedCount} orders`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateOrders();
