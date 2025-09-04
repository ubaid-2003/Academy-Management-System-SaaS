const { Academy, User, UserAcademy, UserPermission, sequelize, Role } = require("../models");
const jwt = require("jsonwebtoken"); // add this line


const createAcademy = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByPk(userId, { include: { model: Role, as: "role" } });
    if (!user) return res.status(401).json({ message: "User not found" });

    // Destructure request body
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

    if (!name || !registrationNumber || !status || !principalName)
      return res.status(400).json({ message: "Required fields missing" });

    const validStatuses = ["Active", "Inactive", "Pending"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: `Invalid status. Must be one of ${validStatuses.join(", ")}` });

    const [academy, created] = await Academy.findOrCreate({
      where: { registrationNumber: registrationNumber.trim() },
      defaults: { name: name.trim(), address, city, province, country, email, phone, principalName: principalName.trim(), totalStudents, status, facilities, notes },
      transaction: t,
    });

    if (!created) {
      await t.rollback();
      return res.status(400).json({ message: "Academy with this registration number already exists" });
    }

    // Link academy to user
    const roleId = user.role?.id;
    await user.addAcademy(academy, { through: { roleId }, transaction: t });

    await t.commit();
    return res.status(201).json({ message: "Academy created successfully", academy });
  } catch (err) {
    await t.rollback();
    console.error("CreateAcademy error:", err);
    return res.status(500).json({ message: "Server error creating academy", error: err.message });
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
          attributes: [],
          required: true,
        },
      ],
    });

    if (!academies.length) return res.status(200).json({ message: "No academy created yet." });

    const mapped = academies.map((academy) => ({
      id: academy.id,
      name: academy.name,
      status: academy.status,
      roleId: req.user.roleId,
    }));

    res.json(mapped);
  } catch (error) {
    console.error("GetUserAcademies error:", error);
    res.status(500).json({ message: "Server error fetching user academies", error: error.message });
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
          attributes: ["id", "fullName", "email", "roleId"],
          through: { attributes: [] },
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
      if (!validStatuses.includes(updates.status))
        return res.status(400).json({ message: `Invalid status. Must be one of ${validStatuses.join(", ")}` });
    }

    await academy.update(updates);
    res.json({ message: "Academy updated successfully", academy });
  } catch (err) {
    console.error("UpdateAcademy error:", err);
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

// ==================== GET ALL ACADEMIES ====================
const getAllAcademies = async (req, res) => {
  try {
    const academies = await Academy.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "fullName", "email", "roleId"],
          through: { attributes: [] },
        },
      ],
    });

    if (!academies.length) return res.status(200).json({ message: "No academies found" });

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
        roleId: u.roleId,
      })),
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GetAllAcademies error:", err);
    res.status(500).json({ message: "Server error fetching all academies", error: err.message });
  }
};

// ==================== SWITCH ACTIVE ACADEMY ====================
const switchAcademy = async (req, res) => {
  try {
    const userId = req.user.id;
    let academyId = req.params.academyId ? parseInt(req.params.academyId, 10) : null;

    if (!academyId) {
      const firstAcademy = await UserAcademy.findOne({ where: { userId }, order: [["createdAt", "ASC"]] });
      if (!firstAcademy) return res.status(400).json({ message: "No academies linked to user" });
      academyId = firstAcademy.academyId;
    }

    const userAcademy = await UserAcademy.findOne({
      where: { userId, academyId },
      include: [{ model: Academy, as: "academy" }],
    });

    if (!userAcademy) return res.status(403).json({ message: "Access denied to this academy" });

    // Use JWT permissions instead of DB query
    const permissions = req.user.permissions || [];

    const token = jwt.sign(
      {
        id: userId,
        email: req.user.email,
        role: req.user.role,
        academyIds: [academyId],
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

    res.json({ success: true, token, currentAcademy: userAcademy.academy, role: req.user.role });
  } catch (err) {
    console.error("SwitchAcademy error:", err);
    res.status(500).json({ message: "Server error switching academy", error: err.message });
  }
};


module.exports = {
  createAcademy,
  getUserAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
  getAllAcademies,
  switchAcademy,
};
