"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NotificationPanel from "@/pages/admin/notification";


export default function AdminHeader({ toggleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setIsDarkMode(localStorage.getItem("theme") === "dark");
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // const handleNotification = ()=>{
  //   return(<>
  //   <NotificationPanel 
  //             onClose={() => setShowNotifications(false)}
  //             onViewAll={() => {
  //               setShowNotifications(false);
  //               // navigate('/admin/notifications');
  //             }}
  //           />
  //   </>)
  // }

  if (!mounted) {
    return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, roles, committees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4 ml-4">
            {/* Notifications */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <span className="absolute top-0 right-2 h-2 w-2 bg-red-500 rounded-full">
              {showNotifications && (
          <div className="absolute top-16 right-[-14rem] z-50">
            <NotificationPanel 
              onClose={() => setShowNotifications(false)}
              onViewAll={() => {
                setShowNotifications(false);
                router.push(`/admin/notification`);
              }}
            />
          </div>
        )}
              </span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-500" />
              ) : (
                <Moon className="h-6 w-6 text-gray-500" />
              )}
            </button>

            {/* Admin profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Admin
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}