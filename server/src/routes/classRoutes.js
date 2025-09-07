// src/routes/classRoutes.js
const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { authMiddleware } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const permissions = require("../contents/permissions");

// ==================== CLASS ROUTES ====================

// Create a class under an academy (requires CREATE_CLASS permission)
router.post(
    "/academies/:academyId/classes",
    authMiddleware,
    checkPermission(permissions.CREATE_CLASS),
    classController.createClass
);


// Get all classes for an academy (requires VIEW_CLASS permission)
router.get(
    "/academies/:academyId/classes",
    authMiddleware,
    checkPermission(permissions.VIEW_CLASS),
    classController.getClassesByAcademy
);

// Get single class by ID (requires VIEW_CLASS permission)
// Get single class by ID under an academy
router.get(
    "/academies/:academyId/classes/:id",
    authMiddleware,
    checkPermission(permissions.VIEW_CLASS),
    classController.getClassById
);


// Update class (requires UPDATE_CLASS permission)
router.put(
    "/academies/:academyId/classes/:id",
    authMiddleware,
    checkPermission(permissions.UPDATE_CLASS),
    classController.updateClass
);

// Delete class (requires DELETE_CLASS permission)
router.delete(
    "/academies/:academyId/classes/:id",
    authMiddleware,
    checkPermission(permissions.DELETE_CLASS),
    classController.deleteClass
);

module.exports = router;
