const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const transporter = require("../config/email");
const crypto = require("crypto");

// ✅ Register a new user
module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, fullname } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send("You already have an account, please login.");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      password: hash,
      fullname,
    });

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/shop");
  } catch (err) {
    return res.status(500).send("Server error: " + err.message);
  }
};

// ✅ Login user (email + password)
module.exports.loginUser = async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).send("Email or password incorrect.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Email or password incorrect.");

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/shop");
  } catch (err) {
    return res.status(500).send("Server error: " + err.message);
  }
};

// ✅ Logout user
module.exports.logout = function (req, res) {
  res.clearCookie("token");
  res.redirect("/");
};

// ✅ Send OTP for login
module.exports.sendOtpLogin = async function (req, res) {
  const { email } = req.body;

  let user = await userModel.findOne({ email });

  // Auto-create user if not exist
  if (!user) {
    user = await userModel.create({ email, fullname: "New User" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 minutes
  await user.save();

  await transporter.sendMail({
    to: email,
    subject: "Your OTP for Login",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });

  res.render("auth/verifyOTP", { email }); // Make sure this view exists
};

// ✅ Verify OTP and login
module.exports.verifyOtpLogin = async function (req, res) {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });
  if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
    req.flash("error", "Invalid or expired OTP");
    return res.redirect("/login");
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const token = generateToken(user);
  res.cookie("token", token, { httpOnly: true });

  req.flash("success", "OTP verified, you're logged in.");
  res.redirect("/shop");
};
