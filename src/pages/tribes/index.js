// "use client";

// import { useState, useEffect } from "react";
// import { MapPin, Users, Filter, Search } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Header from "../../components/Header.js";
// import { motion } from "framer-motion";

// export default function TribeListPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRegion, setSelectedRegion] = useState("All Regions");
//   const [tribes, setTribes] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchTribes() {
//       try {
//         const response = await fetch("/api/tribe");
//         const data = await response.json();
//         if (data?.data) {
//           const transformedTribes = data.data.map((tribe) => ({
//             id: tribe.tribe_id,
//             name: tribe.name,
//             location: tribe.attributes["tribe-Regions"]?.attribute_value?.value?.[0] || "Unknown",
//             population: tribe.attributes["tribe-PopulationInNumbers"]?.attribute_value?.value || "N/A",
//             image: tribe.attributes["tribe-BannerImage"]?.attribute_value?.value || "/placeholder.jpg",
//           }));
//           setTribes(transformedTribes);
//         }
//       } catch (error) {
//         console.error("Error fetching tribes:", error);
//       }
//     }
//     fetchTribes();
//   }, []);

//   const filteredTribes = tribes.filter((tribe) => {
//     const matchesSearch = tribe.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRegion = selectedRegion === "All Regions" || tribe.location === selectedRegion;
//     return matchesSearch && matchesRegion;
//   });

//   const regions = ["All Regions", ...new Set(tribes.map((tribe) => tribe.location))];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
//       <Header />

//       <div className="pt-32 mt-[100px] pb-20 text-center relative z-10">
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-5xl font-bold text-heading dark:text-blue-400 mb-4"
//         >
//           Indigenous Tribes
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className="text-xl text-gray-600 dark:text-gray-300"
//         >
//           Discover the rich cultural heritage of indigenous tribes
//         </motion.p>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="flex flex-col sm:flex-row gap-4"
//         >
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search tribes..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
//             />
//           </div>
//           <div className="relative min-w-[200px]">
//             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <select
//               value={selectedRegion}
//               onChange={(e) => setSelectedRegion(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
//             >
//               {regions.map((region) => (
//                 <option key={region} value={region}>
//                   {region}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </motion.div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredTribes.map((tribe, index) => (
//             <motion.div
//               key={tribe.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               className="group cursor-pointer"
//               onClick={() => router.push("/tribes/" + tribe.name.toLowerCase())}
//             >
//               <div className="relative h-[280px] rounded-2xl overflow-hidden">
//                 <img
//                   src={tribe.image}
//                   alt={tribe.name}
//                   className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
//                   <div className="absolute bottom-6 left-6">
//                     <h3 className="text-2xl font-bold text-white mb-3">
//                       {tribe.name}
//                     </h3>
//                     <div className="flex flex-col gap-2">
//                       <div className="flex items-center gap-2 text-white/90 text-sm bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
//                         <MapPin className="h-4 w-4" />
//                         <span>{tribe.location}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-white/90 text-sm bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
//                         <Users className="h-4 w-4" />
//                         <span>{tribe.population}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//         {filteredTribes.length === 0 && (
//           <div className="text-center py-20">
//             <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No tribes found
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400">
//               Try adjusting your search or filter to find what you're looking for
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// new code below 
"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, Filter, Search } from "lucide-react";
// import { useRouter } from "next/navigation";
import UserHeader from "../../components/user/UserHeader";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function TribeListPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check user role from localStorage or other auth state
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(["Director", "Deputy Director", "Assistant Director", "CBO Member", "CMS Manager"].includes(userRole));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [tribes, setTribes] = useState([]);

  useEffect(() => {
    async function fetchTribes() {
      try {
        const response = await fetch("/api/tribe");
        const data = await response.json();
        if (data?.data) {
          const transformedTribes = data.data.map((tribe) => ({
            id: tribe.tribe_id,
            name: tribe.name,
            location: tribe.attributes["tribe-Regions"]?.attribute_value?.value?.[0] || "Unknown",
            population: tribe.attributes["tribe-PopulationInNumbers"]?.attribute_value?.value || "N/A",
            image: tribe.attributes["tribe-BannerImage"]?.attribute_value?.value || "/placeholder.jpg",
          }));
          setTribes(transformedTribes);
        }
      } catch (error) {
        console.error("Error fetching tribes:", error);
      }
    }
    fetchTribes();
  }, []);

  const filteredTribes = tribes.filter((tribe) => {
    const matchesSearch = tribe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "All Regions" || tribe.location === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ["All Regions", ...new Set(tribes.map((tribe) => tribe.location))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      {isAdmin ? <Header /> : <UserHeader />}

      <div className="pt-32 mt-[100px] pb-20 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-heading dark:text-blue-400 mb-4"
        >
          Indigenous Tribes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          Discover the rich cultural heritage of indigenous tribes
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tribes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTribes.map((tribe, index) => (
            <motion.div
              key={tribe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => router.push("/tribes/" + tribe.name.toLowerCase())}
            >
              <div className="relative h-[280px] rounded-2xl overflow-hidden">
                <img
                  src={tribe.image}
                  alt={tribe.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {tribe.name}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white/90 text-sm bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                        <MapPin className="h-4 w-4" />
                        <span>{tribe.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                        <Users className="h-4 w-4" />
                        <span>{tribe.population}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {filteredTribes.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tribes found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
}