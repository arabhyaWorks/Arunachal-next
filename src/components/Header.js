"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sun,
  Moon,
  User,
  Home,
  PartyPopper,
  Play,
  Music,
  Utensils,
  Trophy,
} from "lucide-react";
import classNames from "classnames";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Tribes", icon: User, path: "/tribes" },
  { name: "Festivals", icon: PartyPopper, path: "/festivals" },
  { name: "Video", icon: Play, path: "/videos" },
  { name: "Music", icon: Music, path: "/music" },
  { name: "Food", icon: Utensils, path: "/food" },
  { name: "Sports", icon: Trophy, path: "/sports" },
];

export default function Header() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const [activeTab, setActiveTab] = useState("/");

  const handleNavigation = (path) => {
    router.push(path);
    setActiveTab(path);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header
    style={{
      zIndex: 11,
    }}
     className="bg-header mt-[-100px] fixed w-full ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 sm:gap-6 md:gap-6 xl:gap-6">
            <div
              className="cursor-pointer"
              onClick={() => router.push("/")}
            >
              <img
                src="https://indigenous.arunachal.gov.in/assets/images/logo_ap.png"
                alt="DIA Logo"
                className="h-12 w-auto"
              />
            </div>
            <h1
              className={classNames(
                "font-semibold",
                "text-md sm:text-xl md:text-xl lg:text-xl"
              )}
            >
              Department of Indigenous Affairs
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <input
                type="text"
                placeholder="Search cultures, festivals..."
                className="w-96 pl-12 pr-4 py-2 border border-[#089ab2] rounded-full bg-[gray-50] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full hover:from-blue-700 hover:to-teal-600 transition-all shadow-sm hover:shadow"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Login</span>
            </button>
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
          <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
        </div>
      </div>

      <nav
        className={classNames(
          "bg-[#f0ffff]/35 dark:bg-[#2d3748] backdrop-blur-sm w-full z-60 border border-b border-gray-100 transition-all duration-300",
          "shadow-lg"
        )}
      >
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
                  "px-[12px] py-[7px] sm:px-5 sm:py-2.5 md:px-5 md:py-2.5 lg:px-5 lg:py-2.5 xl:px-5 xl:py-2.5 2xl:px-5 2xl:py-2.5"
                )}
              >
                <item.icon
                  className={classNames(
                    "transition-transform duration-300 group-hover:scale-110",
                    {
                      "text-white": activeTab === item.path,
                      "text-gray-500 group-hover:text-teal-600":
                        activeTab !== item.path,
                    },
                    "hidden lg:block lg:h-4 lg:w-4 sm:w-0 sm:h-0 md:w-0 md:h-0"
                  )}
                />
                <span className="relative z-10">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}