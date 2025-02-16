"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, PartyPopper, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/Header";

export default function FestivalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [festivals, setFestivals] = useState([]);
  const [expandedFestival, setExpandedFestival] = useState(null);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const response = await fetch("http://localhost:3000/api/category/items?category_id=1");
        const data = await response.json();
        console.log(data);
        if (data?.data) {
          setFestivals(data.data);
        }
      } catch (error) {
        console.error("Error fetching festivals:", error);
      }
    }
    fetchFestivals();
  }, []);

  // Filter festivals based on search query
  const filteredFestivals = festivals.filter(festival =>
    festival.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

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

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search festivals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
          />
        </motion.div>
      </div>

      {/* Festivals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.map((festival, index) => {
            const isExpanded = expandedFestival === festival.id;
            const shortDescription = festival.description.length > 100 
              ? festival.description.slice(0, 100) + "..."
              : festival.description;

            return (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
              >
                {/* Grey Placeholder for Image */}
                <div className="relative h-48 bg-gray-300 dark:bg-gray-700"></div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <PartyPopper className="h-5 w-5 text-amber-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {festival.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {isExpanded ? festival.description : shortDescription}
                    {festival.description.length > 100 && (
                      <button
                        onClick={() =>
                          setExpandedFestival(isExpanded ? null : festival.id)
                        }
                        className="ml-2 text-amber-500 hover:underline"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p>

                  <button className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all group">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredFestivals.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No festivals found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find what you are looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}