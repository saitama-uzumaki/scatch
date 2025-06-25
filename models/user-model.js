const mongoose = require("mongoose"); // ✅ Must be declared before using
const userSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  orders: {
    type: Array,
    default: [],
  },
  contact: Number,
  picture: String,
}, { timestamps: true }); // ✅ this line adds createdAt and updatedAt
// ✅ correct export
module.exports = mongoose.model("user", userSchema);
