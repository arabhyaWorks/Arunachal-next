import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, Info } from "lucide-react";

export default function ManageTribes() {
  const [tribes, setTribes] = useState([]);

  useEffect(() => {
    async function fetchTribes() {
      try {
        const response = await fetch("http://localhost:3000/api/tribe");
        const data = await response.json();
        if (data?.data) {
          const transformedTribes = data.data.map((tribe) => ({
            id: tribe.tribe_id,
            name: tribe.name,
            location:
              tribe.attributes["tribe-Regions"]?.attribute_value?.value?.[0] ||
              "Unknown",
            population:
              tribe.attributes["tribe-PopulationInNumbers"]?.attribute_value
                ?.value || "N/A",
            image:
              tribe.attributes["tribe-BannerImage"]?.attribute_value?.value ||
              "/placeholder.jpg",
          }));
          setTribes(transformedTribes);
        }
      } catch (error) {
        console.error("Error fetching tribes:", error);
      }
    }
    fetchTribes();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tribes.map((tribe, index) => (
        <motion.div
          key={tribe.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden">
            <img
              src={tribe.image}
              alt={tribe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {tribe.name}
                </h3>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created {new Date(tribe.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Created by: {tribe.createdBy}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
