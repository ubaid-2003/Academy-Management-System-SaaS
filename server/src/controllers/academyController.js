const { Academy, User, UserAcademy, UserPermission, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
// controllers/academyController.js
const createAcademy = async (req, res) => {
  console.log("=== CREATE ACADEMY REQUEST ===");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    const role = req.user?.role?.toLowerCase();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: You must be logged in" });
    }

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only Admins can create academies" });
    }

    const {
      name,
      registrationNumber,
      address = null,
      city = null,
      province = null,
      country = "Pakistan",
      email = null,
      phone = null,
      principalName,
      totalStudents,
      status,
      facilities = null,
      notes = null,
    } = req.body;

    // Required fields validation
    if (!name || !registrationNumber || !status || !principalName) {
      return res.status(400).json({
        message: "name, registrationNumber, status, and principalName are required",
      });
    }

    if (totalStudents === undefined || totalStudents < 0) {
      return res
        .status(400)
        .json({ message: "totalStudents is required and must be >= 0" });
    }

    const validStatuses = ["Active", "Inactive", "Pending"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid status. Must be one of ${validStatuses.join(", ")}` });
    }

    // Create academy
    const academy = await Academy.create(
      {
        name: name.trim(),
        registrationNumber: registrationNumber.trim(),
        address: address ? address.trim() : null,
        city: city ? city.trim() : null,
        province: province ? province.trim() : null,
        country: country ? country.trim() : "Pakistan",
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        principalName: principalName.trim(),
        totalStudents,
        status,
        facilities: facilities ? facilities.trim() : null,
        notes: notes ? notes.trim() : null,
      },
      { transaction: t }
    );

    // Link academy to admin user
    const user = await User.findByPk(userId);
    await user.addAcademy(academy, { through: { role: "Admin" }, transaction: t });

    await t.commit();
    return res.status(201).json({ message: "Academy created successfully", academy });
  } catch (err) {
    await t.rollback();
    console.error("CreateAcademy error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Registration Number or Email already exists" });
    }
    return res.status(500).json({
      message: "Server error creating academy",
      error: err.message || err,
    });
  }
};

// ==================== GET USER'S ACADEMIES ====================
const getUserAcademies = async (req, res) => {
  console.log("=== GET USER'S ACADEMIES ===");
  console.log("User:", req.user);

  try {
    const userId = req.user.id;

    const academies = await Academy.findAll({
      include: [
        {
          model: UserAcademy,
          as: "userAcademies",
          where: { userId },
          attributes: ["role"],
          required: true,
        },
      ],
    });

    if (!academies.length) {
      console.log("No academies found for user");
      return res.status(200).json({ message: "No academy created yet." });
    }

    const mapped = academies.map((academy) => ({
      id: academy.id,
      name: academy.name,
      status: academy.status,
      role: academy.userAcademies[0].role,
    }));

    console.log("User academies:", mapped);
    res.json(mapped);
  } catch (error) {
    console.error("GetUserAcademies error:", error);
    res.status(500).json({
      error: error.message,
      message: "Server error fetching user academies",
    });
  }
};

// ==================== GET SINGLE ACADEMY ====================
const getAcademyById = async (req, res) => {
  console.log("=== GET SINGLE ACADEMY ===");
  console.log("User:", req.user);
  console.log("Params:", req.params);

  try {
    const { id } = req.params;
    const academy = await Academy.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "fullName", "email"],
          through: { attributes: ["role"] },
        },
      ],
    });

    if (!academy) {
      console.log("Academy not found with id:", id);
      return res.status(404).json({ message: "Academy not found" });
    }

    console.log("Academy fetched:", academy);
    res.json(academy);
  } catch (err) {
    console.error("GetAcademyById error:", err);
    res.status(500).json({ message: "Server error fetching academy", error: err.message });
  }
};

// ==================== UPDATE ACADEMY ====================
const updateAcademy = async (req, res) => {
  console.log("=== UPDATE ACADEMY ===");
  console.log("User:", req.user);
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  try {
    const { id } = req.params;
    const updates = req.body;

    const academy = await Academy.findByPk(id);
    if (!academy) {
      console.log("Academy not found for update");
      return res.status(404).json({ message: "Academy not found" });
    }

    if (updates.status) {
      const validStatuses = ["Active", "Inactive", "Pending"];
      if (!validStatuses.includes(updates.status)) {
        console.log("Invalid status update:", updates.status);
        return res.status(400).json({
          message: `Invalid status. Must be one of ${validStatuses.join(", ")}`,
        });
      }
    }

    await academy.update(updates);
    console.log("Academy updated successfully:", academy);
    res.json({ message: "Academy updated successfully", academy });
  } catch (err) {
    console.error("UpdateAcademy error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email or Registration Number already exists" });
    }
    res.status(500).json({ message: "Server error updating academy", error: err.message });
  }
};

// ==================== DELETE ACADEMY ====================
const deleteAcademy = async (req, res) => {
  console.log("=== DELETE ACADEMY ===");
  console.log("User:", req.user);
  console.log("Params:", req.params);

  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const academy = await Academy.findByPk(id);
    if (!academy) {
      console.log("Academy not found for delete");
      return res.status(404).json({ message: "Academy not found" });
    }

    await academy.setUsers([], { transaction: t });
    await academy.destroy({ transaction: t });

    await t.commit();
    console.log("Academy deleted successfully:", id);
    res.json({ message: "Academy deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error("DeleteAcademy error:", err);
    res.status(500).json({ message: "Server error deleting academy", error: err.message });
  }
};

// ==================== REFRESH TOKEN ====================
const refreshToken = (req, res) => {
  console.log("=== REFRESH TOKEN ===");
  console.log("Body:", req.body);

  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      console.log("No refresh token provided");
      return res.status(401).json({ message: "Refresh token required" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        console.log("Invalid refresh token");
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("Access token generated for user:", decoded.id);
      res.json({ accessToken });
    });
  } catch (err) {
    console.error("RefreshToken error:", err);
    res.status(500).json({ message: "Server error refreshing token", error: err.message });
  }
};

// ==================== SWITCH ACTIVE ACADEMY ====================
const switchAcademy = async (req, res) => {
  console.log("=== SWITCH ACTIVE ACADEMY ===");
  console.log("User:", req.user);
  console.log("Params:", req.params);

  try {
    const userId = req.user.id;
    let academyId = req.params.academyId;

    if (!academyId) {
      const firstAcademy = await UserAcademy.findOne({
        where: { userId },
        order: [["createdAt", "ASC"]],
      });

      if (!firstAcademy) {
        console.log("No academies linked to user");
        return res.status(400).json({ message: "No academies linked to user" });
      }
      academyId = firstAcademy.academyId;
    }

    const userAcademy = await UserAcademy.findOne({
      where: { userId, academyId },
      include: [{ model: Academy, as: "academy" }],
    });

    if (!userAcademy) {
      console.log("Access denied to this academy:", academyId);
      return res.status(403).json({ message: "Access denied to this academy" });
    }

    const userAcademies = await UserAcademy.findAll({
      where: { userId },
      attributes: ["academyId"],
    });
    const academyIds = userAcademies.map((ua) => ua.academyId);

    const userPerms = await UserPermission.findAll({
      where: { userId },
      attributes: ["permissionName"],
    });
    const permissions = userPerms.map((p) => p.permissionName);

    const token = jwt.sign(
      {
        id: userId,
        email: req.user.email,
        role: req.user.role,
        academyIds,
        activeAcademyId: academyId,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Switch academy successful. Active academy:", academyId);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      currentAcademy: userAcademy.academy,
      role: req.user.role,
    });
  } catch (err) {
    console.error("SwitchAcademy error:", err);
    res.status(500).json({ message: "Server error switching academy", error: err.message });
  }
};

// ==================== GET ALL ACADEMIES ====================
const getAllAcademies = async (req, res) => {
  console.log("=== GET ALL ACADEMIES ===");
  console.log("User:", req.user);

  try {
    const academies = await Academy.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "fullName", "email"],
          through: { attributes: ["role"] },
        },
      ],
    });

    if (!academies.length) {
      console.log("No academies found");
      return res.status(200).json({ message: "No academies found" });
    }

    const mapped = academies.map((academy) => ({
      id: academy.id,
      name: academy.name,
      status: academy.status,
      principalName: academy.principalName,
      totalStudents: academy.totalStudents,
      users: academy.users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.UserAcademy.role,
      })),
    }));

    console.log("All academies:", mapped);
    res.json(mapped);
  } catch (err) {
    console.error("GetAllAcademies error:", err);
    res.status(500).json({ message: "Server error fetching all academies", error: err.message });
  }
};

module.exports = {
  createAcademy,
  getUserAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
  refreshToken,
  switchAcademy,
  getAllAcademies
};
