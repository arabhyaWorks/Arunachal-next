import { Info, User2, Bookmark, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";


export default function Foods({dishes}) {
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

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dishes.map((dish, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={dish.name}
              className="group relative bg-white dark:bg-[#2d3748] rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/3] rounded-t-xl overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/90 text-white">
                      {dish.category}
                    </span>
                  </div>
                  <Info className="w-4 h-4 text-gray-400 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-lg font-semibold text-heading group-hover:text-teal-600 transition-colors">
                  {dish.name}
                </h3>
                
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Tribe:</span> {dish.tribe}
                </p>
                
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 ">
                  {dish.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dishes.map((dish, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={dish.name}
            className="group relative bg-white dark:bg-[#2d3748] rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-[4/3] rounded-t-xl overflow-hidden relative">
              <img
                src={dish.attributes["cat-Foods-Image"].attribute_value.value}
                alt={dish.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient overlay - always visible but more pronounced on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>

              {/* Category tag positioned over the image */}
              <div className="absolute bottom-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500/90 text-white shadow-lg backdrop-blur-sm">
                  {dish.attributes["cat-Foods-FoodType"].attribute_value.value}
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

              {/* Mobile-visible, desktop-hover description */}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 ">
                {dish.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
