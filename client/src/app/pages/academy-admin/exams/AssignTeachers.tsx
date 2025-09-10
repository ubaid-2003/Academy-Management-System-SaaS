// AssignTeachers.tsx - Teacher Assignment Modal
// ===============================================
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Teacher } from '@/types/exam';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface AssignTeachersProps {
    academyId: number;
    examId: number;
    examTitle: string;
    onClose: () => void;
    onAssigned: () => void;
}

const AssignTeachers: React.FC<AssignTeachersProps> = ({
    academyId,
    examId,
    examTitle,
    onClose,
    onAssigned,
}) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [assignedTeachers, setAssignedTeachers] = useState<number[]>([]);
    const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        Promise.all([fetchTeachers(), fetchAssignedTeachers()]);
    }, [academyId, examId]);

    const fetchTeachers = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/academies/${academyId}/teachers`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTeachers(response.data.teachers || []);
        } catch (err) {
            console.error('Error fetching teachers:', err);
            setError('Failed to load teachers');
        }
    };

    const fetchAssignedTeachers = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/academies/${academyId}/exams/${examId}/teachers`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const assigned = response.data.teachers?.map((t: Teacher) => t.id) || [];
            setAssignedTeachers(assigned);
            setSelectedTeachers(assigned);
        } catch (err) {
            console.error('Error fetching assigned teachers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherToggle = (teacherId: number): void => {
        setSelectedTeachers(prev =>
            prev.includes(teacherId)
                ? prev.filter(id => id !== teacherId)
                : [...prev, teacherId]
        );
    };

    const handleAssign = async (): Promise<void> => {
        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/academies/${academyId}/exams/${examId}/assign`,
                { studentIds: [], teacherIds: selectedTeachers }, // ✅ send both fields
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onAssigned();
        } catch (err: any) {
            console.error('Error assigning teachers:', err);
            setError(err.response?.data?.message || 'Failed to assign teachers');
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <UserGroupIcon className="h-5 w-5 mr-2" />
                            Assign Teachers
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
                            <span className="ml-3 text-gray-600">Loading teachers...</span>
                        </div>
                    ) : teachers.length === 0 ? (
                        <div className="text-center py-8">
                            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No teachers available</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-700 mb-4">
                                Select teachers to assign to this exam:
                            </p>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {teachers.map(teacher => (
                                    <div
                                        key={teacher.id}
                                        className={`flex items-center p-3 rounded-lg border transition-colors ${selectedTeachers.includes(teacher.id)
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`teacher-${teacher.id}`}
                                            checked={selectedTeachers.includes(teacher.id)}
                                            onChange={() => handleTeacherToggle(teacher.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor={`teacher-${teacher.id}`}
                                            className="ml-3 flex-1 cursor-pointer"
                                        >
                                            <div className="text-sm font-medium text-gray-900">
                                                {teacher.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {teacher.email}
                                                {teacher.subject && ` • ${teacher.subject}`}
                                            </div>
                                        </label>
                                        {assignedTeachers.includes(teacher.id) && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Currently Assigned
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <div className="text-sm text-gray-600">
                        {selectedTeachers.length} teacher{selectedTeachers.length !== 1 ? 's' : ''} selected
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
                            disabled={saving || teachers.length === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Assigning...
                                </div>
                            ) : (
                                'Assign Teachers'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignTeachers;
