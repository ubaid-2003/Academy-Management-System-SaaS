"use client";

import { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  Shield,
  Layers,
  ClipboardList,
  ChartBar,
  Settings,
  Database,
  FileText,
} from "lucide-react";

const features = [
  { icon: <Users size={28} />, title: "Student, Teacher & Class Management", description: "Comprehensive management of all academy members and classes" },
  { icon: <BookOpen size={28} />, title: "Course Creation & Assignment", description: "Easily create courses and assign them to students" },
  { icon: <ClipboardList size={28} />, title: "Daily Attendance", description: "Track attendance for both students and teachers" },
  { icon: <Calendar size={28} />, title: "Timetable Scheduling", description: "Intuitive scheduling for classes and events" },
  { icon: <DollarSign size={28} />, title: "Fee Management", description: "Integrated payment system with Stripe support" },
  { icon: <Shield size={28} />, title: "Subscription Plans", description: "Flexible subscription options for your academy" },
  { icon: <GraduationCap size={28} />, title: "Role-Based Dashboard", description: "Custom dashboards for different user roles" },
  { icon: <Layers size={28} />, title: "Multi-Tenant Support", description: "Support for multiple institutions on one platform" },
  { icon: <Database size={28} />, title: "Workbench & DB Tools", description: "Powerful database tools for administrators" },
  { icon: <FileText size={28} />, title: "Dynamic Filters", description: "Advanced filtering and pagination for all data" },
  { icon: <ChartBar size={28} />, title: "Real-time Metrics", description: "Live analytics on platform usage" },
  { icon: <Settings size={28} />, title: "Admin Tools", description: "Complete configuration and management tools" },
];

export default function FeaturesSection() {
  const [showAll, setShowAll] = useState(false);

  const visibleFeatures = showAll ? features : features.slice(0, 6);

  return (
    <section id="features" className="w-full py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Powerful Features for Your Academy
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            AcademyHub provides all the tools you need to manage your educational institution efficiently
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {visibleFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 mr-4 text-blue-600 rounded-lg bg-blue-50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {showAll ? "Show Less Features" : "Show All Features"}
          </button>
        </div>
      </div>
    </section>
  );
}