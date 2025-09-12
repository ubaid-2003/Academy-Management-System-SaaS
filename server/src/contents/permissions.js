'use strict';

module.exports = {
  // ==================== Academy Permissions ====================
  CREATE_ACADEMY: "create_academy",        // Admin / SuperAdmin
  UPDATE_ACADEMY: "update_academy",        // Admin / SuperAdmin
  DELETE_ACADEMY: "delete_academy",        // Admin / SuperAdmin
  VIEW_ACADEMY: "view_academy",            // All roles
  SWITCH_ACADEMY: "switch_academy",        // Admin / SuperAdmin

  // ==================== Student Permissions ====================
  CREATE_STUDENT: "create_student",        
  UPDATE_STUDENT: "update_student",        
  DELETE_STUDENT: "delete_student",        
  VIEW_STUDENT: "view_student",            

  // ==================== Teacher Permissions ====================
  CREATE_TEACHER: "create_teacher",        
  UPDATE_TEACHER: "update_teacher",        
  DELETE_TEACHER: "delete_teacher",        
  VIEW_TEACHER: "view_teacher",            

  // ==================== Class Permissions ====================
  CREATE_CLASS: "create_class",            
  UPDATE_CLASS: "update_class",            
  DELETE_CLASS: "delete_class",            
  VIEW_CLASS: "view_class",                

  // ==================== Course Permissions ====================
  CREATE_COURSE: "create_course",          
  UPDATE_COURSE: "update_course",          
  DELETE_COURSE: "delete_course",          
  VIEW_COURSE: "view_course",              
  ASSIGN_TEACHER: "assign_teacher",        
  ENROLL_STUDENT: "enroll_student",        

  // ==================== Exam Permissions ====================
  CREATE_EXAM: "create_exam",              
  UPDATE_EXAM: "update_exam",              
  DELETE_EXAM: "delete_exam",              
  VIEW_EXAM: "view_exam",                  
  ASSIGN_EXAM: "assign_exam",              
  VIEW_EXAM_RESULT: "view_exam_result",    

  // ==================== Fee Management Permissions ====================
  VIEW_FEE_STRUCTURES: "view_fee_structures",       
  CREATE_FEE_STRUCTURES: "create_fee_structures",   
  EDIT_FEE_STRUCTURES: "edit_fee_structures",       
  DELETE_FEE_STRUCTURES: "delete_fee_structures",   
  VIEW_FEE_PAYMENTS: "view_fee_payments",           
  CREATE_FEE_PAYMENTS: "create_fee_payments",       
  EDIT_FEE_PAYMENTS: "edit_fee_payments",           
  DELETE_FEE_PAYMENTS: "delete_fee_payments",       
  EXPORT_FEE_REPORTS: "export_fee_reports",         

  ASSIGN_FEE_STRUCTURE: "assign_fee_structure",     
  EDIT_STUDENT_FEES: "edit_student_fees",           
  VIEW_STUDENT_FEES: "view_student_fees",           
  RECORD_PAYMENT: "record_payment",                 

  // ==================== Attendance Permissions ====================
  CREATE_TEACHER_ATTENDANCE: "create_teacher_attendance",     
  UPDATE_TEACHER_ATTENDANCE: "update_teacher_attendance",     
  DELETE_TEACHER_ATTENDANCE: "delete_teacher_attendance",     
  VIEW_TEACHER_ATTENDANCE: "view_teacher_attendance",         

  CREATE_STUDENT_ATTENDANCE: "create_student_attendance",     
  UPDATE_STUDENT_ATTENDANCE: "update_student_attendance",     
  DELETE_STUDENT_ATTENDANCE: "delete_student_attendance",     
  VIEW_STUDENT_ATTENDANCE: "view_student_attendance"          
};
