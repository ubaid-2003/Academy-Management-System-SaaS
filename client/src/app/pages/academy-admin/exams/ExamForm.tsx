// ===============================================
// ExamForm.tsx - Form Component
// ===============================================
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Exam } from '@/types/exam';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ExamFormProps {
    academyId: number;
    exam?: Exam | null;
    onSave: (exam: Exam) => void;
    onCancel: () => void;
}

interface Class {
    id: number;
    name: string;
}

const ExamForm: React.FC<ExamFormProps> = ({ academyId, exam, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        code: "",
        classId: "",         // keep as string, convert to number when submitting
        date: "",
        duration: "",        // e.g., "90" (minutes) or "01:30"
        examType: "",        // e.g., "Midterm", "Final"
        subject: "",
        totalMarks: 100,     // ✅ required by backend
        passingMarks: 40,    // ✅ required by backend
        startTime: "09:00",  // ✅ provide default
        endTime: "11:00"     // ✅ provide default
    });


    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // fetch classes for this academy
    useEffect(() => {
        const fetchClasses = async (): Promise<void> => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `http://localhost:5000/api/academies/${academyId}/classes`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setClasses(res.data.classes || []);
            } catch (err) {
                console.error('Error fetching classes:', err);
            }
        };

        if (academyId) {
            fetchClasses();
        }
    }, [academyId]);

    // update form if editing
    useEffect(() => {
        if (exam) {
            setFormData({
                title: exam.title || "",
                code: exam.code || "",
                examType: exam.examType || "",
                subject: exam.subject || "",
                classId: exam.classId?.toString() || "",
                date: exam.date || "",
                duration: exam.duration || "",
                totalMarks: exam.totalMarks ?? 100,       // ✅ fallback default
                passingMarks: exam.passingMarks ?? 40,    // ✅ fallback default
                startTime: exam.startTime || "09:00",     // ✅ default if missing
                endTime: exam.endTime || "11:00"          // ✅ default if missing
            });

        }
    }, [exam]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.code.trim()) newErrors.code = 'Code is required';
        if (!formData.examType.trim()) newErrors.examType = 'Exam Type is required';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.classId) newErrors.classId = 'Class selection is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.duration.trim()) newErrors.duration = 'Duration is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                classId: parseInt(formData.classId.toString(), 10)
            };

            let response;
            if (exam) {
                response = await axios.put(
                    `http://localhost:5000/api/academies/${academyId}/exams/${exam.id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                response = await axios.post(
                    `http://localhost:5000/api/academies/${academyId}/exams`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            onSave(response.data.exam);

            if (!exam) {
                setFormData({
                    title: "",
                    code: "",
                    examType: "",
                    subject: "",
                    classId: "",
                    date: "",
                    duration: "",
                    totalMarks: 100,       // ✅ default reset value
                    passingMarks: 40,      // ✅ default reset value
                    startTime: "09:00",    // ✅ default reset value
                    endTime: "11:00"       // ✅ default reset value
                });

            }
        } catch (err: any) {
            console.error('Error saving exam:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save exam';
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {exam ? 'Edit Exam' : 'Create New Exam'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {errors.submit}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.title ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter exam title"
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Code *</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.code ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="e.g., MATH101"
                        />
                        {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                        <input
                            type="number"
                            value={formData.totalMarks}
                            onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Passing Marks</label>
                        <input
                            type="number"
                            value={formData.passingMarks}
                            onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>


                    {/* Exam Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
                        <input
                            type="text"
                            name="examType"
                            value={formData.examType}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.examType ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="e.g., Midterm, Final"
                        />
                        {errors.examType && <p className="text-sm text-red-600">{errors.examType}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.subject ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="e.g., Mathematics"
                        />
                        {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
                    </div>

                    {/* Class dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                        <select
                            name="classId"
                            value={formData.classId}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.classId ? 'border-red-300' : 'border-gray-300'
                                }`}
                        >
                            <option value="">-- Select Class --</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                        {errors.classId && <p className="text-sm text-red-600">{errors.classId}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.date ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors.duration ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="e.g., 2 hours"
                        />
                        {errors.duration && <p className="text-sm text-red-600">{errors.duration}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : exam ? 'Update Exam' : 'Create Exam'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamForm;
