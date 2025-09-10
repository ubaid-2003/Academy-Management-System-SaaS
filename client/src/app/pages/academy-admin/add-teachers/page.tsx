"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Eye,
  X,
  Filter,
  ChevronDown,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  GraduationCap,
  Save,
  CheckCircle,
  AlertCircle,
  Users,
  UserCheck,
  Trash2
} from "lucide-react";


import DashboardLayout from "@/app/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useAcademy } from '../../../context/AcademyContext'; // adjust path

// ================= TYPES =================
interface Teacher {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: "male" | "female" | "other" | "";
  address?: string;
  city?: string;
  province?: string;
  country: string;
  qualification?: string;
  experienceYears?: number;
  employeeId: string;
  status: "active" | "inactive" | "suspended";
  subjects: string[]; // JSON array of subjects
  academyId?: number;
}

const TeacherManagementPage: React.FC = () => {
  const router = useRouter();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  // Filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  const { currentAcademy } = useAcademy();

  // Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<Teacher>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    dateOfBirth: "",
    employeeId: "",
    qualification: "",
    experienceYears: 0,
    address: "",
    city: "",
    province: "",
    country: "Pakistan",
    status: "active",
    subjects: [],
  });


  // ================= API CALLS =================

  // Fetch all teachers for the active academy
  const fetchTeachers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user?.token;

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/academies/${user.activeAcademyId}/teachers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Create or POST a new teacher
  const createTeacher = async (teacherData: Teacher & { academyId?: number }) => {
    try {
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const academyId = teacherData.academyId || user?.activeAcademyId;

      if (!user?.token) throw new Error("Not authorized");
      if (!academyId) throw new Error("No active academy selected");

      // Merge academyId into payload
      const payload = { ...teacherData, academyId };

      const res = await fetch(
        `http://localhost:5000/api/academies/${academyId}/teachers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create teacher");
      }

      return await res.json();
    } catch (err: any) {
      console.error("Create Teacher Error:", err);
      throw err;
    }
  };


  // Update teacher
  const updateTeacher = async (id: number, updatedData: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user?.token;
      if (!token) throw new Error("Not authorized");

      const res = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update teacher");
      }

      return await res.json();
    } catch (err) {
      console.error("Update Teacher Error:", err);
      throw err;
    }
  };

  // Delete teacher
  const deleteTeacher = async (id: number) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const academyId = user.activeAcademyId;
      if (!academyId) throw new Error("No active academy selected");

      const res = await fetch(`http://localhost:5000/api/teachers/${id}?academyId=${academyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete teacher");
      }

      return await res.json();
    } catch (err) {
      console.error("Delete Teacher Error:", err);
      throw err;
    }
  };


  // ================= FORM HANDLERS =================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "subjects") {
      setFormData((prev) => ({ ...prev, subjects: value.split(",").map(s => s.trim()) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  // ✅ Reset form correctly
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "male",
      dateOfBirth: "",
      employeeId: "",
      qualification: "",
      experienceYears: 0,
      address: "",
      city: "",
      province: "",
      country: "Pakistan",
      status: "active",
      subjects: [],
    });
    setEditingTeacher(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Use AuthContext / AcademyContext for active academy
      const academyId = currentAcademy?.id; // make sure currentAcademy comes from useAcademy()

      if (!academyId) {
        alert("Please create or select an academy first");
        return;
      }

      // Merge academyId into teacher payload
      const teacherPayload = {
        ...formData,
        academyId,
      };

      if (editingTeacher) {
        // UPDATE teacher
        const updated = await updateTeacher(editingTeacher.id!, teacherPayload);
        setTeachers((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        alert("Teacher updated successfully");
      } else {
        // CREATE teacher
        const created = await createTeacher(teacherPayload);
        setTeachers((prev) => [...prev, created]);
        alert("Teacher created successfully");
      }

      resetForm(); // reset form fields
    } catch (err: any) {
      console.error("Error saving teacher:", err);
      alert("Error saving teacher: " + (err.message || "Unknown error"));
    }
  };



  // ✅ Edit handler fixed
  const handleEdit = (teacher: Teacher) => {
    setFormData(teacher); // copy selected teacher into form
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await deleteTeacher(id); // sends token automatically
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error("Error deleting teacher:", err);
      alert(err.message);
    }
  };


  // ================= EFFECT =================

  useEffect(() => {
    fetchTeachers();
  }, []);


  // ================= FILTERS =================
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterSubject("All");
  };

  const subjects = ["All", ...Array.from(new Set(teachers.flatMap(t => t.subjects)))];
  const statuses = ["All", "Active", "Inactive", "suspended"];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = [teacher.firstName, teacher.lastName, teacher.email, teacher.employeeId]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "All" || teacher.status === filterStatus;
    const matchesSubject =
      filterSubject === "All" ||
      (Array.isArray(teacher.subjects) && teacher.subjects.includes(filterSubject));
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100 text-gray-800";
    if (status === "active") bgColor = "bg-green-100 text-green-800 border border-green-200";
    else if (status === "suspended") bgColor = "bg-yellow-100 text-yellow-800 border border-yellow-200";
    else if (status === "Inactive") bgColor = "bg-red-100 text-red-800 border border-red-200";

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${bgColor}`}>
        {status}
      </span>
    );
  };

  // View Teacher Modal
  const ViewTeacherModal = ({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-auto max-h-[90vh]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Teacher Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 transition-colors rounded-lg hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Teacher Info Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                    <span className="font-medium">{teacher.firstName} {teacher.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee ID:</span>
                    <span className="font-mono font-medium text-blue-600">{teacher.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{teacher.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="font-medium">
                      {teacher.dateOfBirth
                        ? new Date(teacher.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </span>
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
                    <span className="font-medium text-blue-600">{teacher.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{teacher.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="mt-1 font-medium">{teacher.address}, {teacher.city}, {teacher.province}, {teacher.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Professional Information */}
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="flex items-center mb-4 font-semibold text-gray-800">
                  <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                  Professional Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Qualification:</span>
                    <span className="font-medium">{teacher.qualification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium text-purple-600">{teacher.subjects}</span>
                  </div>
                  <div className="flex justify-between">

                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <StatusBadge status={teacher.status} />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="flex items-center mb-4 font-semibold text-gray-800">
                  <Phone className="w-5 h-5 mr-2 text-red-600" />
                  Emergency Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{teacher.phone}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={() => {
                onClose();
                handleEdit(teacher);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit Teacher
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

  // Form Modal
  const renderFormModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 text-gray-500 transition-colors rounded-lg hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="pr-2 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="flex items-center pb-2 mb-4 text-lg font-semibold text-gray-700 border-b border-gray-200">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="flex items-center pb-2 mb-4 text-lg font-semibold text-gray-700 border-b border-gray-200">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+92-300-1234567"
                    className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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

            {/* Professional Information */}
            <div className="mb-8">
              <h3 className="flex items-center pb-2 mb-4 text-lg font-semibold text-gray-700 border-b border-gray-200">
                <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Qualification *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., M.Sc Mathematics"
                    className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Subject *</label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects.join(", ")}
                    onChange={handleInputChange}
                    placeholder="e.g., Math, Science"
                    className="w-full px-4 py-2 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                </div>


                <div>
                  <label className="block mb-2 font-medium text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="Auto-generated if empty"
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-8">
              <h3 className="flex items-center pb-2 mb-4 text-lg font-semibold text-gray-700 border-b border-gray-200">
                <Phone className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contact
              </h3>

            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Notification */}
        {notification && (
          <div className="fixed z-50 top-4 right-4">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
              }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-gray-800">Teacher Management</h1>
                <p className="text-lg text-gray-600">Manage your academy's teaching staff efficiently</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" /> Add New Teacher
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-800">{teachers.length}</h3>
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                </div>
              </div>
            </div>

            <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {teachers.filter(t => t.status === "active").length}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                </div>
              </div>
            </div>

            <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {teachers.filter(t => t.status === "suspended").length}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                </div>
              </div>
            </div>

            <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {Array.from(new Set(teachers.map(t => t.subjects))).length}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">Subjects Taught</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 mb-8 bg-white border border-gray-100 shadow-lg rounded-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex items-center flex-1 gap-2 p-3 transition-all duration-200 border-2 border-gray-200 rounded-lg bg-gray-50 focus-within:border-blue-500 focus-within:bg-white">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-gray-700 placeholder-gray-500 bg-transparent focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 rounded-lg ${showFilters
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 border-2 border-gray-200 rounded-lg hover:bg-gray-200"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 gap-4 pt-6 mt-6 border-t border-gray-200 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Filter by Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 transition border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Filter by Subject</label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full px-4 py-2 transition border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Subjects</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    <strong>{filteredTeachers.length}</strong> of <strong>{teachers.length}</strong> teachers shown
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teachers Grid/Table */}
          <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
            {filteredTeachers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-xl font-semibold text-gray-600">No Teachers Found</h3>
                <p className="mb-6 text-gray-500">
                  {searchTerm || filterStatus !== "All" || filterSubject !== "All"
                    ? "Try adjusting your search criteria or filters"
                    : "Start by adding your first teacher to the system"
                  }
                </p>
                {!searchTerm && filterStatus === "All" && filterSubject === "All" && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 mx-auto text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Plus className="w-5 h-5" /> Add First Teacher
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-600 uppercase">
                        Teacher Information
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-600 uppercase">
                        Contact Details
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-600 uppercase">
                        Professional Info
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeachers.map((teacher, index) => (
                      <tr key={teacher.id} className="transition-all duration-200 hover:bg-gray-50 hover:shadow-md">
                        {/* Teacher Information */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-12 h-12">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                                <span className="text-lg font-bold text-white">
                                  {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">
                                {teacher.firstName} {teacher.lastName}
                              </div>
                              <div className="font-mono text-sm text-gray-500">
                                ID: {teacher.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Details */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {teacher.email}
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {teacher.phone}
                          </div>
                        </td>

                        {/* Professional Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                            {teacher.subjects}
                          </div>
                          <div className="text-sm text-gray-500">{teacher.qualification}</div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={teacher.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingTeacher(teacher)}
                              className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" /> View
                            </button>
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="flex items-center gap-1 px-3 py-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(teacher.id!)}
                              className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showForm && renderFormModal()}
        {viewingTeacher && (
          <ViewTeacherModal
            teacher={viewingTeacher}
            onClose={() => setViewingTeacher(null)}
          />
        )}
      </div>
    </DashboardLayout>

  );
};

export default TeacherManagementPage;