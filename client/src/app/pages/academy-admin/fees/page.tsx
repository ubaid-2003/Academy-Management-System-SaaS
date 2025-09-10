'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, DollarSign, Calendar, User, Book } from 'lucide-react'
import DashboardLayout from '@/app/components/DashboardLayout'

// Types
interface FeeStructure {
    id: string
    class: string
    tuitionFee: number
    admissionFee: number
    examFee: number
    libraryFee: number
    sportsFee: number
    otherFee: number
    total: number
    dueDate: string
}

interface Student {
    id: string
    name: string
    class: string
    rollNumber: string
    contact: string
}

interface PaymentRecord {
    id: string
    studentId: string
    studentName: string
    class: string
    amount: number
    paymentDate: string
    paymentMethod: string
    status: 'paid' | 'pending' | 'overdue'
    month: string
    dueDate: string
}

const FeeManagementPage = () => {
    // State management
    const [students, setStudents] = useState<Student[]>([])
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
    const [payments, setPayments] = useState<PaymentRecord[]>([])
    const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterClass, setFilterClass] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showFeeStructureModal, setShowFeeStructureModal] = useState(false)

    // Sample data - in a real app, this would come from an API
    useEffect(() => {
        // Mock student data
        const mockStudents: Student[] = [
            { id: '1', name: 'John Doe', class: '10th Grade', rollNumber: 'A101', contact: 'john.doe@example.com' },
            { id: '2', name: 'Jane Smith', class: '10th Grade', rollNumber: 'A102', contact: 'jane.smith@example.com' },
            { id: '3', name: 'Robert Johnson', class: '11th Grade', rollNumber: 'B101', contact: 'robert.j@example.com' },
            { id: '4', name: 'Emily Davis', class: '9th Grade', rollNumber: 'C101', contact: 'emily.d@example.com' },
            { id: '5', name: 'Michael Wilson', class: '11th Grade', rollNumber: 'B102', contact: 'michael.w@example.com' },
        ]

        // Mock fee structure
        const mockFeeStructures: FeeStructure[] = [
            {
                id: '1',
                class: '9th Grade',
                tuitionFee: 5000,
                admissionFee: 1000,
                examFee: 500,
                libraryFee: 300,
                sportsFee: 400,
                otherFee: 200,
                total: 7400,
                dueDate: '2023-10-05'
            },
            {
                id: '2',
                class: '10th Grade',
                tuitionFee: 5500,
                admissionFee: 1000,
                examFee: 600,
                libraryFee: 300,
                sportsFee: 400,
                otherFee: 200,
                total: 8000,
                dueDate: '2023-10-05'
            },
            {
                id: '3',
                class: '11th Grade',
                tuitionFee: 6000,
                admissionFee: 1000,
                examFee: 700,
                libraryFee: 300,
                sportsFee: 400,
                otherFee: 200,
                total: 8600,
                dueDate: '2023-10-05'
            }
        ]

        // Mock payment records
        const mockPayments: PaymentRecord[] = [
            {
                id: '1',
                studentId: '1',
                studentName: 'John Doe',
                class: '10th Grade',
                amount: 8000,
                paymentDate: '2023-10-01',
                paymentMethod: 'Credit Card',
                status: 'paid',
                month: 'October 2023',
                dueDate: '2023-10-05'
            },
            {
                id: '2',
                studentId: '2',
                studentName: 'Jane Smith',
                class: '10th Grade',
                amount: 8000,
                paymentDate: '2023-10-02',
                paymentMethod: 'Bank Transfer',
                status: 'paid',
                month: 'October 2023',
                dueDate: '2023-10-05'
            },
            {
                id: '3',
                studentId: '3',
                studentName: 'Robert Johnson',
                class: '11th Grade',
                amount: 8600,
                paymentDate: '',
                paymentMethod: '',
                status: 'pending',
                month: 'October 2023',
                dueDate: '2023-10-05'
            },
            {
                id: '4',
                studentId: '4',
                studentName: 'Emily Davis',
                class: '9th Grade',
                amount: 7400,
                paymentDate: '2023-10-03',
                paymentMethod: 'Cash',
                status: 'paid',
                month: 'October 2023',
                dueDate: '2023-10-05'
            },
            {
                id: '5',
                studentId: '5',
                studentName: 'Michael Wilson',
                class: '11th Grade',
                amount: 8600,
                paymentDate: '',
                paymentMethod: '',
                status: 'overdue',
                month: 'September 2023',
                dueDate: '2023-09-05'
            }
        ]

        setStudents(mockStudents)
        setFeeStructures(mockFeeStructures)
        setPayments(mockPayments)
        setFilteredPayments(mockPayments)
    }, [])

    // Filter payments based on search and filters
    useEffect(() => {
        let result = payments

        // Filter by search term
        if (searchTerm) {
            result = result.filter(payment =>
                payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.class.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by class
        if (filterClass !== 'all') {
            result = result.filter(payment => payment.class === filterClass)
        }

        // Filter by status
        if (filterStatus !== 'all') {
            result = result.filter(payment => payment.status === filterStatus)
        }

        setFilteredPayments(result)
    }, [searchTerm, filterClass, filterStatus, payments])

    // Calculate summary statistics
    const totalPaid = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0)

    const totalPending = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0)

    const totalOverdue = payments
        .filter(p => p.status === 'overdue')
        .reduce((sum, payment) => sum + payment.amount, 0)

    const handleAddPayment = () => {
        setShowPaymentModal(true)
    }

    const handleEditFeeStructure = () => {
        setShowFeeStructureModal(true)
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Fee Management</h1>
                    <p className="text-gray-600 mb-8">Manage student fees, payments, and fee structures</p>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 mr-4">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">${totalPaid.toLocaleString()}</h2>
                                    <p className="text-gray-600">Total Paid</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                                    <Calendar className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">${totalPending.toLocaleString()}</h2>
                                    <p className="text-gray-600">Pending Payments</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-red-100 mr-4">
                                    <Calendar className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">${totalOverdue.toLocaleString()}</h2>
                                    <p className="text-gray-600">Overdue Payments</p>
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
                                    placeholder="Search students..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filterClass}
                                    onChange={(e) => setFilterClass(e.target.value)}
                                >
                                    <option value="all">All Classes</option>
                                    <option value="9th Grade">9th Grade</option>
                                    <option value="10th Grade">10th Grade</option>
                                    <option value="11th Grade">11th Grade</option>
                                </select>

                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto justify-center"
                                onClick={handleAddPayment}
                            >
                                <Plus className="h-4 w-4" />
                                Record Payment
                            </button>
                            <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 border border-gray-300 rounded-lg transition-colors w-full md:w-auto justify-center">
                                <Download className="h-4 w-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Fee Structures Section */}
                    <div className="bg-white rounded-lg shadow mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Fee Structure</h2>
                            <button
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                onClick={handleEditFeeStructure}
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuition Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Library Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sports Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {feeStructures.map((fee) => (
                                        <tr key={fee.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fee.class}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.tuitionFee}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.admissionFee}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.examFee}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.libraryFee}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.sportsFee}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.otherFee}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${fee.total}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.dueDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Records Section */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Payment Records</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.class}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {payment.paymentDate || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.dueDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {payment.paymentMethod || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                        ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${payment.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-900">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-indigo-600 hover:text-indigo-900">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredPayments.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No payment records found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Modal (simplified) */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Record New Payment</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select a student</option>
                                        {students.map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.name} - {student.class} ({student.rollNumber})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select method</option>
                                        <option value="cash">Cash</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="check">Check</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Record Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fee Structure Modal (simplified) */}
                {showFeeStructureModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Fee Structure</h3>
                            <div className="text-center py-8">
                                <p className="text-gray-500">Fee structure editing interface would appear here</p>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    onClick={() => setShowFeeStructureModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={() => setShowFeeStructureModal(false)}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default FeeManagementPage