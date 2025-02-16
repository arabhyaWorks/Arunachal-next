import { useState, useEffect } from "react";
import {
  User,
  ChevronRight,
  Calendar,
  Eye,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import Video from "../../components/VideoHome";
import classNames from "classnames";
import MusicPlayer from "../../components/MusicPlayer";
import Header from "../../components/Header";
import Tribes from "../../components/TribesHome";
import Festivals from "../../components/FestivalsHome";
import Foods from "../../components/DishesHome";
import DetailedFestivals from "../../components/DetailedFestivals";
import Books from "../../components/BooksHome";
import Sports from "../../components/SportsHome";
import Footer from "../../components/Footer";

export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Folk Music");
  const [musicData, setMusicData] = useState([]);

  useEffect(() => {
    async function fetchMusic() {
      const response = await fetch(
        "http://localhost:3000/api/category/audio"
      );
      const data = await response.json();
      if (data?.data) {
        setMusicData(data.data);
      }
    }
    fetchMusic();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setIsDarkMode(true);
      }
    }
  }, []);

  // Whenever isDarkMode changes, update <html> class and localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDarkMode]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={classNames(
        "min-h-screen dark:bg-[#2d3748] transition-colors text-[#083644] dark:text-white",
        "bg-[#f0ffff]"
      )}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative h-[550px] mt-[100px]">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kathavachak-95a17.appspot.com/o/Banner%206_v2%20(1).jpg?alt=media&token=f4942c5b-638c-4f1a-b4be-6dbc53d4947d"
          alt="Arunachal Pradesh Culture"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Quick Access Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[70px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Calendar,
              title: "Upcoming Festivals",
              count: "12",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Eye,
              title: "Recently Viewed",
              count: "24",
              color: "from-teal-500 to-emerald-500",
            },
            {
              icon: MessageSquare,
              title: "Folk Stories",
              count: "156",
              color: "from-cyan-500 to-blue-500",
            },
            {
              icon: User,
              title: "All Tribes",
              count: "22",
              color: "from-emerald-500 to-teal-500",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.color} mb-6`}
              >
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-2">
                {item.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-subheading">
                  {item.count} items
                </span>
                <ChevronRight className="h-5 w-5 text-subheading" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Luxurious Festival Scroll with Golden Accents */}
      <Festivals />

      {/* Tribes */}
      <Tribes />

      {/* Upcoming Festivals & Events Section */}
      <DetailedFestivals />

      {/* Featured Videos Section */}
      <div id="videos" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-0">
            <div className="relative">
              <h2 className="text-4xl font-bold text-heading mb-4">
                Featured Cultural Performances
                <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
              </h2>
              <p className="text-lg text-subheading">
                Experience the rich traditions through our curated collection
              </p>
            </div>
            <button className="group flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
              <span className="font-medium">View All</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <Video />
        </div>
      </div>

      {/* Music Section */}
      <div id="music" className="py-10">
        <MusicPlayer songs={musicData} />
      </div>

      {/* Traditional Cuisine Section - Mobile Optimized */}
      <Foods />

      {/* Folklore Stories & Books Section */}
      <Books />

      {/* Traditional Sports Section */}
      <Sports />

      {/* Footer */}
      <Footer />
    </div>
  );
}
