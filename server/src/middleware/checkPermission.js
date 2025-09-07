const checkPermission = (permissionName) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }

      const role = user.role;
      if (!role || !role.permissions) {
        return res.status(403).json({ message: "Forbidden: No role or permissions found" });
      }

      // Normalize permission names for case-insensitive comparison
      const permissionNames = role.permissions.map((p) => p.name.toLowerCase());
      const hasPermission = permissionNames.includes(permissionName.toLowerCase());

      if (!hasPermission) {
        return res.status(403).json({
          message: `Forbidden: Missing required permission '${permissionName}'`,
        });
      }

      next();
    } catch (err) {
      console.error("checkPermission error:", err);
      return res.status(500).json({
        message: "Server error in permission check",
        error: err.message,
      });
    }
  };
};

module.exports = checkPermission;
