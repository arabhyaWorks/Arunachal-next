import { Info } from "lucide-react";
import { motion } from "framer-motion";

const dishes = [
  {
    name: "PO'ROK Amin",
    image: 'https://indigenous.arunachal.gov.in/assets/food/Ami.jpeg',
    category: 'Main Course',
    tribe: 'Traditional',
    description:
      'A traditional dish from Arunachal Pradesh made using local ingredients and traditional cooking methods.',
  },
  {
    name: 'Khow Lam',
    image: 'https://indigenous.arunachal.gov.in/assets/food/KhowLa.jpeg',
    category: 'Appetizer',
    tribe: 'Traditional',
    description:
      'A traditional pancake from the region, showcasing the rich culinary heritage of Arunachal Pradesh.',
  },
  {
    name: 'Zan',
    image: 'https://indigenous.arunachal.gov.in/assets/food/Za.jpeg',
    category: 'Staple',
    tribe: 'Traditional',
    description:
      'A hearty and nutritious dish made with millet or maize flour, also known as "Thukpa" in some regions.',
  },
  {
    name: 'Mirung Etting',
    image:
      'https://indigenous.arunachal.gov.in/assets/food/Mirung_Ettin.jpeg',
    category: 'Side Dish',
    tribe: 'Traditional',
    description:
      'A traditional rice cake often prepared during festivals and special occasions using rice flour and banana leaves.',
  },
];

export default function Foods() {
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
            key={dish.name}
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
                  {dish.category}
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