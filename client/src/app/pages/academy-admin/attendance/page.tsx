'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Calendar, User, Book, Users, Clock, CheckCircle, XCircle, AlertCircle, Download, Plus, Edit, Trash2, BarChart3 } from 'lucide-react'
import DashboardLayout from '@/app/components/DashboardLayout'

// Types
interface Student {
    id: string
    name: string
    class: string
    rollNumber: string
    contact: string
}

interface Teacher {
    id: string
    name: string
    subject: string
    contact: string
    classes: string[]
}

interface AttendanceRecord {
    id: string
    date: string
    type: 'student' | 'teacher'
    records: {
        id: string
        name: string
        status: 'present' | 'absent' | 'late' | 'excused'
        checkIn?: string
        checkOut?: string
        notes?: string
    }[]
}

const AttendanceManagementPage = () => {
    // State management
    const [students, setStudents] = useState<Student[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
    const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([])
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [selectedType, setSelectedType] = useState<'all' | 'student' | 'teacher'>('all')
    const [selectedClass, setSelectedClass] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [view, setView] = useState<'daily' | 'overview'>('daily')
    const [showMarkAttendance, setShowMarkAttendance] = useState(false)
    const [attendanceToMark, setAttendanceToMark] = useState<AttendanceRecord | null>(null)

    // Sample data - in a real app, this would come from an API
    useEffect(() => {
        // Mock student data
        const mockStudents: Student[] = [
            { id: '1', name: 'John Doe', class: '10th Grade', rollNumber: 'A101', contact: 'john.doe@example.com' },
            { id: '2', name: 'Jane Smith', class: '10th Grade', rollNumber: 'A102', contact: 'jane.smith@example.com' },
            { id: '3', name: 'Robert Johnson', class: '11th Grade', rollNumber: 'B101', contact: 'robert.j@example.com' },
            { id: '4', name: 'Emily Davis', class: '9th Grade', rollNumber: 'C101', contact: 'emily.d@example.com' },
            { id: '5', name: 'Michael Wilson', class: '11th Grade', rollNumber: 'B102', contact: 'michael.w@example.com' },
            { id: '6', name: 'Sarah Brown', class: '9th Grade', rollNumber: 'C102', contact: 'sarah.b@example.com' },
            { id: '7', name: 'David Miller', class: '10th Grade', rollNumber: 'A103', contact: 'david.m@example.com' },
            { id: '8', name: 'Lisa Taylor', class: '11th Grade', rollNumber: 'B103', contact: 'lisa.t@example.com' },
        ]

        // Mock teacher data
        const mockTeachers: Teacher[] = [
            { id: 'T1', name: 'Dr. James Anderson', subject: 'Mathematics', contact: 'james.a@example.com', classes: ['9th Grade', '10th Grade', '11th Grade'] },
            { id: 'T2', name: 'Ms. Jennifer Lee', subject: 'Science', contact: 'jennifer.l@example.com', classes: ['10th Grade', '11th Grade'] },
            { id: 'T3', name: 'Mr. Robert Clark', subject: 'English', contact: 'robert.c@example.com', classes: ['9th Grade', '11th Grade'] },
            { id: 'T4', name: 'Mrs. Maria Garcia', subject: 'History', contact: 'maria.g@example.com', classes: ['9th Grade', '10th Grade'] },
        ]

        // Mock attendance records
        const mockAttendance: AttendanceRecord[] = [
            {
                id: 'A1',
                date: new Date().toISOString().split('T')[0],
                type: 'student',
                records: [
                    { id: '1', name: 'John Doe', status: 'present', checkIn: '08:15', checkOut: '15:30' },
                    { id: '2', name: 'Jane Smith', status: 'present', checkIn: '08:05', checkOut: '15:25' },
                    { id: '3', name: 'Robert Johnson', status: 'late', checkIn: '09:30', checkOut: '15:35', notes: 'Doctor appointment' },
                    { id: '4', name: 'Emily Davis', status: 'absent', notes: 'Sick' },
                    { id: '5', name: 'Michael Wilson', status: 'present', checkIn: '08:10', checkOut: '14:45', notes: 'Left early' },
                    { id: '6', name: 'Sarah Brown', status: 'present', checkIn: '08:20', checkOut: '15:40' },
                    { id: '7', name: 'David Miller', status: 'excused', notes: 'Family event' },
                    { id: '8', name: 'Lisa Taylor', status: 'present', checkIn: '08:00', checkOut: '15:20' },
                ]
            },
            {
                id: 'A2',
                date: new Date().toISOString().split('T')[0],
                type: 'teacher',
                records: [
                    { id: 'T1', name: 'Dr. James Anderson', status: 'present', checkIn: '07:45', checkOut: '16:00' },
                    { id: 'T2', name: 'Ms. Jennifer Lee', status: 'present', checkIn: '07:50', checkOut: '15:55' },
                    { id: 'T3', name: 'Mr. Robert Clark', status: 'late', checkIn: '09:15', checkOut: '16:10', notes: 'Car trouble' },
                    { id: 'T4', name: 'Mrs. Maria Garcia', status: 'present', checkIn: '08:00', checkOut: '15:45' },
                ]
            },
            {
                id: 'A3',
                date: '2023-10-14',
                type: 'student',
                records: [
                    { id: '1', name: 'John Doe', status: 'present', checkIn: '08:10', checkOut: '15:30' },
                    { id: '2', name: 'Jane Smith', status: 'absent', notes: 'Sick' },
                    { id: '3', name: 'Robert Johnson', status: 'present', checkIn: '08:20', checkOut: '15:40' },
                    { id: '4', name: 'Emily Davis', status: 'present', checkIn: '08:05', checkOut: '15:25' },
                    { id: '5', name: 'Michael Wilson', status: 'late', checkIn: '09:45', checkOut: '15:35', notes: 'Traffic' },
                    { id: '6', name: 'Sarah Brown', status: 'present', checkIn: '08:15', checkOut: '15:20' },
                    { id: '7', name: 'David Miller', status: 'present', checkIn: '08:00', checkOut: '15:45' },
                    { id: '8', name: 'Lisa Taylor', status: 'excused', notes: 'School trip' },
                ]
            }
        ]

        setStudents(mockStudents)
        setTeachers(mockTeachers)
        setAttendance(mockAttendance)
        setFilteredAttendance(mockAttendance)
    }, [])

    // Filter attendance based on selected filters
    useEffect(() => {
        let result = attendance

        // Filter by date
        if (selectedDate) {
            result = result.filter(record => record.date === selectedDate)
        }

        // Filter by type
        if (selectedType !== 'all') {
            result = result.filter(record => record.type === selectedType)
        }

        // Filter by class (for student attendance)
        if (selectedClass !== 'all') {
            result = result.map(record => {
                if (record.type === 'student') {
                    return {
                        ...record,
                        records: record.records.filter(r => {
                            const student = students.find(s => s.id === r.id)
                            return student && student.class === selectedClass
                        })
                    }
                }
                return record
            }).filter(record => record.records.length > 0)
        }

        // Filter by search term
        if (searchTerm) {
            result = result.map(record => {
                return {
                    ...record,
                    records: record.records.filter(r =>
                        r.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                }
            }).filter(record => record.records.length > 0)
        }

        setFilteredAttendance(result)
    }, [selectedDate, selectedType, selectedClass, searchTerm, attendance, students])

    // Calculate attendance statistics
    const calculateStats = (records: any[]) => {
        const total = records.length
        const present = records.filter(r => r.status === 'present').length
        const absent = records.filter(r => r.status === 'absent').length
        const late = records.filter(r => r.status === 'late').length
        const excused = records.filter(r => r.status === 'excused').length

        return {
            total,
            present,
            absent,
            late,
            excused,
            attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
        }
    }

    const studentStats = calculateStats(
        filteredAttendance
            .filter(a => a.type === 'student')
            .flatMap(a => a.records)
    )

    const teacherStats = calculateStats(
        filteredAttendance
            .filter(a => a.type === 'teacher')
            .flatMap(a => a.records)
    )

    const handleMarkAttendance = (date: string, type: 'student' | 'teacher') => {
        // Check if attendance for this date and type already exists
        const existingRecord = attendance.find(a => a.date === date && a.type === type)

        if (existingRecord) {
            setAttendanceToMark(existingRecord)
        } else {
            // Create a new attendance record
            const newRecord: AttendanceRecord = {
                id: `A${attendance.length + 1}`,
                date,
                type,
                records: type === 'student'
                    ? students.map(student => ({
                        id: student.id,
                        name: student.name,
                        status: 'absent'
                    }))
                    : teachers.map(teacher => ({
                        id: teacher.id,
                        name: teacher.name,
                        status: 'absent'
                    }))
            }
            setAttendanceToMark(newRecord)
        }

        setShowMarkAttendance(true)
    }

    const handleSaveAttendance = (updatedRecord: AttendanceRecord) => {
        // Check if this is an existing record or a new one
        const existingIndex = attendance.findIndex(a => a.id === updatedRecord.id)

        if (existingIndex >= 0) {
            // Update existing record
            const updatedAttendance = [...attendance]
            updatedAttendance[existingIndex] = updatedRecord
            setAttendance(updatedAttendance)
        } else {
            // Add new record
            setAttendance([...attendance, updatedRecord])
        }

        setShowMarkAttendance(false)
        setAttendanceToMark(null)
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h1>
                    <p className="text-gray-600 mb-8">Track and manage student and teacher attendance</p>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 mr-4">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{studentStats.total}</h2>
                                    <p className="text-gray-600">Total Students</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 mr-4">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{studentStats.attendanceRate}%</h2>
                                    <p className="text-gray-600">Student Attendance Rate</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 mr-4">
                                    <User className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{teachers.length}</h2>
                                    <p className="text-gray-600">Total Teachers</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-orange-100 mr-4">
                                    <BarChart3 className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{teacherStats.attendanceRate}%</h2>
                                    <p className="text-gray-600">Teacher Attendance Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value as any)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="student">Students</option>
                                    <option value="teacher">Teachers</option>
                                </select>

                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                >
                                    <option value="all">All Classes</option>
                                    <option value="9th Grade">9th Grade</option>
                                    <option value="10th Grade">10th Grade</option>
                                    <option value="11th Grade">11th Grade</option>
                                </select>

                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={view}
                                    onChange={(e) => setView(e.target.value as any)}
                                >
                                    <option value="daily">Daily View</option>
                                    <option value="overview">Overview</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto justify-center"
                                onClick={() => handleMarkAttendance(selectedDate, 'student')}
                            >
                                <Plus className="h-4 w-4" />
                                Mark Student Attendance
                            </button>
                            <button
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto justify-center"
                                onClick={() => handleMarkAttendance(selectedDate, 'teacher')}
                            >
                                <Plus className="h-4 w-4" />
                                Mark Teacher Attendance
                            </button>
                        </div>
                    </div>

                    {/* Date Selector */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <label htmlFor="date" className="text-sm font-medium text-gray-700">Select Date:</label>
                            <input
                                type="date"
                                id="date"
                                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Attendance Records */}
                    {view === 'daily' ? (
                        <div className="space-y-6">
                            {filteredAttendance.map(record => (
                                <div key={record.id} className="bg-white rounded-lg shadow">
                                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {record.type === 'student' ? 'Student' : 'Teacher'} Attendance - {new Date(record.date).toLocaleDateString()}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                                onClick={() => {
                                                    setAttendanceToMark(record)
                                                    setShowMarkAttendance(true)
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                                                <Download className="h-4 w-4" />
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        {record.type === 'student' ? 'Student' : 'Teacher'} Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Check In
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Check Out
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Notes
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {record.records.map(person => (
                                                    <tr key={person.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <User className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                                                    {record.type === 'student' && (
                                                                        <div className="text-sm text-gray-500">
                                                                            {students.find(s => s.id === person.id)?.class}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${person.status === 'present' ? 'bg-green-100 text-green-800' : ''}
                              ${person.status === 'absent' ? 'bg-red-100 text-red-800' : ''}
                              ${person.status === 'late' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${person.status === 'excused' ? 'bg-blue-100 text-blue-800' : ''}
                            `}>
                                                                {person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {person.checkIn || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {person.checkOut || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {person.notes || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            {filteredAttendance.length === 0 && (
                                <div className="bg-white rounded-lg shadow p-8 text-center">
                                    <p className="text-gray-500">No attendance records found for the selected filters.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-3">Student Attendance</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Present</span>
                                            <span className="font-medium">{studentStats.present}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Absent</span>
                                            <span className="font-medium">{studentStats.absent}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Late</span>
                                            <span className="font-medium">{studentStats.late}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Excused</span>
                                            <span className="font-medium">{studentStats.excused}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-800 font-medium">Total</span>
                                                <span className="font-medium">{studentStats.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-3">Teacher Attendance</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Present</span>
                                            <span className="font-medium">{teacherStats.present}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Absent</span>
                                            <span className="font-medium">{teacherStats.absent}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Late</span>
                                            <span className="font-medium">{teacherStats.late}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Excused</span>
                                            <span className="font-medium">{teacherStats.excused}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-800 font-medium">Total</span>
                                                <span className="font-medium">{teacherStats.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mark Attendance Modal */}
                {showMarkAttendance && attendanceToMark && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Mark {attendanceToMark.type === 'student' ? 'Student' : 'Teacher'} Attendance - {new Date(attendanceToMark.date).toLocaleDateString()}
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Check In
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Check Out
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {attendanceToMark.records.map(person => (
                                                <tr key={person.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                                        {attendanceToMark.type === 'student' && (
                                                            <div className="text-sm text-gray-500">
                                                                {students.find(s => s.id === person.id)?.class}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <select
                                                            className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            value={person.status}
                                                            onChange={(e) => {
                                                                const updatedRecords = attendanceToMark.records.map(p =>
                                                                    p.id === person.id ? { ...p, status: e.target.value as any } : p
                                                                )
                                                                setAttendanceToMark({ ...attendanceToMark, records: updatedRecords })
                                                            }}
                                                        >
                                                            <option value="present">Present</option>
                                                            <option value="absent">Absent</option>
                                                            <option value="late">Late</option>
                                                            <option value="excused">Excused</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="time"
                                                            className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            value={person.checkIn || ''}
                                                            onChange={(e) => {
                                                                const updatedRecords = attendanceToMark.records.map(p =>
                                                                    p.id === person.id ? { ...p, checkIn: e.target.value } : p
                                                                )
                                                                setAttendanceToMark({ ...attendanceToMark, records: updatedRecords })
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="time"
                                                            className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            value={person.checkOut || ''}
                                                            onChange={(e) => {
                                                                const updatedRecords = attendanceToMark.records.map(p =>
                                                                    p.id === person.id ? { ...p, checkOut: e.target.value } : p
                                                                )
                                                                setAttendanceToMark({ ...attendanceToMark, records: updatedRecords })
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Notes"
                                                            value={person.notes || ''}
                                                            onChange={(e) => {
                                                                const updatedRecords = attendanceToMark.records.map(p =>
                                                                    p.id === person.id ? { ...p, notes: e.target.value } : p
                                                                )
                                                                setAttendanceToMark({ ...attendanceToMark, records: updatedRecords })
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    onClick={() => {
                                        setShowMarkAttendance(false)
                                        setAttendanceToMark(null)
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={() => handleSaveAttendance(attendanceToMark)}
                                >
                                    Save Attendance
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default AttendanceManagementPage