const checkPermission = (permissionName) => {
  if (!permissionName || typeof permissionName !== "string") {
    throw new Error("checkPermission requires a valid permissionName string");
  }

  const normalizedPermission = permissionName.toLowerCase();

  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: "Unauthorized: No user found" });

      const role = user.role;
      if (!role) return res.status(403).json({ success: false, message: "Forbidden: No role assigned" });

      const permissions = Array.isArray(role.permissions)
        ? role.permissions.map(p => (p && p.toJSON ? p.toJSON() : p))
        : [];

      const hasAllAccess = permissions.some(p => p && (p.name || '').toLowerCase() === 'all_access');
      if (hasAllAccess) return next();

      const hasPermission = permissions.some(p => p && (p.name || '').toLowerCase() === normalizedPermission);
      if (!hasPermission) {
        return res.status(403).json({ success: false, message: `Forbidden: Missing required permission '${permissionName}'` });
      }

      next();
    } catch (err) {
      console.error("checkPermission error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in permission check",
        error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
      });
    }
  };
};

module.exports = checkPermission;
