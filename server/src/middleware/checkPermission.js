const checkPermission = (permissionName) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const role = user.role;
      if (!role || !role.permissions) {
        return res.status(403).json({ message: "Forbidden: No role or permissions found" });
      }

      // Map Sequelize Permission objects to string names
      const permissionNames = role.permissions.map(p => p.name);

      const hasPermission = permissionNames.includes(permissionName);

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      console.error("checkPermission error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };
};

module.exports = checkPermission;
