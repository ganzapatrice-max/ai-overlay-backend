require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// =====================
// Middleware
// =====================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// =====================
// Routes
// =====================
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/ai", require("./src/routes/aiRoutes"));

// =====================
// Root test route
// =====================
app.get("/", (req, res) => {
  res.send("✅ AI Overlay Backend is running and MongoDB is connected");
});

// =====================
// MongoDB Status route
// =====================
app.get("/api/status", (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  res.json({
    dbState: state,
    message: state === 1 ? "MongoDB is connected ✅" : "MongoDB not connected ❌",
  });
});

// =====================
// MongoDB Connection & Server Start
// =====================
const PORT = process.env.PORT || 5000;

async function connectDB() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "📡 Mongo URI:",
      process.env.MONGO_URI
        ? process.env.MONGO_URI.replace(/\/\/.*?:.*?@/, "//<hidden>:<hidden>@")
        : "❌ MONGO_URI not set"
    );

    // ===== Mongoose v7+ connection =====
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // optional
      socketTimeoutMS: 45000,           // optional
    });

    console.log("✅ MongoDB connected successfully");

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("⏳ Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
}

// Start MongoDB connection
connectDB();
