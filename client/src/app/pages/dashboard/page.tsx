'use client';

import DashboardLayout from "../../components/DashboardLayout";
import { useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    academies: 12,
    users: 58,
    activeAcademies: 10,
    inactiveAcademies: 2
  });

  // Mock data for analytics
  const quickActions = [
    { name: 'Create Course', icon: '📚', description: 'Add a new course to curriculum' },
    { name: 'Generate Report', icon: '📊', description: 'Create performance reports' },
    { name: 'Send Announcement', icon: '📢', description: 'Notify all users' },
    { name: 'Manage Roles', icon: '👥', description: 'Update user permissions' }
  ];

  const recentActivities = [
    { action: 'New student registered', user: 'Sarah Johnson', time: '10 mins ago' },
    { action: 'Course completed', user: 'Michael Chen', time: '1 hour ago' },
    { action: 'Academy created', user: 'Admin User', time: '2 hours ago' },
    { action: 'Payment received', user: 'Robert Williams', time: '5 hours ago' },
    { action: 'Teacher assigned', user: 'Admin User', time: 'Yesterday' }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 space-y-8 bg-gray-50">
        {/* Header Section */}
        <div className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Smart Academy</h1>
            <p className="text-gray-500">Comprehensive Academy Management System Dashboard</p>
          </div>
          <div className="flex mt-4 space-x-3 md:mt-0">
            <button className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 shadow-sm">
              Add Academy
            </button>
            <button className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition duration-200 shadow-sm">
              Add Student/Teacher
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-5 transition duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">Total Academies</h2>
                <p className="mt-1 text-2xl font-semibold text-gray-800">{stats.academies}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <span className="text-xl text-blue-600">🏫</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Across all locations</p>
          </div>

          <div className="p-5 transition duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">Total Users</h2>
                <p className="mt-1 text-2xl font-semibold text-gray-800">{stats.users}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <span className="text-xl text-green-600">👥</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Students and staff</p>
          </div>

          <div className="p-5 transition duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">Active Academies</h2>
                <p className="mt-1 text-2xl font-semibold text-gray-800">{stats.activeAcademies}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <span className="text-xl text-purple-600">✅</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Currently operational</p>
          </div>

          <div className="p-5 transition duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">Inactive Academies</h2>
                <p className="mt-1 text-2xl font-semibold text-gray-800">{stats.inactiveAcademies}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-md">
                <span className="text-xl text-red-600">⏸️</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Requiring attention</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-1">
            <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <div key={index} className="flex items-center p-3 transition duration-200 border border-gray-100 rounded-md cursor-pointer bg-gray-50 hover:bg-blue-50">
                  <span className="mr-3 text-2xl">{action.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-800">{action.name}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-1">
            <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">{activity.action}</h3>
                    <p className="text-sm text-gray-600">By {activity.user}</p>
                    <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-1">
            <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200">Performance Metrics</h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Student Enrollment</span>
                  <span className="text-sm font-medium text-gray-700">78%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Course Completion</span>
                  <span className="text-sm font-medium text-gray-700">92%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Resource Utilization</span>
                  <span className="text-sm font-medium text-gray-700">65%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <div className="pt-3">
                <div className="flex items-center justify-between p-3 border border-blue-100 rounded-md bg-blue-50">
                  <span className="text-sm font-medium text-gray-700">Overall Performance</span>
                  <span className="inline-flex items-center text-sm font-bold text-green-600">
                    +12.5%
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200">Academy Distribution</h2>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto border-8 border-blue-500 rounded-full border-t-gray-200 border-r-gray-200 animate-spin"></div>
                <p className="mt-3 text-sm text-gray-500">Visualization of academy types</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200">User Engagement</h2>
            <div className="flex items-center justify-center h-40">
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Active Users</span>
                  <span className="text-sm font-medium text-gray-700">72%</span>
                </div>
                <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{width: '72%'}}></div>
                </div>
                
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">New Users</span>
                  <span className="text-sm font-medium text-gray-700">28%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{width: '28%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}