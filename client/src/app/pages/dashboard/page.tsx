"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import { useAcademy } from "../../context/AcademyContext";
import { useAuth } from "../../context/AuthContext";

import { BookOpen, BarChart3, Megaphone, UserCog, GraduationCap, Clock, Users, Building2, TrendingUp, UserCheck, CheckCircle, ArrowUpRight, Calendar } from 'lucide-react';

type Academy = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
};

type Stats = {
  academies: number;
  users: number;
  activeAcademies: number;
  inactiveAcademies: number;
  totalTeachers: number;
  totalStudents: number;
};

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { academies, currentAcademy } = useAcademy();

  const [stats, setStats] = useState<Stats>({
    academies: 0,
    users: 0,
    activeAcademies: 0,
    inactiveAcademies: 0,
    totalTeachers: 0,
    totalStudents: 0,
  });

    useEffect(() => {
      const fetchStats = async () => {
        try {
          if (!user?.token) return;

          // 1️⃣ Fetch all academies for the logged-in user
          const resAcademies = await fetch(`http://localhost:5000/api/academies/user`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (!resAcademies.ok) throw new Error(await resAcademies.text());
          const academies: Academy[] = await resAcademies.json();

          const active = academies.filter(a => a.status === "Active").length;
          const inactive = academies.filter(a => a.status === "Inactive").length;

          // 2️⃣ Fetch teachers and students from currentAcademy
          let totalTeachers = 0;
          let totalStudents = 0;

          if (currentAcademy?.id) {
            const [resTeachers, resStudents] = await Promise.all([
              fetch(`http://localhost:5000/api/academies/${currentAcademy.id}/teachers`, {
                headers: { Authorization: `Bearer ${user.token}` },
              }),
              fetch(`http://localhost:5000/api/academies/${currentAcademy.id}/students`, {
                headers: { Authorization: `Bearer ${user.token}` },
              }),
            ]);

            if (resTeachers.ok) totalTeachers = (await resTeachers.json()).length;
            if (resStudents.ok) totalStudents = (await resStudents.json()).length;
          }

          setStats({
            academies: academies.length,
            users: 1, // current logged-in user
            activeAcademies: active,
            inactiveAcademies: inactive,
            totalTeachers,
            totalStudents,
          });
        } catch (err) {
          console.error("Error fetching stats:", err);
        }
      };

      fetchStats();
    }, [user?.token, currentAcademy]);

    // Enhanced quick actions with proper icons
    const quickActions = [
      { name: 'Create Course', icon: BookOpen, description: 'Add a new course to curriculum', color: 'bg-blue-500' },
      { name: 'Generate Report', icon: BarChart3, description: 'Create performance reports', color: 'bg-green-500' },
      { name: 'Send Announcement', icon: Megaphone, description: 'Notify all users', color: 'bg-purple-500' },
      { name: 'Manage Roles', icon: UserCog, description: 'Update user permissions', color: 'bg-orange-500' }
    ];

    const recentActivities = [
      { action: 'New student registered', user: 'Sarah Johnson', time: '10 mins ago', type: 'success' },
      { action: 'Course completed', user: 'Michael Chen', time: '1 hour ago', type: 'info' },
      { action: 'Academy created', user: 'Admin User', time: '2 hours ago', type: 'success' },
      { action: 'Payment received', user: 'Robert Williams', time: '5 hours ago', type: 'success' },
      { action: 'Teacher assigned', user: 'Admin User', time: 'Yesterday', type: 'info' }
    ];

    const getActivityColor = (type: string) => {
      switch (type) {
        case 'success': return 'bg-green-500';
        case 'info': return 'bg-blue-500';
        case 'warning': return 'bg-yellow-500';
        default: return 'bg-gray-500';
      }
    };

    return (
      <DashboardLayout>
        <div className="min-h-screen space-y-8">
          {/* Enhanced Header Section */}
          <div className="relative overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
            <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
            <div className="relative flex flex-col justify-between p-8 md:flex-row md:items-center">
              <div>
                <div className="flex items-center mb-3 space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
                    <GraduationCap className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">Smart Academy</h1>
                    <div className="flex items-center mt-1 space-x-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <p className="font-medium text-slate-600">Dashboard Overview</p>
                    </div>
                  </div>
                </div>
                <p className="max-w-lg leading-relaxed text-slate-600">
                  Comprehensive Academy Management System providing real-time insights and seamless administration
                </p>
              </div>
              <div className="flex mt-6 space-x-3 md:mt-0">
                <button
                  onClick={() => router.push("/pages/academy-admin/add-academy")}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Add Academy
                </button>
                <button className="flex items-center px-6 py-3 font-semibold transition-all duration-200 border-2 shadow-sm border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300">
                  <Users className="w-5 h-5 mr-2" />
                  Add User
                </button>
              </div>
            </div>
          </div>


          {/* Enhanced Stats Cards for Academy Management */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Academies Card */}
            <div className="relative overflow-hidden transition-all duration-300 transform bg-white border shadow-sm group border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-blue-100 rounded-xl group-hover:bg-blue-200">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12%
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 text-sm font-semibold tracking-wide uppercase text-slate-500">Total Academies</h2>
                  <p className="mb-2 text-3xl font-bold text-slate-800">{stats.academies}</p>
                  <p className="text-sm text-slate-600">Across all locations</p>
                </div>
              </div>
            </div>

            {/* Total Students Card */}
            <div className="relative overflow-hidden transition-all duration-300 transform bg-white border shadow-sm group border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-green-100 rounded-xl group-hover:bg-green-200">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8%
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 text-sm font-semibold tracking-wide uppercase text-slate-500">Total Students</h2>
                  <p className="mb-2 text-3xl font-bold text-slate-800">{stats.totalStudents}</p>
                  <p className="text-sm text-slate-600">Enrolled across all academies</p>
                </div>
              </div>
            </div>

            {/* Total Teachers Card */}
            <div className="relative overflow-hidden transition-all duration-300 transform bg-white border shadow-sm group border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-purple-100 rounded-xl group-hover:bg-purple-200">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5%
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 text-sm font-semibold tracking-wide uppercase text-slate-500">Total Teachers</h2>
                  <p className="mb-2 text-3xl font-bold text-slate-800">{stats.totalTeachers}</p>
                  <p className="text-sm text-slate-600">Teaching staff members</p>
                </div>
              </div>
            </div>

            {/* Active Academies Card */}
            <div className="relative overflow-hidden transition-all duration-300 transform bg-white border shadow-sm group border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 transition-colors rounded-xl bg-emerald-100 group-hover:bg-emerald-200">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +3%
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 text-sm font-semibold tracking-wide uppercase text-slate-500">Active Academies</h2>
                  <p className="mb-2 text-3xl font-bold text-slate-800">{stats.activeAcademies}</p>
                  <p className="text-sm text-slate-600">Currently operational</p>
                </div>
              </div>
            </div>
          </div>


          {/* Enhanced Analytics Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Enhanced Quick Actions */}
            <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="mb-1 text-xl font-bold text-slate-800">Quick Actions</h2>
                <p className="text-sm text-slate-600">Streamline your workflow</p>
              </div>
              <div className="p-6 space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div key={index} className="flex items-center p-4 transition-all duration-200 border cursor-pointer group border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-md bg-slate-50/50 hover:bg-white">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 ml-4">
                        <h3 className="font-semibold text-slate-800 group-hover:text-slate-900">{action.name}</h3>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 transition-colors text-slate-400 group-hover:text-slate-600" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Recent Activity */}
            <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="mb-1 text-xl font-bold text-slate-800">Recent Activity</h2>
                <p className="text-sm text-slate-600">Latest system updates</p>
              </div>
              <div className="p-6 space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.type)} group-hover:scale-125 transition-transform`}></div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="font-semibold transition-colors text-slate-800 group-hover:text-slate-900">{activity.action}</h3>
                      <p className="mb-1 text-sm text-slate-600">By {activity.user}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Performance Metrics */}
            <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="mb-1 text-xl font-bold text-slate-800">Performance Metrics</h2>
                <p className="text-sm text-slate-600">System performance overview</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Student Enrollment</span>
                    <span className="text-sm font-bold text-slate-800">78%</span>
                  </div>
                  <div className="w-full h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Course Completion</span>
                    <span className="text-sm font-bold text-slate-800">92%</span>
                  </div>
                  <div className="w-full h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Resource Utilization</span>
                    <span className="text-sm font-bold text-slate-800">65%</span>
                  </div>
                  <div className="w-full h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between p-4 border border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      <span className="text-sm font-semibold text-slate-700">Overall Performance</span>
                    </div>
                    <span className="inline-flex items-center text-lg font-bold text-green-600">
                      +12.5%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Additional Stats Section */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="mb-1 text-xl font-bold text-slate-800">Academy Distribution</h2>
                <p className="text-sm text-slate-600">Geographic spread analysis</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-32 h-32 mx-auto border-8 rounded-full border-slate-200"></div>
                      <div className="absolute inset-0 w-32 h-32 mx-auto border-8 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-600">Interactive visualization coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="mb-1 text-xl font-bold text-slate-800">User Engagement</h2>
                <p className="text-sm text-slate-600">Activity and retention metrics</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Active Users</span>
                      <span className="text-sm font-bold text-slate-800">72%</span>
                    </div>
                    <div className="w-full h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">New Users</span>
                      <span className="text-sm font-bold text-slate-800">28%</span>
                    </div>
                    <div className="w-full h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 text-center rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">2.4k</div>
                        <div className="text-xs font-medium text-slate-600">Daily Active</div>
                      </div>
                      <div className="p-3 text-center rounded-lg bg-green-50">
                        <div className="text-2xl font-bold text-green-600">89%</div>
                        <div className="text-xs font-medium text-slate-600">Retention Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
}


export default DashboardPage;