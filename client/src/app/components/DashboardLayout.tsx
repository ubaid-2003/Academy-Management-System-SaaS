"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useAcademy } from '../context/AcademyContext';
import {
    // Dashboard
    Home,

    // Academy Management
    Building2,
    GraduationCap,
    PlusCircle,
    BookOpen,
    CalendarDays,

    // User Management
    UserCheck,
    Users,
    Shield,

    // Exams & Attendance
    FileText,
    Award,
    ClipboardList,

    // Finance & Fees
    Wallet,

    // Library & Resources
    BookCopy,

    // Reports & Analytics
    BarChart3,

    // Settings
    Settings,

    // UI / Utility
    LogOut,
    User,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";

// ------------------ TYPES ------------------
type Academy = {
    id: number;
    name: string;
    location?: string;
};

type AcademyStats = {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalClasses: number;
    activeStudents: number;
    pendingEnrollments: number;
    monthlyRevenue: number;
};

type NavItem = {
    label: string;
    href: string;
    icon: any;
};

// ------------------ MAIN COMPONENT ------------------
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [academyDropdownOpen, setAcademyDropdownOpen] = useState<boolean>(false);
    const [academies, setAcademies] = useState<Academy[]>([]);
    const [academyStats, setAcademyStats] = useState<AcademyStats | null>(null);
    const [loadingAcademies, setLoadingAcademies] = useState<boolean>(false);
    const [loadingStats, setLoadingStats] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const searchRef = useRef<NodeJS.Timeout | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // ✅ useAuth (single source of truth)
    const { user, setUser, fetchWithAuth, logout, updateActiveAcademy } = useAuth();

    interface AcademyStats {
        totalStudents: number;
        totalTeachers: number;
        activeStudents: number;
        inactiveStudents: number; // ✅ add this
        totalCourses: number;
        totalClasses: number;
    }

    // ------------------ LOCALSTORAGE COLLAPSE ------------------
    useEffect(() => {
        const collapsedState = localStorage.getItem("sidebar-collapsed") === "true";
        setCollapsed(collapsedState);
    }, []);

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", String(collapsed));
    }, [collapsed]);

    useEffect(() => {
        const fetchUserAcademies = async () => {
            if (!user) return;
            setLoadingAcademies(true);
            setError(null);

            try {
                // Use fetchWithAuth to handle 401 and headers
                const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/academies/user`);
                const data = await res.json().catch(() => []);

                const academiesArray: Academy[] = Array.isArray(data) ? data : [];
                setAcademies(academiesArray);

                // If no active academy, set the first one
                if (!user.activeAcademyId && academiesArray.length > 0) {
                    await updateActiveAcademy(academiesArray[0].id);
                    // No need to manually setUser; updateActiveAcademy handles it
                }
            } catch (err: any) {
                console.error("Error fetching academies:", err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoadingAcademies(false);
            }
        };

        fetchUserAcademies();
    }, [user, fetchWithAuth, updateActiveAcademy]);


    const activeAcademy = academies.find(a => a.id === user?.activeAcademyId) || null;

    const handleLogout = () => {
        logout();
        setAcademies([]);
        router.replace("/auth/login");
    };
    // ------------------ NAVIGATION ------------------
    // ------------------ NAVIGATION ------------------
    interface NavSection {
        section: string;
        items: NavItem[];
    }

    const navigation: NavSection[] = [
        {
            section: "Dashboard",
            items: [
                { label: "Dashboard", href: "/pages/dashboard", icon: Home },
            ],
        },
        {
            section: "Academy Management",
            items: [
                { label: "My Academies", href: "/pages/academy-admin/academies", icon: Building2 },
                { label: "Add Academy", href: "/pages/academy-admin/add-academy", icon: PlusCircle },
                { label: "Courses", href: "/pages/academy-admin/courses", icon: BookOpen },
                { label: "Classes", href: "/pages/academy-admin/classes", icon: CalendarDays },
            ],
        },
        {
            section: "User Management",
            items: [
                { label: "Teachers", href: "/pages/academy-admin/add-teachers", icon: UserCheck },
                { label: "Students", href: "/pages/academy-admin/add-students", icon: Users },
            ],
        },
        {
            section: "Exams & Attendance",
            items: [
                { label: "Exam Management", href: "/pages/academy-admin/exams", icon: FileText },
                // { label: "Results", href: "/pages/academy-admin/results", icon: Award },
                { label: "Attendance", href: "/pages/academy-admin/attendance", icon: ClipboardList },
            ],
        },
        {
            section: "Finance & Fees",
            items: [
                { label: "Fee Management", href: "/pages/academy-admin/fees", icon: Wallet },
            ],
        },
        {
            section: "Roles",
            items: [
                { label: "Roles & Permissions", href: "/pages/academy-admin/add-roles", icon: Shield },

            ]
        },
        {
            section: "Settings",
            items: [
                { label: "Settings", href: "/pages/academy-admin/settings", icon: Settings },
            ],
        },
    ];



    // ------------------ SEARCH DEBOUNCE ------------------
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (searchRef.current) clearTimeout(searchRef.current);
        searchRef.current = setTimeout(() => {
            console.log("Searching for:", value);
            // TODO: Implement search API call
        }, 500);
    };

    // ------------------ STATS CARDS ------------------
    const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }: {
        icon: any;
        label: string;
        value: string | number;
        subtext?: string;
        color?: string;
    }) => {
        const colorClasses = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600",
            purple: "from-purple-500 to-purple-600",
            orange: "from-orange-500 to-orange-600",
            red: "from-red-500 to-red-600",
            teal: "from-teal-500 to-teal-600",
        };

        return (
            <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">{label}</p>
                        <p className="text-2xl font-bold text-slate-800">{value}</p>
                        {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        );
    };

    // ------------------ RENDER ------------------
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Academy Dropdown Overlay */}
            {academyDropdownOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setAcademyDropdownOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${collapsed ? "w-20" : "w-72"} ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:relative z-50 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-xl md:shadow-sm`}>
                {/* Logo */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 bg-slate-50/50">
                    {!collapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-800">SAMS</h1>
                                <p className="text-xs font-medium text-slate-500">Academy Management</p>
                            </div>
                        </div>
                    )}

                    {/* Collapse Button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden p-2 transition-all rounded-lg md:flex text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    {/* Mobile Close */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 transition-colors rounded-lg md:hidden text-slate-400 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map(section =>
                        section.items.map(item => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        router.push(item.href);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${collapsed ? "justify-center" : ""} ${isActive ? "bg-slate-200 text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                                >
                                    <Icon className={`flex-shrink-0 w-5 h-5 transition-colors ${isActive ? "text-slate-900" : ""}`} />
                                    {!collapsed && <span className="font-medium tracking-tight">{item.label}</span>}
                                </button>
                            );
                        })
                    )}
                </nav>

                {/* User Profile & Logout */}
                <div className="px-4 py-4 mt-auto border-t border-slate-100 bg-slate-50/50">
                    {!collapsed && user && (
                        <div className="flex items-center p-3 mb-3 space-x-3 bg-white border shadow-sm rounded-xl border-slate-100">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-slate-800">{user.fullName ?? "Unknown User"}</p>
                                <p className="text-xs font-medium truncate text-slate-500">{user.email}</p>
                                <p className="text-xs font-medium text-blue-600">{user.role}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center space-x-3 p-3 w-full rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 font-medium ${collapsed ? "justify-center" : ""}`}
                    >
                        <LogOut className="w-5 h-5" />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-hidden bg-slate-50">
                {/* Top Header */}
                <header className="flex items-center justify-between h-20 px-6 bg-white border-b shadow-sm border-slate-200">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open sidebar menu"
                            className="p-2 transition rounded-lg md:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard</h1>
                            <p className="text-sm font-medium text-slate-600">
                                Welcome back, {user?.fullName ?? "Guest"}
                                {activeAcademy && ` • ${activeAcademy.name}`}
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {/* Academy Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setAcademyDropdownOpen(!academyDropdownOpen)}
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium transition border rounded-xl bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-700 text-slate-700"
                            >
                                <Building2 className="w-4 h-4" />
                                <span className="hidden sm:block">
                                    {activeAcademy?.name ?? "Select Academy"}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${academyDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown menu */}
                            {academyDropdownOpen && (
                                <div className="absolute right-0 z-40 w-64 mt-2 overflow-y-auto bg-white border shadow-lg rounded-xl border-slate-200 max-h-60">
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-xs font-semibold tracking-wide uppercase text-slate-500">
                                            Switch Academy
                                        </div>

                                        {loadingAcademies && (
                                            <p className="px-3 py-2 text-xs text-slate-500">Loading...</p>
                                        )}
                                        {error && <p className="px-3 py-2 text-xs text-red-500">{error}</p>}

                                        {academies
                                            .filter((a) => a.id !== activeAcademy?.id)
                                            .map((academy) => (
                                                <button
                                                    key={academy.id}
                                                    onClick={async () => {
                                                        try {
                                                            await updateActiveAcademy(academy.id);
                                                            setAcademyDropdownOpen(false);

                                                            // ✅ Redirect to dashboard
                                                            router.push("/pages/dashboard");
                                                        } catch (err) {
                                                            console.error("Failed to switch academy:", err);
                                                            alert("Failed to switch academy. Please try again.");
                                                        }
                                                    }}
                                                    className="flex items-center w-full gap-3 px-3 py-2 transition rounded-lg hover:bg-slate-50 text-slate-700"
                                                >
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100">
                                                        <Building2 className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <div className="font-semibold truncate">{academy.name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {academy.location ?? "No location"}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}

                                        {academies.length === 0 && !loadingAcademies && (
                                            <p className="px-3 py-2 text-xs text-slate-500">No academies found</p>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Search */}
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search students, teachers..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-64 py-2 pl-10 pr-4 text-sm transition border rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                            />
                            <Search className="absolute w-4 h-4 -translate-y-1/2 text-slate-400 left-3 top-1/2" />
                        </div>

                        <button className="p-2 transition rounded-lg sm:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 transition rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Bell className="w-5 h-5" />

                        </button>

                        {/* Desktop User */}
                        <div className="items-center hidden gap-3 pl-3 border-l md:flex border-slate-200">
                            {user && (
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-800">{user.fullName}</p>
                                        <p className="text-xs font-medium text-slate-500">{user.role}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm bg-gradient-to-br from-blue-500 to-purple-600">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <section className="h-[calc(100vh-5rem)] overflow-y-auto p-6">
                    <div className="mx-auto max-w-7xl">

                        {children}
                    </div>
                </section>
            </main>
        </div>
    );
}