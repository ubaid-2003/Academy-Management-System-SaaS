"use client";

/**
 * Academy Details Page
 * Route: /pages/academy-admin/academies/[id]
 * - Fetches single academy by id
 * - Shows full detail card
 * - Back button uses router.back()
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import DashboardLayout from "@/app/components/DashboardLayout";
import {
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  User,
  Building2,
  FileText,
  ArrowLeft,
  Users,
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
  totalTeachers?: number;
  status?: "Active" | "Inactive" | "Pending";
  facilities?: string;
  notes?: string;
}

export default function AcademyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [academy, setAcademy] = useState<Academy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await axios.get(`http://localhost:5000/api/academies/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setAcademy(res.data?.academy ?? res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to fetch academy");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOne();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg bg-slate-100 hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </div>

          {loading && (
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              Loading academy details...
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 text-red-700 border border-red-200 bg-red-50 rounded-xl">
              {error}
            </div>
          )}

          {academy && (
            <div className="p-6 bg-white border shadow-sm rounded-2xl">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{academy.name}</h1>
                    <div className="flex items-center mt-1 text-slate-500">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Registration #: {academy.registrationNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {academy.status && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      academy.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : academy.status === "Inactive"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                    title="Status"
                  >
                    {academy.status}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center text-slate-700">
                    <Building2 className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm font-medium">{academy.address}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm">
                      {academy.city}, {academy.province}, {academy.country}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <User className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm">
                      Principal: <strong>{academy.principalName}</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-slate-700">
                    <Mail className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm">{academy.email}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Phone className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm">{academy.phone}</span>
                  </div>

                  {(academy.totalStudents || academy.totalTeachers) && (
                    <div className="flex items-center pt-2 space-x-4 border-t border-slate-100">
                      {academy.totalStudents && (
                        <div className="inline-flex items-center text-sm text-slate-700">
                          <Users className="w-4 h-4 mr-2 text-slate-400" />
                          {academy.totalStudents} Students
                        </div>
                      )}
                      {academy.totalTeachers && (
                        <div className="inline-flex items-center text-sm text-slate-700">
                          <GraduationCap className="w-4 h-4 mr-2 text-slate-400" />
                          {academy.totalTeachers} Teachers
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">
                    Facilities
                  </h3>
                  <p className="p-3 text-sm leading-relaxed border rounded-lg bg-slate-50 text-slate-700 min-h-[72px]">
                    {academy.facilities || "—"}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">
                    Notes
                  </h3>
                  <p className="p-3 text-sm leading-relaxed border rounded-lg bg-slate-50 text-slate-700 min-h-[72px]">
                    {academy.notes || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
