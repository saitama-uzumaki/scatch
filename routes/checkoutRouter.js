const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const userModel = require("../models/user-model");
const orderModel = require("../models/order-model");

// Step 1: Show checkout form
router.get("/", isLoggedin, (req, res) => {
  res.render("checkout"); // 👈 create views/checkout.ejs
});

// Step 2: Handle checkout form submission and go to confirm page
router.post("/", isLoggedin, async (req, res) => {
  const { fullname, mobile, line1, city, pincode, state } = req.body;

    // 🔴 ADD THIS VALIDATION HERE:
  if (!fullname || !mobile || !line1 || !city || !pincode || !state) {
    req.flash("error", "Please fill out all address fields");
    return res.redirect("/checkout");
  }

  // ✅ Store this in session (temporary)
  req.session.address = { fullname, mobile, line1, city, pincode, state };

  res.redirect("/checkout/confirm-order");
});

// Step 3: Show confirm-order page
router.get("/confirm-order", isLoggedin, async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("cart.product");
  const address = req.session.address;

  let total = 0;
  user.cart.forEach(item => {
    total += item.product.price * item.quantity;
  });

  res.render("confirm-order", { user, address, total }); // 👈 views/confirm-order.ejs
});

// Step 4: Show payment method selection
router.get("/payment", isLoggedin, (req, res) => {
  res.render("payment"); // 👈 create views/payment.ejs
});

// Step 5: Finalize order
router.post("/payment", isLoggedin, async (req, res) => {
  const paymentMethod = req.body.paymentMethod;
  const address = req.session.address;

  const user = await userModel.findById(req.user._id).populate("cart.product");

  let total = 0;
  const items = user.cart.map(item => {
    total += item.product.price * item.quantity;
    return {
      product: item.product._id,
      quantity: item.quantity
    };
  });

  // ✅ Save order to DB
  await orderModel.create({
    user: req.user._id,
    items,
    address,
    paymentMethod,
    totalAmount: total
  });

  // ✅ Clear user cart after order
  user.cart = [];
  await user.save();

  // ✅ Clean up session
  delete req.session.address;

  res.redirect("/checkout/order-success");
});

// Step 6: Order success page
router.get("/order-success", isLoggedin, (req, res) => {
  res.render("order-success"); // 👈 create views/order-success.ejs
});

module.exports = router;
