// routes/authRoutes.js
const router = require("express").Router();
const { register, login, logout } = require("../controllers/authController");
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/checkPermission");

// Public login
router.post("/login", login);

// Admin-only register: automatically updates Role ↔ Permission junction
router.post(
  "/register",
  register
);

// Protected logout
router.post("/logout", authMiddleware, logout);

module.exports = router;
