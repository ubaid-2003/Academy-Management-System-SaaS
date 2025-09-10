'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import { Plus, Edit2, Trash2, Users, BookOpen, User, Eye, Calendar, Clock, X, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/app/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { useAcademy } from '../../../context/AcademyContext';
// --- Types ---
type CourseStatus = 'active' | 'pending' | 'archived';

interface Course {
    id: number;
    title: string;
    code?: string;
    description?: string;
    field?: string;
    credits?: number;
    classId?: number[] | number; // backend may return single id or array
    teacherId?: number | null; // primary assigned teacher
    teacherIds?: number[]; // or multiple teachers
    enrolledStudents?: number[];
    maxStudents?: number;
    status?: CourseStatus | string;
    schedule?: string;
    duration?: string;
    prerequisites?: string[] | string;
}
interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    qualification: string;
    experienceYears: number;
    subjects: string;
}


interface Student {
    id: number;
    name: string;
    email?: string;
    semester?: string;
    avatar?: string;
    academyId?: number; // <--- add this
}


// --- Helper: unified auth & axios ---
const useApi = (basePath = 'http://localhost:5000') => {
    const instanceRef = useMemo(() => {
        const instance = axios.create({ baseURL: basePath, timeout: 10_000 });
        instance.interceptors.request.use((config) => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                const token = user?.token || localStorage.getItem('token');
                if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
            } catch (e) {
                // ignore
            }
            return config;
        });
        return instance;
    }, [basePath]);

    return instanceRef;
};

