require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// ROUTES
app.use("/auth", require("./src/routes/authRoutes"));
app.use("/admin", require("./src/routes/adminRoutes"));
app.use("/ai", require("./src/routes/aiRoutes"));

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("✅ AI Overlay Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
