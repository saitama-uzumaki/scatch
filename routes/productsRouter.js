const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.get("/", function (req,res){
    res.send("hey its working ");
});

router.post("/create",upload.single("image"),async function (req,res){

   let { name,price, category,discount, bgcolor, panelcolor , textcolor} = req.body;

   try {let product = await productModel.create({
        image : req.file.buffer,
        name,
        price,
        category,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
    });
    
 req.flash("success", "Product created successfully"); 
 res.redirect("/owners/admin");
}
    catch(err){
        res.send(err.message);
    }
    
});

module.exports = router;