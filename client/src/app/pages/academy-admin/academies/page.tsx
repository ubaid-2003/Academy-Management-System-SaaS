"use client";

/**
 * Academies List Page
 * - Grid/List toggle
 * - Search
 * - View → navigates to academy details page
 * - Edit → opens blue modal, updates academy via backend
 * - Delete
 * - TypeScript-safe handleChange for input/select/textarea
 */

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import {
  Eye,
  Edit3,
  MoreVertical,
  Users,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  User,
  Building2,
  FileText,
  Trash2,
  Plus,
  Search,
  Grid3X3,
  List,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/* ===========================
   Types
   =========================== */

interface UserAcademy {
  id: number;
  role: string;
}

export interface Academy {
  id: number;
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  province: string;
  country: string;
  email: string;
  phone: string;
  principalName: string;
  totalStudents?: number;
  totalTeachers?: number;
  status?: "Active" | "Inactive" | "Pending";
  facilities?: string;
  notes?: string;
  userAcademies?: UserAcademy[];
}

/* ===========================
   Component
   =========================== */

export default function AcademiesPage() {
  const router = useRouter();

  // Data
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Edit modal
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);
  const [formData, setFormData] = useState<Partial<Academy>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ===========================
     Effects
     =========================== */

  useEffect(() => {
    const fetchAcademies = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in.");

        const res = await fetch("http://localhost:5000/api/academies/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch user academies");
        }

        const data = await res.json();

        if (data.message === "No academy created yet.") {
          setAcademies([]);
          setError("No academies created yet.");
        } else if (Array.isArray(data)) {
          setAcademies(data);
          setError(null);
        } else {
          setError("Unexpected response from server");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch user academies");
      } finally {
        setLoading(false);
      }
    };

    fetchAcademies();
  }, []);

  /* ===========================
     Derived
     =========================== */

  const filteredAcademies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return academies;
    return academies.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.registrationNumber.toLowerCase().includes(q)
    );
  }, [academies, searchTerm]);

  /* ===========================
     Helpers
     =========================== */

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "owner":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "teacher":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "principal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const closeDropdown = () => setActiveDropdown(null);

  /* ===========================
     Navigation
     =========================== */

  // 👉 When user clicks "View", push to details page with this academy id
  const handleView = (academyId: number) => {
    router.push(`/pages/academy-admin/academies/${academyId}`);
  };

  /* ===========================
     Edit Flow
     =========================== */

  // Open modal with academy data
  const handleEdit = (academyId: number) => {
    const academy = academies.find((a) => a.id === academyId);
    if (academy) {
      setSelectedAcademy(academy);
      setFormData(academy);
    }
    closeDropdown();
    setSaveError(null);
    setSaveSuccess(null);
  };

  // Unified change handler for <input>, <textarea>, <select>
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveError(null);
    setSaveSuccess(null);
  };

  // Update academy via API
  const handleUpdate = async () => {
    if (!selectedAcademy) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.put(
        `http://localhost:5000/api/academies/${selectedAcademy.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated: Academy = res.data?.academy ?? selectedAcademy;

      // Update local list
      setAcademies((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );

      setSelectedAcademy(null);
      setSaveSuccess("Academy updated successfully!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update academy.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ===========================
     Delete
     =========================== */

  const handleDelete = async (academyId: number) => {
    if (!confirm("Are you sure you want to delete this academy?")) return;
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/academies/${academyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) throw new Error("Failed to delete academy");
      setAcademies((prev) => prev.filter((a) => a.id !== academyId));
    } catch (err) {
      console.error("Failed to delete academy", err);
      setError("Failed to delete academy");
      setLoading(false);
    }
  };

  /* ===========================
     Render
     =========================== */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin" />
              <span className="text-lg font-medium text-slate-600">
                Loading academies...
              </span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* ================= Header ================= */}
        <div className="bg-white border-b border-slate-200">
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  My Academies
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  Manage and overview all your academy institutions
                </p>
              </div>

              <button
                onClick={() =>
                  router.push("/pages/academy-admin/add-academy")
                }
                className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 shadow-sm rounded-xl hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Academy
              </button>
            </div>

            {/* Stats + Filters */}
            <div className="flex flex-col gap-4 mt-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">
                    {filteredAcademies.length}{" "}
                    {filteredAcademies.length === 1 ? "Academy" : "Academies"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search academies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 py-2 pl-10 pr-4 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center p-1 border rounded-lg border-slate-300">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Content ================= */}
        <div className="px-6 py-8">
          {error && (
            <div className="p-4 mb-8 border border-red-200 bg-red-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full">
                  <span className="text-xs text-red-600">!</span>
                </div>
                <p className="font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {!error && filteredAcademies.length === 0 && !loading && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                No academies found
              </h3>
              <p className="mb-6 text-slate-600">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first academy"}
              </p>
              <button
                onClick={() =>
                  router.push("/pages/academy-admin/add-academy")
                }
                className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Academy
              </button>
            </div>
          )}

          {/* Grid/List */}
          {filteredAcademies.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAcademies.map((academy) => {
                const userRole = academy.userAcademies?.[0]?.role || "Member";

                return (
                  <div
                    key={academy.id}
                    className={`bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                      viewMode === "list" ? "flex items-center p-6" : "p-6"
                    }`}
                  >
                    {/* Header */}
                    <div className={`${viewMode === "list" ? "flex-1" : "mb-4"}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={
                            viewMode === "list" ? "flex items-center space-x-4" : ""
                          }
                        >
                          <div
                            className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center ${
                              viewMode === "list" ? "" : "mb-3"
                            }`}
                          >
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold leading-tight text-slate-900">
                              {academy.name}
                            </h3>
                            <div className="flex items-center mt-1 space-x-2">
                              <FileText className="w-3 h-3 text-slate-400" />
                              <p className="text-sm font-medium text-slate-500">
                                Reg# {academy.registrationNumber}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === academy.id ? null : academy.id
                              )
                            }
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            aria-label="Open card menu"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeDropdown === academy.id && (
                            <div className="absolute right-0 z-10 w-56 mt-2 bg-white border shadow-lg border-slate-200 rounded-xl">
                              <button
                                onClick={() => {
                                  handleView(academy.id);
                                  closeDropdown();
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-t-xl"
                              >
                                <Eye className="w-4 h-4 mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  handleEdit(academy.id);
                                  closeDropdown();
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit3 className="w-4 h-4 mr-3" />
                                Edit Academy
                              </button>
                              <hr className="border-slate-100" />
                              <button
                                onClick={() => {
                                  handleDelete(academy.id);
                                  closeDropdown();
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete Academy
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role */}
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                            userRole
                          )}`}
                        >
                          <User className="w-3 h-3 mr-1" />
                          {userRole}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div
                      className={`space-y-3 ${
                        viewMode === "list" ? "flex-1 ml-6" : ""
                      }`}
                    >
                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm">
                          {academy.city}, {academy.province}, {academy.country}
                        </span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <User className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm font-medium">
                          Principal: {academy.principalName}
                        </span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <Mail className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm">{academy.email}</span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <Phone className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm">{academy.phone}</span>
                      </div>

                      {(academy.totalStudents || academy.totalTeachers) && (
                        <div className="flex items-center pt-2 space-x-4 border-t border-slate-100">
                          {academy.totalStudents && (
                            <div className="flex items-center text-slate-600">
                              <Users className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="text-sm font-medium">
                                {academy.totalStudents} Students
                              </span>
                            </div>
                          )}
                          {academy.totalTeachers && (
                            <div className="flex items-center text-slate-600">
                              <GraduationCap className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="text-sm font-medium">
                                {academy.totalTeachers} Teachers
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      className={`flex space-x-2 ${
                        viewMode === "list"
                          ? "ml-6"
                          : "mt-6 pt-4 border-t border-slate-100"
                      }`}
                    >
                      <button
                        onClick={() => handleView(academy.id)}
                        className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(academy.id)}
                        className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= Edit Modal ================= */}
          {selectedAcademy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-300 bg-opacity-80">
              <div className="p-6 bg-white shadow-lg rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold">Edit Academy</h2>
                  <button
                    className="p-2 rounded text-slate-500 hover:bg-slate-100"
                    onClick={() => setSelectedAcademy(null)}
                    aria-label="Close edit modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Success / Error banners */}
                {saveSuccess && (
                  <div className="flex items-center p-3 mb-4 text-green-800 rounded-lg bg-green-50">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="text-sm">{saveSuccess}</span>
                  </div>
                )}
                {saveError && (
                  <div className="flex items-center p-3 mb-4 text-red-800 rounded-lg bg-red-50">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{saveError}</span>
                  </div>
                )}

                {/* Academy Name & Registration Number */}
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Academy Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="Enter academy name"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber || ""}
                      onChange={handleChange}
                      placeholder="Enter registration number"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Complete Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Province *
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province || ""}
                      onChange={handleChange}
                      placeholder="Enter province"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || "Pakistan"}
                      onChange={handleChange}
                      placeholder="Enter country"
                      className="w-full p-2 border rounded bg-slate-100"
                      disabled
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                {/* Administration Details */}
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Principal Name *
                    </label>
                    <input
                      type="text"
                      name="principalName"
                      value={formData.principalName || ""}
                      onChange={handleChange}
                      placeholder="Enter principal's full name"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Total Students *
                    </label>
                    <input
                      type="number"
                      name="totalStudents"
                      value={
                        typeof formData.totalStudents === "number"
                          ? String(formData.totalStudents)
                          : formData.totalStudents || ""
                      }
                      onChange={handleChange}
                      placeholder="Enter number of students"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">
                    Facilities *
                  </label>
                  <textarea
                    name="facilities"
                    value={formData.facilities || ""}
                    onChange={handleChange}
                    placeholder="Describe the facilities available at the academy..."
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-1 text-sm font-medium">Notes *</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    placeholder="Any additional notes..."
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    className="inline-flex items-center px-4 py-2 rounded text-slate-700 bg-slate-100 hover:bg-slate-200"
                    onClick={() => setSelectedAcademy(null)}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-60"
                    onClick={handleUpdate}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
