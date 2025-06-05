const express = require("express");
const app = express();
require("dotenv").config();

const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/mongoose-connection");
connectDB(); // Important!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("hey");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
