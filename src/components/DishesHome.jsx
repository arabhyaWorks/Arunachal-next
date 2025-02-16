import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Foods() {
  const [dishes, setDishesData] = useState([]);
  
  useEffect(() => {
    async function fetchDishes() {
      const response = await fetch(
        "http://localhost:3000/api/category/items?category_id=5"
      );
      const data = await response.json();
      if (data?.data) {
        // Transform the data to include the correct image URL and tribe information
        const transformedDishes = data.data.map(dish => {
          const attributes = dish.attributes || [];
          
          // Find the image attribute
          const imageAttribute = attributes.find(
            attr => attr.name === "cat-Cuisine/Delicacies-Image"
          );
          
          // Find the tribe attribute
          const tribeAttribute = attributes.find(
            attr => attr.name === "cat-Cuisine/Delicacies-Tribe"
          );

          return {
            ...dish,
            image: imageAttribute?.value?.value || "/placeholder-food.jpg", // Add a fallback image
            tribe: tribeAttribute?.value?.value?.[0]?.name || "Unknown Tribe"
          };
        });

        setDishesData(transformedDishes);
      }
    }
    fetchDishes();
  }, []);

  return (
    <div
      id="cuisine"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
    >
      <div className="relative mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold text-heading mb-2 sm:mb-4">
          Traditional Cuisine
          <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
        </h2>
        <p className="text-sm sm:text-lg text-subheading">
          Savor the authentic flavors of Arunachal Pradesh
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dishes.map((dish) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white dark:bg-[#2d3748] rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/3] rounded-t-xl overflow-hidden relative">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>

              {/* Category Tag */}
              <div className="absolute bottom-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500/90 text-white shadow-lg backdrop-blur-sm">
                  Traditional
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-heading group-hover:text-teal-600 transition-colors">
                  {dish.name}
                </h3>
                <Info className="w-4 h-4 text-gray-400 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Tribe:</span> {dish.tribe}
              </p>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {dish.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}