import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sports() {
  const [sportsData, setSportsData] = useState([]);

  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch(
          "/api/category/items?category_id=6"
        );
        const data = await response.json();
        if (data?.data) {
          // Transform the data to match the UI requirements
          const transformedSports = data.data.map(sport => {
            const attributes = sport.attributes || [];
            
            // Find the image attribute
            const imageAttribute = attributes.find(
              attr => attr.name === "cat-TraditionalSportsOfTheTribes-ThumbImageOfTheSport"
            );
            
            // Find the tribe attribute
            const tribeAttribute = attributes.find(
              attr => attr.name === "cat-TraditionalSportsOfTheTribes-Tribe"
            );

            // Extract tribe name
            const tribe = tribeAttribute?.value?.value?.[0]?.name || "Unknown Tribe";

            return {
              id: sport.id,
              name: sport.name,
              description: sport.description,
              image: imageAttribute?.value?.value || "/placeholder-sport.jpg",
              tribe: tribe,
              participants: `${tribe} Tribe` // Using tribe name for participants label
            };
          });

          setSportsData(transformedSports);
        }
      } catch (error) {
        console.error("Error fetching sports data:", error);
      }
    }
    fetchSports();
  }, []);

  return (
    <div id="sports" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12">
          <h2 className="text-4xl font-bold text-heading mb-4">
            Traditional Sports & Games
            <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
          </h2>
          <p className="text-lg text-subheading">
            Discover ancient games that shaped our culture
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sportsData.map((sport) => (
            <div
              key={sport.id}
              className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-[200px] rounded-xl border overflow-hidden mb-3 shadow-md group-hover:shadow-xl">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="text-xs font-medium text-white bg-blue-600/80 px-2 py-1 rounded-full backdrop-blur-sm">
                      {sport.participants}
                    </span>
                    <span className="text-xs font-medium text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-heading text-center group-hover:text-teal-600 transition-colors">
                {sport.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}