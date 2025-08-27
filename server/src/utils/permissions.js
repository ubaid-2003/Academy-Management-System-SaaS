module.exports.getPermissionsForRole = (role) => {
  switch (role) {
    case 'super_admin': return ['all_permissions'];
    case 'academy_admin': return ['manage_academy', 'manage_users', 'view_reports'];
    case 'teacher': return ['manage_students', 'view_courses'];
    case 'student': return ['view_courses'];
    default: return [];
  }
};
