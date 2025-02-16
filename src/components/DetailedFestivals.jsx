import { ArrowRight, Calendar, User, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const currentMonth = new Date().toLocaleString("default", { month: "long" });

// Helper function to extract month from date string
const extractMonth = (dateString) => {
  if (!dateString || dateString === "Date not available") return null;
  
  // Common date formats in the input
  const monthRegex = /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)/i;
  
  const match = dateString.toLowerCase().match(monthRegex);
  return match ? match[0] : null;
};

export default function DetailedFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [currentMonthFestivals, setCurrentMonthFestivals] = useState([]);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/category/items?category_id=1"
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

          // Filter festivals for current month
          const filteredFestivals = transformedFestivals.filter(festival => {
            const festivalMonth = extractMonth(festival.date);
            return festivalMonth && festivalMonth.toLowerCase() === currentMonth.toLowerCase();
          });

          setCurrentMonthFestivals(filteredFestivals);
        }
      } catch (error) {
        console.error("Error fetching festivals:", error);
      }
    }
    fetchFestivals();
  }, []);

  return (
    <div id="festivals" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div className="relative">
            <span className="text-sm font-semibold text-teal-600 tracking-wider uppercase mb-2 block">
              Cultural Calendar
            </span>
            <h2 className="text-5xl font-bold text-heading mb-4">
              {currentMonth} Festivals & Events
              <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-subheading max-w-2xl">
              Experience the vibrant cultural celebrations that showcase our
              rich heritage and traditions
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-full shadow-md hover:shadow-lg transition-all group">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">View Full Calendar</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMonthFestivals.map((festival, index) => (
            <div
              key={festival.id}
              className="group border relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-tr-full"></div>

              <div className="p-8 relative flex flex-col space-between">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-heading mb-4 group-hover:text-blue-600 transition-colors">
                    {festival.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tribe</p>
                      <p className="font-medium text-heading">
                        {festival.tribe}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium text-heading">
                        {festival.district}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mt-6 px-4 py-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-teal-100">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <p className="font-medium text-heading">{festival.date}</p>
                    </div>
                  </div>

                  <button className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-subheading rounded-xl group-hover:bg-gradient-to-r from-blue-600 to-teal-500 group-hover:text-white transition-all duration-600">
                    <span className="font-medium">View Festival Details</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex md:hidden justify-center">
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-full shadow-md hover:shadow-lg transition-all group">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">View Full Calendar</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}