import { Eye, Play } from "lucide-react";
import VideoModal from "./VideoModal";
import { useEffect, useState } from "react";

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [videos, setVideoData] = useState([]);
  
    useEffect(() => {
      async function fetchVideo() {
        const response = await fetch(
          "http://localhost:3000/api/category/video"
        );
        const data = await response.json();
        if (data?.data) {
          setVideoData(data.data);
        }
      }
      fetchVideo();
    }, []);

  const handleVideoEnd = () => {
    if (selectedVideo) {
      const currentIndex = videos.findIndex(
        (v) => v.file_path === selectedVideo.file_path
      );
      const nextIndex = (currentIndex + 1) % videos.length;
      setSelectedVideo(videos[nextIndex]);
    }
  };

  return (
    <div className="min-h-screen mt-6 transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {videos.map((video) => (
          <div
            key={video.title}
            className="group cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 shadow-lg">
              <img
                src={`${video.thumbnail_path}`}
                alt={video.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-center text-white text-xs sm:text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    {video.views}
                  </span>
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-heading text-base sm:text-lg mb-1 group-hover:text-teal-600 transition-colors line-clamp-1">
              {video.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-500"></span>
              {video.tribe} Tribe
            </p>
          </div>
        ))}
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
          videos={videos}
        />
      )}
    </div>
  );
}