const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const dotenv = require('dotenv').config();

async function addSupplierOrder() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, { dbName: 'Flower_SCM' });
    console.log('Connected to MongoDB');

    // Get all suppliers
    const suppliers = await User.find({ role: 'supplier' });
    console.log(`Found ${suppliers.length} suppliers`);

    if (suppliers.length === 0) {
      console.log('No suppliers found. Cannot create test order.');
      await mongoose.disconnect();
      return;
    }

    // Select a random supplier
    const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    console.log(`Selected supplier: ${randomSupplier.firstName} ${randomSupplier.lastName}`);
    console.log(`Supplier ID: ${randomSupplier._id}`);

    // Generate a random order ID
    const orderId = `ORD-SUP-${Math.floor(Math.random() * 1000000)}`;
    
    // Create a new test order
    const newOrder = new Order({
      orderId,
      items: [
        {
          name: "Supplier Special Product",
          price: 5500,
          quantity: 1,
          listerId: randomSupplier._id,
          listerRole: "supplier"
        }
      ],
      total: 5800,
      customer: {
        name: "New Supplier Test Customer",
        address: "999 Supplier Avenue, Test City",
        phone: "1112223333",
        paymentMethod: "cash",
        area: "Test Area"
      },
      status: "Processing"
    });

    // Save the new order
    await newOrder.save();
    console.log(`Added new test order for supplier: ${orderId} assigned to ${randomSupplier.firstName} ${randomSupplier.lastName}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

addSupplierOrder();
