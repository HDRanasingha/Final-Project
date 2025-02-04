const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImagePath: {
      type: String,
      default: "",
    },
    customers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer", // Assuming a Customer model exists
      },
    ],
    growers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grower", // Assuming a Grower model exists
      },
    ],
    suppliers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier", // Assuming a Supplier model exists
      },
    ],
    sellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller", // Assuming a Seller model exists
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
