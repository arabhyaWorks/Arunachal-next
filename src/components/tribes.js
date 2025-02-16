import { ArrowRight } from "lucide-react";
import Marquee from "react-fast-marquee";

const tribes = [
  {
    name: "Adi",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
  },
  {
    name: "Khamba",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/Khamba1.jpg",
  },
  {
    name: "Nocte",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/nocte1.jpg",
  },
  {
    name: "Tangsa",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/tangsa1.jpg",
  },
  {
    name: "Apatani",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
  },
  {
    name: "Kaman",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/Kaman1.jpg",
  },
  {
    name: "Puroik",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/puroik1.jpg",
  },
  {
    name: "Tutsa",
    image:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/tutsa1.jpg",
  },
];

export default function Tribes() {
  return (
    <div id="tribes" className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12">
          <h2 className="text-4xl font-bold text-heading mb-4">
            Indigenous Tribes
            <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
          </h2>
          <p className="text-lg text-subheading">
            Discover the diverse tribal communities of Arunachal Pradesh
          </p>
        </div>

        <Marquee speed={50} gradient={false} pauseOnHover={true}>
          {tribes.map((tribe, index) => (
            <div key={`${tribe.name}-${index}`} className="flex-none w-72 mx-4">
              <div className="group cursor-pointer">
                <div className="relative h-96 rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img
                    src={tribe.image}
                    alt={`${tribe.name} Tribe`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {tribe.name} Tribe
                      </h3>
                      <button className="text-sm text-white flex items-center gap-2 group">
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}