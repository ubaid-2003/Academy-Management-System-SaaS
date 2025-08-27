const router = require("express").Router();
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware"); // Correct import
const {
  createAcademy,
  getUserAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
} = require("../controllers/academyController");

// ==================== CRUD Routes ====================

// CREATE a new academy
router.post("/", authMiddleware, adminAuth, createAcademy);

// GET all academies for logged-in user
router.get("/user", authMiddleware, adminAuth, getUserAcademies);

// GET single academy by ID
router.get("/:id", authMiddleware, adminAuth, getAcademyById);

// UPDATE academy by ID
router.put("/:id", authMiddleware, adminAuth, updateAcademy);

// DELETE academy by ID
router.delete("/:id", authMiddleware, adminAuth, deleteAcademy);

module.exports = router;
