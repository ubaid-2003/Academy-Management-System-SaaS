// ===============================================
// AssignStudents.tsx - Student Assignment Modal
// ===============================================
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Student } from '@/types/exam';
import { XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface AssignStudentsProps {
  academyId: number;
  examId: number;
  examTitle: string;
  onClose: () => void;
  onAssigned: () => void;
}

const AssignStudents: React.FC<AssignStudentsProps> = ({
  academyId,
  examId,
  examTitle,
  onClose,
  onAssigned,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    Promise.all([fetchStudents(), fetchAssignedStudents()]);
  }, [academyId, examId]);

  const fetchStudents = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/academies/${academyId}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    }
  };

  const fetchAssignedStudents = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/academies/${academyId}/exams/${examId}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const assigned = response.data.students?.map((s: Student) => s.id) || [];
      setAssignedStudents(assigned);
      setSelectedStudents(assigned);
    } catch (err) {
      console.error('Error fetching assigned students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId: number): void => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (): void => {
    const filteredStudentIds = filteredStudents.map(s => s.id);
    if (selectedStudents.length === filteredStudentIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudentIds);
    }
  };

  const handleAssign = async (): Promise<void> => {
    setSaving(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/academies/${academyId}/exams/${examId}/assign-students`,
        { studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onAssigned();
    } catch (err: any) {
      console.error('Error assigning students:', err);
      setError(err.response?.data?.message || 'Failed to assign students');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.rollNumber && student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Assign Students
            </h3>
            <p className="text-sm text-gray-600 mt-1">Exam: {examTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading students...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Search students by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Select All */}
              {filteredStudents.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Select All ({filteredStudents.length})
                    </span>
                  </label>
                </div>
              )}

              {/* Students List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No students match your search
                  </div>
                ) : (
                  filteredStudents.map(student => (
                    <div
                      key={student.id}
                      className={`flex items-center p-3 rounded-lg border transition-colors ${
                        selectedStudents.includes(student.id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`student-${student.id}`}
                        className="ml-3 flex-1 cursor-pointer"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                          {student.rollNumber && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {student.rollNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </label>
                      {assignedStudents.includes(student.id) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Currently Assigned
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="text-sm text-gray-600">
            {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={saving || students.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning...
                </div>
              ) : (
                'Assign Students'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStudents;