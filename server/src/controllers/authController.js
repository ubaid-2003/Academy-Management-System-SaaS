// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role, Permission, RolePermission, UserAcademy } = require("../models");

// ==================== REGISTER ====================
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign default role (e.g., "Student" or "User")
    const defaultRole = await Role.findOne({
      where: { name: "Admin" }, // or "User", whichever you want
    });

    if (!defaultRole) return res.status(400).json({ message: "Role not found" });

    // Create new user with default role
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      roleId: defaultRole.id,
    });

    // Optional: fetch permissions of this role
    const permissions = await defaultRole.getPermissions(); // returns Permission instances
    const permissionNames = permissions.map((p) => p.name);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: defaultRole.name,
        permissions: permissionNames, // or empty array if you don't want any
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ==================== LOGIN ====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "role",
          include: [
            {
              model: Permission,
              as: "permissions",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const userAcademies = await UserAcademy.findAll({ where: { userId: user.id } });
    const academyIds = userAcademies.map((ua) => ua.academyId);
    const activeAcademyId = academyIds[0] || null;

    const roleName = user.role?.name || null;
    const permissions = user.role?.permissions?.map((p) => p.name) || [];

    const token = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: { name: roleName, permissions }, // ✅ include all permissions
        academyIds,
        activeAcademyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: roleName,
        academyIds,
        activeAcademyId,
      },
      permissions, // ✅ this is used by frontend
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};



// ==================== LOGOUT ====================
const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
