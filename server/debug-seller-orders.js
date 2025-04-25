const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const dotenv = require('dotenv').config();

async function debugSellerOrders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, { dbName: 'Flower_SCM' });
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`\n=== USERS (${users.length}) ===`);
    
    // Find sellers
    const sellers = users.filter(user => user.role === 'seller');
    console.log(`Found ${sellers.length} sellers:`);
    sellers.forEach((seller, index) => {
      console.log(`Seller ${index + 1}: ${seller.firstName} ${seller.lastName}`);
      console.log(`  ID: ${seller._id} (${typeof seller._id})`);
      console.log(`  Email: ${seller.email}`);
    });

    // Get all orders
    const orders = await Order.find({}).sort({ createdAt: -1 });
    console.log(`\n=== ORDERS (${orders.length}) ===`);
    
    // Check each order for seller items
    console.log("\n=== CHECKING ORDERS FOR SELLER ITEMS ===");
    let sellerOrdersFound = 0;
    
    orders.forEach((order, orderIndex) => {
      let hasSellerItems = false;
      let sellerItemsCount = 0;
      
      // Check each item in the order
      order.items.forEach((item, itemIndex) => {
        const itemListerId = item.listerId ? item.listerId.toString() : '';
        
        // Check if this item belongs to a seller
        const matchingSeller = sellers.find(seller => 
          seller._id.toString() === itemListerId
        );
        
        if (matchingSeller) {
          hasSellerItems = true;
          sellerItemsCount++;
          console.log(`\nOrder ${orderIndex + 1} (${order.orderId}) has seller item:`);
          console.log(`  Item: ${item.name}`);
          console.log(`  Price: Rs.${item.price}`);
          console.log(`  Quantity: ${item.quantity}`);
          console.log(`  ListerId: ${itemListerId}`);
          console.log(`  ListerRole: ${item.listerRole}`);
          console.log(`  Belongs to seller: ${matchingSeller.firstName} ${matchingSeller.lastName}`);
        }
      });
      
      if (hasSellerItems) {
        sellerOrdersFound++;
        console.log(`Order ${orderIndex + 1} (${order.orderId}) has ${sellerItemsCount} seller items out of ${order.items.length} total items`);
      }
    });
    
    console.log(`\nFound ${sellerOrdersFound} orders with seller items out of ${orders.length} total orders`);
    
    // Create a test order for a seller if none found
    if (sellerOrdersFound === 0 && sellers.length > 0) {
      console.log("\n=== CREATING TEST ORDER FOR SELLER ===");
      const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
      
      // Generate a random order ID
      const orderId = `ORD-SELLER-${Math.floor(Math.random() * 1000000)}`;
      
      // Create a new test order
      const newOrder = new Order({
        orderId,
        items: [
          {
            name: "Seller Test Bouquet",
            price: 3500,
            quantity: 1,
            listerId: randomSeller._id,
            listerRole: "seller"
          }
        ],
        total: 3800,
        customer: {
          name: "Seller Test Customer",
          address: "456 Seller Street, Test City",
          phone: "9876543210",
          paymentMethod: "cash",
          area: "Test Area"
        },
        status: "Processing"
      });
      
      // Save the new order
      await newOrder.save();
      console.log(`Added new test order for seller: ${orderId} assigned to ${randomSeller.firstName} ${randomSeller.lastName}`);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

debugSellerOrders();
