// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user-model");

// module.exports = async function (req,res,next){
//     if(!req.cookies.token){
//         req.flash("error", "you need to login first");
//         return res.redirect("/");

//     }

//     try{
//         let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
//         let user = await userModel.findOne({email:decoded.email}).select("-password");
//         req.user = user;
//         next();
//     }
//     catch(err){
//         req.flash("error","something went wrong");
//         res.redirect("/");
//     }

// };
    
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "You need to login first");
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY); // ✅ Uses JWT_KEY from .env

    const user = await userModel.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    req.user = user;             // For internal route use
    res.locals.user = user;      // ✅ For EJS templates like /account

    next();
  } catch (err) {
    console.error("isLoggedin error:", err.message);
    req.flash("error", "Session expired or invalid. Please login again.");
    return res.redirect("/");
  }
};
