const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const dotenv = require('dotenv').config();

async function debugSupplierOrders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, { dbName: 'Flower_SCM' });
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`\n=== USERS (${users.length}) ===`);
    
    // Find suppliers
    const suppliers = users.filter(user => user.role === 'supplier');
    console.log(`Found ${suppliers.length} suppliers:`);
    suppliers.forEach((supplier, index) => {
      console.log(`Supplier ${index + 1}: ${supplier.firstName} ${supplier.lastName}`);
      console.log(`  ID: ${supplier._id} (${typeof supplier._id})`);
      console.log(`  Email: ${supplier.email}`);
    });

    // Get all orders
    const orders = await Order.find({}).sort({ createdAt: -1 });
    console.log(`\n=== ORDERS (${orders.length}) ===`);
    
    // Check each order for supplier items
    console.log("\n=== CHECKING ORDERS FOR SUPPLIER ITEMS ===");
    let supplierOrdersFound = 0;
    
    orders.forEach((order, orderIndex) => {
      let hasSupplierItems = false;
      let supplierItemsCount = 0;
      
      // Check each item in the order
      order.items.forEach((item, itemIndex) => {
        const itemListerId = item.listerId ? item.listerId.toString() : '';
        
        // Check if this item belongs to a supplier
        const matchingSupplier = suppliers.find(supplier => 
          supplier._id.toString() === itemListerId
        );
        
        if (matchingSupplier) {
          hasSupplierItems = true;
          supplierItemsCount++;
          console.log(`\nOrder ${orderIndex + 1} (${order.orderId}) has supplier item:`);
          console.log(`  Item: ${item.name}`);
          console.log(`  Price: Rs.${item.price}`);
          console.log(`  Quantity: ${item.quantity}`);
          console.log(`  ListerId: ${itemListerId}`);
          console.log(`  ListerRole: ${item.listerRole}`);
          console.log(`  Belongs to supplier: ${matchingSupplier.firstName} ${matchingSupplier.lastName}`);
        }
        
        // Also check if the item has listerRole = 'supplier'
        if (item.listerRole === 'supplier') {
          console.log(`\nOrder ${orderIndex + 1} (${order.orderId}) has item with listerRole='supplier':`);
          console.log(`  Item: ${item.name}`);
          console.log(`  Price: Rs.${item.price}`);
          console.log(`  Quantity: ${item.quantity}`);
          console.log(`  ListerId: ${itemListerId}`);
          
          // Check if this listerId matches any supplier
          const matchingSupplierById = suppliers.find(supplier => 
            supplier._id.toString() === itemListerId
          );
          
          if (matchingSupplierById) {
            console.log(`  Matches supplier: ${matchingSupplierById.firstName} ${matchingSupplierById.lastName}`);
          } else {
            console.log(`  ⚠️ NO MATCHING SUPPLIER FOUND for this listerId`);
          }
        }
      });
      
      if (hasSupplierItems) {
        supplierOrdersFound++;
        console.log(`Order ${orderIndex + 1} (${order.orderId}) has ${supplierItemsCount} supplier items out of ${order.items.length} total items`);
      }
    });
    
    console.log(`\nFound ${supplierOrdersFound} orders with supplier items out of ${orders.length} total orders`);
    
    // Create a test order for a supplier if none found
    if (supplierOrdersFound === 0 && suppliers.length > 0) {
      console.log("\n=== CREATING TEST ORDER FOR SUPPLIER ===");
      const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      
      // Generate a random order ID
      const orderId = `ORD-SUPPLIER-${Math.floor(Math.random() * 1000000)}`;
      
      // Create a new test order
      const newOrder = new Order({
        orderId,
        items: [
          {
            name: "Supplier Test Product",
            price: 4500,
            quantity: 1,
            listerId: randomSupplier._id,
            listerRole: "supplier"
          }
        ],
        total: 4800,
        customer: {
          name: "Supplier Test Customer",
          address: "789 Supplier Street, Test City",
          phone: "5556667777",
          paymentMethod: "cash",
          area: "Test Area"
        },
        status: "Processing"
      });
      
      // Save the new order
      await newOrder.save();
      console.log(`Added new test order for supplier: ${orderId} assigned to ${randomSupplier.firstName} ${randomSupplier.lastName}`);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

debugSupplierOrders();
