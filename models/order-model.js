const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
      },
      quantity: Number
    }
  ],
  address: {
    fullname: String,
    mobile: String,
    line1: String,
    city: String,
    pincode: String,
    state: String
  },
  paymentMethod: String,
  totalAmount: Number,
  status: {
    type: String,
    default: "Processing"
  }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
