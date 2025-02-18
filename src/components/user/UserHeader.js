"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Settings,
  LogOut,
  Heart,
  Home,
  User,
  PartyPopper,
  Play,
  Music,
  Utensils,
  Trophy,
  ChevronDown,
} from "lucide-react";
// import NotificationPanel from "../admin/notification";
import classNames from "classnames";

export default function UserHeader() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("/user");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const navItems = [
    { name: "Home", icon: Home, path: "/user/UserDashboard" },
    { name: "Tribes", icon: User, path: "/tribes" },
    { name: "Festivals", icon: PartyPopper, path: "/festivals" },
    { name: "Video", icon: Play, path: "/videos" },
    { name: "Music", icon: Music, path: "/music" },
    { name: "Food", icon: Utensils, path: "/food" },
    { name: "Sports", icon: Trophy, path: "/sports" },
  ];

  const toggleDarkMode = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
    }
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const handleNavigation = (path) => {
    router.push(path);
    setActiveTab(path);
  };

  return (
    <header className="bg-header mt-[-100px] fixed w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2 sm:gap-6 md:gap-6 xl:gap-6 cursor-pointer"
            onClick={() => handleNavigation("/user")}
          >
            <img
              src="https://indigenous.arunachal.gov.in/assets/images/logo_ap.png"
              alt="DIA Logo"
              className="h-12 w-auto"
            />
            <h1 className="font-semibold text-md sm:text-xl md:text-xl lg:text-xl">
              Department of Indigenous Affairs
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search cultures, festivals..."
                className="w-96 pl-12 pr-4 py-2 border border-[#089ab2] rounded-full bg-[gray-50] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Heart className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors relative"
              >
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-500" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                    U
                  </div>
                  <div className="hidden sm:block pr-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-left">
                      User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Member
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 z-50  mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <button
                      onClick={() => {
                        router.push("/user/profile");
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        router.push("/user/settings");
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                    <div className="absolute top-0 right-4 -mt-2 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 transform rotate-45" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:hidden">
        <div className="relative block group">
          <input
            type="text"
            placeholder="Search cultures, festivals..."
            className="w-full pl-12 pr-4 py-2 border border-[#089ab2] rounded-full bg-[gray-50] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
          <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <nav className="bg-[#f0ffff]/35 dark:bg-[#2d3748]  w-full z-30 border-b border-gray-100 transition-all duration-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 pb-2 items-center">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={classNames(
                  "flex items-center gap-2 rounded-full text-sm font-medium transition-all duration-300",
                  {
                    "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md transform scale-105":
                      activeTab === item.path,
                    "text-[#083644] dark:text-white hover:bg-gray-50 hover:text-teal-600":
                      activeTab !== item.path,
                  },
                  "group relative overflow-hidden",
                  "px-[12px] py-[7px] sm:px-5 sm:py-2.5"
                )}
              >
                <item.icon
                  className={classNames(
                    "transition-transform duration-300 group-hover:scale-110 hidden lg:block lg:h-4 lg:w-4",
                    activeTab === item.path
                      ? "text-white"
                      : "text-gray-500 group-hover:text-teal-600"
                  )}
                />
                <span className="relative z-10">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {showNotifications && (
        <div className="absolute top-16 right-4 z-50">
          <NotificationPanel
            onClose={() => setShowNotifications(false)}
            onViewAll={() => {
              setShowNotifications(false);
              router.push("/notifications");
            }}
          />
        </div>
      )}
    </header>
  );
}