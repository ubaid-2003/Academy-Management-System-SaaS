const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const permissions = require("../contents/permissions");
const {
  createExam,
  updateExam,
  getAllExams,
  getExamById,
  deleteExam,
  assignExam,
  getExamStats
} = require("../controllers/examController");

// ==================== EXAM CRUD ====================

// GET all exams for an academy
router.get(
  "/academies/:academyId/exams",
  authMiddleware,
  checkPermission(permissions.VIEW_EXAM),
  getAllExams
);

// GET single exam by ID under an academy
router.get(
  "/academies/:academyId/exams/:id",
  authMiddleware,
  checkPermission(permissions.VIEW_EXAM),
  getExamById
);

// CREATE new exam under an academy
router.post(
  "/academies/:academyId/exams",
  authMiddleware,
  checkPermission(permissions.CREATE_EXAM),
  createExam
);

// UPDATE exam by ID
router.put(
  "/academies/:academyId/exams/:id",
  authMiddleware,
  checkPermission(permissions.UPDATE_EXAM),
  updateExam
);

// DELETE exam by ID
router.delete(
  "/academies/:academyId/exams/:id",
  authMiddleware,
  checkPermission(permissions.DELETE_EXAM),
  deleteExam
);

// ==================== EXAM ASSIGNMENTS ====================
// Assign students/teachers to exam
router.put(
  "/academies/:academyId/exams/:examId/assign",
  authMiddleware,
  checkPermission(permissions.ASSIGN_EXAM),
  assignExam
);


// ==================== EXAM STATS ====================
// Get stats for specific exam by ID
router.get(
  "/academies/:academyId/exams/:examId/stats",
  authMiddleware,
  checkPermission(permissions.VIEW_EXAM),
  getExamStats
);

module.exports = router;
