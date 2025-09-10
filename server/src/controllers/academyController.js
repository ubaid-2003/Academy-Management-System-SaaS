const { Academy, User, UserAcademy, UserPermission, sequelize, Role, Student, Teacher } = require("../models");
const jwt = require("jsonwebtoken"); // add this line

// ==================== CREATE ACADEMY ====================
const createAcademy = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByPk(userId, { include: { model: Role, as: "role" } });
    if (!user) return res.status(401).json({ message: "User not found" });

    const {
      name,
      registrationNumber,
      address,
      city,
      province,
      country = "Pakistan",
      email,
      phone,
      principalName,
      status,
      facilities,
      notes,
      teacherIds = [], // ✅ teacher IDs coming from frontend
      studentIds = [], // ✅ student IDs coming from frontend
    } = req.body;

    if (!name || !registrationNumber || !status || !principalName)
      return res.status(400).json({ message: "Required fields missing" });

    const validStatuses = ["Active", "Inactive", "Pending"];
    if (!validStatuses.includes(status))
      return res
        .status(400)
        .json({ message: `Invalid status. Must be one of ${validStatuses.join(", ")}` });

    const [academy, created] = await Academy.findOrCreate({
      where: { registrationNumber: registrationNumber.trim() },
      defaults: {
        name: name.trim(),
        address,
        city,
        province,
        country,
        email,
        phone,
        principalName: principalName.trim(),
        totalStudents: 0,
        totalTeachers: 0,
        status,
        facilities,
        notes,
      },
      transaction: t,
    });

    if (!created) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Academy with this registration number already exists" });
    }

    // Link academy to user
    const roleId = user.role?.id;
    await user.addAcademy(academy, { through: { roleId }, transaction: t });

    // ✅ Link selected teachers & students
    if (teacherIds.length) {
      await Teacher.update(
        { academyId: academy.id },
        { where: { id: teacherIds }, transaction: t }
      );
    }

    if (studentIds.length) {
      await Student.update(
        { academyId: academy.id },
        { where: { id: studentIds }, transaction: t }
      );
    }

    await t.commit();

    // ✅ Fetch academy with teacher & student (only id + name for dropdown)
    const academyWithDropdownData = await Academy.findByPk(academy.id, {
      include: [
        { model: Teacher, as: "teachers", attributes: ["id", "name"] },
        { model: Student, as: "students", attributes: ["id", "name"] },
      ],
    });

    return res.status(201).json({
  message: "Academy created successfully",
  academy: academyWithDropdownData,
  teachers: academyWithDropdownData.teachers || [],
  students: academyWithDropdownData.students || []
});
  } catch (err) {
    await t.rollback();
    console.error("CreateAcademy error:", err);
    return res.status(500).json({
      message: "Server error creating academy",
      error: err.message,
    });
  }
};