// --- Component ---
const CourseManagementSystem: React.FC = () => {
    const { currentAcademy } = useAcademy();
    const router = useRouter();
    const api = useApi();

    // data
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);


    // ui state
    const [activeTab, setActiveTab] = useState<'courses' | 'teachers' | 'students'>('courses');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit' | 'assign' | 'enroll' | 'view' | ''>('');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');

    // forms
    const emptyCourseForm: Partial<Course> = {
        title: '',
        code: '',
        description: '',
        field: '',
        credits: 3,
        maxStudents: 30,
        status: 'active',
        schedule: '',
        duration: '',
        prerequisites: [],
        classId: []
    };

    const [courseForm, setCourseForm] = useState<Partial<Course>>(emptyCourseForm);
    const [assignmentForm, setAssignmentForm] = useState<{ teacherIds: number[] }>({ teacherIds: [] });
    const [enrollmentForm, setEnrollmentForm] = useState<{ studentIds: number[] }>({ studentIds: [] });

    // unified academy id getter (try context then localStorage fallback)
    const getAcademyId = () => {
        try {
            if (currentAcademy?.id) return currentAcademy.id;
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            return user?.activeAcademyId || null;
        } catch (e) {
            return null;
        }
    };

    // --- Fetchers ---
    const fetchAll = async () => {
        const academyId = getAcademyId();
        if (!academyId) return;
        setLoading(true);
        setError(null);
        try {
            const [coursesRes, teachersRes, studentsRes, classesRes] = await Promise.all([
                api.get(`/api/academies/${academyId}/courses`),
                api.get(`/api/academies/${academyId}/teachers`),
                api.get(`/api/academies/${academyId}/students`),
                api.get(`/api/academies/${academyId}/classes`)
            ]);

            setCourses(Array.isArray(coursesRes.data?.courses) ? coursesRes.data.courses : (coursesRes.data || []));
            setTeachers(Array.isArray(teachersRes.data) ? teachersRes.data : (teachersRes.data?.teachers || []));
            setStudents(Array.isArray(studentsRes.data?.students) ? studentsRes.data.students : (studentsRes.data || []));
            setClasses(classesRes.data?.classes || classesRes.data || []);
        } catch (err: any) {
            console.error('Fetch error', err);
            setError(err?.response?.data?.message || err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // if no token found, redirect to login
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const token = user?.token || localStorage.getItem('token');
            if (!token) router.push('/login');
        } catch {
            router.push('/login');
        }

        if (getAcademyId()) fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAcademy]);

    // --- CRUD Handlers ---
    const createCourse = async () => {
        const academyId = getAcademyId();
        if (!academyId) return alert('Academy not available');
        if (!courseForm.title) return alert('Title required');
        if (!courseForm.classId || (Array.isArray(courseForm.classId) && courseForm.classId.length === 0)) return alert('Select at least one class');

        setBusy(true);
        try {
            const payload: any = { ...courseForm };
            if (Array.isArray(courseForm.classId)) payload.classId = courseForm.classId[0];
            if (Array.isArray(courseForm.prerequisites)) payload.prerequisites = (courseForm.prerequisites as string[]).join(',');
            payload.status = (payload.status || 'active').toString().toLowerCase();

            await api.post(`/api/academies/${academyId}/courses`, payload);

            // ✅ Re-fetch all courses from backend to ensure state is always synced
            await fetchAll();
            closeModal();
            toast.success('Course created successfully');
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Create failed');
        } finally {
            setBusy(false);
        }
    };

    const updateCourse = async () => {
        if (!selectedCourse) return;
        const academyId = getAcademyId();
        if (!academyId) return;

        setBusy(true);
        try {
            const payload: any = { ...courseForm };
            if (Array.isArray(courseForm.classId)) payload.classId = courseForm.classId[0];
            if (Array.isArray(courseForm.prerequisites)) payload.prerequisites = (courseForm.prerequisites as string[]).join(',');
            payload.status = (payload.status || 'active').toString().toLowerCase();

            await api.put(`/api/academies/${academyId}/courses/${selectedCourse.id}`, payload);

            // ✅ Re-fetch all courses
            await fetchAll();
            closeModal();
            toast.success('Course updated successfully');
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Update failed');
        } finally {
            setBusy(false);
        }
    };

    const deleteCourse = async (id: number) => {
        if (!confirm('Delete this course?')) return;
        const academyId = getAcademyId();
        if (!academyId) return;

        setBusy(true);
        try {
            await api.delete(`/api/academies/${academyId}/courses/${id}`);
            setCourses(prev => prev.filter(c => c.id !== id));
            alert('Deleted');
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || 'Delete failed');
        } finally {
            setBusy(false);
        }
    };

    const openAssignModal = (course: Course) => {
        setSelectedCourse(course);
        setAssignmentForm({
            teacherIds: (course.teacherIds && Array.isArray(course.teacherIds))
                ? course.teacherIds
                : (course.teacherId ? [course.teacherId] : [])
        });
        setModalType('assign');
        setShowModal(true);
    };

    const assignTeachers = async () => {
        if (!selectedCourse) {
            toast.error("No course selected");
            return;
        }
        const academyId = getAcademyId();
        if (!academyId) return;

        setBusy(true);
        try {
            await api.post(
                `http://localhost:5000/api/academies/${academyId}/courses/${selectedCourse.id}/assign-teachers`,
                { teacherIds: assignmentForm.teacherIds }
            );

            // Always re-fetch from backend to stay in sync
            await fetchAll();

            toast.success("Teachers assigned successfully");
            closeModal();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to assign teachers");
        } finally {
            setBusy(false);
        }
    };



    const openEnrollModal = (course: Course) => {
        setSelectedCourse(course);
        const academyId = getAcademyId();
        if (!academyId) return;

        // Filter academy students only
        const academyStudents = students.filter(
            s => s.academyId === academyId || !s.academyId
        );

        // Preselect enrolled
        const enrolledIds = course.enrolledStudents || [];

        setEnrollmentForm({ studentIds: enrolledIds });
        setAvailableStudents(academyStudents); // ✅ use separate state
        setModalType('enroll');
        setShowModal(true);
    };


    const enrollStudent = async () => {
        const academyId = getAcademyId();
        if (!academyId || !selectedCourse) return;

        if (!enrollmentForm.studentIds || enrollmentForm.studentIds.length === 0) {
            toast.error("Select at least one student to enroll");
            return;
        }

        setBusy(true);
        try {
            await api.post(`/api/academies/${academyId}/courses/${selectedCourse.id}/enroll-students`, {
                studentIds: enrollmentForm.studentIds
            });

            // ✅ Re-fetch courses and students to keep frontend in sync
            await fetchAll();
            closeModal();
            toast.success('Students enrolled successfully');
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Enrollment failed');
        } finally {
            setBusy(false);
        }
    };


    const openCreateModal = () => {
        setCourseForm(emptyCourseForm);
        setSelectedCourse(null);
        setModalType('create');
        setShowModal(true);
    };

    const openEditModal = (course: Course) => {
        setSelectedCourse(course);
        setCourseForm({ ...course, classId: Array.isArray(course.classId) ? course.classId : (course.classId ? [Number(course.classId)] : []), prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : (typeof course.prerequisites === 'string' ? course.prerequisites.split(',').map(s => s.trim()) : []) });
        setModalType('edit');
        setShowModal(true);
    };

    const openViewCourse = (course: Course) => {
        setSelectedCourse(course);
        setModalType('view');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType('');
        setSelectedCourse(null);
        setSelectedStudent(null);
        setCourseForm(emptyCourseForm);
        setAssignmentForm({ teacherIds: [] });
        setEnrollmentForm({ studentIds: [] });
    };

    const filteredCourses = courses
        .filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(c => statusFilter === 'all' ? true : (c.status?.toString().toLowerCase() === statusFilter));

    const getTeacherNames = (course: Course) => {
        if (Array.isArray(course.teacherIds) && course.teacherIds.length > 0) {
            return course.teacherIds.map(tid => {
                const t = teachers.find(x => x.id === tid);
                return t ? `${t.firstName} ${t.lastName}` : `T#${tid}`;
            });
        }
        if (course.teacherId) {
            const t = teachers.find(x => x.id === course.teacherId);
            return [t ? `${t.firstName} ${t.lastName}` : `T#${course.teacherId}`];
        }
        return [];
    };


    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Course Management</h1>
                        <p className="text-sm text-gray-500">Manage courses, teachers and student enrollments for the selected academy.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 text-white rounded shadow bg-emerald-600 hover:opacity-95"><Plus /> New Course</button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                    {(['courses', 'teachers', 'students'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                    ))}
                </div>

                {error && <div className="mb-4 text-red-600">{error}</div>}

                {activeTab === 'courses' && (
                    <div className="p-4 bg-white rounded shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 px-3 py-2 rounded bg-gray-50">
                                <Search />
                                <input className="bg-transparent outline-none" placeholder="Search courses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>

                            <select className="p-2 border rounded" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                                <option value="all">All status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                            </select>

                            <div className="ml-auto text-sm text-gray-500">{loading ? 'Loading...' : `${courses.length} courses`}</div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse table-auto">
                                <thead>
                                    <tr className="text-sm text-left text-gray-600">
                                        <th className="p-2 border-b">Title</th>
                                        <th className="p-2 border-b">Code</th>
                                        <th className="p-2 border-b">Teacher</th>
                                        <th className="p-2 border-b">Enrolled</th>
                                        <th className="p-2 border-b">Status</th>
                                        <th className="p-2 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="p-2 border-b">{c.title}</td>
                                            <td className="p-2 border-b">{c.code || '-'}</td>
                                            <td className="p-2 border-b">
                                                {getTeacherNames(c).length > 0 ? (
                                                    getTeacherNames(c).map(name => (
                                                        <span key={name} className="inline-block px-2 py-1 mr-1 text-xs text-green-800 bg-green-100 rounded">
                                                            {name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="p-2 border-b">{(c.enrolledStudents || []).length}</td>
                                            <td className="p-2 capitalize border-b">{c.status}</td>
                                            <td className="flex gap-2 p-2 border-b">
                                                <button onClick={() => openEditModal(c)} className="px-2 py-1 text-white bg-yellow-500 rounded" title="Edit"><Edit2 /></button>
                                                <button onClick={() => deleteCourse(c.id)} className="px-2 py-1 text-white bg-red-500 rounded" title="Delete"><Trash2 /></button>
                                                <button onClick={() => openAssignModal(c)} className="px-2 py-1 text-white rounded bg-sky-600" title="Assign Teachers"><Users /></button>
                                                <button onClick={() => openEnrollModal(c)} className="px-2 py-1 text-white rounded bg-emerald-600" title="Enroll Student">Enroll</button>
                                                <button onClick={() => openViewCourse(c)} className="px-2 py-1 text-white bg-gray-700 rounded" title="View"><Eye /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'teachers' && (
                    <div className="p-4 bg-white rounded shadow">
                        <h3 className="mb-3 font-medium">Teachers</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="text-sm text-left text-gray-600"><th className="p-2 border-b">Name</th><th className="p-2 border-b">Email</th><th className="p-2 border-b">Specialization</th></tr>
                                </thead>
                                <tbody>
                                    {teachers.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="p-2 border-b">{t.firstName} {t.lastName}</td>
                                            <td className="p-2 border-b">{t.email}</td>
                                            <td className="p-2 border-b">{t.subjects || t.qualification || "N/A"}</td>
                                            <td className="p-2 border-b">
                                                <button
                                                    onClick={() => {
                                                        if (!selectedCourse) {
                                                            toast.error("Select a course first to assign this teacher.");
                                                            return;
                                                        }
                                                        setAssignmentForm({ teacherIds: [t.id] });
                                                        assignTeachers(); // ✅ now works because selectedCourse is set
                                                    }}
                                                    className="px-2 py-1 text-white rounded bg-sky-600"
                                                >
                                                    Assign
                                                </button>

                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="p-4 bg-white rounded shadow">
                        <h3 className="mb-3 font-medium">Students</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="text-sm text-left text-gray-600"><th className="p-2 border-b">Name</th><th className="p-2 border-b">Email</th><th className="p-2 border-b">Semester</th><th className="p-2 border-b">Actions</th></tr>
                                </thead>
                                <tbody>
                                    {students.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="p-2 border-b">{s.name}</td>
                                            <td className="p-2 border-b">{s.email}</td>
                                            <td className="flex gap-2 p-2 border-b">
                                                <button onClick={() => { setSelectedStudent(s); setModalType('view'); setShowModal(true); }} className="px-2 py-1 text-white bg-gray-700 rounded">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal overlay */}
                {showModal && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-40">
                        <div className="relative w-full max-w-2xl p-6 bg-white rounded shadow-lg">
                            <button onClick={closeModal} className="absolute text-gray-600 top-3 right-3"><X /></button>

                            {modalType === 'create' && (
                                <div>
                                    <h2 className="mb-3 text-xl font-semibold">Create Course</h2>
                                    <div className="grid grid-cols-1 gap-3">
                                        <input className="p-2 border rounded" placeholder="Title" value={courseForm.title || ''} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input className="p-2 border rounded" placeholder="Code" value={courseForm.code || ''} onChange={e => setCourseForm({ ...courseForm, code: e.target.value })} />
                                            <input type="number" className="p-2 border rounded" placeholder="Credits" value={courseForm.credits || 3} onChange={e => setCourseForm({ ...courseForm, credits: Number(e.target.value) })} />
                                        </div>

                                        <textarea className="p-2 border rounded" placeholder="Description" value={courseForm.description || ''} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} />

                                        <div>
                                            <label className="block mb-1 text-sm">Select Class(es)</label>
                                            <select multiple value={Array.isArray(courseForm.classId) ? courseForm.classId.map(String) : courseForm.classId !== undefined ? [String(courseForm.classId)] : []} onChange={e => {
                                                const vals = Array.from(e.target.selectedOptions).map(o => Number(o.value));
                                                setCourseForm({ ...courseForm, classId: vals });
                                            }} className="w-full p-2 border rounded">
                                                {classes.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
                                            </select>
                                            <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to multi-select (backend accepts first class by default)</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <select className="flex-1 p-2 border rounded" value={(courseForm.status as string) || 'active'} onChange={e => setCourseForm({ ...courseForm, status: e.target.value as any })}>
                                                <option value="active">Active</option>
                                                <option value="pending">Pending</option>
                                            </select>

                                            <input className="w-40 p-2 border rounded" placeholder="Schedule" value={courseForm.schedule || ''} onChange={e => setCourseForm({ ...courseForm, schedule: e.target.value })} />
                                        </div>

                                        <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={createCourse} disabled={busy} className="px-4 py-2 text-white rounded bg-emerald-600">{busy ? 'Saving...' : 'Create'}</button>
                                            <button onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'edit' && selectedCourse && (
                                <div>
                                    <h2 className="mb-3 text-xl font-semibold">Edit Course</h2>
                                    <div className="grid grid-cols-1 gap-3">
                                        <input className="p-2 border rounded" placeholder="Title" value={courseForm.title || ''} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
                                        <input className="p-2 border rounded" placeholder="Code" value={courseForm.code || ''} onChange={e => setCourseForm({ ...courseForm, code: e.target.value })} />
                                        <textarea className="p-2 border rounded" placeholder="Description" value={courseForm.description || ''} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={updateCourse} disabled={busy} className="px-4 py-2 text-white bg-yellow-500 rounded">{busy ? 'Updating...' : 'Update'}</button>
                                            <button onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalType === 'assign' && selectedCourse && (
                                <div>
                                    <h2 className="mb-3 text-xl font-semibold">Assign Teachers — {selectedCourse.title}</h2>
                                    <div>
                                        <label className="block mb-1 text-sm">Select one or more teachers</label>
                                        <select
                                            multiple
                                            value={assignmentForm.teacherIds.map(String)}
                                            onChange={e => {
                                                const vals = Array.from(e.target.selectedOptions).map(o => Number(o.value));
                                                setAssignmentForm({ teacherIds: vals });
                                            }}
                                            className="w-full p-2 border rounded"
                                        >
                                            {teachers.map(t => (
                                                <option key={t.id} value={t.id}>
                                                    {t.firstName} {t.lastName} — {t.qualification || t.subjects || 'N/A'}
                                                </option>
                                            ))}
                                        </select>

                                        <p className="mt-1 text-xs text-gray-500">Primary teacher will be the first selected.</p>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={async () => {
                                                    if (!selectedCourse) return;
                                                    if (assignmentForm.teacherIds.length === 0) {
                                                        toast.error("Select at least one teacher to assign");
                                                        return;
                                                    }

                                                    try {
                                                        setBusy(true);

                                                        const res = await api.post(
                                                            `/api/academies/${getAcademyId()}/courses/${selectedCourse.id}/assign-teachers`,
                                                            { teacherIds: assignmentForm.teacherIds }
                                                        );

                                                        const assignedTeachers = res.data.teachers || [];

                                                        // ✅ Update courses with both teacherIds and teachers
                                                        setCourses(prev =>
                                                            prev.map(c =>
                                                                c.id === selectedCourse.id
                                                                    ? {
                                                                        ...c,
                                                                        teacherIds: assignedTeachers.map((t: Teacher) => t.id),
                                                                        teachers: assignedTeachers, // keep full teacher objects for UI mapping
                                                                    }
                                                                    : c
                                                            )
                                                        );

                                                        toast.success("Teachers assigned successfully");
                                                        closeModal(); // close modal after successful assignment
                                                    } catch (err) {
                                                        console.error(err);
                                                        toast.error("Failed to assign teachers");
                                                    } finally {
                                                        setBusy(false);
                                                    }
                                                }}
                                                disabled={busy}
                                                className="px-4 py-2 text-white rounded bg-sky-600"
                                            >
                                                {busy ? "Assigning..." : "Assign"}
                                            </button>


                                            <button
                                                onClick={closeModal}
                                                className="px-4 py-2 border rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {modalType === 'enroll' && selectedCourse && (
                                <div>
                                    <h2 className="mb-3 text-xl font-semibold">
                                        Enroll Students — {selectedCourse.title}
                                    </h2>
                                    <div>
                                        <label className="block mb-1 text-sm">Select Students</label>
                                        <select
                                            multiple
                                            value={enrollmentForm.studentIds.map(String)}
                                            onChange={e => {
                                                const vals = Array.from(e.target.selectedOptions).map(o => Number(o.value));
                                                setEnrollmentForm({ studentIds: vals });
                                            }}
                                            className="w-full p-2 border rounded"
                                        >
                                            {availableStudents.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} — {s.email || "No Email"}
                                                </option>
                                            ))}
                                        </select>
                                        )

                                        <p className="mt-1 text-xs text-gray-500">
                                            Hold Ctrl/Cmd to select multiple students.
                                        </p>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={enrollStudent}
                                                disabled={busy}
                                                className="px-4 py-2 text-white rounded bg-emerald-600"
                                            >
                                                {busy ? "Enrolling..." : "Enroll"}
                                            </button>
                                            <button
                                                onClick={closeModal}
                                                className="px-4 py-2 border rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {modalType === 'view' && (selectedCourse || selectedStudent) && (
                                <div>
                                    <h2 className="mb-3 text-xl font-semibold">Details</h2>
                                    {selectedCourse && (
                                        <div className="space-y-2">
                                            <div><strong>Title:</strong> {selectedCourse.title}</div>
                                            <div><strong>Code:</strong> {selectedCourse.code || '-'}</div>
                                            <div>
                                                <strong>Teachers:</strong>{' '}
                                                {getTeacherNames(selectedCourse).length > 0
                                                    ? getTeacherNames(selectedCourse).join(', ')
                                                    : 'Unassigned'}
                                            </div>
                                            <div><strong>Schedule:</strong> {selectedCourse.schedule || '-'}</div>
                                            <div><strong>Duration:</strong> {selectedCourse.duration || '-'}</div>
                                            <div><strong>Prerequisites:</strong> {Array.isArray(selectedCourse.prerequisites) ? selectedCourse.prerequisites.join(', ') : selectedCourse.prerequisites}</div>
                                            <div className="flex justify-end mt-4"><button onClick={closeModal} className="px-4 py-2 border rounded">Close</button></div>
                                        </div>
                                    )}

                                    {selectedStudent && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">{selectedStudent.avatar ? <img src={selectedStudent.avatar} alt="avatar" className="w-16 h-16 rounded-full" /> : <User />}</div>
                                                <div>
                                                    <div className="text-lg font-medium">{selectedStudent.name}</div>
                                                    <div className="text-sm text-gray-500">{selectedStudent.email}</div>
                                                </div>
                                            </div>
                                            <div><strong>Semester:</strong> {selectedStudent.semester || '-'}</div>
                                            <div className="flex justify-end mt-4"><button onClick={closeModal} className="px-4 py-2 border rounded">Close</button></div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CourseManagementSystem;
