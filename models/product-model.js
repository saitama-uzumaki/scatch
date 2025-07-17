const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    image:Buffer,
    name:String,
    price:Number,
    discount:{
        type:Number,
        default:0,
    },
    // 🟢 REQUIRED: Add stock for availability filter
    stock: {
        type: Number,
        default: 0, // or whatever initial quantity you want
    },

    // 🟢 REQUIRED: Add 'new' flag for new product filter
    new: {
        type: Boolean,
        default: false,
    },
    category: {
   type: String,
   required: true,
    enum: ["Bags", "Electronics", "Shoes", "Clothing","Books"] // Add more as needed
    },
    bgcolor:String,
    panelcolor :String,
    textcolor:String,
});

module.exports = mongoose.model("product",productSchema);