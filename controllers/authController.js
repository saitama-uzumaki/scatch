const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken");


module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, fullname } = req.body;

    let user = await userModel.findOne({email:email})

    if(user) return res.status(401).send("you already had an account , please login ")
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return res.send(err.message);

      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);

        try {
          const user = await userModel.create({
            email,
            password: hash,
            fullname,
          });

          // ✅ Correct jwt.sign syntax
        //   const token = jwt.sign({ email: user.email, id: user._id }, "heyheyhey");
       let token =  generateToken(user);
          // ✅ Send token in cookie
          res.cookie("token", token);
          res.send("user created successfully");
        } catch (dbErr) {
          res.send(dbErr.message);
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
}