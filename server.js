const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const authRoute = require("./src/routes/authRoutes");

const {
  autheticateUser,
  authorizedAdmin,
} = require("./src/middlewares/authMiddleware");

const ticketRoutes = require("./src/routes/ticketRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const replyRoutes = require("./src/routes/replyRoutes");

dotenv.config();

// routes

const app = express();

// Middleware

app.use(cors());
app.use(express.json());

// Routes

app.use("/api/auth", authRoute);

// 📌 =============== Protected Test Route for All Authenticated Users =====================

app.get("/api/protected", autheticateUser, (req, res) => {
  res.json({
    message: "Welcome to protected route, authenticated user",
    user: req.user,
    // success: true,
  });
});

//============ 📌 Admin-Only Route ===========================

app.get("/api/admin", autheticateUser, authorizedAdmin, (req, res) => {
  res.json({
    message: "Welcome to admin route, authenticated admin",
    // user: req.user,
    // success: true,
  });
});

app.use("/api/tickets", autheticateUser, ticketRoutes, replyRoutes);

app.use("/api/admin", authorizedAdmin, adminRoutes);

// ======== get all tickets =================




// reply routes

// app.use("/api/tickets", replyRoutes);

// testing routes

app.get("/", (req, res) => {
  res.send("Welcome to Complaint Management Service");
});

// Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
