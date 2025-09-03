const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message:
          err.name === "TokenExpiredError"
            ? "Token expired. Please login again."
            : "Invalid token",
        error: err.message,
      });
    }

    // Find user in DB
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // don’t expose password
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // attach user object to request
    next();
  } catch (err) {
    console.error("🔥 AuthMiddleware Error:", err);
    return res.status(500).json({
      message: "Server error in authentication",
      error: err.message,
    });
  }
};

// ==================== ADMIN CHECK ====================
const adminAuth = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User missing in request" });
    }

    const role = (req.user.role || "").toLowerCase();
    if (!["admin", "superadmin"].includes(role)) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    console.error("🔥 AdminAuth Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { authMiddleware, adminAuth };
