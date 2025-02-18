import { useState, useEffect } from "react";
import { Eye, Play, Search, Filter } from "lucide-react";
import VideoModal from "../../components/VideoModal";
import Header from "../../components/Header";
import VideoCard from "../../components/VideoCard";
import { motion } from "framer-motion";
import UserHeader from "@/components/user/UserHeader";

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTribe, setSelectedTribe] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeSection, setActiveSection] = useState("all"); // all, new, trending

  const tribes = [
    "All Tribes",
    "Adi",
    "Apatani",
    "Buguns",
    "Galo",
    "Nocte",
    "Nyishi",
    "Tagin",
    "Monpa",
  ];

  const categories = [
    "All Categories",
    "Dance",
    "Music",
    "Festival",
    "Ceremony",
    "Craft",
    "Food",
  ];

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(
          "/api/category/items?category_id=2"
        );
        const data = await response.json();

        if (data?.data) {
          const videoPromises = data.data.map(async (item) => {
            const videoAttribute = item.attributes.find(
              (attr) => attr.name === "cat-FolkDance-VideoOfTheDance"
            );

            if (videoAttribute?.value?.value) {
              const videoId = videoAttribute.value.value;
              const videoResponse = await fetch(
                `/api/category/video?video_id=${videoId}`
              );
              const videoData = await videoResponse.json();
              return videoData.data;
            }
            return null;
          });

          const videos = await Promise.all(videoPromises);
          const filteredVideos = videos.filter((video) => video !== null);

          setVideos(filteredVideos);
          setFilteredVideos(filteredVideos);
        }
      } catch (error) {
        console.error("Error fetching Videos:", error);
      }
    }
    fetchVideos();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...videos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tribe filter
    if (selectedTribe) {
      filtered = filtered.filter((video) => video.tribe === selectedTribe);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (video) => video.category === selectedCategory
      );
    }

    // Section filter
    switch (activeSection) {
      case "new":
        filtered = filtered
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);
        break;
      case "trending":
        filtered = filtered
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 10);
        break;
      default:
        break;
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery, selectedTribe, selectedCategory, activeSection]);

  const handleVideoEnd = () => {
    if (selectedVideo) {
      const currentIndex = filteredVideos.findIndex(
        (v) => v.file_path === selectedVideo.file_path
      );
      const nextIndex = (currentIndex + 1) % filteredVideos.length;
      setSelectedVideo(filteredVideos[nextIndex]);
    }
  };

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Check user role from localStorage or other auth state
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(["Director", "Deputy Director", "Assistant Director", "CBO Member", "CMS Manager"].includes(userRole));
  }, []);
  // const tribes = [...new Set(videos.map((video) => video.tribe))];
  // const categories = [...new Set(videos.map((video) => video.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAdmin ? <Header /> : <UserHeader />}

      {/* Hero Section */}
      <div className="pt-32 mt-[100px] pb-20 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-heading mb-4 dark:text-white"
        >
          Tribal Cultural Videos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-subheading dark:text-gray-300"
        >
          Explore the rich cultural heritage through our video collection
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400/80" />
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800/90 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800/90 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm appearance-none bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]"
            value={selectedTribe}
            onChange={(e) => setSelectedTribe(e.target.value)}
          >
            <option value="">All Tribes</option>
            {tribes.map((tribe) => (
              <option key={tribe} value={tribe}>
                {tribe}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800/90 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm appearance-none bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* All Videos Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-heading dark:text-white">
              All Videos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.title}
                video={video}
                onClick={setSelectedVideo}
              />
            ))}
          </div>
        </div>

        {/* New Videos Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-heading dark:text-white">
              New Videos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 8)
              .map((video) => (
                <VideoCard
                  key={video.title}
                  video={video}
                  onClick={setSelectedVideo}
                />
              ))}
          </div>
        </div>

        {/* Trending Videos Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Play className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-heading dark:text-white">
              Trending Videos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 8)
              .map((video) => (
                <VideoCard
                  key={video.title}
                  video={video}
                  onClick={setSelectedVideo}
                />
              ))}
          </div>
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          file_path={selectedVideo.file_path}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          title={selectedVideo.title}
          tribe={selectedVideo.tribe}
          tribeLogo={selectedVideo.tribeLogo}
          onVideoEnd={handleVideoEnd}
          videos={filteredVideos}
        />
      )}
    </div>
  );
}

export default App;
