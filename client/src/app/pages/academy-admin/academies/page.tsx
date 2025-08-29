"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import { useRouter } from "next/navigation";

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
  CheckCircle,
  AlertTriangle,
  Calendar,
  Award,
} from "lucide-react";

interface Academy {
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
  facilities?: string;
  notes?: string;
  status?: "Active" | "Inactive";
  totalTeachers?: number;
  userAcademies?: { id: number; role: string }[];
}

export default function AcademiesPage() {

  const router = useRouter();

  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [academyToDelete, setAcademyToDelete] = useState<Academy | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Academy>>({});

  useEffect(() => {
    const fetchAcademies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in.");

        const res = await fetch("http://localhost:5000/api/academies/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (Array.isArray(data)) setAcademies(data);
        else setError("No academies created yet.");
      } catch (err: any) {
        setError(err.message || "Failed to fetch academies");
      } finally {
        setLoading(false);
      }
    };
    fetchAcademies();
  }, []);


const filteredAcademies = academies.filter(
  (a) =>
    (a.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (a.city?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (a.registrationNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase())
);

const closeModals = () => {
  setIsDeleteModalOpen(false);
  setAcademyToDelete(null); // reset selection
};

  const handleView = (academy: Academy) => {
    setSelectedAcademy(academy);
    setIsViewModalOpen(true);
    setActiveDropdown(null);
  };

  const handleEdit = (academy: Academy) => {
    setSelectedAcademy(academy);
    setEditFormData(academy);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (academy: Academy) => {
    setAcademyToDelete(academy);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };
  const handleClick = () => {
    router.push("/pages/academy-admin/add-academy");
  };
const handleConfirmDelete = async () => {
  if (!academyToDelete) return;
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    await axios.delete(
      `http://localhost:5000/api/academies/${academyToDelete.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Remove deleted academy from state
    setAcademies(prev => prev.filter(a => a.id !== academyToDelete.id));
    closeModals();
  } catch (err: any) {
    alert(err.response?.data?.message || err.message || "Failed to delete");
  }
};


  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200";
      case "owner":
        return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200";
      case "teacher":
        return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200";
      case "principal":
        return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200";
      default:
        return "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-200";
    }
  };
const handleEditFormChange = (field: keyof Academy, value: any) => {
  setEditFormData(prev => ({ ...prev, [field]: value }));
};


  const handleEditFormSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/academies/${selectedAcademy?.id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcademies((prev) =>
        prev.map((a) => (a.id === selectedAcademy?.id ? response.data : a))
      );
      setIsEditModalOpen(false);
      setSelectedAcademy(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update academy");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 rounded-full border-slate-200"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800">Loading Academies</h3>
              <p className="text-slate-600">Please wait while we fetch your academies...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
          <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
          <div className="relative flex flex-col justify-between p-8 md:flex-row md:items-center">
            <div>
              <div className="flex items-center mb-3 space-x-3">
                <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
                  <Building2 className="text-white w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-800">My Academies</h1>
                  <p className="font-medium text-slate-600">Manage and overview your educational institutions</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>{academies.length} Total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{academies.filter(a => a.status === "Active").length} Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClick}
              className="flex items-center px-6 py-3 mt-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 md:mt-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Academy
            </button>
          </div>
        </div>

        {/* Enhanced Search & Controls */}
        <div className="p-6 bg-white border shadow-sm border-slate-200 rounded-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search academies by name, city, or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 transition-all duration-200 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center overflow-hidden border border-slate-200 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center px-4 py-2 transition-colors ${viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-4 py-2 transition-colors ${viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Academy List */}
        {error && (
          <div className="flex items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl">
            <div className="text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-800">No Academies Found</h3>
              <p className="mb-4 text-slate-600">{error}</p>
              <button className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700">
                Create Your First Academy
              </button>
            </div>
          </div>
        )}

        {filteredAcademies.length === 0 && !error ? (
          <div className="flex items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl">
            <div className="text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-800">No Results Found</h3>
              <p className="text-slate-600">Try adjusting your search criteria</p>
            </div>
          </div>
        ) : (
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
                  className={`group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${viewMode === "list" ? "flex items-center" : ""
                    }`}
                >
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center transition-all duration-300 shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:shadow-xl">
                          <GraduationCap className="text-white w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold transition-colors text-slate-800 group-hover:text-slate-900">
                            {academy.name}
                          </h3>
                          <p className="text-sm font-medium text-slate-500">
                            REG# {academy.registrationNumber}
                          </p>
                          <div className="flex items-center mt-1 space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500">{academy.city}, {academy.province}</span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === academy.id ? null : academy.id
                            )
                          }
                          className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {activeDropdown === academy.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute right-0 z-20 w-48 mt-2 overflow-hidden bg-white border shadow-xl border-slate-200 rounded-xl">
                              <button
                                onClick={() => handleView(academy)}
                                className="flex items-center w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
                              >
                                <Eye className="w-4 h-4 mr-3 text-slate-500" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(academy)}
                                className="flex items-center w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
                              >
                                <Edit3 className="w-4 h-4 mr-3 text-slate-500" />
                                Edit Academy
                              </button>
                              <div className="border-t border-slate-100">
                                <button
                                  onClick={() => handleDeleteClick(academy)}
                                  className="flex items-center w-full px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-3" />
                                  Delete Academy
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 space-y-3">
                      {/* Role Badge */}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(userRole)}`}
                      >
                        <User className="w-3 h-3 mr-1" />
                        {userRole}
                      </span>

                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${academy.status === "Active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                        >
                          {academy.status === "Active" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {academy.status}
                        </span>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center space-x-4 text-xs text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{academy.totalStudents || 0} Students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>{academy.totalTeachers || 0} Teachers</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(academy)}
                        className="flex items-center justify-center flex-1 px-4 py-2 font-medium transition-colors rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(academy)}
                        className="flex items-center justify-center flex-1 px-4 py-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Professional View Modal */}
        {isViewModalOpen && selectedAcademy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedAcademy.name}</h2>
                    <p className="text-slate-600">Academy Details Overview</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                {/* Basic Information */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-slate-800">
                    <FileText className="w-5 h-5 mr-2" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div>
                      <span className="font-medium text-slate-600">Registration Number:</span>
                      <p className="font-semibold text-slate-800">{selectedAcademy.registrationNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Status:</span>
                      <p className={`font-semibold ${selectedAcademy.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedAcademy.status}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Principal:</span>
                      <p className="font-semibold text-slate-800">{selectedAcademy.principalName}</p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-slate-800">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-slate-600">Address:</span> <span className="text-slate-800">{selectedAcademy.address}</span></p>
                    <p><span className="font-medium text-slate-600">City:</span> <span className="text-slate-800">{selectedAcademy.city}</span></p>
                    <p><span className="font-medium text-slate-600">Province:</span> <span className="text-slate-800">{selectedAcademy.province}</span></p>
                    <p><span className="font-medium text-slate-600">Country:</span> <span className="text-slate-800">{selectedAcademy.country}</span></p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-slate-800">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-800">{selectedAcademy.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-800">{selectedAcademy.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-slate-800">
                    <Users className="w-5 h-5 mr-2" />
                    Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 text-center bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedAcademy.totalStudents || 0}</div>
                      <div className="text-xs font-medium text-slate-600">Total Students</div>
                    </div>
                    <div className="p-4 text-center bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedAcademy.totalTeachers || 0}</div>
                      <div className="text-xs font-medium text-slate-600">Total Teachers</div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {(selectedAcademy.facilities || selectedAcademy.notes) && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="mb-4 text-lg font-semibold text-slate-800">Additional Information</h3>
                    {selectedAcademy.facilities && (
                      <div className="mb-3">
                        <span className="font-medium text-slate-600">Facilities:</span>
                        <p className="mt-1 text-slate-800">{selectedAcademy.facilities}</p>
                      </div>
                    )}
                    {selectedAcademy.notes && (
                      <div>
                        <span className="font-medium text-slate-600">Notes:</span>
                        <p className="mt-1 text-slate-800">{selectedAcademy.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 space-x-3 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 font-medium transition-colors text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEdit(selectedAcademy);
                  }}
                  className="px-6 py-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700"
                >
                  Edit Academy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Professional Edit Modal */}
        {isEditModalOpen && selectedAcademy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Edit Academy</h2>
                    <p className="text-slate-600">Update {selectedAcademy.name} details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 transition-colors rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Academy Name</label>
                    <input
                      type="text"
                      placeholder="Enter academy name"
                      value={editFormData.name || ""}
                      onChange={(e) => handleEditFormChange("name", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Registration Number</label>
                    <input
                      type="text"
                      placeholder="Enter registration number"
                      value={editFormData.registrationNumber || ""}
                      onChange={(e) => handleEditFormChange("registrationNumber", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Address</label>
                    <textarea
                      placeholder="Enter full address"
                      value={editFormData.address || ""}
                      onChange={(e) => handleEditFormChange("address", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 transition-colors border resize-none border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">City</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={editFormData.city || ""}
                      onChange={(e) => handleEditFormChange("city", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Province</label>
                    <input
                      type="text"
                      placeholder="Enter province"
                      value={editFormData.province || ""}
                      onChange={(e) => handleEditFormChange("province", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Country</label>
                    <input
                      type="text"
                      placeholder="Enter country"
                      value={editFormData.country || ""}
                      onChange={(e) => handleEditFormChange("country", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={editFormData.email || ""}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Phone</label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={editFormData.phone || ""}
                      onChange={(e) => handleEditFormChange("phone", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Principal Name</label>
                    <input
                      type="text"
                      placeholder="Enter principal name"
                      value={editFormData.principalName || ""}
                      onChange={(e) => handleEditFormChange("principalName", e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Total Students</label>
                    <input
                      type="number"
                      placeholder="Enter student count"
                      value={editFormData.totalStudents || ""}
                      onChange={(e) => handleEditFormChange("totalStudents", Number(e.target.value))}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Total Teachers</label>
                    <input
                      type="number"
                      placeholder="Enter teacher count"
                      value={editFormData.totalTeachers || ""}
                      onChange={(e) => handleEditFormChange("totalTeachers", Number(e.target.value))}
                      className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={editFormData.status || "Active"}
                    onChange={(e) => handleEditFormChange("status", e.target.value)}
                    className="w-full px-4 py-3 transition-colors border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Facilities</label>
                  <textarea
                    placeholder="Describe available facilities..."
                    value={editFormData.facilities || ""}
                    onChange={(e) => handleEditFormChange("facilities", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 transition-colors border resize-none border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">Notes</label>
                  <textarea
                    placeholder="Additional notes or comments..."
                    value={editFormData.notes || ""}
                    onChange={(e) => handleEditFormChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 transition-colors border resize-none border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 space-x-3 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 font-medium transition-colors text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditFormSubmit}
                  className="px-6 py-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Professional Delete Confirmation Modal */}
        {isDeleteModalOpen && academyToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-red-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-red-500 to-red-600">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Delete Academy</h2>
                    <p className="text-slate-600">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="mb-2 font-semibold text-slate-800">
                      {academyToDelete.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Registration: {academyToDelete.registrationNumber}
                    </p>
                    <p className="text-sm text-slate-600">
                      Location: {academyToDelete.city}, {academyToDelete.province}
                    </p>
                  </div>

                  <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
                    <p className="text-sm font-medium text-red-800">
                      Are you absolutely sure you want to delete this academy?
                      All associated data will be permanently removed and cannot be recovered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex p-6 space-x-3 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setAcademyToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 font-medium transition-colors border text-slate-600 hover:text-slate-800 border-slate-200 rounded-xl hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700"
                >
                  Delete Academy
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}