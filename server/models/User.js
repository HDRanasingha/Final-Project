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
    role: {
      type: String,
      enum: ['admin', 'user', 'supplier', 'grower', 'seller'],
      default: 'user', // Default role is 'user'
    },
    
    growers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grower",
      },
    ],
    suppliers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
      },
    ],
    sellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
