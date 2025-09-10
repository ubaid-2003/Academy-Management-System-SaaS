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
  ASSIGN_EXAM: "assign_exam",            // Teacher / Admin / SuperAdmin
  VIEW_EXAM_RESULT: "view_exam_result",    // Teacher / Student / Admin / SuperAdmin
};
