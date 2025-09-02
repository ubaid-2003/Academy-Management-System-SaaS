"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
    Home,
    Users,
    LogOut,
    GraduationCap,
    Info,
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
} from "lucide-react";

// ------------------ TYPES ------------------
type Academy = {
    id: number;   // change here too
    name: string;
    location: string;
};


// ------------------ MAIN COMPONENT ------------------
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [academyDropdownOpen, setAcademyDropdownOpen] = useState(false);
    const [academies, setAcademies] = useState<Academy[]>([]);

    const { user, setUser, logout } = useAuth();
    const active = academies.find((a) => a.id === user?.activeAcademyId) || academies[0];

    const currentAcademy = academies.find(
        (a: Academy) => a.id === user?.activeAcademyId
    ) || null;

    // ------------------ FETCH USER ACADEMIES ------------------
    useEffect(() => {
        const fetchAcademies = async () => {
            if (!user?.token) return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academies/user`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setAcademies(data);
            if (!user.activeAcademyId && data.length > 0) {
                await handleAcademySwitch(data[0]);
            }
        };
        if (user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin") {
            fetchAcademies();
        }
    }, [user]);

    const handleAcademySwitch = async (academy: Academy) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academies/switch/${academy.id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${user?.token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        const newUser = { ...user!, token: data.token, activeAcademyId: data.currentAcademy.id };
        setUser(newUser);
        setAcademyDropdownOpen(false);
    };


    // ------------------ LOGOUT ------------------
    const handleLogout = () => {
        logout();                      // clear user & token
        router.replace("/auth/login"); // use replace instead of push
    };


    // ------------------ NAVIGATION ------------------
    const navigationItems = [
        { label: "Dashboard", href: "/pages/dashboard", icon: Home },
        { label: "Academies", href: "/pages/academy-admin/academies", icon: GraduationCap },
        { label: "Add Academy", href: "/pages/academy-admin/add-academy", icon: GraduationCap },
        { label: "Teachers", href: "/pages/academy-admin/add-teachers", icon: Users },
        { label: "Students", href: "/pages/academy-admin/add-students", icon: Users },
        { label: "Analytics", href: "#", icon: BarChart },
        { label: "About Us", href: "#", icon: Info },
        { label: "Settings", href: "#", icon: Settings },
    ];

    // ------------------ RENDER ------------------
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Academy dropdown overlay */}
            {academyDropdownOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setAcademyDropdownOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${collapsed ? "w-20" : "w-72"
                    } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    } fixed md:relative z-50 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-xl md:shadow-sm`}
            >
                {/* Logo / Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 bg-slate-50/50">
                    {!collapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-800">
                                    SAMS
                                </h1>
                                <p className="text-xs font-medium text-slate-500">
                                    Academy Management
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Collapse button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden p-2 transition-all rounded-lg md:flex text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>

                    {/* Mobile close */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 transition-colors rounded-lg md:hidden text-slate-400 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    router.push(item.href);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group 
                  ${collapsed ? "justify-center" : ""}
                  ${isActive
                                        ? "bg-slate-200 text-slate-900 font-semibold"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                <Icon
                                    className={`flex-shrink-0 w-5 h-5 transition-colors ${isActive ? "text-slate-900" : ""
                                        }`}
                                />
                                {!collapsed && (
                                    <span className="font-medium tracking-tight">{item.label}</span>
                                )}
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
                                <p className="text-sm font-semibold truncate text-slate-800">
                                    {user.fullName ?? "Unknown User"}
                                </p>
                                <p className="text-xs font-medium truncate text-slate-500">
                                    {user.email}
                                </p>
                                <p className="text-xs font-medium text-blue-600">{user.role}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`flex items-center space-x-3 p-3 w-full rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 font-medium ${collapsed ? "justify-center" : ""
                            }`}
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
                    {/* Left: Mobile menu + title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open sidebar menu"
                            className="p-2 transition rounded-lg md:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                                Dashboard
                            </h1>
                            <p className="text-sm font-medium text-slate-600">
                                Welcome back, {user ? user.fullName : "Guest"}
                            </p>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* ================= Switch Academy Dropdown ================= */}
                        <div className="relative">
                            <button
                                onClick={() => setAcademyDropdownOpen(!academyDropdownOpen)}
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium transition border rounded-xl bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-700 text-slate-700"
                            >
                                <Building2 className="w-4 h-4" />
                                <span className="hidden sm:block">
                                    {currentAcademy?.name ?? "Select Academy"}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${academyDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {academyDropdownOpen && (
                                <div className="absolute right-0 z-40 w-64 mt-2 bg-white border shadow-lg rounded-xl border-slate-200">
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-xs font-semibold tracking-wide uppercase text-slate-500">
                                            Switch Academy
                                        </div>

                                        {academies?.map((academy) => (
                                            <button key={academy.id} onClick={() => handleAcademySwitch(academy)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${currentAcademy?.id === academy.id
                                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                    : "hover:bg-slate-50 text-slate-700"
                                                    }`}
                                            >
                                                <div
                                                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${currentAcademy?.id === academy.id
                                                        ? "bg-blue-100"
                                                        : "bg-slate-100"
                                                        }`}
                                                >
                                                    <Building2
                                                        className={`w-4 h-4 ${currentAcademy?.id === academy.id
                                                            ? "text-blue-600"
                                                            : "text-slate-500"
                                                            }`}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <div className="font-semibold truncate">{academy.name}</div>
                                                    <div className="text-xs text-slate-500">
                                                        
                                                        {academy.location}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search (desktop) */}
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 py-2 pl-10 pr-4 text-sm transition border rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                            />
                            <Search className="absolute w-4 h-4 -translate-y-1/2 text-slate-400 left-3 top-1/2" />
                        </div>

                        {/* Search (mobile) */}
                        <button className="p-2 transition rounded-lg sm:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 transition rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Bell className="w-5 h-5" />
                            <span className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1" />
                        </button>

                        {/* User menu (desktop) */}
                        <div className="items-center hidden gap-3 pl-3 border-l md:flex border-slate-200">
                            {user && (
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {user.fullName}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500">
                                            {user.role}
                                        </p>
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
                    <div className="mx-auto max-w-7xl">{children}</div>
                </section>
            </main>
        </div>
    );
}
