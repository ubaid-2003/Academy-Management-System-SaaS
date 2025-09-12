"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import DashboardLayout from "@/app/components/DashboardLayout";
import { useAcademy } from "@/app/context/AcademyContext";

const API_BASE = "http://localhost:5000/api";

// ======================= Types =========================
interface Student {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
}

interface AttendanceRecordItem {
  id: number;
  studentId?: number;
  teacherId?: number;
  date: string;
  status: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  type: "student" | "teacher";
  records: AttendanceRecordItem[];
}

// ======================= Page Component =========================
export default function AttendanceManagementPage() {
  const { currentAcademy } = useAcademy();

  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<
    AttendanceRecord[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classId, setClassId] = useState<number>(1); // default class for now
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ======================= Fetch Data =========================
  useEffect(() => {
    if (!currentAcademy?.id || !classId) return;

    const fetchData = async () => {
      try {
        // ✅ Correct student & teacher fetch
        const [studentsRes, teachersRes] = await Promise.all([
          axios.get<Student[]>(
            `${API_BASE}/academies/${currentAcademy.id}/students`
          ),
          axios.get<Teacher[]>(
            `${API_BASE}/academies/${currentAcademy.id}/teachers`
          ),
        ]);

        setStudents(studentsRes.data);
        setTeachers(teachersRes.data);

        // ✅ Correct attendance fetch with query param
        const [studentAttendanceRes, teacherAttendanceRes] = await Promise.all([
          axios.get<AttendanceRecordItem[]>(
            `${API_BASE}/academies/${currentAcademy.id}/class/${classId}/students/studentattendance?date=${selectedDate}`
          ),
          axios.get<AttendanceRecordItem[]>(
            `${API_BASE}/academies/${currentAcademy.id}/teachers/teacherattendance?date=${selectedDate}`
          ),
        ]);

        const combinedAttendance: AttendanceRecord[] = [
          {
            id: "S1",
            date: selectedDate,
            type: "student",
            records: studentAttendanceRes.data,
          },
          {
            id: "T1",
            date: selectedDate,
            type: "teacher",
            records: teacherAttendanceRes.data,
          },
        ];

        setAttendance(combinedAttendance);
        setFilteredAttendance(combinedAttendance);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      }
    };

    fetchData();
  }, [currentAcademy?.id, classId, selectedDate]);

  // ======================= Search Filter =========================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAttendance(attendance);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = attendance.map((record) => ({
        ...record,
        records: record.records.filter((r) => {
          if (record.type === "student") {
            const student = students.find((s) => s.id === r.studentId);
            return student?.name.toLowerCase().includes(term);
          }
          if (record.type === "teacher") {
            const teacher = teachers.find((t) => t.id === r.teacherId);
            return teacher?.name.toLowerCase().includes(term);
          }
          return false;
        }),
      }));
      setFilteredAttendance(filtered);
    }
  }, [searchTerm, attendance, students, teachers]);

  // ======================= Save Attendance =========================
  const handleSaveAttendance = async (
    type: "student" | "teacher",
    personId: number,
    status: string
  ) => {
    try {
      if (!currentAcademy) {
        alert("No academy selected.");
        return;
      }
      if (type === "student") {
        await axios.post(
          `${API_BASE}/academies/${currentAcademy.id}/class/${classId}/students/studentattendance`,
          {
            studentId: personId,
            academyId: currentAcademy.id,
            classId,
            courseId: 1, // ⚠️ Replace with actual courseId from context
            date: selectedDate,
            status,
          }
        );
      } else {
        await axios.post(
          `${API_BASE}/academies/${currentAcademy.id}/teachers/teacherattendance`,
          {
            teacherId: personId,
            academyId: currentAcademy.id,
            date: selectedDate,
            status,
          }
        );
      }

      alert("Attendance saved!");
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Failed to save attendance");
    }
  };

  // ======================= Render =========================
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Attendance Management
          </h1>
          <div className="flex gap-2">
            <input
              type="date"
              className="border p-2 rounded"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                className="border p-2 pl-10 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 absolute left-2 top-2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Attendance Sections */}
        {filteredAttendance.map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              {section.type === "student" ? "Students" : "Teachers"}
            </h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {section.records.map((record) => {
                  const person =
                    section.type === "student"
                      ? students.find((s) => s.id === record.studentId)
                      : teachers.find((t) => t.id === record.teacherId);

                  return (
                    <tr key={record.id}>
                      <td className="border p-2">{person?.name || "N/A"}</td>
                      <td className="border p-2">{record.date}</td>
                      <td className="border p-2">{record.status}</td>
                      <td className="border p-2">
                        <select
                          value={record.status}
                          onChange={(e) =>
                            handleSaveAttendance(
                              section.type,
                              section.type === "student"
                                ? record.studentId!
                                : record.teacherId!,
                              e.target.value
                            )
                          }
                          className="border p-1 rounded"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="leave">Leave</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
