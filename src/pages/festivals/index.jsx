"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, Calendar, PartyPopper, ArrowRight, Users, Clock, MapPin, ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import UserHeader from "@/components/user/UserHeader";

export default function FestivalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedTribe, setSelectedTribe] = useState("All Tribes");
  const [viewMode, setViewMode] = useState("grid");
  const [festivals, setFestivals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check user role from localStorage or other auth state
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(["Director", "Deputy Director", "Assistant Director", "CBO Member", "CMS Manager"].includes(userRole));
  }, []);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const response = await fetch("/api/category/items?category_id=1");
        const data = await response.json();
        if (data?.data) {
          const transformedFestivals = data.data.map((festival) => {
            const attributes = festival.attributes || [];

            return {
              id: festival.id,
              name: festival.name,
              description: festival.description,
              tribe: attributes.find(attr => attr.name === "cat-Festivals-Tribe")?.value?.value?.[0]?.name || "Unknown Tribe",
              date: attributes.find(attr => attr.name === "cat-Festivals-DateOfCelebration")?.value?.value || "Date not available",
              duration: attributes.find(attr => attr.name === "cat-Festivals-Duration")?.value?.value || "Duration not available",
              image: attributes.find(attr => attr.name === "cat-Festivals-ImagesOfTheFestivals")?.value?.value || null,
              district: attributes.find(attr => attr.name === "cat-Festivals-District")?.value?.value || "Unknown Location"
            };
          });

          setFestivals(transformedFestivals);
        }
      } catch (error) {
        console.error("Error fetching festivals:", error);
      }
    }
    fetchFestivals();
  }, []);

  // Extract unique months and tribes
  const months = ["All Months", ...new Set(festivals.map(festival => festival.date))];
  const tribes = ["All Tribes", ...new Set(festivals.map(festival => festival.tribe))];

  // Filter festivals
  const filteredFestivals = festivals.filter((festival) => {
    const matchesSearch = festival.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = selectedMonth === "All Months" || festival.date === selectedMonth;
    const matchesTribe = selectedTribe === "All Tribes" || festival.tribe === selectedTribe;
    return matchesSearch && matchesMonth && matchesTribe;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Header /> */}
      {isAdmin ? <Header /> : <UserHeader />}

      {/* Hero Section */}
      <div className="pt-32 mt-[100px] pb-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-6">
            Cultural Festivals & Events
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Experience the vibrant celebrations and rich traditions of Arunachal Pradesh
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search festivals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Month Filter */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Tribe Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedTribe}
              onChange={(e) => setSelectedTribe(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
            >
              {tribes.map((tribe) => (
                <option key={tribe} value={tribe}>{tribe}</option>
              ))}
            </select>
          </div>

          {/* View Mode Switch */}
          <div className="flex gap-2">
            <button onClick={() => setViewMode("grid")} className={`flex-1 py-3 px-4 rounded-xl border transition-all ${viewMode === "grid" ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
              Grid View
            </button>
            <button onClick={() => setViewMode("calendar")} className={`flex-1 py-3 px-4 rounded-xl border transition-all ${viewMode === "calendar" ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
              Calendar View
            </button>
          </div>
        </motion.div>
      </div>

      {/* Festivals View */}
      {viewMode === "grid" ? (
        <FestivalsGridView festivals={filteredFestivals} />
      ) : (
        <FestivalsCalendarView festivals={filteredFestivals} />
      )}
    </div>
  );
}

const FestivalsGridView = ({ festivals }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {festivals.map((festival, index) => (
          <motion.div
            key={festival.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
          >
            {/* Festival Image or Grey Placeholder */}
            {festival.image ? (
              <img
                src={festival.image}
                alt={festival.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="relative h-48 bg-gray-300 dark:bg-gray-700"></div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <PartyPopper className="h-5 w-5 text-amber-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {festival.name}
                </h3>
              </div>

              {/* Festival Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{festival.tribe}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{festival.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{festival.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{festival.district}</span>
                </div>
              </div>

              {/* View Details Button */}
              <button className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all group">
                <span>View Details</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {festivals.length === 0 && (
        <div className="text-center py-20">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No festivals found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

const FestivalsCalendarView = ({ festivals }) => {
  // Group festivals by month
  const festivalsByMonth = festivals.reduce((acc, festival) => {
    const month = festival.date || "Unknown Month";
    if (!acc[month]) acc[month] = [];
    acc[month].push(festival);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(festivalsByMonth).map(([month, monthFestivals], index) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {month}
              </h3>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {monthFestivals.map((festival) => (
                <div 
                  key={festival.id} 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {festival.name}
                    </h4>
                    <span className="text-sm text-amber-500">{festival.date}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {festival.tribe} Tribe
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {festival.district}
                    </span>
                    <button className="text-sm text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 group">
                      Details
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};