// ==================== UPDATE ACADEMY ====================
const updateAcademy = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // ❌ Prevent users from updating counts manually
    delete updates.totalStudents;
    delete updates.totalTeachers;

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

    // ✅ Fetch stats dynamically for each academy
    const mapped = await Promise.all(
      academies.map(async (academy) => {
        const stats = await getAcademyStats(academy.id);
        return {
          id: academy.id,
          name: academy.name,
          status: academy.status,
          principalName: academy.principalName,
          totalStudents: stats.totalStudents,   // ✅ dynamic
          totalTeachers: stats.totalTeachers,   // ✅ dynamic
          users: academy.users.map((u) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            roleId: u.roleId,
          })),
        };
      })
    );

    res.json(mapped);
  } catch (err) {
    console.error("GetAllAcademies error:", err);
    res.status(500).json({ message: "Server error fetching all academies", error: err.message });
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
          through: { attributes: [] }, // from UserAcademy
        },
        {
          model: Student,
          as: "students",
          attributes: ["id", "firstName", "email"], // only fields you need for dropdown
        },
        {
          model: Teacher,
          as: "teachers",
          attributes: ["id", "lastName", "email"], // only fields you need for dropdown
        },
      ],
    });

    if (!academy) return res.status(404).json({ message: "Academy not found" });

    // Get stats
    const stats = await getAcademyStats(id);

    // Return academy with students & teachers separately for dropdown usage
    res.json({
      ...academy.toJSON(),
      stats,
      students: academy.students || [],
      teachers: academy.teachers || [],
    });
  } catch (err) {
    console.error("GetAcademyById error:", err);
    res
      .status(500)
      .json({ message: "Server error fetching academy", error: err.message });
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

// ==================== SWITCH ACTIVE ACADEMY ====================
const switchAcademy = async (req, res) => {
  try {
    const userId = req.user.id;
    let academyId = req.params.academyId ? parseInt(req.params.academyId, 10) : null;

    // If no academyId given → use first academy
    if (!academyId) {
      const firstAcademy = await UserAcademy.findOne({
        where: { userId },
        order: [["createdAt", "ASC"]],
      });
      if (!firstAcademy)
        return res.status(400).json({ message: "No academies linked to user" });
      academyId = firstAcademy.academyId;
    }

    // Verify user has access to this academy
    const userAcademy = await UserAcademy.findOne({
      where: { userId, academyId },
      include: [{ model: Academy, as: "academy" }],
    });

    if (!userAcademy)
      return res.status(403).json({ message: "Access denied to this academy" });

    // ✅ Fetch academy stats
    const stats = await getAcademyStats(academyId);

    // ✅ Build currentAcademy response with dynamic totalStudents & Active status
    const currentAcademy = {
      ...userAcademy.academy.toJSON(),
      totalStudents: stats.totalStudents, // override manual field
      status: "Active", // always mark switched academy as active
    };

    // ✅ Issue new JWT
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

    // ✅ Send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      currentAcademy, // updated academy details
      stats,          // detailed stats
      role: req.user.role,
    });
  } catch (err) {
    console.error("SwitchAcademy error:", err);
    res
      .status(500)
      .json({ message: "Server error switching academy", error: err.message });
  }
};

const getAcademyStats = async (academyId) => {
  const { Student, Teacher } = require("../models");

  const totalStudents = await Student.count({ where: { academyId } });
  const activeStudents = await Student.count({ where: { academyId, status: "Active" } });
  const inactiveStudents = await Student.count({ where: { academyId, status: "Inactive" } });

  const totalTeachers = await Teacher.count({ where: { academyId } });

  return {
    totalStudents,
    activeStudents,
    inactiveStudents,
    totalTeachers,
  };
};


// ==================== ACTIVE ACADEMY STATS ====================
const getActiveAcademyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { Student, Teacher, Academy } = require("../models");

    // Determine active academy
    const activeAcademyId = req.user.activeAcademyId;
    if (!activeAcademyId) {
      return res.status(400).json({ message: "No active academy set for user" });
    }

    const academy = await Academy.findByPk(activeAcademyId);
    if (!academy) return res.status(404).json({ message: "Active academy not found" });

    const totalStudents = await Student.count({ where: { academyId: activeAcademyId } });
    const totalTeachers = await Teacher.count({ where: { academyId: activeAcademyId } });

    res.json({
      academy: {
        id: academy.id,
        name: academy.name,
        status: academy.status,
      },
      totalStudents,
      totalTeachers,
    });
  } catch (err) {
    console.error("getActiveAcademyStats error:", err);
    res.status(500).json({ message: "Server error fetching active academy stats", error: err.message });
  }
};

// ==================== SPECIFIC ACADEMY STATS BY ID ====================
const getAcademyStatsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { Student, Teacher, Academy } = require("../models");

    const academyId = parseInt(id, 10);
    if (!academyId) return res.status(400).json({ message: "Invalid academy ID" });

    const academy = await Academy.findByPk(academyId);
    if (!academy) return res.status(404).json({ message: "Academy not found" });

    const totalStudents = await Student.count({ where: { academyId } });
    const totalTeachers = await Teacher.count({ where: { academyId } });

    res.json({
      academy: {
        id: academy.id,
        name: academy.name,
        status: academy.status,
      },
      totalStudents,
      totalTeachers,
    });
  } catch (err) {
    console.error("getAcademyStatsById error:", err);
    res.status(500).json({ message: "Server error fetching academy stats", error: err.message });
  }
};






module.exports = {
  getActiveAcademyStats,
  getAcademyStatsById,
  createAcademy,
  getUserAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
  getAllAcademies,
  switchAcademy,
  getAcademyStats
};
