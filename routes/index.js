const express = require("express");
const router = express.Router();


router.get("/", function (req, res) {
    res.render("index.ejs", { error: "" }); // 👈 pass a default error value
});


module.exports = router;