const express = require('express');
// const userModel = require('../models/user-model');
const router = express.Router();
const userModel = require("../models/user-model");

router.get("/", function (req,res){
    res.send("hey its working ");
});

router.post("/register", async function (req,res){
     try{
        let {email , password , fullname } = req.body;

    let user = await userModel.create({
        email,
        password,
        fullname,
     });
     res.send(user);


     }
     catch(err){
        res.send(err.message);
     }
});



module.exports = router;