const express = require("express");
const router = express.Router();
const isLoggedin =require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");


router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index.ejs", { error , isLoggedin :false }); // 👈 pass a default error value
});

// router.get("/shop",isLoggedin,async function (req,res) {
//    try{ res.render("shop.ejs",{products});

// }catch (err){
//     console.error("error loading products:", err.message);
//     res.send("something went wrong");
// }
// });

router.get("/shop", isLoggedin, async function (req, res) {
    let products = await productModel.find();
    let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");
    let success = req.flash("success");

    res.render("shop", { products, success, user }); // ✅ pass user to EJS
});

// router.get("/cart",isLoggedin,async function (req,res){
//     let user = await userModel.findOne({email : req.user.email}).populate("cart.product");
//     res.render("cart",{user});
// });

// router.get("/addtocart/:id", isLoggedin, async function (req, res) {
//     let user = await userModel.findOne({ email: req.user.email });

//     // Ensure cart is always initialized
//     if (!user.cart) user.cart = [];

//     // Safe findIndex with null checks
//     let productIndex = user.cart.findIndex(item =>
//         item && item.product && item.product.toString() === req.params.id
//     );

//     if (productIndex > -1) {
//         user.cart[productIndex].quantity += 1;
//     } else {
//         user.cart.push({ product: req.params.id, quantity: 1 });
//     }

//     await user.save();
//     req.flash("success", "added to cart");
//     res.redirect("/shop");
// }); 

// ✅ Updated /addtocart route
router.get("/addtocart/:id", isLoggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    if (!user.cart) user.cart = [];

    let productIndex = user.cart.findIndex(item =>
        item && item.product && item.product.toString() === req.params.id
    );

    if (productIndex > -1) {
        user.cart[productIndex].quantity += 1;
    } else {
        user.cart.push({ product: req.params.id, quantity: 1 });
    }

    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});


// ✅ Updated /cart route with cart.product population
router.get("/cart", isLoggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");
    res.render("cart", { user });
});

// 👇 Route to subtract from cart
router.get("/removefromcart/:id", isLoggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    let productIndex = user.cart.findIndex(item => item.product.toString() === req.params.id);

    if (productIndex > -1) {
        user.cart[productIndex].quantity -= 1;

        // Remove the product completely if quantity is 0 or less
        if (user.cart[productIndex].quantity <= 0) {
            user.cart.splice(productIndex, 1);
        }

        await user.save();
    }

    req.flash("success", "Removed from cart");
    res.redirect("/shop");
});


router.get("/logout",isLoggedin, function (req, res) {
   res.render("shop"); // 👈 pass a default error value
});






module.exports = router;