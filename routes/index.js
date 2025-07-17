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
    let filter = req.query.filter;
    let search = req.query.search;

    let query = {};

    // Filtering logic
    if (filter === "available") {
        query.stock = { $gt: 0 };
    } else if (filter === "discount") {
        query.discount = { $gt: 0 };
    } else if (filter === "new") {
        query.tag = "new";
    }

    // Search logic
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    // Fetch all products matching search/filter
    let products = await productModel.find(query);

   let categorizedProducts = {};

// Step 1: Group products
products.forEach(product => {
    const category = product.category || "Uncategorized"; // fallback for old data
    if (!categorizedProducts[category]) {
        categorizedProducts[category] = [];
    }
    categorizedProducts[category].push(product);
});

// Step 2: Convert object to array of { category, products }
const categorizedArray = Object.entries(categorizedProducts).map(([category, items]) => ({
    category,
    products: items
}));

res.render('shop', {
    user: req.user,
    success: req.flash('success'),
    search: req.query.search,
    categorizedProducts: categorizedArray
});
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