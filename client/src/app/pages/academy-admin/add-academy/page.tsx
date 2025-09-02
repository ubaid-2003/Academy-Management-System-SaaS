"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

import {
  GraduationCap,
  Building2,
  MapPin,
  Mail,
  Phone,
  User,
  Users,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Save,
  Building,
  Globe,
  Briefcase,
  Hash,
  StickyNote,
  Zap,
} from "lucide-react";

export default function AddAcademyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    address: "",
    city: "",
    province: "",
    country: "Pakistan",
    email: "",
    phone: "",
    principalName: "",
    totalStudents: "",
    facilities: "",
    notes: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return; // wait for context to load

    if (user.role !== "Admin" && user.role !== "SuperAdmin") {
      router.push("/pages/dashboard"); // redirect non-admin to dashboard
    }
  }, [user, router]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      if (!user?.token) {
        setError("You must be logged in to create an academy.");
        setLoading(false);
        return;
      }




      const res = await fetch("http://localhost:5000/api/academies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          totalStudents: Number(formData.totalStudents),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create academy");
      }

      const data = await res.json();
      setSuccess(true);
      console.log("Academy created:", data);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          registrationNumber: "",
          address: "",
          city: "",
          province: "",
          country: "Pakistan",
          email: "",
          phone: "",
          principalName: "",
          totalStudents: "",
          facilities: "",
          notes: "",
          status: "Active",
        });
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "Admin") {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="max-w-md p-8 text-center border border-red-200 bg-red-50 rounded-xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-red-800">Access Denied</h3>
          <p className="text-red-600">You are not authorized to access this page.</p>
          <button
            onClick={() => router.push("/pages/dashboard")}
            className="inline-flex items-center px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}


return (
  <DashboardLayout>
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/pages/academy-admin/academies")}
                className="p-2 transition-colors rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Create New Academy
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  Add a new educational institution to the system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className="p-4 mb-8 border border-green-200 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Academy Created Successfully!</p>
                  <p className="text-sm text-green-700">The academy has been added to the system.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-8 border border-red-200 bg-red-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Error Creating Academy</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white border shadow-sm border-slate-200 rounded-xl">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <Building className="w-4 h-4" />
                      <span>Academy Name *</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter academy name"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <Hash className="w-4 h-4" />
                      <span>Registration Number *</span>
                    </label>
                    <input
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter registration number"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="bg-white border shadow-sm border-slate-200 rounded-xl">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Location Details</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                    <MapPin className="w-4 h-4" />
                    <span>Complete Address *</span>
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter complete address"
                    className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <Building className="w-4 h-4" />
                      <span>City *</span>
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Enter city"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <MapPin className="w-4 h-4" />
                      <span>Province *</span>
                    </label>
                    <input
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      placeholder="Enter province"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <Globe className="w-4 h-4" />
                      <span>Country *</span>
                    </label>
                    <input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Enter country"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white border shadow-sm border-slate-200 rounded-xl">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <Mail className="w-4 h-4" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Administration Section */}
            <div className="bg-white border shadow-sm border-slate-200 rounded-xl">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Administration Details</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <User className="w-4 h-4" />
                      <span>Principal Name *</span>
                    </label>
                    <input
                      name="principalName"
                      value={formData.principalName}
                      onChange={handleChange}
                      required
                      placeholder="Enter principal's full name"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                      <Users className="w-4 h-4" />
                      <span>Total Students *</span>
                    </label>
                    <input
                      type="number"
                      name="totalStudents"
                      value={formData.totalStudents}
                      onChange={handleChange}
                      required
                      placeholder="Enter number of students"
                      className="w-full px-4 py-3 transition-all border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                    <Settings className="w-4 h-4" />
                    <span>Status *</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 transition-all bg-white border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white border shadow-sm border-slate-200 rounded-xl">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                    <Zap className="w-4 h-4" />
                    <span>Facilities *</span>
                  </label>
                  <textarea
                    name="facilities"
                    value={formData.facilities}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Describe the facilities available at the academy..."
                    className="w-full px-4 py-3 transition-all border outline-none resize-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center mb-2 space-x-2 text-sm font-medium text-slate-700">
                    <StickyNote className="w-4 h-4" />
                    <span>Notes *</span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Add any additional notes or comments about the academy..."
                    className="w-full px-4 py-3 transition-all border outline-none resize-none border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => router.push("/pages/academy-admin/academies")}
                className="inline-flex items-center px-6 py-3 font-medium transition-colors border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-8 py-3 font-medium text-white transition-all bg-blue-600 shadow-sm rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Creating Academy...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Academy
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DashboardLayout>
);
}