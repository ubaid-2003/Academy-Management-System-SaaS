'use strict';

const express = require('express');
const router = express.Router();
const FeeController = require('../controllers/FeeController');
const { authMiddleware } = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// ========================== FEE STRUCTURE ROUTES ==========================
router.post(
  '/academies/:academyId/fee-structures',
  authMiddleware,
  checkPermission('create_fee_structures'),
  FeeController.createFeeStructure
);

router.get(
  '/academies/:academyId/fee-structures',
  authMiddleware,
  checkPermission('view_fee_structures'),
  FeeController.getFeeStructures
);

router.get(
  '/academies/:academyId/fee-structures/:id',
  authMiddleware,
  checkPermission('view_fee_structures'),
  FeeController.getFeeStructureById
);

router.put(
  '/academies/:academyId/fee-structures/:id',
  authMiddleware,
  checkPermission('edit_fee_structures'),
  FeeController.updateFeeStructure
);

router.delete(
  '/academies/:academyId/fee-structures/:id',
  authMiddleware,
  checkPermission('delete_fee_structures'),
  FeeController.deleteFeeStructure
);

router.post(
  '/academies/:academyId/fee-structures/:feeStructureId/assign-students',
  authMiddleware,
  checkPermission('edit_fee_structures'),
  FeeController.assignStudentsToFeeStructure
);

// ========================== FEE PAYMENT ROUTES ==========================
router.post(
  '/academies/:academyId/fee-payments',
  authMiddleware,
  checkPermission('create_fee_payments'),
  FeeController.createFeePayment
);

// 1. Get all payments of a student
router.get(
  '/academies/students/:studentId/fee-payments',
  authMiddleware,
  checkPermission('view_fee_payments'),
  FeeController.getStudentPayments
);

// 2. Get single payment of a student by payment ID
router.get(
  '/academies/students/:studentId/fee-payments/:id',
  authMiddleware,
  checkPermission('view_fee_payments'),
  FeeController.getFeePaymentById
);

// 3. Get all payments of an academy
router.get(
  '/academies/:academyId/fee-payments',
  authMiddleware,
  checkPermission('view_fee_payments'),
  FeeController.getAllPayments
);

module.exports = router;
