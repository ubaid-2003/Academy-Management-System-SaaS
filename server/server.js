require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/models");

const authRoutes = require("./src/routes/auth");
const academyRoutes = require("./src/routes/academyRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const classRoutes = require("./src/routes/classRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const examRoutes = require("./src/routes/examRoutes");
const feeRoutes = require("./src/routes/feeRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");

const app = express();

// =====================
// Middleware
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
// Health Check
// =====================
app.get("/", (req, res) => res.send("✅ API is running..."));

// =====================
// API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/academies", academyRoutes);
app.use("/api", studentRoutes);
app.use("/api", teacherRoutes);
app.use("/api", classRoutes);
app.use("/api", courseRoutes);
app.use("/api", examRoutes);
app.use("/api", feeRoutes);
app.use("/api", attendanceRoutes); // <-- all attendance routes prefixed with /api

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// =====================
// Start Server
// =====================
const PORT = parseInt(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    console.log(
      process.env.NODE_ENV !== "production"
        ? "⚙️  Development mode: connecting to database..."
        : "🔒 Production mode: connecting to database..."
    );

    await sequelize.authenticate();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
