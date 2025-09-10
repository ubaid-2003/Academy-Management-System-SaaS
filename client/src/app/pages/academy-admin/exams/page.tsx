// ===============================================
// ExamsPage.tsx - Main Component (Enhanced)
// ===============================================
'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import axios from 'axios';
import ExamForm from "@/app/pages/academy-admin/exams/ExamForm";
import AssignTeachers from '@/app/pages/academy-admin/exams/AssignTeachers';
import AssignStudents from '@/app/pages/academy-admin/exams/AssignStudents';
import { useAcademy } from '@/app/context/AcademyContext';
import { Exam } from '@/types/exam';
import {
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  UserGroupIcon,
  AcademicCapIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState<boolean>(false);
  const [showStudentModal, setShowStudentModal] = useState<boolean>(false);
  const [showExamForm, setShowExamForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { currentAcademy } = useAcademy();
  const academyId = currentAcademy?.id || null;

  // ------------------- FETCH EXAMS -------------------
  const fetchExams = async (id: number): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `http://localhost:5000/api/academies/${id}/exams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const examsData = response.data.exams || response.data || [];
      setExams(examsData);
      setFilteredExams(examsData);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to fetch exams';
      setError(errorMessage);
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (academyId) {
      fetchExams(academyId);
    }
  }, [academyId]);

  // ------------------- SEARCH EXAMS -------------------
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredExams(exams);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = exams.filter(
        exam =>
          exam.title.toLowerCase().includes(term) ||
          exam.code?.toLowerCase().includes(term) ||
          exam.subject?.toLowerCase().includes(term) ||
          exam.examType?.toLowerCase().includes(term) ||
          exam.class?.name?.toLowerCase().includes(term)
      );
      setFilteredExams(filtered);
    }
  }, [searchTerm, exams]);

  // ------------------- HANDLE EXAM SAVED -------------------
  const handleExamSaved = (exam: Exam): void => {
    setExams((prev) => {
      const existingExamIndex = prev.findIndex((e) => e.id === exam.id);
      if (existingExamIndex !== -1) {
        const updated = [...prev];
        updated[existingExamIndex] = exam;
        return updated;
      } else {
        return [...prev, exam];
      }
    });
    setEditingExam(null);
    setShowExamForm(false);
  };

  // ------------------- HANDLE DELETE EXAM -------------------
  const handleDeleteExam = async (examId: number | string): Promise<void> => {
    if (!academyId) return;

    if (typeof window !== 'undefined') {
      if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/academies/${academyId}/exams/${examId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExams((prev) => prev.filter((exam) => exam.id !== examId));
    } catch (err: any) {
      console.error('Error deleting exam:', err);
      alert('Failed to delete exam. Please try again.');
    }
  };

  // ------------------- HANDLE EDIT -------------------
  const handleEditExam = (exam: Exam): void => {
    setEditingExam(exam);
    setShowExamForm(true);
  };

  // ------------------- HANDLE CREATE NEW -------------------
  const handleCreateNew = (): void => {
    setEditingExam(null);
    setShowExamForm(true);
  };

  // ------------------- HANDLE REFRESH -------------------
  const handleRefresh = (): void => {
    if (academyId) {
      setRefreshing(true);
      fetchExams(academyId);
    }
  };

  // ------------------- FORMAT DATE -------------------
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // ------------------- FORMAT TIME -------------------
  const formatTime = (timeString: string): string => {
    if (!timeString) return 'N/A';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      
      return `${formattedHour}:${minutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  if (!academyId) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
            <p className="text-yellow-800">
              Please select an academy to manage exams.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Exam Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage exams for {currentAcademy?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                Create Exam
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search exams by title, code, subject, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Exam Form Modal */}
        {showExamForm && (
          <ExamForm
            academyId={academyId}
            exam={editingExam}
            onSave={handleExamSaved}
            onCancel={() => {
              setShowExamForm(false);
              setEditingExam(null);
            }}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading exams...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Exams List */}
            {filteredExams.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {exams.length === 0 ? 'No exams found' : 'No matching exams'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {exams.length === 0 
                    ? 'Get started by creating your first exam for this academy.'
                    : 'Try adjusting your search terms to find what you\'re looking for.'
                  }
                </p>
                {exams.length === 0 && (
                  <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create First Exam
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExams.map((exam) => {
                        const examDate = new Date(exam.date);
                        const today = new Date();
                        const isUpcoming = examDate > today;
                        const isPast = examDate < today;
                        
                        return (
                          <tr
                            key={exam.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {exam.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {exam.subject} • {exam.examType}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {exam.code}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {exam.class?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                  {formatDate(exam.date)}
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                                  {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                                </div>
                                <div className="text-xs text-gray-500 ml-6">
                                  Duration: {exam.duration}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isUpcoming 
                                  ? 'bg-green-100 text-green-800' 
                                  : isPast 
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isUpcoming ? 'Upcoming' : isPast ? 'Completed' : 'Today'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditExam(exam)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                                  title="Edit exam"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedExam(exam);
                                    setShowTeacherModal(true);
                                  }}
                                  className="text-purple-600 hover:text-purple-900 transition-colors duration-150"
                                  title="Assign teachers"
                                >
                                  <UserGroupIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedExam(exam);
                                    setShowStudentModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900 transition-colors duration-150"
                                  title="Assign students"
                                >
                                  <AcademicCapIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteExam(exam.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                  title="Delete exam"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredExams.length}</span> of{' '}
                    <span className="font-medium">{exams.length}</span> exams
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Assign Teachers Modal */}
        {selectedExam && showTeacherModal && (
          <AssignTeachers
            academyId={academyId}
            examId={selectedExam.id}
            examTitle={selectedExam.title}
            onClose={() => {
              setShowTeacherModal(false);
              setSelectedExam(null);
            }}
            onAssigned={() => {
              setShowTeacherModal(false);
              setSelectedExam(null);
              if (academyId) fetchExams(academyId);
            }}
          />
        )}

        {/* Assign Students Modal */}
        {selectedExam && showStudentModal && (
          <AssignStudents
            academyId={academyId}
            examId={selectedExam.id}
            examTitle={selectedExam.title}
            onClose={() => {
              setShowStudentModal(false);
              setSelectedExam(null);
            }}
            onAssigned={() => {
              setShowStudentModal(false);
              setSelectedExam(null);
              if (academyId) fetchExams(academyId);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamsPage;