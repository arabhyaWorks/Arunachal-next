"use client"; // Ensures client-side rendering (important if using Next.js 13 App Router)

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

// Example mock data (plain JS, no TypeScript interface)
const mockNotifications = [
  {
    id: "1",
    type: "signup",
    title: "New User",
    message: "John Doe has signed up",
    time: "3 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "approval",
    title: "Content Approved",
    message: "Adi Tribe Music approved by CBO Manager 1",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "pending",
    title: "Pending Approval",
    message: "Adi tribe video pending for approval",
    time: "15 mins ago",
    read: true,
  },
  {
    id: "4",
    type: "expiring",
    title: "Expiring Soon",
    message: "Only 2 days left for Adi tribe dance approval",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "5",
    type: "like",
    title: "New Like",
    message: "Sarah liked Adi tribe Video",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "comment",
    title: "New Comment",
    message: "Mike commented on Adi tribe video",
    time: "3 hours ago",
    read: true,
  },
];

// Props remain the same, but now in plain JS
export default function NotificationPanel({ onClose, onViewAll }) {
  const [notifications] = useState(mockNotifications);

  const getIcon = (type) => {
    switch (type) {
      case "signup":
        return Bell;
      case "approval":
        return CheckCircle;
      case "pending":
      case "expiring":
        return AlertTriangle;
      case "like":
        return Heart;
      case "comment":
        return MessageSquare;
      default:
        return Clock;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "signup":
        return "text-blue-500";
      case "approval":
        return "text-green-500";
      case "pending":
      case "expiring":
        return "text-amber-500";
      case "like":
        return "text-red-500";
      case "comment":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "signup":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "approval":
        return "bg-green-50 dark:bg-green-900/20";
      case "pending":
      case "expiring":
        return "bg-amber-50 dark:bg-amber-900/20";
      case "like":
        return "bg-red-50 dark:bg-red-900/20";
      case "comment":
        return "bg-purple-50 dark:bg-purple-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto text-left">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);

            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${getBgColor(notification.type)}`}>
                    <Icon className={`h-5 w-5 ${getIconColor(notification.type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewAll}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all text-sm font-medium"
          >
            View All Notifications
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}