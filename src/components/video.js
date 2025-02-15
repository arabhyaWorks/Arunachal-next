import { useState } from "react";
import { Play } from "lucide-react";
import VideoModal from "./videoModal";

// Helper to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  } catch (error) {
    console.error("Invalid URL", error);
    return "";
  }
};

export default function Home({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Automatically play the next video when one ends
  const handleVideoEnd = () => {
    if (selectedVideo) {
      const currentIndex = videos.findIndex(
        (v) => v.id === selectedVideo.id
      );
      const nextIndex = (currentIndex + 1) % videos.length;
      setSelectedVideo(videos[nextIndex]);
    }
  };

  return (
    <div className=" mt-6 transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 shadow-lg">
              <img
                src={video.thumbnail_path}
                alt={video.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-teal-600 transition-colors line-clamp-1">
             {video.title} 
            </h3>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoModal
          videoId={getYouTubeVideoId(selectedVideo.file_path)}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          description={selectedVideo.description}
          onVideoEnd={handleVideoEnd}
          // Pass along videos with the extracted videoId for use in the modal’s related list
          videos={videos.map((v) => ({
            ...v,
            videoId: getYouTubeVideoId(v.file_path),
          }))}
          setSelectedVideo={setSelectedVideo}
        />
      )}
    </div>
  );
}