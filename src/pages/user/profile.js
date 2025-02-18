"use client"; // Ensures client-side rendering in Next.js 13+ (App Router). Harmless in Next.js ≤12.

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Mail,
  Lock,
  Trash2,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function UserProfile() {
  // Example states to make component functional (since snippet references them)
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  // Example form data
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  });

  // Example stats array
  const stats = [
    // Each item must have .icon, .label, .value
    {
      label: "Example Stat",
      value: "123",
      icon: Camera, // or any other Lucide icon
    },
  ];

  // Example recent activity
  const recentActivity = [
    {
      description: "Watched a documentary",
      time: "2 hours ago",
      icon: Mail,
    },
  ];

  // Example action methods
  const handleDeleteAccount = () => {
    if (!deleteReason.trim()) return;
    // Implement account deletion logic. Possibly route somewhere with router.push
    console.log("Account deleted. Reason:", deleteReason);
  };

  // Return your UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8 backdrop-blur-lg bg-opacity-95"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-36 h-36 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 p-1 shadow-lg"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-4xl font-bold text-blue-600">
                  {formData.firstName[0]}
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-0 right-0 p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Camera className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                  {formData.firstName} {formData.lastName}
                </h2>
                <span className="px-4 py-1.5 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-violet-600 dark:text-violet-400 rounded-full text-sm font-medium border border-violet-200 dark:border-violet-800">
                  Member
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-8">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{formData.email}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  {/* Example toggled icon/text */}
                  {isEditing ? (
                    <>
                      {/* Suppose there's a Save icon... */}
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      {/* Suppose there's an Edit icon... */}
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {/* show password change modal */ setShowChangePassword(true)}}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                >
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-all hover:scale-105 border border-red-200 dark:border-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example stats array, if you had them */}
            {[{ label: "Some Stat", value: "123" }].map((stat, i) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-95"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 shadow-lg">
                    {/* You might have a stat.icon here */}
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                      {stat.value}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-95"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {/* Example static array */}
              {[{ description: "Watched a documentary", time: "2 hours ago" }].map(
                (activity, index) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <form>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-500 outline-none transition-colors"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-500 outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Deletion (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 dark:focus:border-red-500 outline-none transition-colors resize-none"
                  placeholder="Your feedback helps us improve"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  // handle the actual delete logic
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}