const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

      req.user = user;
      next();
    } catch (err) {
      // Handle token expiration
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired. Use refresh token to get a new token.",
          expiredAt: err.expiredAt,
        });
      }
      throw err;
    }
  } catch (err) {
    console.error("AuthMiddleware Error:", err);
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

// ==================== ADMIN CHECK ====================
const adminAuth = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized: No user attached" });

    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    console.error("AdminAuth Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== PERMISSION CHECK ====================
const requirePermission = (permission) => async (req, res, next) => {
  try {
    if (
      req.user.role === "SuperAdmin" ||
      (req.user.permissions && req.user.permissions.some(p => p.permissionName === permission))
    ) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden. Insufficient permissions" });
  } catch (err) {
    console.error("RequirePermission Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// authMiddleware.js
module.exports = { authMiddleware, adminAuth, requirePermission };

