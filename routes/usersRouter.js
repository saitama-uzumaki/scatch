const express = require('express');
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedin");
const {registerUser , loginUser} = require("../controllers/authController");
const { logout } = require("../controllers/authController");

const { sendOtpLogin, verifyOtpLogin } = require("../controllers/authController");

router.get("/", function (req, res) {
  res.redirect("/login");
});

router.get("/account", isloggedin, function (req, res) {
    res.render("account", { user: req.user });
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/logout",logout);
router.post("/login", loginUser);  // 👈 This handles form POST

router.post("/otp-login", sendOtpLogin);       // Step 1
router.post("/verify-otp", verifyOtpLogin);    // Step 2

module.exports = router;
