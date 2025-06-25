const express = require('express');
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedin");
const {registerUser , loginUser} = require("../controllers/authController");
const { logout } = require("../controllers/authController");

router.get("/", function (req, res) {
  res.send("hey its working ");
});

router.get("/account", isloggedin, function (req, res) {
    res.render("account", { user: req.user });
});

router.post("/register", registerUser);

router.post("/login",loginUser);

router.get("/logout",logout);

module.exports = router;
