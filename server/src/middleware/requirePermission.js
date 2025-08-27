module.exports.requirePermission = (permission) => async (req, res, next) => {
  if (req.user.isSuperAdmin || (req.user.permissions && req.user.permissions.some(p => p.permissionName === permission))) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden. Insufficient permissions' });
};
