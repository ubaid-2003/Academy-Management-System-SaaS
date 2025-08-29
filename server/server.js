require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { sequelize, User } = require("./src/models"); // Sequelize models

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
    origin: process.env.CLIENT_URL || "http://localhost:3000", // configurable frontend URL
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

// Protected admin routes
app.use("/api/academies", authMiddleware, adminAuth, academyRoutes);
app.use("/api/students", authMiddleware, adminAuth, studentRoutes);
app.use("/api/teachers", authMiddleware, adminAuth, teacherRoutes);

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
// Create SuperAdmin if not exists
// =====================
const createSuperAdmin = async () => {
  try {
    const adminEmail = process.env.SUPERADMIN_EMAIL || "ubaidaltaf070@gmail.com";
    const adminPassword = process.env.SUPERADMIN_PASSWORD || "Ubaid2003";

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const superAdmin = await User.create({
        fullName: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SuperAdmin",
      });
      console.log(`✅ SuperAdmin created: ${superAdmin.email}`);
    } else {
      console.log(`ℹ️ SuperAdmin already exists: ${adminEmail}`);
    }
  } catch (err) {
    console.error("❌ Error creating SuperAdmin:", err);
  }
};

// =====================
// Start server
// =====================
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true }) // careful with alter in production
  .then(async () => {
    console.log("✅ Database synced successfully");
    await createSuperAdmin(); // Ensure SuperAdmin exists
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Unable to sync database:", err);
  });
