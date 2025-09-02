const router = require("express").Router();
const { authMiddleware, adminAuth } = require("../middleware/authMiddleware");
const {
  createAcademy,
  getUserAcademies,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
  switchAcademy,
  getAllAcademies
} = require("../controllers/academyController");

// ==================== ACADEMY ROUTES ====================

// GET all academies (Admin or logged-in users)
router.get("/", authMiddleware, getAllAcademies);

// GET all academies for logged-in user
router.get("/user", authMiddleware, getUserAcademies);

// GET single academy by ID
router.get("/:id", authMiddleware, getAcademyById);

// CREATE a new academy (Admin only)
router.post("/", authMiddleware, adminAuth, createAcademy);

// UPDATE academy by ID (Admin only)
router.put("/:id", authMiddleware, adminAuth, updateAcademy);

// DELETE academy by ID (Admin only)
router.delete("/:id", authMiddleware, adminAuth, deleteAcademy);

// ==================== SWITCHER ROUTES ====================

// Default switch to first academy
router.post("/switch", authMiddleware, switchAcademy);

// Switch to a specific academy by ID
router.post("/switch/:academyId", authMiddleware, switchAcademy);

module.exports = router;
