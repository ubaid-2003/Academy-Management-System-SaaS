const { Academy, User, UserAcademy, UserPermission, sequelize } = require("../models");
const jwt = require("jsonwebtoken");

// ==================== CREATE ACADEMY ====================
const createAcademy = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Only Admin (Academy Admin) can create academies
    if (role !== "Admin") {
      return res.status(403).json({ message: "Only Admins can create academies" });
    }

    const {
      name,
      registrationNumber,
      address,
      city,
      province,
      country,
      email,
      phone,
      principalName,
      totalStudents,
      status,
      facilities,
      notes,
    } = req.body;

    // Required fields validation
    if (!name || !registrationNumber || !status || !principalName || !totalStudents) {
      return res.status(400).json({
        message:
          "name, registrationNumber, status, principalName, and totalStudents are required",
      });
    }

    // Validate status
    const validStatuses = ["Active", "Inactive", "Pending"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid status. Must be one of ${validStatuses.join(", ")}` });
    }

    // Create the academy
    const academy = await Academy.create(
      {
        name,
        registrationNumber,
        address,
        city,
        province,
        country: country || "Pakistan",
        email,
        phone,
        principalName,
        totalStudents,
        status,
        facilities,
        notes,
      },
      { transaction: t }
    );

    // Link academy to user as Admin
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
        .json({ message: "Registration Number or email already exists" });
    }
    return res
      .status(500)
      .json({ message: "Server error creating academy", error: err.message });
  }
};

// ==================== GET USER'S ACADEMIES ====================
const getUserAcademies = async (req, res) => {
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
      return res.status(200).json({ message: "No academy created yet." });
    }

    const mapped = academies.map((academy) => ({
      id: academy.id,
      name: academy.name,
      status: academy.status,
      role: academy.userAcademies[0].role,
    }));

    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
      message: "Server error fetching user academies",
    });
  }
};

// ==================== GET SINGLE ACADEMY ====================
const getAcademyById = async (req, res) => {
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

    if (!academy) return res.status(404).json({ message: "Academy not found" });
    res.json(academy);
  } catch (err) {
    console.error("GetAcademyById error:", err);
    res.status(500).json({ message: "Server error fetching academy", error: err.message });
  }
};

// ==================== UPDATE ACADEMY ====================
const updateAcademy = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const academy = await Academy.findByPk(id);
    if (!academy) return res.status(404).json({ message: "Academy not found" });

    if (updates.status) {
      const validStatuses = ["Active", "Inactive", "Pending"];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of ${validStatuses.join(", ")}`,
        });
      }
    }

    await academy.update(updates);
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
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const academy = await Academy.findByPk(id);
    if (!academy) return res.status(404).json({ message: "Academy not found" });

    await academy.setUsers([], { transaction: t });
    await academy.destroy({ transaction: t });

    await t.commit();
    res.json({ message: "Academy deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error("DeleteAcademy error:", err);
    res.status(500).json({ message: "Server error deleting academy", error: err.message });
  }
};

// ==================== REFRESH TOKEN ====================
const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid refresh token" });

      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ accessToken });
    });
  } catch (err) {
    console.error("RefreshToken error:", err);
    res.status(500).json({ message: "Server error refreshing token", error: err.message });
  }
};

// ==================== SWITCH ACTIVE ACADEMY ====================
const switchAcademy = async (req, res) => {
  try {
    const userId = req.user.id;
    let academyId = req.params.academyId;

    if (!academyId) {
      const firstAcademy = await UserAcademy.findOne({
        where: { userId },
        order: [["createdAt", "ASC"]],
      });

      if (!firstAcademy) return res.status(400).json({ message: "No academies linked to user" });
      academyId = firstAcademy.academyId;
    }

    const userAcademy = await UserAcademy.findOne({
      where: { userId, academyId },
      include: [{ model: Academy, as: "academy" }],
    });

    if (!userAcademy) return res.status(403).json({ message: "Access denied to this academy" });

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
