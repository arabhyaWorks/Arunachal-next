import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Heart,
  Shuffle,
  ListMusic,
  Clock,
} from "lucide-react";

const MusicPlayer = ({ songs }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(new Array(songs.length).fill(false));
  const [isShuffle, setIsShuffle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef(null);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = (index) => {
    if (typeof index === "number") {
      if (index === currentSongIndex) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentSongIndex(index);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
    setIsPlayerVisible(true);
  };

  const handlePrevious = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === 0 ? songs.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === songs.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
      setCurrentTime(formatTime(audioRef.current.currentTime));
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition =
        e.clientX - progressBar.getBoundingClientRect().left;
      const progressBarWidth = progressBar.offsetWidth;
      const percentage = (clickPosition / progressBarWidth) * 100;
      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage);
    }
  };

  const toggleLike = (index) => {
    const newLiked = [...isLiked];
    newLiked[index] = !newLiked[index];
    setIsLiked(newLiked);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative mb-12">
        <h2 className="text-4xl font-bold text-heading mb-4">
          Traditional Music
          <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
        </h2>
        <p className="text-lg text-subheading">
          Experience the soul-stirring melodies of Arunachal Pradesh
        </p>
      </div>

      {/* Music Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.map((song, index) => (
          <div
            key={index}
            className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-100 group"
          >
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-bl-full -z-1"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-tr-full -z-1"></div>

            {/* Music Icon and Title Section */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 p-0.5">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={song["thumbnail_path"]}
                    alt={song["Music Name"]}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-base font-semibold text-heading mb-1 truncate">
                  {song["title"]}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                  <p className="text-xs text-subheading truncate">
                    {song["Tribe Name"]}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-subheading">
                {song["Duration"]}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handlePlayPause(index)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:shadow-md transition-all group"
              >
                {currentSongIndex === index && isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                )}
              </button>

              <button
                onClick={() => toggleLike(index)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked[index]
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Heart
                  className={`h-6 w-6 ${isLiked[index] ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Player */}
      {isPlayerVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg transform transition-all duration-300 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentSong["thumbnail_path"]}
                  alt={currentSong["Music Name"]}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-heading">
                    {currentSong["title"]}
                  </h4>
                  <p className="text-sm text-subheading">
                    {currentSong["Tribe Name"]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded-full transition-colors ${
                    isShuffle
                      ? "text-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "text-gray-400"
                  }`}
                >
                  <Shuffle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-2 rounded-full transition-colors ${
                    showPlaylist
                      ? "text-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "text-gray-400"
                  }`}
                >
                  <ListMusic className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsPlayerVisible(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <SkipBack className="h-5 w-5 text-heading" />
              </button>

              <button
                onClick={() => handlePlayPause()}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:shadow-lg transition-all"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <SkipForward className="h-5 w-5 text-heading" />
              </button>

              <div className="flex-grow flex items-center gap-2">
                <span className="text-sm text-gray-500">{currentTime}</span>
                <div
                  className="flex-grow h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {currentSong["Duration"]}
                </span>
              </div>

              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-heading" />
                ) : (
                  <Volume2 className="h-5 w-5 text-heading" />
                )}
              </button>
            </div>
          </div>

          {/* Playlist */}
          {showPlaylist && (
            <div className="max-h-64 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
              {songs.map((song, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentSongIndex(index);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    currentSongIndex === index
                      ? "bg-gray-50 dark:bg-gray-700"
                      : ""
                  }`}
                >
                  <img
                    src={song["Thumb Image Link"]}
                    alt={song["Music Name"]}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-grow">
                    <h5 className="font-medium text-heading">
                      {song["title"]}
                    </h5>
                    <p className="text-sm text-subheading">
                      {song["Tribe Name"]}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {song["Duration"]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {songs.length > 0 && (
        <audio
          ref={audioRef}
          src={currentSong["file_path"]}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNext}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
