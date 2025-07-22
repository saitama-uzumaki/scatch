const express = require("express");
const app = express();
require("dotenv").config();

const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

// Routers
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");
const accountRouter = require("./routes/accountRouter"); // ✅ Add this
const checkoutRouter = require("./routes/checkoutRouter");
// MongoDB Connection
const connectDB = require("./config/mongoose-connection");
connectDB(); // Connect to database

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // Log session secret to confirm it's being loaded
// console.log("SESSION SECRET:", process.env.EXPRESS_SESSION_SECRET);

// Session and flash
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.EXPRESS_SESSION_SECRET,
}));

app.use(flash());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");

// Routes (must come after session and flash middlewares)
app.use("/account", accountRouter); // ✅ Mount the route
app.use("/owners", ownersRouter);
app.use("/", usersRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter); // Root route should be last
app.use("/checkout", checkoutRouter);

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
