// components/VideoCard.jsx
import { Play, Eye } from "lucide-react";

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-lg">
        <img
          src={`${video.thumbnail_path}`}
          alt={video.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
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

      <h3 className="font-semibold text-heading text-lg mb-1 group-hover:text-teal-600 transition-colors line-clamp-1 dark:text-white">
        {video.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        {video.tribe} Tribe
      </p>
    </div>
  );
};

export default VideoCard;