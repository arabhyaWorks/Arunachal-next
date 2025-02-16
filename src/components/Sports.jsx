import { Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Sports({ sports }) {
  return (
    <div
      id="sports"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
    >
      <div className="relative mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold text-heading mb-2 sm:mb-4">
          Traditional Sports
          <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></div>
        </h2>
        <p className="text-sm sm:text-lg text-subheading">
          Discover the indigenous sports played by various tribes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sports.map((sport, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={sport.name}
            className="group relative bg-white dark:bg-[#2d3748] rounded-xl transition-all duration-300"
          >
            <div className="aspect-[4/3] rounded-t-xl overflow-hidden relative">
              {sport.attributes[
                "cat-TraditionalSportsOfTheTribes-ThumbImageOfTheSport"
              ]?.attribute_value?.value && (
                <img
                  src={
                    sport.attributes[
                      "cat-TraditionalSportsOfTheTribes-ThumbImageOfTheSport"
                    ].attribute_value.value
                  }
                  alt={sport.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/90 text-white shadow-lg backdrop-blur-sm">
                  {sport.category_name}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-heading group-hover:text-red-600 transition-colors">
                  {sport.name}
                </h3>
                <Info className="w-4 h-4 text-gray-400 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Tribe:</span>{" "}
                {sport.attributes[
                  "cat-TraditionalSportsOfTheTribes-Tribe"
                ].attribute_value.value
                  .map((item) => item.name)
                  .join(", ")}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {sport.description !== "-"
                  ? sport.description
                  : "No description available."}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
