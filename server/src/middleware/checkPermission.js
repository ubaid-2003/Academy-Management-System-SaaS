const checkPermission = (permissionName) => {
  if (!permissionName || typeof permissionName !== "string") {
    throw new Error("checkPermission requires a valid permissionName string");
  }

  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }

      const role = user.role;
      if (!role) {
        return res.status(403).json({ message: "Forbidden: No role found" });
      }

      const permissionsArray = Array.isArray(role.permissions) ? role.permissions : [];

      const permissionNames = permissionsArray
        .map(p => p?.name)
        .filter(name => typeof name === "string")
        .map(name => name.toLowerCase());

      if (!permissionNames.includes(permissionName.toLowerCase())) {
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
