    'use client';

    import React, { useState, useEffect } from 'react'
    import axios from 'axios'
    import { Search, Download, Plus, Eye, Edit, Trash2, DollarSign, Calendar, User } from 'lucide-react'
    import DashboardLayout from "@/app/components/DashboardLayout";
    import { useRouter } from "next/navigation";
    import { useAuth } from "@/app/context/AuthContext";
    import { useAcademy } from '@/app/context/AcademyContext';

    // ======================= Types =========================
    interface FeeStructure {
        id: number;
        classId: number;
        class?: { // Make this optional
            id: number;
            name: string;
        } | null; // Also allow null
        tuitionFee: number;
        admissionFee: number;
        examFee: number;
        libraryFee: number;
        sportsFee: number;
        otherFee: number;
        dueDate: string;
        academicYear: string;
        isActive: boolean;
        total?: number;
    }

    interface Student {
        id: number;
        firstName: string;
        lastName: string;
        class: {
            id: number;
            name: string;
        };
        rollNumber: string;
        contact: string;
        feeStructureId?: number;
        amount?: number;
        paymentMethod?: string;
        paymentDate?: string;
        month?: string;
        dueDate?: string;
        notes?: string;
    }

    interface Payment {
        id: number;
        studentId: number;
        student: {
            id: number;
            firstName: string;
            lastName: string;
            class: {
                id: number;
                name: string;
            };
        };
        feeStructureId: number;
        amount: number;
        paymentDate: string;
        paymentMethod: string;
        status: string;
        month: string;
        dueDate: string;
        recordedBy: number;
        notes: string;
    }

    interface Class {
        id: number;
        name: string;
    }

    const safeFetch = async (url: string, fetchWithAuth: any) => {
        try {
            const res = await fetchWithAuth(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const text = await res.text();

            try {
                return JSON.parse(text);
            } catch {
                console.error(`❌ Invalid JSON from ${url}:`, text.slice(0, 100));
                return null;
            }
        } catch (err) {
            console.error(`❌ Fetch error from ${url}:`, err);
            return null;
        }
    };

    // ======================= Fee Management Page =========================
    const FeeManagementPage = () => {
        const router = useRouter();
        const { fetchWithAuth, user } = useAuth();
        const { currentAcademy } = useAcademy();

        // =================== States ===================
        const [students, setStudents] = useState<Student[]>([]);
        const [classes, setClasses] = useState<Class[]>([]);
        const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
        const [showPaymentModal, setShowPaymentModal] = useState(false);
        const [showFeeStructureModal, setShowFeeStructureModal] = useState(false);
        const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
        const [payments, setPayments] = useState<Payment[]>([]);
        const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [filterClass, setFilterClass] = useState('all');
        const [filterStatus, setFilterStatus] = useState('all');
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        // =================== Fetch Data ===================
        const fetchFeeStructures = async () => {
            if (!currentAcademy) return;

            try {
                setIsLoading(true);
                const res = await safeFetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/fee-structures`,
                    fetchWithAuth
                );

                if (!res || !Array.isArray(res.data)) {
                    setFeeStructures([]);
                    return;
                }

                // Add safety check for class property
                const feeStructuresWithTotal = res.data.map((f: any) => ({
                    ...f,
                    class: f.class || null, // Ensure class is at least null if undefined
                    total: (f.tuitionFee || 0) +
                        (f.admissionFee || 0) +
                        (f.examFee || 0) +
                        (f.libraryFee || 0) +
                        (f.sportsFee || 0) +
                        (f.otherFee || 0)
                }));

                setFeeStructures(feeStructuresWithTotal);
            } catch (err) {
                console.error('Error fetching fee structures:', err);
                setError('Failed to load fee structures');
            } finally {
                setIsLoading(false);
            }
        };
        const fetchPayments = async () => {
            if (!currentAcademy) return;

            try {
                setIsLoading(true);
                const res = await safeFetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/fee-payments`,
                    fetchWithAuth
                );

                if (!res || !Array.isArray(res.data)) {
                    setPayments([]);
                    return;
                }

                setPayments(res.data);
                setFilteredPayments(res.data);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setError('Failed to load payments');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchStudents = async () => {
            if (!currentAcademy) return;

            try {
                setIsLoading(true);
                const res = await safeFetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/students`,
                    fetchWithAuth
                );

                if (!res || !Array.isArray(res.data)) {
                    setStudents([]);
                    return;
                }

                setStudents(res.data);
            } catch (err) {
                console.error('Error fetching students:', err);
                setError('Failed to load students');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchClasses = async () => {
            if (!currentAcademy) return;

            try {
                setIsLoading(true);
                const res = await safeFetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/classes`,
                    fetchWithAuth
                );

                if (!res || !Array.isArray(res.data)) {
                    setClasses([]);
                    return;
                }

                setClasses(res.data);
            } catch (err) {
                console.error('Error fetching classes:', err);
                setError('Failed to load classes');
            } finally {
                setIsLoading(false);
            }
        };

        // =================== Fetch on Academy Switch ===================
        useEffect(() => {
            if (currentAcademy) {
                fetchFeeStructures();
                fetchPayments();
                fetchStudents();
                fetchClasses();
            }
        }, [currentAcademy]);

        // =================== Filtering ===================
        useEffect(() => {
            let result = [...payments];

            if (searchTerm) {
                result = result.filter(
                    (p) =>
                        `${p.student?.firstName || ""} ${p.student?.lastName || ""}`
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        (p.student?.class?.name || "N/A")
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                );
            }

            if (filterClass !== "all") {
                result = result.filter(
                    (p) => (p.student?.class?.name || "N/A") === filterClass
                );
            }

            if (filterStatus !== "all") {
                result = result.filter((p) => p.status === filterStatus);
            }

            setFilteredPayments(result);
        }, [searchTerm, filterClass, filterStatus, payments]);

        // =================== Summary Stats ===================
        const totalPaid = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
        const totalPending = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
        const totalOverdue = payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

        // =================== Handlers ===================
        const handleAddPayment = () => {
            setSelectedStudent(null);
            setShowPaymentModal(true);
        };

        const handleEditFeeStructure = () => setShowFeeStructureModal(true);

        const handleRecordPayment = async () => {
            if (!selectedStudent || !currentAcademy) return;

            try {
                const payload = {
                    studentId: selectedStudent.id,
                    feeStructureId: selectedStudent.feeStructureId,
                    amount: selectedStudent.amount,
                    paymentMethod: selectedStudent.paymentMethod,
                    paymentDate: selectedStudent.paymentDate || new Date().toISOString().split('T')[0],
                    dueDate: selectedStudent.dueDate,
                    month: selectedStudent.month,
                    notes: selectedStudent.notes,
                    recordedBy: user?.id,
                    status: 'paid'
                };

                const res = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/fee-payments`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (!res.ok) {
                    throw new Error('Failed to record payment');
                }

                // Refresh data
                fetchPayments();
                setShowPaymentModal(false);
                setSelectedStudent(null);
            } catch (err) {
                console.error('Error recording payment:', err);
                setError('Failed to record payment');
            }
        };

        const handleUpdateFeeStructures = async () => {
            if (!currentAcademy) return;

            try {
                const updatePromises = feeStructures.map((fee) =>
                    fetchWithAuth(
                        `${process.env.NEXT_PUBLIC_API_URL}/academies/${currentAcademy.id}/fee-structures/${fee.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                tuitionFee: fee.tuitionFee,
                                admissionFee: fee.admissionFee,
                                examFee: fee.examFee,
                                libraryFee: fee.libraryFee,
                                sportsFee: fee.sportsFee,
                                otherFee: fee.otherFee,
                                dueDate: fee.dueDate,
                                academicYear: fee.academicYear,
                                isActive: fee.isActive,
                            }),
                        }
                    )
                );

                await Promise.all(updatePromises);
                fetchFeeStructures();
                setShowFeeStructureModal(false);
            } catch (err) {
                console.error('Error updating fee structures:', err);
                setError('Failed to update fee structures');
            }
        };

        // =================== Render ===================
        if (isLoading) {
            return (
                <DashboardLayout>
                    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading fee data...</p>
                        </div>
                    </div>
                </DashboardLayout>
            );
        }

        if (error) {
            return (
                <DashboardLayout>
                    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                        <div className="text-center text-red-600">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </DashboardLayout>
            );
        }

        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Fee Management</h1>
                        <p className="text-gray-600 mb-8">Manage student fees, payments, and fee structures</p>

                        {/* =================== Summary Cards =================== */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Total Paid */}
                            <div className="bg-white rounded-lg shadow p-6 flex items-center">
                                <div className="p-3 rounded-full bg-green-100 mr-4">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        ${totalPaid?.toLocaleString() || 0}
                                    </h2>
                                    <p className="text-gray-600">Total Paid</p>
                                </div>
                            </div>

                            {/* Pending Payments */}
                            <div className="bg-white rounded-lg shadow p-6 flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                                    <Calendar className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        ${totalPending?.toLocaleString() || 0}
                                    </h2>
                                    <p className="text-gray-600">Pending Payments</p>
                                </div>
                            </div>

                            {/* Overdue Payments */}
                            <div className="bg-white rounded-lg shadow p-6 flex items-center">
                                <div className="p-3 rounded-full bg-red-100 mr-4">
                                    <Calendar className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        ${totalOverdue?.toLocaleString() || 0}
                                    </h2>
                                    <p className="text-gray-600">Overdue Payments</p>
                                </div>
                            </div>
                        </div>


                        {/* =================== Action Bar =================== */}
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
                                        value={filterClass}
                                        onChange={(e) => setFilterClass(e.target.value)}
                                        className="border rounded px-3 py-2"
                                    >
                                        <option value="all">All Classes</option>
                                        {Array.from(
                                            new Set(payments.map(p => p.student?.class?.name || "N/A"))
                                        ).map((className) => (
                                            <option key={className} value={className}>
                                                {className}
                                            </option>
                                        ))}
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

                        {/* =================== Fee Structure Table =================== */}
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
                                        {feeStructures.map((fee) => {
                                            // Add this safety check before rendering
                                            const className =
                                                typeof fee.class === "string"
                                                    ? fee.class
                                                    : fee.class?.name || fee.classId || "Class not found";

                                            return (
                                                <tr key={fee.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {className}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.tuitionFee || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.admissionFee || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.examFee || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.libraryFee || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.sportsFee || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.otherFee || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        ${(fee.tuitionFee || 0) + (fee.admissionFee || 0) + (fee.examFee || 0) +
                                                            (fee.libraryFee || 0) + (fee.sportsFee || 0) + (fee.otherFee || 0)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {fee.dueDate && !isNaN(new Date(fee.dueDate).getTime())
                                                            ? new Date(fee.dueDate).toLocaleDateString()
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* =================== Payment Records Table =================== */}
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPayments.map((p) => (
                                            <tr key={p.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {p.student?.firstName} {p.student?.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {p.student?.class?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    {p.paymentMethod || 'N/A'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${p.status === 'paid' ? 'text-green-600' :
                                                    p.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {p.status ? p.status.toUpperCase() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredPayments.length === 0 && (
                                    <div className="p-6 text-center text-gray-500">
                                        No payment records found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================== Payment Modal =================== */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Record New Payment
                            </h3>

                            <div className="space-y-4">
                                {/* Student Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Student
                                    </label>
                                    <select
                                        value={selectedStudent?.id || ""}
                                        onChange={(e) => {
                                            const student = students.find(s => s.id === Number(e.target.value));
                                            setSelectedStudent(student || null);
                                        }}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="">Select Student</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.firstName} {student.lastName} - {student.class?.name || "N/A"} ({student.rollNumber})
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                {/* Fee Structure */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fee Structure
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={selectedStudent?.feeStructureId || ""}
                                        onChange={(e) =>
                                            setSelectedStudent((prev) =>
                                                prev ? { ...prev, feeStructureId: Number(e.target.value) } : prev
                                            )
                                        }
                                    >
                                        <option value="">Select Fee Structure</option>
                                        {feeStructures.map((fs) => (
                                            <option key={fs.id} value={fs.id}>
                                                {(fs.class?.name ?? 'Class not found')} - Total: ${fs.total}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={selectedStudent?.amount || ""}
                                        onChange={(e) =>
                                            setSelectedStudent((prev) =>
                                                prev ? { ...prev, amount: parseFloat(e.target.value) } : prev
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={selectedStudent?.paymentMethod || ""}
                                        onChange={(e) =>
                                            setSelectedStudent((prev) =>
                                                prev ? { ...prev, paymentMethod: e.target.value } : prev
                                            )
                                        }
                                    >
                                        <option value="">Select method</option>
                                        <option value="cash">Cash</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="check">Check</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>

                                {/* Month */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Month
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. January 2025"
                                        value={selectedStudent?.month || ""}
                                        onChange={(e) =>
                                            setSelectedStudent((prev) =>
                                                prev ? { ...prev, month: e.target.value } : prev
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedStudent?.dueDate || ""}
                                        onChange={(e) =>
                                            setSelectedStudent((prev) =>
                                                prev ? { ...prev, dueDate: e.target.value } : prev
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={selectedStudent?.notes || ""}
                                        onChange={(e) =>
                                            setSelectedStudent((prev) =>
                                                prev ? { ...prev, notes: e.target.value } : prev
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Additional notes..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                    onClick={handleRecordPayment}
                                    disabled={!selectedStudent || !selectedStudent.amount || !selectedStudent.paymentMethod}
                                >
                                    Record Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* =================== Fee Structure Modal =================== */}
                {showFeeStructureModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Edit Fee Structure
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {[
                                                "Class",
                                                "Tuition Fee",
                                                "Admission Fee",
                                                "Exam Fee",
                                                "Library Fee",
                                                "Sports Fee",
                                                "Other Fee",
                                                "Total",
                                                "Due Date",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {feeStructures.map((fee) => {
                                            // Defensive class name handling
                                            const className =
                                                typeof fee.class === "string"
                                                    ? fee.class
                                                    : fee.class && typeof fee.class === "object"
                                                        ? fee.class.name
                                                        : fee.classId || "N/A";

                                            return (
                                                <tr key={fee.id}>
                                                    {/* Class Name */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {className}
                                                    </td>

                                                    {/* Tuition Fee Input */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="number"
                                                            value={fee.tuitionFee ?? 0}
                                                            className="w-20 border border-gray-300 rounded px-2 py-1"
                                                            onChange={(e) =>
                                                                setFeeStructures((prev) =>
                                                                    prev.map((f) =>
                                                                        f.id === fee.id
                                                                            ? { ...f, tuitionFee: parseFloat(e.target.value) || 0 }
                                                                            : f
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* Admission Fee Input */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="number"
                                                            value={fee.admissionFee ?? 0}
                                                            className="w-20 border border-gray-300 rounded px-2 py-1"
                                                            onChange={(e) =>
                                                                setFeeStructures((prev) =>
                                                                    prev.map((f) =>
                                                                        f.id === fee.id
                                                                            ? { ...f, admissionFee: parseFloat(e.target.value) || 0 }
                                                                            : f
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* Exam Fee Input */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="number"
                                                            value={fee.examFee ?? 0}
                                                            className="w-20 border border-gray-300 rounded px-2 py-1"
                                                            onChange={(e) =>
                                                                setFeeStructures((prev) =>
                                                                    prev.map((f) =>
                                                                        f.id === fee.id
                                                                            ? { ...f, examFee: parseFloat(e.target.value) || 0 }
                                                                            : f
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* Library Fee Input */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="number"
                                                            value={fee.libraryFee ?? 0}
                                                            className="w-20 border border-gray-300 rounded px-2 py-1"
                                                            onChange={(e) =>
                                                                setFeeStructures((prev) =>
                                                                    prev.map((f) =>
                                                                        f.id === fee.id
                                                                            ? { ...f, libraryFee: parseFloat(e.target.value) || 0 }
                                                                            : f
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* Sports Fee Input */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="number"
                                                            value={fee.sportsFee ?? 0}
                                                            className="w-20 border border-gray-300 rounded px-2 py-1"
                                                            onChange={(e) =>
                                                                setFeeStructures((prev) =>
                                                                    prev.map((f) =>
                                                                        f.id === fee.id
                                                                            ? { ...f, sportsFee: parseFloat(e.target.value) || 0 }
                                                                            : f
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* Other Fee Input */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="number"
                                                            value={fee.otherFee ?? 0}
                                                            className="w-20 border border-gray-300 rounded px-2 py-1"
                                                            onChange={(e) =>
                                                                setFeeStructures((prev) =>
                                                                    prev.map((f) =>
                                                                        f.id === fee.id
                                                                            ? { ...f, otherFee: parseFloat(e.target.value) || 0 }
                                                                            : f
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* Total (auto-calculated) */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {(fee.tuitionFee ?? 0) +
                                                            (fee.admissionFee ?? 0) +
                                                            (fee.examFee ?? 0) +
                                                            (fee.libraryFee ?? 0) +
                                                            (fee.sportsFee ?? 0) +
                                                            (fee.otherFee ?? 0)}
                                                    </td>

                                                    {/* Due Date */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="date"
                                                            value={fee.dueDate || ""}
                                                            className="border border-gray-300 rounded px-2 py-1"
                                                            onChange={(e) =>
                                                                setFeeStructures((prev) =>
                                                                    prev.map((f) =>
                                                                        f.id === fee.id ? { ...f, dueDate: e.target.value } : f
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Modal Buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    onClick={() => setShowFeeStructureModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={handleUpdateFeeStructures}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </DashboardLayout>
        )
    }

    export default FeeManagementPage