const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const dotenv = require('dotenv').config();

async function testOrders() {
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

    // Print details of all orders
    console.log('\n=== ORDER DETAILS ===');
    orders.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}: ${order.orderId}`);
      console.log(`Customer: ${order.customer.name}`);
      console.log(`Status: ${order.status}`);
      console.log(`Total: Rs.${order.total}`);
      console.log(`Items (${order.items.length}):`);

      order.items.forEach((item, i) => {
        console.log(`  Item ${i + 1}: ${item.name}`);
        console.log(`    Price: Rs.${item.price}`);
        console.log(`    Quantity: ${item.quantity}`);
        console.log(`    ListerId: ${item.listerId || 'Not set'}`);

        // Check if this listerId matches any user
        const matchingUser = users.find(user =>
          user._id.toString() === (item.listerId ? item.listerId.toString() : '')
        );

        if (matchingUser) {
          console.log(`    Matches user: ${matchingUser.firstName} ${matchingUser.lastName} (${matchingUser.role})`);
        } else {
          console.log(`    No matching user found`);
        }
      });
    });

    // For each user, find orders where they are the lister
    console.log('\n=== USER ORDER MATCHES ===');
    for (const user of users) {
      console.log(`\nChecking orders for user: ${user.firstName} ${user.lastName} (${user._id}) - Role: ${user.role}`);

      // Find orders where this user is the lister
      const userOrders = orders.filter(order => {
        return order.items.some(item => {
          const itemListerId = item.listerId ? item.listerId.toString() : '';
          const userId = user._id.toString();
          return itemListerId === userId;
        });
      });

      console.log(`Found ${userOrders.length} orders for this user`);

      if (userOrders.length > 0) {
        // Print details of the first order
        const firstOrder = userOrders[0];
        console.log('Sample order details:');
        console.log(`  Order ID: ${firstOrder.orderId}`);
        console.log(`  Customer: ${firstOrder.customer.name}`);
        console.log(`  Items: ${firstOrder.items.length}`);

        // Print items that belong to this user
        const userItems = firstOrder.items.filter(item => {
          const itemListerId = item.listerId ? item.listerId.toString() : '';
          const userId = user._id.toString();
          return itemListerId === userId;
        });

        console.log(`  User's items in this order: ${userItems.length}`);
        userItems.forEach(item => {
          console.log(`    - ${item.name} (${item.quantity} x Rs.${item.price})`);
        });
      }
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

testOrders();
