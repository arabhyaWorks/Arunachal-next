"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Edit, Save } from "lucide-react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@dia.gov.in",
    phone: "+91 9876543210",
    address: "Itanagar, Arunachal Pradesh",
    role: "Super Admin",
    department: "Department of Indigenous Affairs",
    joinDate: "January 2024",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle profile update logic here
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-start gap-6 pt-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-4xl font-bold text-white">
                  A
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Camera className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formData.firstName} {formData.lastName}
                </h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  {formData.role}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6">
                <Mail className="h-4 w-4" />
                <span>{formData.email}</span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>
            </form>
          </div>

          {/* Work Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Work Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Join Date
                </label>
                <input
                  type="text"
                  value={formData.joinDate}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}