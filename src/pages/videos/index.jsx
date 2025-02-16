import { useState } from "react";
import {
  Search,
  TrendingUp,
  Play,
  Eye,
  Clock,
  Calendar,
  Filter,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import VideoModal from "../../components/VideoModal";
import { useEffect } from "react";

export default function VideoPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTribe, setSelectedTribe] = useState("All Tribes");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [videos, setVideos] = useState([]);

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
          "http://localhost:3000/api/category/items?category_id=2"
        );
        const data = await response.json();
        if (data?.data) {
          
        }
      } catch (error) {
        console.error("Error fetching Videos:", error);
      }
    }
    fetchVideos();
  }, []);

  const handleVideoEnd = () => {
    if (selectedVideo) {
      const currentIndex = videos.findIndex(
        (v) => v.videoId === selectedVideo.videoId
      );
      const nextIndex = (currentIndex + 1) % videos.length;
      setSelectedVideo(videos[nextIndex]);
    }
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tribe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTribe =
      selectedTribe === "All Tribes" || video.tribe === selectedTribe;
    const matchesCategory =
      selectedCategory === "All Categories" ||
      video.category === selectedCategory;
    return matchesSearch && matchesTribe && matchesCategory;
  });

  const trendingVideos = [...videos]
    .sort(
      (a, b) =>
        parseInt(b.views.replace("K", "000")) -
        parseInt(a.views.replace("K", "000"))
    )
    .slice(0, 4);

  const newVideos = [...videos]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="pt-32 mt-[100px] pb-20 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-heading mb-4"
        >
          Tribal Cultural Videos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-subheading"
        >
          Explore the rich cultural heritage through our video collection
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedTribe}
              onChange={(e) => setSelectedTribe(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {tribes.map((tribe) => (
                <option key={tribe} value={tribe}>
                  {tribe}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* All Videos/Search Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-heading">
            {searchQuery ||
            selectedTribe !== "All Tribes" ||
            selectedCategory !== "All Categories"
              ? "Search Results"
              : "All Videos"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.videoId}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                      <Play className="h-8 w-8 text-white fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.views}
                    </span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-heading mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {video.title}
              </h3>
              <p className="text-sm text-subheading flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                {video.tribe} Tribe
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-heading mb-2">
              No videos found
            </h3>
            <p className="text-subheading">
              Try adjusting your search or filters to find what you're looking
              for
            </p>
          </div>
        )}
      </div>

      {/* Show other sections only when not searching */}
      {!searchQuery &&
        selectedTribe === "All Tribes" &&
        selectedCategory === "All Categories" && (
          <>
            {/* Trending Videos Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-heading">
                    Trending Videos
                  </h2>
                </div>
                <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingVideos.map((video) => (
                  <div
                    key={video.videoId}
                    className="group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                            <Play className="h-8 w-8 text-white fill-current" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {video.views}
                          </span>
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-heading mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-subheading flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      {video.tribe} Tribe
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* New Videos Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-heading">
                    New Videos
                  </h2>
                </div>
                <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newVideos.map((video) => (
                  <div
                    key={video.videoId}
                    className="group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                            <Play className="h-8 w-8 text-white fill-current" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(video.date).toLocaleDateString()}
                          </span>
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-heading mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-subheading flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      {video.tribe} Tribe
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo.videoId}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          title={selectedVideo.title}
          tribe={selectedVideo.tribe}
          tribeLogo={selectedVideo.tribeLogo}
          onVideoEnd={handleVideoEnd}
          videos={videos}
        />
      )}
    </div>
  );
}
