import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = ({ musicData }) => {

  console.log(musicData)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* <audio 
        ref={audioRef}
        src={musicData["link"]}
        preload="metadata"
      /> */}
      
      {/* Thumbnail and Info */}
      <div className="relative">
        {/* <img 
          src={musicData["Thumb Image Link"]} 
          alt={musicData["Music Name"]}
          className="w-full h-48 object-cover"
        /> */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          {/* <h3 className="text-lg font-semibold">{musicData["Music Name"]}</h3> */}
          {/* <p className="text-sm">{musicData["Singer Name"]} • {musicData["Tribe Name"]}</p> */}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        {/* Progress Bar */}
        <div 
          className="h-1 bg-gray-200 rounded cursor-pointer mb-4"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-blue-500 rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{formatTime(currentTime)}</span>
          {/* <span>{musicData.Duration}</span> */}
        </div>

        {/* Play/Pause and Volume Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={togglePlay}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-gray-800" />
            ) : (
              <Play className="w-8 h-8 text-gray-800" />
            )}
          </button>

          <button 
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-gray-800" />
            ) : (
              <Volume2 className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;