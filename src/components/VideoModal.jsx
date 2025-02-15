import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import {
  X,
  Facebook,
  Twitter,
  Link,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
} from "lucide-react";

const VideoModal = ({
  file_path,
  isOpen,
  onClose,
  selectedVideo,
  setSelectedVideo,
  title,
  tribe,
  tribeLogo,
  onVideoEnd,
  videos,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const timeTrackingIntervalRef = useRef(null);

  const shareUrl = `https://www.youtube.com/watch?v=${file_path}`;

  useEffect(() => {
    // Hide controls after 3 seconds of inactivity
    const hideControls = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    hideControls();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (timeTrackingIntervalRef.current) {
        clearInterval(timeTrackingIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const startTimeTracking = (player) => {
    if (timeTrackingIntervalRef.current) {
      clearInterval(timeTrackingIntervalRef.current);
    }

    timeTrackingIntervalRef.current = setInterval(() => {
      if (player) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        setCurrentTime(currentTime);
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVideoReady = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const handleStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startTimeTracking(event.target);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      onVideoEnd();
    }
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    if (playerRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      const newTime = clickPosition * duration;
      playerRef.current.seekTo(newTime);
      setProgress(clickPosition * 100);
    }
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(`Watch ${title} - ${tribe} Tribe`)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full h-full bg-white overflow-hidden flex flex-col sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:m-4 sm:rounded-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Custom Video Player */}
        <div
          className="aspect-video w-full flex-shrink-0 relative bg-black"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <YouTube
            file_path={file_path}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                playsinline: 1,
              },
            }}
            className="w-full h-full"
            onReady={handleVideoReady}
            onStateChange={handleStateChange}
          />

          {/* Custom Controls Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Progress Bar */}
            <div className="absolute bottom-16 left-0 right-0 px-4">
              <div
                className="w-full h-1 bg-gray-600/50 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-teal-500 rounded-full relative group-hover:h-2 transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </button>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      playerRef.current?.seekTo(
                        playerRef.current.getCurrentTime() - 10
                      )
                    }
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <SkipBack className="w-6 h-6 text-white" />
                  </button>

                  <button
                    onClick={() =>
                      playerRef.current?.seekTo(
                        playerRef.current.getCurrentTime() + 10
                      )
                    }
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <SkipForward className="w-6 h-6 text-white" />
                  </button>

                  <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <Maximize className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video info and content */}
        <div className="flex-1 overflow-y-auto">
          {/* Title and share section */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500 flex-shrink-0">
                <img
                  src={tribeLogo}
                  alt={`${tribe} Tribe`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg text-heading font-semibold text-gray-900 mb-1 line-clamp-2">
                  {title}
                </h3>
                <p className="text-sm text-subheading">{tribe} Tribe</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={shareOnFacebook}
                className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                onClick={shareOnTwitter}
                className="p-2 hover:bg-blue-50 rounded-full text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                onClick={copyLink}
                className="p-2 hover:bg-blue-50 rounded-full text-subheading transition-colors"
              >
                <Link className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile: Related Videos */}
          <div className="block sm:hidden">
            <div className="p-4">
              <h4 className="text-sm text-heading font-semibold text-gray-900 mb-3">
                Related Videos
              </h4>
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <div key={index} className="flex gap-3">
                    <div
                      onClick={() => setSelectedVideo(video)}
                      className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.file_path}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-heading text-gray-900 line-clamp-2 mb-1">
                        {video.title}
                      </h5>
                      <p className="text-xs text-subheading text-gray-600">
                        {video.tribe} Tribe
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {video.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;