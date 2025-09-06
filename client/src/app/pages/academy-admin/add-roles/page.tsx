"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  UserCog,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  GraduationCap,
  Users,
  UserCheck
} from "lucide-react";

// Permission constants
const PERMISSIONS = {
  // Academy Permissions
  CREATE_ACADEMY: "create_academy",
  UPDATE_ACADEMY: "update_academy",
  DELETE_ACADEMY: "delete_academy",
  VIEW_ACADEMY: "view_academy",
  SWITCH_ACADEMY: "switch_academy",

  // Student Permissions
  CREATE_STUDENT: "create_student",
  UPDATE_STUDENT: "update_student",
  DELETE_STUDENT: "delete_student",
  VIEW_STUDENT: "view_student",

  // Teacher Permissions
  CREATE_TEACHER: "create_teacher",
  UPDATE_TEACHER: "update_teacher",
  DELETE_TEACHER: "delete_teacher",
  VIEW_TEACHER: "view_teacher",
};

// Group permissions by category
const PERMISSION_GROUPS = [
  {
    title: "Academy Permissions",
    icon: GraduationCap,
    permissions: [
      { key: "CREATE_ACADEMY", label: "Create Academy" },
      { key: "UPDATE_ACADEMY", label: "Update Academy" },
      { key: "DELETE_ACADEMY", label: "Delete Academy" },
      { key: "VIEW_ACADEMY", label: "View Academy" },
      { key: "SWITCH_ACADEMY", label: "Switch Academy" }
    ]
  },
  {
    title: "Student Permissions",
    icon: Users,
    permissions: [
      { key: "CREATE_STUDENT", label: "Create Student" },
      { key: "UPDATE_STUDENT", label: "Update Student" },
      { key: "DELETE_STUDENT", label: "Delete Student" },
      { key: "VIEW_STUDENT", label: "View Student" }
    ]
  },
  {
    title: "Teacher Permissions",
    icon: UserCheck,
    permissions: [
      { key: "CREATE_TEACHER", label: "Create Teacher" },
      { key: "UPDATE_TEACHER", label: "Update Teacher" },
      { key: "DELETE_TEACHER", label: "Delete Teacher" },
      { key: "VIEW_TEACHER", label: "View Teacher" }
    ]
  }
];

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

export default function AddRolePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: []
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Academy Permissions": true,
    "Student Permissions": true,
    "Teacher Permissions": true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!user) return;
    if (user.role !== "Admin" && user.role !== "SuperAdmin") {
      router.push("/pages/dashboard");
    }
  }, [user, router]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  // Toggle permission group expansion
  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permissionKey: string) => {
    setFormData(prev => {
      const permissionValue = PERMISSIONS[permissionKey as keyof typeof PERMISSIONS];
      if (prev.permissions.includes(permissionValue)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permissionValue)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionValue]
        };
      }
    });
  };

  // Select all permissions in a group
  const selectAllInGroup = (group: typeof PERMISSION_GROUPS[0]) => {
    setFormData(prev => {
      const groupPermissions = group.permissions.map(
        p => PERMISSIONS[p.key as keyof typeof PERMISSIONS]
      );
      const newPermissions = [...prev.permissions];
      
      groupPermissions.forEach(permission => {
        if (!newPermissions.includes(permission)) {
          newPermissions.push(permission);
        }
      });
      
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

  // Deselect all permissions in a group
  const deselectAllInGroup = (group: typeof PERMISSION_GROUPS[0]) => {
    setFormData(prev => {
      const groupPermissions = group.permissions.map(
        p => PERMISSIONS[p.key as keyof typeof PERMISSIONS]
      );
      const newPermissions = prev.permissions.filter(
        p => !groupPermissions.includes(p)
      );
      
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

  // Validate payload
  const validatePayload = (payload: RoleFormData) => {
    if (!payload.name.trim()) throw new Error("Role name is required");
    if (!payload.description.trim()) throw new Error("Role description is required");
    if (payload.permissions.length === 0) throw new Error("At least one permission is required");
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      if (!user?.token) throw new Error("You must be logged in to create a role");

      const payload: RoleFormData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        permissions: formData.permissions
      };

      validatePayload(payload);

      const res = await fetch(`http://localhost:5000/api/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create role");
      }

      const data = await res.json();
      console.log("Role created:", data);
      
      // Show success notification
      setSuccess(true);
      setShowNotification(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/pages/role-management");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Access denied page
  if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="max-w-md p-8 text-center border border-red-200 bg-red-50 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-red-800">Access Denied</h3>
            <p className="text-red-600">You are not authorized to access this page.</p>
            <button
              onClick={() => router.push("/pages/dashboard")}
              className="inline-flex items-center px-4 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed z-50 top-4 right-4 animate-fade-in-down">
          <div className="flex items-center p-4 mb-4 text-white bg-green-600 rounded-lg shadow-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Role created successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl p-6 mx-auto mt-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-full">
            <UserCog className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="ml-3 text-2xl font-bold text-gray-800">Create New Role</h2>
        </div>

        {error && (
          <div className="flex items-center p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Role Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter role name"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Role Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role's purpose and responsibilities"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Permissions Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Permissions</h3>
            <p className="mb-4 text-sm text-gray-600">
              Select the permissions this role should have. You can expand each category to see specific permissions.
            </p>

            <div className="space-y-4">
              {PERMISSION_GROUPS.map((group) => {
                const GroupIcon = group.icon;
                const isExpanded = expandedGroups[group.title];
                
                return (
                  <div key={group.title} className="border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full p-4 rounded-t-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <GroupIcon className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="font-medium text-gray-800">{group.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4">
                        <div className="flex justify-end mb-2 space-x-2">
                          <button
                            type="button"
                            onClick={() => selectAllInGroup(group)}
                            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={() => deselectAllInGroup(group)}
                            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                          >
                            Deselect All
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {group.permissions.map((permission) => {
                            const permissionValue = PERMISSIONS[permission.key as keyof typeof PERMISSIONS];
                            const isChecked = formData.permissions.includes(permissionValue);
                            
                            return (
                              <label key={permission.key} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handlePermissionChange(permission.key)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{permission.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Creating Role..." : "Create Role"}
            </button>
          </div>
        </form>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
}