export interface Exam {
  id: number;
  title: string;
  description?: string;
  date: string;          // exam date
  classId: number;
  duration?: string;
  code?: string;

  // Relations
  class?: {
    id: number;
    name: string;
  };

  examType?: string;
  subject?: string;

  // Required by backend
  totalMarks: number;
  passingMarks: number;
  startTime: string;  // "09:00"
  endTime: string;    // "11:00"

  createdAt?: string;
  updatedAt?: string;
}


// ==================== TEACHER ====================
export interface Teacher {
    id: number;
    name: string;
    email: string;
    subject?: string;
}

// ==================== STUDENT ====================
export interface Student {
    id: number;
    name: string;
    email: string;
    rollNumber?: string;
}

// ==================== ACADEMY ====================
export interface Academy {
    id: number;
    name: string;
}
