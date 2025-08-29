const { Academy, User, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const { UserAcademy } = require("../models"); // make sure UserAcademy is exported in models/index.js

// ==================== CREATE ACADEMY ====================
const createAcademy = async (req, res) => {
  const t = await sequelize.transaction();
  try {
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
      facilities,
      status,
      notes,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    // Validate required fields
    const requiredFields = {
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
      facilities,
      status,
      notes,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        await t.rollback();
        return res.status(400).json({ message: `${key} is required` });
      }
    }

    // Validate status
    const validStatuses = ["Active", "Inactive", "Pending"];
    if (!validStatuses.includes(status)) {
      await t.rollback();
      return res.status(400).json({ message: `Invalid status. Must be one of ${validStatuses.join(", ")}` });
    }

    // Create academy
    const academy = await Academy.create(
      { name, registrationNumber, address, city, province, country, email, phone, principalName, totalStudents, facilities, status, notes },
      { transaction: t }
    );

    const user = await User.findByPk(userId);
    await user.addAcademy(academy, { through: { role: "Owner" }, transaction: t });

    await t.commit();
    res.status(201).json({ message: "Academy created successfully", academy });
  } catch (err) {
    await t.rollback();
    console.error("CreateAcademy error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email or Registration Number already exists" });
    }
    res.status(500).json({ message: "Server error creating academy", error: err.message });
  }
};

// ==================== GET USER'S ACADEMIES ====================

// In your academyController.js
const getUserAcademies = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const academies = await Academy.findAll({
      include: [
        {
          model: UserAcademy,
          as: "userAcademies",
          where: { userId: userId },
          attributes: ["role"],
          required: true
        }
      ]
    });

    if (!academies.length) {
      return res.status(200).json({ message: "No academy created yet." });
    }

    res.json(academies);
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
          attributes: ["id", "fullName", "email", "role"],
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
        return res.status(400).json({ message: `Invalid status. Must be one of ${validStatuses.join(", ")}` });
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

// ==================== REFRESH TOKEN HANDLER ====================
const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid refresh token" });

      const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error("RefreshToken error:", err);
    res.status(500).json({ message: "Server error refreshing token", error: err.message });
  }
};

module.exports = {
  createAcademy,
  getUserAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
  refreshToken,
};
