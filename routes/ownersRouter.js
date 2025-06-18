const express = require('express');
const router = express.Router();

const ownerModel = require("../models/owner-model");

// ✅ Pass success flash message to the view
router.get("/admin", function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

router.post("/create", async function (req, res) {
    let owners = await ownerModel.find();

    if (owners.length > 0) {
        return res
            .status(403)
            .send("You don't have permission to create a new owner");
    }

    let { fullname, email, password } = req.body;

    let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
    });

    // ✅ Set flash message and redirect
    req.flash("success", "Owner created successfully!");
    res.redirect("/owners/admin");
});

module.exports = router;
