// ================= IMPORTS =================
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

// ================= APP SETUP =================
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// Serve frontend (VERY IMPORTANT)
app.use(express.static("public"));

// ================= DATABASE CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);

// 🔐 Protected Route Example
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Profile Data",
    user: req.user
  });
});

// ================= SOCKET.IO =================
let workoutCounter = 0;

io.on("connection", (socket) => {
  console.log("⚡ User Connected");

  // Send current counter value
  socket.emit("updateCounter", workoutCounter);

  // When workout button is clicked
  socket.on("workout", () => {
    workoutCounter++;
    io.emit("updateCounter", workoutCounter);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected");
  });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});