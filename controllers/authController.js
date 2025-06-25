const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

// Register a new user
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

// Login user
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

// Logout user
module.exports.logout = function (req, res) {
  res.clearCookie("token");
  res.redirect("/");
};
