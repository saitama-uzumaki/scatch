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

module.exports = router;
