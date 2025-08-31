"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Eye, Trash2, Filter, X, User, Mail, Phone, BookOpen, Calendar, ChevronDown, MapPin, Users, GraduationCap, Home, Shield } from "lucide-react";
import DashboardLayout from "@/app/components/DashboardLayout";

// -----------------------------
// Student Type
// -----------------------------
interface Student {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    registrationNumber: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    class: string;
    section: string;
    address: string;
    city: string;
    province: string;
    country: string;
    fatherName: string;
    motherName: string;
    guardianContact: string;
    bloodGroup: string;
    enrollmentDate: string;
    status: string;
    notes: string;
    teacherIds: number[];
}

// -----------------------------
// Component
// -----------------------------
const StudentRegistrationPage: React.FC = () => {
    const router = useRouter();

    // -----------------------------
    // State
    // -----------------------------
    const [students, setStudents] = useState<Student[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState<number | null>(null);
    const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterClass, setFilterClass] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    // Initial form data
    const [formData, setFormData] = useState<Student>({
        firstName: "",
        lastName: "",
        email: "",
        registrationNumber: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        class: "",
        section: "",
        address: "",
        city: "",
        province: "",
        country: "Pakistan",
        fatherName: "",
        motherName: "",
        guardianContact: "",
        bloodGroup: "",
        enrollmentDate: "",
        status: "Active",
        notes: "",
        teacherIds: []
    });

    // -----------------------------
    // Fetch Students from Backend
    // -----------------------------
    const fetchStudents = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/students", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch students");
            const data = await res.json();
            setStudents(data.students || []);
        } catch (err) {
            console.error("Fetch students error:", err);
        }
    };

    useEffect(() => {
        fetchStudents();

        // User Role
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserRole(user?.role || null);

        // Redirect if not Admin/SuperAdmin
        if (user?.role !== "Admin" && user?.role !== "SuperAdmin") {
            router.push("/academy-admin");
        }
    }, [router]);

    // -----------------------------
    // Filter Options
    // -----------------------------
    const classes = ["All", ...Array.from(new Set(students.map(s => s.class)))];
    const statuses = ["All", "Active", "Inactive", "Graduated", "Transferred"];

    // -----------------------------
    // Filtered Students
    // -----------------------------
    const filteredStudents = students.filter((student) => {
        const matchesSearch = [student.firstName, student.lastName, student.email, student.registrationNumber]
            .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === "All" || student.status === filterStatus;
        const matchesClass = filterClass === "All" || student.class === filterClass;
        return matchesSearch && matchesStatus && matchesClass;
    });

    // -----------------------------
    // Handlers
    // -----------------------------
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const generateRegistrationNumber = () => {
        const maxId = students.reduce((max, s) => {
            const num = parseInt(s.registrationNumber.replace("STU", "")) || 0;
            return num > max ? num : max;
        }, 125);
        return `STU${maxId + 1}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = {
            ...formData,
            registrationNumber: formData.registrationNumber || generateRegistrationNumber(),
        };

        try {
            if (editingStudent !== null) {
                // Update existing student
                const studentId = students[editingStudent]?.id;
                if (!studentId) throw new Error("Student ID is missing");

                const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to update student");
            } else {
                // Create new student
                const res = await fetch("http://localhost:5000/api/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to create student");
            }

            await fetchStudents();
            resetForm();
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            registrationNumber: "",
            phone: "",
            dateOfBirth: "",
            gender: "",
            class: "",
            section: "",
            address: "",
            city: "",
            province: "",
            country: "Pakistan",
            fatherName: "",
            motherName: "",
            guardianContact: "",
            bloodGroup: "",
            enrollmentDate: "",
            status: "Active",
            notes: "",
            teacherIds: []
        });
        setShowForm(false);
        setEditingStudent(null);
    };

    const handleEdit = (index: number) => {
        setFormData(students[index]);
        setEditingStudent(index);
        setShowForm(true);
    };

    const handleDelete = async (index: number) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;

        const token = localStorage.getItem("token");
        const studentId = students[index]?.id;
        if (!studentId) return;

        try {
            const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete student");

            await fetchStudents();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("All");
        setFilterClass("All");
    };

    // -----------------------------
    // Status Badge Component
    // -----------------------------
    const StatusBadge = ({ status }: { status: string }) => {
        let bgColor = "bg-gray-100 text-gray-800";

        if (status === "Active") {
            bgColor = "bg-green-100 text-green-800";
        } else if (status === "Graduated") {
            bgColor = "bg-blue-100 text-blue-800";
        } else if (status === "Transferred") {
            bgColor = "bg-yellow-100 text-yellow-800";
        } else if (status === "Inactive") {
            bgColor = "bg-red-100 text-red-800";
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`}>
                {status}
            </span>
        );
    };

    // -----------------------------
    // Student Details Modal
    // -----------------------------
    const StudentDetailsModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-auto max-h-[90vh]">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 transition-colors rounded-lg hover:text-gray-700 hover:bg-gray-100"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Student Info Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="flex items-center mb-4 font-semibold text-gray-800">
                                    <User className="w-5 h-5 mr-2 text-blue-600" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Full Name:</span>
                                        <span className="font-medium">{student.firstName} {student.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Registration Number:</span>
                                        <span className="font-mono font-medium text-blue-600">{student.registrationNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gender:</span>
                                        <span className="font-medium">{student.gender}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date of Birth:</span>
                                        <span className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Blood Group:</span>
                                        <span className="font-medium">{student.bloodGroup}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="flex items-center mb-4 font-semibold text-gray-800">
                                    <Mail className="w-5 h-5 mr-2 text-green-600" />
                                    Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium text-blue-600">{student.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium">{student.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Academic Information */}
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="flex items-center mb-4 font-semibold text-gray-800">
                                    <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                                    Academic Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Class:</span>
                                        <span className="font-medium">Class {student.class}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Section:</span>
                                        <span className="font-medium">{student.section}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Enrollment Date:</span>
                                        <span className="font-medium">{new Date(student.enrollmentDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <StatusBadge status={student.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="flex items-center mb-4 font-semibold text-gray-800">
                                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                                    Address Information
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Address:</span>
                                        <span className="font-medium text-right">{student.address}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">City:</span>
                                        <span className="font-medium">{student.city}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Province:</span>
                                        <span className="font-medium">{student.province}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Country:</span>
                                        <span className="font-medium">{student.country}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guardian Information */}
                    <div className="p-4 mt-6 rounded-lg bg-gray-50">
                        <h3 className="flex items-center mb-4 font-semibold text-gray-800">
                            <Shield className="w-5 h-5 mr-2 text-orange-600" />
                            Guardian Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Father's Name:</span>
                                    <span className="font-medium">{student.fatherName}</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mother's Name:</span>
                                    <span className="font-medium">{student.motherName}</span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Guardian Contact:</span>
                                    <span className="font-medium">{student.guardianContact}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {student.notes && (
                        <div className="p-4 mt-6 rounded-lg bg-gray-50">
                            <h3 className="mb-4 font-semibold text-gray-800">Additional Notes</h3>
                            <p className="text-gray-700">{student.notes}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
                        <button
                            onClick={() => {
                                onClose();
                                const index = students.findIndex(s => s.id === student.id);
                                if (index !== -1) handleEdit(index);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Student
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // -----------------------------
    // JSX for Form Modal
    // -----------------------------
    const renderFormModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-auto max-h-[90vh]">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 mb-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingStudent !== null ? 'Edit Student' : 'Add New Student'}
                        </h2>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-gray-500 transition-colors hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="pr-2 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                        {/* Basic Information */}
                        <div className="mb-6">
                            <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-700 border-b">Basic Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Registration Number</label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleInputChange}
                                        placeholder="Auto-generated if empty"
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Blood Group</label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="mb-6">
                            <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-700 border-b">Academic Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Class *</label>
                                    <select
                                        name="class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Class</option>
                                        <option value="1st">1st</option>
                                        <option value="2nd">2nd</option>
                                        <option value="3rd">3rd</option>
                                        <option value="4th">4th</option>
                                        <option value="5th">5th</option>
                                        <option value="6th">6th</option>
                                        <option value="7th">7th</option>
                                        <option value="8th">8th</option>
                                        <option value="9th">9th</option>
                                        <option value="10th">10th</option>
                                        <option value="11th">11th</option>
                                        <option value="12th">12th</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Section *</label>
                                    <select
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Section</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Enrollment Date *</label>
                                    <input
                                        type="date"
                                        name="enrollmentDate"
                                        value={formData.enrollmentDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Graduated">Graduated</option>
                                        <option value="Transferred">Transferred</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="mb-6">
                            <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-700 border-b">Address Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-medium text-gray-700">Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Province *</label>
                                    <select
                                        name="province"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Province</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Sindh">Sindh</option>
                                        <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                                        <option value="Balochistan">Balochistan</option>
                                        <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Guardian Information */}
                        <div className="mb-6">
                            <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-700 border-b">Guardian Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Father's Name *</label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Mother's Name *</label>
                                    <input
                                        type="text"
                                        name="motherName"
                                        value={formData.motherName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Guardian Contact *</label>
                                    <input
                                        type="tel"
                                        name="guardianContact"
                                        value={formData.guardianContact}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-gray-700">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Additional notes about the student..."
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 mr-4 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            {editingStudent !== null ? 'Update Student' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen p-6 bg-gray-50">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
                            <p className="mt-1 text-gray-600">Manage all student records in one place</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                        >
                            <Plus className="w-5 h-5" /> Add Student
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-gray-800">{students.length}</h3>
                                    <p className="text-sm text-gray-600">Total Students</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <User className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {students.filter(s => s.status === "Active").length}
                                    </h3>
                                    <p className="text-sm text-gray-600">Active Students</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {Array.from(new Set(students.map(s => s.class))).length}
                                    </h3>
                                    <p className="text-sm text-gray-600">Classes</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <User className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {students.filter(s => s.status === "Graduated").length}
                                    </h3>
                                    <p className="text-sm text-gray-600">Graduated</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex items-center flex-1 gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50">
                                <Search className="w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or registration number"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent focus:outline-none"
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Clear Filters
                            </button>
                        </div>

                        {/* Expanded Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Class</label>
                                    <select
                                        value={filterClass}
                                        onChange={(e) => setFilterClass(e.target.value)}
                                        className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {classes.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Students Table */}
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Student Details</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Academic Info</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Contact</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Guardian</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={index} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                                                        <span className="font-semibold text-blue-600">
                                                            {student.firstName[0]}{student.lastName[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.firstName} {student.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{student.registrationNumber}</div>
                                                        <div className="text-sm text-gray-500">
                                                            DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">Class {student.class} - Section {student.section}</div>
                                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                                                </div>
                                                {student.bloodGroup && (
                                                    <div className="text-sm text-gray-500">Blood: {student.bloodGroup}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-900">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {student.email || 'No email'}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    {student.phone || 'No phone'}
                                                </div>
                                                <div className="text-sm text-gray-500">{student.city}, {student.province}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">Father: {student.fatherName}</div>
                                                <div className="text-sm text-gray-900">Mother: {student.motherName}</div>
                                                <div className="text-sm text-gray-500">Contact: {student.guardianContact}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={student.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setViewingStudent(student)}
                                                        className="p-1 text-blue-600 transition-colors rounded-full hover:text-blue-800 hover:bg-blue-50"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(index)}
                                                        className="p-1 text-green-600 transition-colors rounded-full hover:text-green-800 hover:bg-green-50"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(index)}
                                                        className="p-1 text-red-600 transition-colors rounded-full hover:text-red-800 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <User className="w-12 h-12 mb-2 text-gray-300" />
                                                    <p className="text-lg font-medium">No students found</p>
                                                    <p className="text-sm">Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Form Modal */}
                    {showForm && renderFormModal()}

                    {/* Student Details Modal */}
                    {viewingStudent && (
                        <StudentDetailsModal
                            student={viewingStudent}
                            onClose={() => setViewingStudent(null)}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentRegistrationPage;