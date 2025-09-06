require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/models"); // Sequelize models

// Import routes
const authRoutes = require("./src/routes/auth");
const academyRoutes = require("./src/routes/academyRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");

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
app.use("/api/academies", authMiddleware, adminAuth, academyRoutes);
app.use("/api", authMiddleware, adminAuth, studentRoutes);
app.use("/api", authMiddleware, adminAuth, teacherRoutes);

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

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("⚙️  Development mode: syncing database using migrations...");

      // DON'T use alter: true
      // Use migrations instead: run `npx sequelize-cli db:migrate`
      await sequelize.authenticate();
      console.log("✅ Database connected (development)");
    } else {
      console.log("🔒 Production mode: connecting to database...");
      await sequelize.authenticate();
      console.log("✅ Database connected (production)");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};


startServer();
