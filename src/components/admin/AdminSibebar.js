"use client";

import { useState } from "react";
import { useRouter } from "next/router"; // For Next.js 13 app directory, use: import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Database,
  Users2,
  UserCircle,
  Settings,
  Eye,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import classNames from "classnames";

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users & Roles", path: "/admin/users" },
    { icon: FileText, label: "Content", path: "/admin/content" },
    { icon: Database, label: "Manage Master Data", path: "/admin/master-data" },
    { icon: Users2, label: "Committees", path: "/admin/committees" },
    { icon: UserCircle, label: "Profile", path: "/admin/profile" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    router.push("/login");
  };

  const handleViewAsMember = () => {
    router.push("/"); // Navigate to member view
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-900 dark:text-white" />
        ) : (
          <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={classNames(
          "fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-40 transition-all duration-300",
          {
            "w-64": isOpen,
            "w-20": !isOpen,
            "translate-x-0": isMobileMenuOpen,
            "-translate-x-full": !isMobileMenuOpen,
            "lg:translate-x-0": true,
          }
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700">
          <img
            src="https://indigenous.arunachal.gov.in/assets/images/logo_ap.png"
            alt="Logo"
            className="h-10 w-10"
          />
          {isOpen && (
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Admin
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Dashboard
              </span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          className="hidden lg:block absolute -right-3 top-20 p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronRight
            className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                router.push(item.path);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <item.icon
                className={`h-5 w-5 text-blue-600 dark:text-blue-400 ${
                  !isOpen && "mx-auto"
                }`}
              />
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}

          {/* View as Member Button */}
          <button
            onClick={handleViewAsMember}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
          >
            <Eye className={`h-5 w-5 ${!isOpen && "mx-auto"}`} />
            {isOpen && <span>View as Member</span>}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors mt-8"
          >
            <LogOut className={`h-5 w-5 ${!isOpen && "mx-auto"}`} />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>
    </>
  );
}