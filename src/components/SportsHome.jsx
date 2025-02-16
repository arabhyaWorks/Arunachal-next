import { ArrowRight } from "lucide-react";

export default function Sports() {
  const sportsData = [
    {
      name: "Archery",
      image: "https://indigenous.arunachal.gov.in/assets/sports/archery.png",
      participants: "Individual",
    },
    {
      name: "Wrestling",
      image: "https://indigenous.arunachal.gov.in/assets/sports/wrestling.jpg",
      participants: "Duo",
    },
    {
      name: "Boat Racing",
      image: "https://indigenous.arunachal.gov.in/assets/sports/baot-racing.jpg",
      participants: "Team",
    },
    {
      name: "Bamboo Pole Climbing",
      image: "https://indigenous.arunachal.gov.in/assets/sports/bamboo-pooling.jpg",
      participants: "Individual",
    },
    {
      name: "Pony Racing",
      image: "https://indigenous.arunachal.gov.in/assets/sports/pony-racing.jpg",
      participants: "Individual",
    },
    {
      name: "Animal Sports",
      image: "https://indigenous.arunachal.gov.in/assets/sports/animalsports.jpg",
      participants: "Group",
    },
  ];

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
              key={sport.name}
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