"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import {
    Plus, Search, Filter, Edit2, Trash2, Eye, X, Check,
    Users, Calendar, Clock, BookOpen, UserCheck, GraduationCap
} from "lucide-react";
import { useAcademy, Academy } from "@/app/context/AcademyContext";
import { useAuth } from "@/app/context/AuthContext";

// -----------------------------
// Interfaces & Types
// -----------------------------
interface Teacher {
    id: number;
    name: string;
    subject: string;
    email: string;
}

interface Student {
    id: number;
    name: string;
    rollNumber: string;
    grade: string;
}

interface Class {
    id?: number;
    name: string;
    section: string;
    gradeLevel: string;
    academicYear: string;
    shift: string;
    medium: string;
    capacity: number;
    status: string;
    assignedTeacher?: Teacher | null;
    students?: Student[];
    enrolledStudents?: number;
    assignedStudents?: Student[];   // already added earlier
    studentAssignments?: Student[]; // ✅ add this if different from assignedStudents
}




// -----------------------------
// Component
// -----------------------------
const ClassManagementPage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();

    // State
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [editingClass, setEditingClass] = useState<number | null>(null);
    const [managingClassIndex, setManagingClassIndex] = useState<number | null>(null);
    // state (add these near other useState declarations)
    const [students, setStudents] = useState<Student[]>([]);
    const [studentSearch, setStudentSearch] = useState("");
    const [isSavingStudents, setIsSavingStudents] = useState(false);

    const [formData, setFormData] = useState<Class>({
        name: "",
        section: "",
        gradeLevel: "",
        academicYear: "",
        shift: "Morning",
        medium: "English",
        capacity: 0,
        status: "active",
        assignedStudents: [],
        enrolledStudents: 0
    });
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterShift, setFilterShift] = useState("All");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const handleView = (cls: Class) => {
        setViewingClass(cls);
        setShowViewModal(true);
    };
    const [viewingClass, setViewingClass] = useState<Class | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("All"); // ✅ Fix
    const { currentAcademy } = useAcademy(); // get current academy from context

    // -----------------------------
    // Fetch Data
    // -----------------------------
    const fetchClasses = async () => {
        if (!currentAcademy) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/login");

            const res = await axios.get(
                `http://localhost:5000/api/academies/${currentAcademy?.id}/classes/`, // ✅ add /
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setClasses(res.data.classes || []);
        } catch (err) {
            console.error("Error fetching classes:", err);
        }
    };


    const fetchTeachers = async () => {
        if (!currentAcademy?.id) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:5000/api/academies/${currentAcademy.id}/teachers`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Handle both cases (array or wrapped in { teachers: [] })
            const data = Array.isArray(res.data) ? res.data : res.data.teachers;

            setTeachers(
                (data || []).map((t: any) => ({
                    id: t.id,
                    name: t.firstName && t.lastName ? `${t.firstName} ${t.lastName}` : t.name,
                    subject: t.subject || (t.specialization ?? "N/A"),
                    email: t.email
                }))
            );
        } catch (err) {
            console.error("Error fetching teachers:", err);
        }
    };

    const fetchStudents = async () => {
        if (!currentAcademy?.id) return;
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const token = user?.token;
            if (!token) return;

            const res = await axios.get(
                `http://localhost:5000/api/academies/${currentAcademy.id}/students`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = Array.isArray(res.data)
                ? res.data
                : res.data.students || res.data.data || [];

            const normalized: Student[] = (data || []).map((s: any) => ({
                id: s.id,
                name: s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : s.name,
                rollNumber: s.rollNumber || `STD-${s.id}`,
                grade: s.grade || s.gradeLevel || "",
            }));

            setStudents(normalized);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    const openStudentModal = (classIndex: number) => {
        setManagingClassIndex(classIndex);
        fetchStudents();
        setShowStudentModal(true);

        // Pre-load already assigned students from class
        const assigned = classes[classIndex]?.students?.map((s: any) => s.id) || [];
        setSelectedStudents(assigned);
    };


    const handleAssignTeacher = async (classIndex: number) => {
        setManagingClassIndex(classIndex);
        const teacherId = classes[classIndex]?.assignedTeacher?.id ?? null;
        setSelectedTeacher(teacherId);
        await fetchTeachers(); // <-- fetch list before showing modal
        setShowTeacherModal(true);
    };

    // updated handleAssignStudents -> fetch students before opening modal and set currently selected
    const handleAssignStudents = async (classIndex: number) => {
        setManagingClassIndex(classIndex);

        const cls = classes[classIndex] || {};
        // try multiple possible keys that might contain already-assigned students:
        const assignedIds =
            (cls.assignedStudents && cls.assignedStudents.map((s: any) => s.id)) ||
            (cls.students && cls.students.map((s: any) => s.id)) ||
            (cls.studentAssignments && cls.studentAssignments.map((r: any) => r.student?.id || r.studentId)) ||
            [];

        setSelectedStudents(assignedIds || []);
        await fetchStudents();
        setStudentSearch("");
        setShowStudentModal(true);
    };



    const saveTeacherAssignment = async () => {
        if (managingClassIndex === null) return;
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const token = user?.token;
            const classId = classes[managingClassIndex]?.id;
            if (!token || !classId) return;

            // Save assignment
            await axios.put(
                `http://localhost:5000/api/academies/${currentAcademy?.id}/classes/${classId}/assign-teacher`,
                { teacherId: selectedTeacher },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update locally (no reload)
            const teacher = teachers.find(t => t.id === selectedTeacher) ?? null;
            const updatedClass = {
                ...classes[managingClassIndex],
                assignedTeacher: teacher
            };

            setClasses(prev =>
                prev.map((cls, idx) => (idx === managingClassIndex ? updatedClass : cls))
            );

        } catch (err) {
            console.error("Failed to save teacher assignment", err);
            alert("Failed to save teacher assignment");
        }

        setShowTeacherModal(false);
        setManagingClassIndex(null);
        setSelectedTeacher(null);
    };


    const saveStudentAssignment = async () => {
        if (managingClassIndex === null) return;

        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const token = user?.token;
            const classId = classes[managingClassIndex]?.id;
            if (!token || !classId) return;

            // Save assignment
            await axios.put(
                `http://localhost:5000/api/academies/${currentAcademy?.id}/classes/${classId}/assign-students`,
                { studentIds: selectedStudents },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Reload class with assigned students
            const res = await axios.get(
                `http://localhost:5000/api/academies/${currentAcademy?.id}/classes/${classId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedClass = res.data;

            setClasses(prev =>
                prev.map((cls, idx) => (idx === managingClassIndex ? updatedClass : cls))
            );

        } catch (err) {
            console.error("Failed to save student assignment", err);
            alert("Failed to save student assignment");
        }

        setShowStudentModal(false);
        setManagingClassIndex(null);
        setSelectedStudents([]);
    };



    useEffect(() => {
        // If no academy or user, clear data
        if (!currentAcademy || !user) {
            setClasses([]);
            setTeachers([]);
            setStudents([]);
            return;
        }

        // Fetch academy-related data
        fetchClasses();
        fetchTeachers();
        fetchStudents();

        setUserRole(user.role || null);

        if (user.role !== "Admin") {
            router.push("/academy-admin");
        }
    }, [currentAcademy, user]); // 🔑 Depend on both
    ;

    // -----------------------------
    // Form Handlers
    // -----------------------------
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const token = user?.token;
            if (!token) return;

            const academyId = user.activeAcademyId;
            let url = `http://localhost:5000/api/academies/${academyId}/classes`;
            let method: "POST" | "PUT" = "POST";

            if (editingClass !== null) {
                const classId = classes[editingClass]?.id;
                if (!classId) throw new Error("Class ID missing");
                url = `http://localhost:5000/api/academies/${academyId}/classes/${classId}`;
                method = "PUT";
            }

            await axios({
                url,
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                data: formData
            });

            await fetchClasses();
            resetForm();
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Error saving class");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            section: "",
            gradeLevel: "",
            academicYear: "",
            shift: "Morning",
            medium: "English",
            capacity: 0,
            status: "active",
            assignedStudents: [],
            enrolledStudents: 0
        });
        setShowForm(false);
        setEditingClass(null);
    };

    const handleEdit = (index: number) => {
        setFormData(classes[index]);
        setEditingClass(index);
        setShowForm(true);
    };

    const handleDelete = async (index: number) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;

        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const token = user?.token;
            const academyId = user.activeAcademyId;
            const classId = classes[index]?.id;
            if (!classId) return;

            await axios.delete(`http://localhost:5000/api/academies/${academyId}/classes/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchClasses();
        } catch (err) {
            console.error(err);
        }
    };



    // -----------------------------
    // Filtered Classes
    // -----------------------------
    const filteredClasses = classes.filter(c => {
        const matchesSearch = [c.name, c.section, c.gradeLevel].some(f => (f || "").toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === "All" || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // -----------------------------
    // Statistics
    // -----------------------------
    const stats = {
        total: classes.length,
        active: classes.filter(c => c.status === "active").length,
        inactive: classes.filter(c => c.status === "inactive").length,
        totalCapacity: classes.reduce((sum, c) => sum + c.capacity, 0),
        totalEnrolled: classes.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)
    };

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <DashboardLayout>
            <div className="min-h-screen p-6 bg-gray-50">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">Class Management</h1>
                    <p className="text-gray-600">Manage your academy classes, teachers, and student assignments</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-5">
                    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <BookOpen className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Inactive Classes</p>
                                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.totalCapacity}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.totalEnrolled}</p>
                            </div>
                            <GraduationCap className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex flex-col flex-1 gap-4 md:flex-row">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search classes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Filter className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="py-2 pr-8 bg-white border border-gray-300 rounded-lg outline-none appearance-none pl-9 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <select
                                    value={filterShift}
                                    onChange={(e) => setFilterShift(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="All">All Shifts</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            <Plus size={20} />
                            Add New Class
                        </button>
                    </div>
                </div>

                {/* Classes Table */}
                <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="p-4 font-semibold text-left text-gray-900">Class Details</th>
                                    <th className="p-4 font-semibold text-left text-gray-900">Academic Info</th>
                                    <th className="p-4 font-semibold text-left text-gray-900">Teacher</th>
                                    <th className="p-4 font-semibold text-left text-gray-900">Students</th>
                                    <th className="p-4 font-semibold text-left text-gray-900">Status</th>
                                    <th className="p-4 font-semibold text-center text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredClasses.map((cls, index) => (
                                    <tr key={cls.id} className="transition-colors hover:bg-gray-50">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{cls.name}</p>
                                                <p className="text-sm text-gray-600">Section {cls.section}</p>
                                                <p className="text-sm text-gray-600">Grade {cls.gradeLevel}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="text-gray-900">{cls.academicYear}</p>
                                                <p className="text-sm text-gray-600">{cls.medium} Medium</p>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Clock size={12} />
                                                    <span>{cls.shift}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {cls.assignedTeacher ? (
                                                <div>
                                                    <p className="font-medium text-gray-900">{cls.assignedTeacher.name}</p>
                                                    <p className="text-sm text-gray-600">{cls.assignedTeacher.subject}</p>
                                                    <button
                                                        onClick={() => handleAssignTeacher(index)}
                                                        className="mt-1 text-xs text-blue-600 hover:text-blue-700"
                                                    >
                                                        Change Teacher
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleAssignTeacher(index)}
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    <UserCheck size={14} />
                                                    Assign Teacher
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users size={14} className="text-gray-500" />
                                                    <span className="text-gray-900">
                                                        {cls.enrolledStudents || 0}/{cls.capacity}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 mb-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-2 bg-blue-600 rounded-full"
                                                        style={{ width: `${((cls.enrolledStudents || 0) / cls.capacity) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <button
                                                    onClick={() => handleAssignStudents(index)}
                                                    className="text-xs text-blue-600 hover:text-blue-700"
                                                >
                                                    Manage Students
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {cls.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(cls)}
                                                    className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                                                    title="Edit Class"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                    title="Delete Class"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredClasses.length === 0 && (
                        <div className="py-12 text-center">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No classes found</h3>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingClass !== null ? 'Edit Class' : 'Add New Class'}
                                    </h2>
                                    <button
                                        onClick={resetForm}
                                        className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Class Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Enter class name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Section *
                                        </label>
                                        <input
                                            type="text"
                                            name="section"
                                            required
                                            placeholder="e.g., A, B, C"
                                            value={formData.section}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Grade Level *
                                        </label>
                                        <input
                                            type="text"
                                            name="gradeLevel"
                                            required
                                            placeholder="e.g., 10th, 9th"
                                            value={formData.gradeLevel}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Academic Year *
                                        </label>
                                        <input
                                            type="text"
                                            name="academicYear"
                                            required
                                            placeholder="e.g., 2024-25"
                                            value={formData.academicYear}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Shift
                                        </label>
                                        <select
                                            name="shift"
                                            value={formData.shift}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Morning">Morning</option>
                                            <option value="Evening">Evening</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Medium
                                        </label>
                                        <select
                                            name="medium"
                                            value={formData.medium}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="English">English</option>
                                            <option value="Urdu">Urdu</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Capacity *
                                        </label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            required
                                            min="1"
                                            placeholder="Enter capacity"
                                            value={formData.capacity || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* your input fields here */}

                                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            {editingClass !== null ? 'Update Class' : 'Create Class'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>


                            </div>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {showViewModal && viewingClass && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Class Details</h2>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Class Name</p>
                                        <p className="font-semibold text-gray-900">{viewingClass.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Section</p>
                                        <p className="font-semibold text-gray-900">{viewingClass.section}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Grade Level</p>
                                        <p className="font-semibold text-gray-900">{viewingClass.gradeLevel}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Academic Year</p>
                                        <p className="font-semibold text-gray-900">{viewingClass.academicYear}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Shift</p>
                                        <p className="font-semibold text-gray-900">{viewingClass.shift}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Medium</p>
                                        <p className="font-semibold text-gray-900">{viewingClass.medium}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Capacity</p>
                                        <p className="font-semibold text-gray-900">{viewingClass.capacity}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewingClass.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {viewingClass.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Assigned Teacher */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Assigned Teacher</h3>
                                    {viewingClass.assignedTeacher ? (
                                        <div className="p-4 rounded-lg bg-blue-50">
                                            <div className="flex items-center gap-3">
                                                <UserCheck className="w-8 h-8 text-blue-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{viewingClass.assignedTeacher.name}</p>
                                                    <p className="text-sm text-gray-600">{viewingClass.assignedTeacher.subject}</p>
                                                    <p className="text-sm text-gray-600">{viewingClass.assignedTeacher.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center rounded-lg bg-gray-50">
                                            <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-gray-600">No teacher assigned</p>
                                        </div>
                                    )}
                                </div>

                                {/* Assigned Students */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                        Assigned Students ({viewingClass.assignedStudents?.length ?? 0})
                                    </h3>

                                    {viewingClass.assignedStudents && viewingClass.assignedStudents.length > 0 ? (
                                        <div className="space-y-2 overflow-y-auto max-h-40">
                                            {viewingClass.assignedStudents.map((student: Student, index: number) => (
                                                <div
                                                    key={student.id ?? index}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-green-50"
                                                >
                                                    <GraduationCap className="w-5 h-5 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{student.name ?? "Unnamed Student"}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Roll: {student.rollNumber && !isNaN(Number(student.rollNumber))
                                                                ? student.rollNumber
                                                                : "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center rounded-lg bg-gray-50">
                                            <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-gray-600">No students assigned</p>
                                        </div>
                                    )}
                                </div>


                                {/* Enrollment Progress */}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="mb-2 text-sm text-gray-600">Enrollment Progress</p>
                                    <div className="flex items-center justify-between mb-2 text-sm text-gray-900">
                                        <span>Students Enrolled</span>
                                        <span>{viewingClass.enrolledStudents || 0} / {viewingClass.capacity}</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 rounded-full">
                                        <div
                                            className="h-3 transition-all bg-blue-600 rounded-full"
                                            style={{ width: `${((viewingClass.enrolledStudents || 0) / viewingClass.capacity) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="w-full px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Teacher Assignment Modal */}
                {showTeacherModal && managingClassIndex !== null && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="w-full max-w-lg bg-white shadow-xl rounded-xl">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Assign Teacher</h2>
                                    <button
                                        onClick={() => setShowTeacherModal(false)}
                                        className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="mb-4 text-gray-600">
                                    Select a teacher for "{classes[managingClassIndex].name}"
                                </p>

                                <div className="space-y-3 overflow-y-auto max-h-60">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="teacher"
                                            value=""
                                            checked={selectedTeacher === null}
                                            onChange={() => setSelectedTeacher(null)}
                                            className="text-blue-600"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">No Teacher</p>
                                            <p className="text-sm text-gray-600">Unassign current teacher</p>
                                        </div>
                                    </label>

                                    {teachers.map((teacher) => (
                                        <label key={teacher.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="teacher"
                                                value={teacher.id}
                                                checked={selectedTeacher === teacher.id}
                                                onChange={() => setSelectedTeacher(teacher.id)}
                                                className="text-blue-600"
                                            />
                                            <UserCheck className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{teacher.name}</p>
                                                <p className="text-sm text-gray-600">{teacher.subject}</p>
                                                <p className="text-sm text-gray-600">{teacher.email}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={saveTeacherAssignment}
                                    className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Assign Teacher
                                </button>
                                <button
                                    onClick={() => setShowTeacherModal(false)}
                                    className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Student Assignment Modal */}
                {showStudentModal && managingClassIndex !== null && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Assign Students</h2>
                                <button
                                    onClick={() => setShowStudentModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="mb-4 text-gray-600">
                                    Select students for "{classes[managingClassIndex].name}"
                                    <span className="text-sm text-gray-500">
                                        (Capacity: {classes[managingClassIndex].capacity}, Selected: {selectedStudents.length})
                                    </span>
                                </p>

                                <div className="grid grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 max-h-96">
                                    {students
                                        .filter(s => s.grade === classes[managingClassIndex].gradeLevel)
                                        .map((student) => (
                                            <label key={student.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            if (selectedStudents.length < classes[managingClassIndex].capacity) {
                                                                setSelectedStudents(prev => [...prev, student.id]);
                                                            } else {
                                                                alert(`Cannot assign more than ${classes[managingClassIndex].capacity} students.`);
                                                            }
                                                        } else {
                                                            setSelectedStudents(prev => prev.filter(id => id !== student.id));
                                                        }
                                                    }}
                                                    className="text-blue-600"
                                                />
                                                <GraduationCap className="w-6 h-6 text-green-600" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{student.name}</p>
                                                    <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
                                                    <p className="text-sm text-gray-600">Grade: {student.grade}</p>
                                                </div>
                                            </label>
                                        ))}
                                </div>

                                {students.filter(s => s.grade === classes[managingClassIndex].gradeLevel).length === 0 && (
                                    <div className="py-8 text-center">
                                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600">No students found for grade {classes[managingClassIndex].gradeLevel}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={saveStudentAssignment}
                                    className="flex-1 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Assign Students ({selectedStudents.length})
                                </button>
                                <button
                                    onClick={() => setShowStudentModal(false)}
                                    className="flex-1 px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default ClassManagementPage;