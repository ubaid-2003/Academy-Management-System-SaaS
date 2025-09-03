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
} from "lucide-react";

// -----------------------
// Form data type
// -----------------------
interface AcademyFormData {
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  province: string;
  country: string;
  email: string;
  phone: string;
  principalName: string;
  totalStudents: number;
  facilities: string;
  notes: string;
  status: "Active" | "Inactive" | "Pending";
}

export default function AddAcademyPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<AcademyFormData>({
    name: "",
    registrationNumber: "",
    address: "",
    city: "",
    province: "",
    country: "Pakistan",
    email: "",
    phone: "",
    principalName: "",
    totalStudents: 0,
    facilities: "",
    notes: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // -----------------------
  // Redirect if not admin
  // -----------------------
  useEffect(() => {
    if (!user) return;
    if (user.role !== "Admin" && user.role !== "SuperAdmin") {
      router.push("/pages/dashboard");
    }
  }, [user, router]);

  // -----------------------
  // Handle input changes
  // -----------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalStudents" && type === "number" ? Number(value) : value,
    }));

    if (error) setError(null);
  };

  // -----------------------
  // Validate payload
  // -----------------------
  const validatePayload = (payload: AcademyFormData) => {
    if (!payload.name.trim()) throw new Error("Academy name is required");
    if (!payload.registrationNumber.trim()) throw new Error("Registration number is required");
    if (!payload.address.trim()) throw new Error("Address is required");
    if (!payload.city.trim()) throw new Error("City is required");
    if (!payload.province.trim()) throw new Error("Province is required");
    if (!payload.country.trim()) throw new Error("Country is required");
    if (!payload.email.trim()) throw new Error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) throw new Error("Please enter a valid email address");
    if (!payload.phone.trim()) throw new Error("Phone number is required");
    if (!payload.principalName.trim()) throw new Error("Principal name is required");
    if (payload.totalStudents <= 0) throw new Error("Total Students must be greater than 0");
    if (!payload.facilities.trim()) throw new Error("Facilities are required");
    if (!payload.notes.trim()) throw new Error("Notes are required");
  };

  // -----------------------
  // Submit form
  // -----------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      if (!user?.token) throw new Error("You must be logged in to create an academy");

      const payload: AcademyFormData = {
        ...formData,
        name: formData.name.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        province: formData.province.trim(),
        country: formData.country.trim() || "Pakistan",
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        principalName: formData.principalName.trim(),
        facilities: formData.facilities.trim(),
        notes: formData.notes.trim(),
      };

      validatePayload(payload);

      const res = await fetch(`http://localhost:5000/api/academies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create academy");
      }

      const data = await res.json();
      console.log("Academy created:", data);
      
      // Show success notification
      setSuccess(true);
      setShowNotification(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/pages/academy-admin/academies");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Access denied page
  // -----------------------
  if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
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
              className="inline-flex items-center px-4 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // -----------------------
  // Form UI
  // -----------------------
  return (
    <DashboardLayout>
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed z-50 top-4 right-4 animate-fade-in-down">
          <div className="flex items-center p-4 mb-4 text-white bg-green-600 rounded-lg shadow-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Academy created successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl p-6 mx-auto mt-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-full">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="ml-3 text-2xl font-bold text-gray-800">Add New Academy</h2>
        </div>

        {error && (
          <div className="flex items-center p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Academy Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Academy Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Academy Name"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Registration Number"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Province */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Province <span className="text-red-500">*</span>
              </label>
              <input
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="Province"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Pakistan">Pakistan</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Principal Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Principal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  placeholder="Principal Name"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Total Students */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Total Students <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  name="totalStudents"
                  type="number"
                  min="1"
                  value={formData.totalStudents}
                  onChange={handleChange}
                  placeholder="Total Students"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Facilities */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Facilities <span className="text-red-500">*</span>
              </label>
              <textarea
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="List of facilities (separated by commas)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the academy"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Creating Academy..." : "Create Academy"}
            </button>
          </div>
        </form>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
}