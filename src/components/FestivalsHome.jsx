import {
  MapPin,
  Calendar,
  Bookmark,
  ArrowRight,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { useState, useEffect } from "react";

export default function Festivals() {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const response = await fetch(
          "/api/category/items?category_id=1"
        );
        const data = await response.json();
        if (data?.data) {
          const transformedFestivals = data.data.map((festival) => {
            const attributes = festival.attributes || [];

            return {
              id: festival.id,
              name: festival.name,
              description: festival.description,
              tribe:
                attributes.find((attr) => attr.name === "cat-Festivals-Tribe")
                  ?.value?.value?.[0]?.name || "Unknown Tribe",
              date:
                attributes.find(
                  (attr) => attr.name === "cat-Festivals-DateOfCelebration"
                )?.value?.value || "Date not available",
              duration:
                attributes.find(
                  (attr) => attr.name === "cat-Festivals-Duration"
                )?.value?.value || "Duration not available",
              image:
                attributes.find(
                  (attr) => attr.name === "cat-Festivals-ImagesOfTheFestivals"
                )?.value?.value || null,
              district:
                attributes.find(
                  (attr) => attr.name === "cat-Festivals-District"
                )?.value?.value || "Unknown Location",
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

  return (
    <div className="mt-16 relative overflow-hidden">
      {/* Enhanced Background with Golden Gradient */}
      <div className="absolute inset-0 dark:from-amber-900/10 dark:via-yellow-900/15 dark:to-amber-900/10">
        {/* Decorative Golden Sparkles */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-[20%] left-[25%] w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-[50%] right-[30%] w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
              <PartyPopper className="h-10 w-10 text-amber-500" />
              Tribal Festivals
            </h2>
            <p className="text-subheading mt-2 text-amber-700 dark:text-amber-300">
              Discover the rich cultural heritage of Arunachal Pradesh
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-300 border border-amber-200 dark:border-amber-700 group">
              <ChevronLeft className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300" />
            </button>
            <button className="p-3 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-300 border border-amber-200 dark:border-amber-700 group">
              <ChevronRight className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300" />
            </button>
          </div>
        </div>

        <Marquee
          speed={35}
          gradient={false}
          pauseOnHover={true}
          className="py-6"
        >
          {festivals.map((festival, index) => {
            const gradients = [
              "from-amber-500/15 via-yellow-500/15 to-amber-500/15",
              "from-rose-500/10 via-amber-500/15 to-rose-500/10",
              "from-purple-500/10 via-amber-500/15 to-purple-500/10",
            ];

            const iconBgs = [
              "from-amber-500 to-yellow-500",
              "from-rose-500 via-amber-500 to-rose-600",
              "from-purple-500 via-amber-500 to-purple-600",
            ];

            const buttonGradients = [
              "hover:from-amber-100 hover:via-yellow-50 hover:to-amber-100",
              "hover:from-rose-100 hover:via-amber-50 hover:to-rose-100",
              "hover:from-purple-100 hover:via-amber-50 hover:to-purple-100",
            ];

            const gradientIndex = index % gradients.length;

            return (
              <div
                key={`${festival.name}-${index}`}
                className="mx-4 relative group"
              >
                <div className="relative w-[400px] bg-white dark:bg-gray-800/95 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgba(251,191,36,0.2)] hover:-translate-y-1 border border-amber-100/50 dark:border-amber-700/30">
                  {/* Decorative Elements */}
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${gradients[gradientIndex]} rounded-bl-full opacity-70`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${gradients[gradientIndex]} rounded-tr-full opacity-70`}
                  ></div>

                  {/* Golden Corner Accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400/30 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400/30 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400/30 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400/30 rounded-br"></div>

                  <div className="p-7 relative">
                    <div className="flex items-start gap-5">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${iconBgs[gradientIndex]} p-0.5 shadow-lg`}
                      >
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[14px] flex items-center justify-center">
                          <PartyPopper className="h-8 w-8 text-amber-500" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-heading group-hover:text-amber-600 transition-colors">
                          {festival.name}
                        </h3>
                        <p className="text-subheading flex items-center gap-2 mt-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          {festival.tribe} Tribe
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 space-y-4">
                      <div className="flex items-center gap-3 text-subheading">
                        <div className="w-9 h-9 rounded-full bg-amber-100/70 dark:bg-amber-900/30 flex items-center justify-center">
                          <MapPin className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm">{festival.district}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100/70 dark:bg-amber-900/30 flex items-center justify-center">
                          <Calendar className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-heading">
                          {festival.date}
                        </span>
                      </div>
                    </div>

                    <button
                      className={`mt-7 w-full bg-gradient-to-r ${gradients[gradientIndex]} dark:from-amber-900/30 dark:to-gray-800/30 rounded-xl p-3.5 flex items-center justify-center gap-2 transition-all duration-300 border border-amber-100/50 dark:border-amber-700/30 ${buttonGradients[gradientIndex]}`}
                    >
                      <span className="text-sm font-medium text-heading">
                        View Festival Details
                      </span>
                      <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
