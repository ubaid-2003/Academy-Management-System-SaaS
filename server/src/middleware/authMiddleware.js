const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Role, Permission } = require("../models");

// ========================== AUTH MIDDLEWARE ==========================
// ========================== AUTH MIDDLEWARE ==========================
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === "TokenExpiredError"
          ? "Token expired. Please login again."
          : "Invalid token",
        error: err.message,
      });
    }

    // Fetch user with role and permissions
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
              through: { attributes: [] },
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found"
      });
    }

    // Remove the status check completely

    // Ensure role exists
    if (!user.role) {
      user.role = { name: "unknown", permissions: [] };
    }

    // Ensure permissions array
    if (!Array.isArray(user.role.permissions)) {
      user.role.permissions = [];
    }

    // Normalize permission names
    user.role.permissions = user.role.permissions.map(p => ({
      ...p.toJSON ? p.toJSON() : p,
      name: (p.name || "").toLowerCase()
    }));

    req.user = user;
    next();

  } catch (err) {
    console.error("🔥 AuthMiddleware Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};


// ========================== ADMIN ONLY MIDDLEWARE ==========================
const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const roleName = req.user.role?.name?.toLowerCase();
  if (!["admin", "superadmin"].includes(roleName)) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admins only"
    });
  }

  next();
};

// ========================== ROLE CHECK MIDDLEWARE ==========================
const checkRole = (allowedRoles = []) => {
  if (!Array.isArray(allowedRoles)) {
    throw new Error("checkRole requires an array of allowed roles");
  }

  const normalizedRoles = allowedRoles.map(role => role.toLowerCase());

  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No user found"
        });
      }

      const userRole = user.role?.name?.toLowerCase();

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: No role assigned"
        });
      }

      // Check if user has one of the allowed roles
      const hasAllowedRole = normalizedRoles.includes(userRole);

      if (!hasAllowedRole) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: Required role not granted. Allowed roles: ${allowedRoles.join(', ')}`,
        });
      }

      next();
    } catch (err) {
      console.error("checkRole error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in role check",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  };
};

module.exports = {
  authMiddleware,
  checkRole,
  adminAuth
};