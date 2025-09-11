'use strict';

module.exports = {
  // ==================== Academy Permissions ====================
  CREATE_ACADEMY: "create_academy",        // Admin / SuperAdmin
  UPDATE_ACADEMY: "update_academy",        // Admin / SuperAdmin
  DELETE_ACADEMY: "delete_academy",        // Admin / SuperAdmin
  VIEW_ACADEMY: "view_academy",            // All roles
  SWITCH_ACADEMY: "switch_academy",        // Admin / SuperAdmin

  // ==================== Student Permissions ====================
  CREATE_STUDENT: "create_student",        // Admin / SuperAdmin
  UPDATE_STUDENT: "update_student",        // Admin / SuperAdmin
  DELETE_STUDENT: "delete_student",        // Admin / SuperAdmin
  VIEW_STUDENT: "view_student",            // All roles

  // ==================== Teacher Permissions ====================
  CREATE_TEACHER: "create_teacher",        // Admin / SuperAdmin
  UPDATE_TEACHER: "update_teacher",        // Admin / SuperAdmin
  DELETE_TEACHER: "delete_teacher",        // Admin / SuperAdmin
  VIEW_TEACHER: "view_teacher",            // All roles

  // ==================== Class Permissions ====================
  CREATE_CLASS: "create_class",            // Admin / SuperAdmin
  UPDATE_CLASS: "update_class",            // Admin / SuperAdmin
  DELETE_CLASS: "delete_class",            // Admin / SuperAdmin
  VIEW_CLASS: "view_class",                // All roles

  // ==================== Course Permissions ====================
  CREATE_COURSE: "create_course",          // Admin / SuperAdmin
  UPDATE_COURSE: "update_course",          // Admin / SuperAdmin
  DELETE_COURSE: "delete_course",          // Admin / SuperAdmin
  VIEW_COURSE: "view_course",              // All roles
  ASSIGN_TEACHER: "assign_teacher",        // Admin / SuperAdmin
  ENROLL_STUDENT: "enroll_student",        // Admin / SuperAdmin / Teacher

  // ==================== Exam Permissions ====================
  CREATE_EXAM: "create_exam",              // Admin / SuperAdmin
  UPDATE_EXAM: "update_exam",              // Admin / SuperAdmin
  DELETE_EXAM: "delete_exam",              // Admin / SuperAdmin
  VIEW_EXAM: "view_exam",                  // All roles
  ASSIGN_EXAM: "assign_exam",              // Teacher / Admin / SuperAdmin
  VIEW_EXAM_RESULT: "view_exam_result",    // Teacher / Student / Admin / SuperAdmin

  // ==================== Fee Management Permissions ====================
  // Fee Structures
  VIEW_FEE_STRUCTURES: "view_fee_structures",       // Admin / SuperAdmin / Teacher
  CREATE_FEE_STRUCTURES: "create_fee_structures",   // Admin / SuperAdmin
  EDIT_FEE_STRUCTURES: "edit_fee_structures",       // Admin / SuperAdmin
  DELETE_FEE_STRUCTURES: "delete_fee_structures",   // Admin / SuperAdmin

  // Fee Payments
  VIEW_FEE_PAYMENTS: "view_fee_payments",           // Admin / SuperAdmin / Teacher / Student (own)
  CREATE_FEE_PAYMENTS: "create_fee_payments",       // Admin / SuperAdmin
  EDIT_FEE_PAYMENTS: "edit_fee_payments",           // Admin / SuperAdmin
  DELETE_FEE_PAYMENTS: "delete_fee_payments",       // Admin / SuperAdmin
  EXPORT_FEE_REPORTS: "export_fee_reports",         // Admin / SuperAdmin

  // ==================== Student-Fee Assignment ====================
  ASSIGN_FEE_STRUCTURE: "assign_fee_structure",     // Admin / SuperAdmin
  EDIT_STUDENT_FEES: "edit_student_fees",           // Admin / SuperAdmin
  VIEW_STUDENT_FEES: "view_student_fees",           // Admin / SuperAdmin / Teacher / Student (own)
  RECORD_PAYMENT: "record_payment",                 // Admin / SuperAdmin / Teacher
};
