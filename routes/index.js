const express = require("express");
const router = express.Router();
const isLoggedin =require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");


router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index.ejs", { error: "" }); // 👈 pass a default error value
});

// router.get("/shop",isLoggedin,async function (req,res) {
//    try{ res.render("shop.ejs",{products});

// }catch (err){
//     console.error("error loading products:", err.message);
//     res.send("something went wrong");
// }
// });

router.get("/shop",isLoggedin,async function (req,res){
    let products = await productModel.find();
    res.render("shop",{products});
});

router.get("/logout",isLoggedin, function (req, res) {
   res.render("shop"); // 👈 pass a default error value
});






module.exports = router;