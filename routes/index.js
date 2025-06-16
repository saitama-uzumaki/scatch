const express = require("express");
const router = express.Router();
const isLoggedin =require("../middlewares/isLoggedin");



router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index.ejs", { error: "" }); // 👈 pass a default error value
});

router.get("/shop",isLoggedin,function (req,res) {
   try{ res.render("shop.ejs",{products});

}catch (err){
    console.error("error loading products:", err.message);
    res.send("something went wrong");
}
});


module.exports = router;