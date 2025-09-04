"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
    Home,
    Users,
    LogOut,
    GraduationCap,
    BarChart,
    Settings,
    User,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    Menu,
    X,
    Building2,
    ChevronDown,
    BookOpen,
    Calendar,
    UserCheck,
    TrendingUp,
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
    completionRate: number;
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
    const { user, setUser, logout, updateActiveAcademy } = useAuth();

    // ------------------ LOCALSTORAGE COLLAPSE ------------------
    useEffect(() => {
        const collapsedState = localStorage.getItem("sidebar-collapsed") === "true";
        setCollapsed(collapsedState);
    }, []);

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", String(collapsed));
    }, [collapsed]);

    // ------------------ FETCH ACADEMIES ------------------
    useEffect(() => {
        const fetchAcademies = async () => {
            if (!user?.token) return;
            setLoadingAcademies(true);
            setError(null);

            try {
                const res = await fetch("http://localhost:5000/api/academies/user", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch academies");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setAcademies(data);
                    if (!user.activeAcademyId && data.length > 0) {
                        await updateActiveAcademy(data[0].id);
                    }
                } else if (data?.message === "No academy created yet.") {
                    setAcademies([]);
                } else {
                    throw new Error("Unexpected API response");
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong");
                setAcademies([]);
            } finally {
                setLoadingAcademies(false);
            }
        };

        fetchAcademies();
    }, [user?.token]);

    // ------------------ FETCH ACADEMY STATS ------------------
    useEffect(() => {
        const fetchAcademyStats = async () => {
            if (!user?.token || !user?.activeAcademyId) return;
            setLoadingStats(true);

            try {
                const res = await fetch(`http://localhost:5000/api/academies/${user.activeAcademyId}/stats`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch academy stats");
                const stats = await res.json();
                setAcademyStats(stats);
            } catch (err: any) {
                console.error("Error fetching academy stats:", err);
                // Set default stats if API fails
                setAcademyStats({
                    totalStudents: 0,
                    totalTeachers: 0,
                    totalCourses: 0,
                    totalClasses: 0,
                    activeStudents: 0,
                    pendingEnrollments: 0,
                    monthlyRevenue: 0,
                    completionRate: 0,
                });
            } finally {
                setLoadingStats(false);
            }
        };

        fetchAcademyStats();
    }, [user?.token, user?.activeAcademyId]);

    // ------------------ COMPUTE ACTIVE ACADEMY ------------------
    const activeAcademy = academies.find(
        (a) => a.id === user?.activeAcademyId
    );

    // ------------------ LOGOUT ------------------
    const handleLogout = () => {
        logout();
        setAcademies([]);
        setAcademyStats(null);
        router.replace("/auth/login");
    };

    // ------------------ NAVIGATION ------------------
    const navigationItems: NavItem[] = [
        { label: "Dashboard", href: "/pages/dashboard", icon: Home },
        { label: "My Academies", href: "/pages/academy-admin/academies", icon: Building2 },
        { label: "Add Academy", href: "/pages/academy-admin/add-academy", icon: GraduationCap },
        { label: "Manage Teachers", href: "/pages/academy-admin/teachers", icon: UserCheck },
        { label: "Manage Students", href: "/pages/academy-admin/students", icon: Users },
        { label: "Courses", href: "/pages/academy-admin/courses", icon: BookOpen },
        { label: "Classes", href: "/pages/academy-admin/classes", icon: Calendar },
        { label: "Analytics", href: "/pages/academy-admin/analytics", icon: BarChart },
        { label: "Settings", href: "/pages/academy-admin/settings", icon: Settings },
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
                    {navigationItems.map(item => {
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
                    })}
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
                        {/* <button className="relative p-2 transition rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Bell className="w-5 h-5" />
                            {academyStats?.pendingEnrollments > 0 && (
                                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                                    {academyStats.pendingEnrollments > 9 ? '9+' : academyStats.pendingEnrollments}
                                </span>
                            )}
                        </button> */}

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
                        {/* Academy Stats Dashboard - Show only on dashboard page */}
                        {pathname === '/pages/dashboard' && activeAcademy && academyStats && (
                            <div className="mb-6">
                                <div className="mb-6">
                                    <h2 className="mb-2 text-xl font-bold text-slate-800">Academy Overview</h2>
                                    <p className="text-slate-600">Manage and monitor your academy performance</p>
                                </div>

                                {loadingStats ? (
                                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="p-6 bg-white border shadow-sm rounded-xl border-slate-200 animate-pulse">
                                                <div className="h-4 mb-2 rounded bg-slate-200"></div>
                                                <div className="h-8 mb-1 rounded bg-slate-200"></div>
                                                <div className="w-1/2 h-3 rounded bg-slate-200"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
                                        <StatCard
                                            icon={Users}
                                            label="Total Students"
                                            value={academyStats.totalStudents}
                                            subtext={`${academyStats.activeStudents} active`}
                                            color="blue"
                                        />
                                        <StatCard
                                            icon={UserCheck}
                                            label="Total Teachers"
                                            value={academyStats.totalTeachers}
                                            subtext="Active instructors"
                                            color="green"
                                        />
                                        <StatCard
                                            icon={BookOpen}
                                            label="Total Courses"
                                            value={academyStats.totalCourses}
                                            subtext="Available courses"
                                            color="purple"
                                        />
                                        <StatCard
                                            icon={Calendar}
                                            label="Total Classes"
                                            value={academyStats.totalClasses}
                                            subtext="Scheduled classes"
                                            color="orange"
                                        />
                                        <StatCard
                                            icon={TrendingUp}
                                            label="Completion Rate"
                                            value={`${academyStats.completionRate}%`}
                                            subtext="Course completion"
                                            color="teal"
                                        />
                                        <StatCard
                                            icon={Bell}
                                            label="Pending Enrollments"
                                            value={academyStats.pendingEnrollments}
                                            subtext="Awaiting approval"
                                            color="red"
                                        />
                                        <StatCard
                                            icon={BarChart}
                                            label="Monthly Revenue"
                                            value={`$${academyStats.monthlyRevenue.toLocaleString()}`}
                                            subtext="This month"
                                            color="green"
                                        />
                                        <StatCard
                                            icon={GraduationCap}
                                            label="Academy Rating"
                                            value="4.8"
                                            subtext="Based on reviews"
                                            color="purple"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {children}
                    </div>
                </section>
            </main>
        </div>
    );
}