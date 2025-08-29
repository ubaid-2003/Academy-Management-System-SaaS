"use client";

import { useState } from "react";
import { useRouter, usePathname} from "next/navigation";

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
import { useAuth } from "../context/AuthContext";

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

// Mock data for academies - replace with actual data from your context/API
const mockAcademies = [
    { id: 1, name: "Sunrise Academy", location: "Downtown" },
    { id: 2, name: "Greenfield School", location: "Suburbs" },
    { id: 3, name: "Oakwood Institute", location: "City Center" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [academyDropdownOpen, setAcademyDropdownOpen] = useState(false);
    const [currentAcademy, setCurrentAcademy] = useState(mockAcademies[0]);
    const { user, setUser } = useAuth();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem("user");
            setUser(null);
            router.push("/auth/login");
        }
    };

    const handleAcademySwitch = (academy: typeof mockAcademies[0]) => {
        setCurrentAcademy(academy);
        setAcademyDropdownOpen(false);
        // Add your academy switching logic here
        // For example: updateCurrentAcademy(academy);
    };

    const navigationItems = [
        { label: "Dashboard", href: "/pages/dashboard", icon: Home },
        { label: "Academies", href: "/pages/academy-admin/academies", icon: GraduationCap },
        { label: "Add Academy", href: "/pages/academy-admin/add-academy", icon: GraduationCap },
        { label: "Teachers", href: "#", icon: Users },
        { label: "Students", href: "#", icon: Users },
        { label: "Analytics", href: "#", icon: BarChart },
        { label: "About Us", href: "#", icon: Info },
        { label: "Settings", href: "#", icon: Settings },
    ];

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

                    {/* Desktop collapse button */}
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

                    {/* Mobile close button */}
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
                        const pathname = usePathname(); // ✅ Get current route

                        const isActive = pathname === item.href; // ✅ Check if this menu is active

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
                                        ? "bg-slate-200 text-slate-900 font-semibold" // ✅ Active style
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
                                {collapsed && (
                                    <span className="absolute z-50 px-3 py-2 ml-2 text-sm font-medium text-white transition-opacity rounded-lg opacity-0 left-20 bg-slate-800 group-hover:opacity-100 whitespace-nowrap">
                                        {item.label}
                                    </span>
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
                                    {user.name || "Unknown User"}
                                </p>
                                <p className="text-xs font-medium truncate text-slate-500">
                                    {user.email}
                                </p>
                                <p className="text-xs font-medium text-blue-600">
                                    {user.role}
                                </p>
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
                    <div className="flex items-center space-x-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 transition-colors rounded-lg md:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                                Dashboard
                            </h1>
                            <p className="text-sm font-medium text-slate-600">
                                Welcome back, {user ? `${user.name}` : "Guest"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Switch Academy Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setAcademyDropdownOpen(!academyDropdownOpen)}
                                className="flex items-center px-4 py-2 space-x-3 text-sm font-medium transition-all border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-500 hover:text-blue-700 text-slate-700"
                            >
                                <Building2 className="w-4 h-4" />
                                <div className="hidden text-left sm:block">
                                    <div className="font-semibold">{currentAcademy.name}</div>
                                    <div className="text-xs text-slate-500">{currentAcademy.location}</div>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${academyDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Academy Dropdown Menu */}
                            {academyDropdownOpen && (
                                <div className="absolute right-0 z-40 w-64 mt-2 bg-white border shadow-lg border-slate-200 rounded-xl">
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-xs font-semibold tracking-wide uppercase text-slate-500">
                                            Switch Academy
                                        </div>
                                        {mockAcademies.map((academy) => (
                                            <button
                                                key={academy.id}
                                                onClick={() => handleAcademySwitch(academy)}
                                                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                                                    currentAcademy.id === academy.id 
                                                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                                                        : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                            >
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                                                    currentAcademy.id === academy.id 
                                                        ? "bg-blue-100" 
                                                        : "bg-slate-100"
                                                }`}>
                                                    <Building2 className={`w-4 h-4 ${
                                                        currentAcademy.id === academy.id 
                                                            ? "text-blue-600" 
                                                            : "text-slate-500"
                                                    }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold truncate">{academy.name}</div>
                                                    <div className="text-xs text-slate-500">{academy.location}</div>
                                                </div>
                                                {currentAcademy.id === academy.id && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 py-2 pl-10 pr-4 text-sm transition-all border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                            />
                            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                        </div>

                        {/* Mobile search button */}
                        <button className="p-2 transition-colors rounded-lg sm:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 transition-colors rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                            <Bell className="w-5 h-5" />
                            <span className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1"></span>
                        </button>

                        {/* User menu - desktop only */}
                        <div className="items-center hidden pl-3 space-x-3 border-l md:flex border-slate-200">
                            {user && (
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {user.name}
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
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </section>
            </main>
        </div>
    );
}