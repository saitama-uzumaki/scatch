// routes/accountRouter.js
const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin"); // ✅ your login check middleware
const userModel = require("../models/user-model");

router.get("/", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(res.locals.user._id);
    res.render("account", { user });
  } catch (err) {
    res.send("Error loading account" + err.message);
  }
});


const orderModel = require("../models/order-model");

router.get("/orders", isLoggedin, async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 }); // Most recent first

    res.render("order-history", { orders });
  } catch (err) {
    res.status(500).send("Error loading orders: " + err.message);
  }
});

module.exports = router;
