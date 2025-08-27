const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, UserAcademy, UserPermission } = require("../models");
const { getPermissionsForRole } = require("../utils/permissions");

// REGISTER (creates an Admin by default)
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const role = "Admin"; // ✅ Default role

    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      isSuperAdmin: false, // Normal admins are not superadmin
    });

    // Assign default permissions based on role
    const permissions = getPermissionsForRole(role);
    const permRecords = permissions.map((p) => ({
      userId: user.id,
      academyId: null, // Admin may not be linked yet
      permissionName: p,
    }));

    await UserPermission.bulkCreate(permRecords);

    res.status(201).json({ message: "User registered successfully", user, permissions });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const userAcademies = await UserAcademy.findAll({
      where: { userId: user.id },
      attributes: ["academyId"],
    });
    const academyIds = userAcademies.map((ua) => ua.academyId);

    let permissions = [];
    if (user.role === "SuperAdmin") {
      permissions = ["all_permissions"];
    } else {
      const userPerms = await UserPermission.findAll({
        where: { userId: user.id },
        attributes: ["permissionName"],
      });
      permissions = userPerms.map((p) => p.permissionName);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        academyIds,
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
        role: user.role,
        academyIds,
      },
      permissions,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
