// routes/academyRoutes.js
const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const permissions = require("../contents/permissions");
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

// GET all academies (requires VIEW_ACADEMY permission)
router.get(
  "/",
  authMiddleware,
  checkPermission(permissions.VIEW_ACADEMY),
  getAllAcademies
);

// GET all academies for logged-in user (requires VIEW_ACADEMY permission)
router.get(
  "/user",
  authMiddleware,
  checkPermission(permissions.VIEW_ACADEMY),
  getUserAcademies
);

// GET single academy by ID (requires VIEW_ACADEMY permission)
router.get(
  "/:id",
  authMiddleware,
  checkPermission(permissions.VIEW_ACADEMY),
  getAcademyById
);

// CREATE a new academy (requires CREATE_ACADEMY permission)
router.post(
  "/",
  authMiddleware,
  checkPermission(permissions.CREATE_ACADEMY),
  createAcademy
);

// UPDATE academy by ID (requires UPDATE_ACADEMY permission)
router.put(
  "/:id",
  authMiddleware,
  checkPermission(permissions.UPDATE_ACADEMY),
  updateAcademy
);

// DELETE academy by ID (requires DELETE_ACADEMY permission)
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(permissions.DELETE_ACADEMY),
  deleteAcademy
);

// ==================== SWITCHER ROUTES ====================

// Default switch to first academy (requires SWITCH_ACADEMY permission)
router.post(
  "/switch",
  authMiddleware,
  checkPermission(permissions.SWITCH_ACADEMY),
  switchAcademy
);

// Switch to a specific academy by ID (requires SWITCH_ACADEMY permission)
router.post(
  "/switch/:academyId",
  authMiddleware,
  checkPermission(permissions.SWITCH_ACADEMY),
  switchAcademy
);

module.exports = router;
