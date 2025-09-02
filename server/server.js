require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/models"); // Sequelize models

// Import routes
const authRoutes = require("./src/routes/auth");
const academyRoutes = require("./src/routes/academyRoutes");

// Middleware
const { authMiddleware, adminAuth } = require("./src/middleware/authMiddleware");

const app = express();

// =====================
// Global Middleware
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// =====================
// Health check
// =====================
app.get("/", (req, res) => res.send("✅ API is running..."));

// =====================
// API Routes
// =====================
app.use("/api/auth", authRoutes);

// Protected admin routes (only accessible by Admin users)
app.use("/api/academies", authMiddleware, adminAuth, academyRoutes);

// =====================
// Global error handler
// =====================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// =====================
// Start server
// =====================
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true }) // careful with alter in production
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Unable to sync database:", err);
  });
