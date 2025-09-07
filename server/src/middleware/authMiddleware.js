const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Role, Permission } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

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

    // Load user with role + permissions
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          as: "role",
          include: [
            {
              model: Permission,
              as: "permissions",
              through: { attributes: [] }, // hide junction table
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // save user with role + permissions in req
    next();
  } catch (err) {
    console.error("🔥 AuthMiddleware Error:", err);
    res.status(500).json({
      message: "Server error in authentication",
      error: err.message,
    });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const roleName = req.user.role?.name?.toLowerCase();
  if (!["admin", "superadmin"].includes(roleName)) {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next();
};

module.exports = { authMiddleware, adminAuth };
