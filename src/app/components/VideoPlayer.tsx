"use client";

import { useRef, useEffect, useState } from "react";
import { getImageUrl } from "@/lib/utils";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from "react-icons/fa";

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, posterUrl, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Set video to unmuted by default and cleanup
  useEffect(() => {
    if (videoRef.current) {
      // Ensure audio is enabled
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
      
      // Force enable audio
      if (!isMuted && volume > 0) {
        videoRef.current.muted = false;
      }
    }

    // Cleanup function to pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [volume, isMuted]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle click to play/pause with proper error handling
  const handleVideoClick = async () => {
    if (!videoRef.current || isLoading) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        // Check if video is ready to play
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play();
          setIsPlaying(true);
        } else {
          // Wait for video to be ready
          videoRef.current.addEventListener('canplay', async () => {
            try {
              await videoRef.current?.play();
              setIsPlaying(true);
            } catch (error) {
              console.warn('Video play error after canplay:', error);
            }
          }, { once: true });
        }
      }
    } catch (error) {
      console.warn('Video play/pause error:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      
      // If unmuting, ensure volume is set
      if (!newMutedState && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
      videoRef.current.muted = newVolume === 0;
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle duration change
  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle video play/pause events
  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  // Handle video errors
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('Video error:', e);
    setIsPlaying(false);
    setIsLoading(false);
  };

  // Process poster URL through getImageUrl
  const processedPosterUrl = posterUrl 
    ? getImageUrl(posterUrl, "/placeholder-course.jpg") 
    : "/placeholder-course.jpg";

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/9] bg-gray-900 rounded-md sm:rounded-lg md:rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={processedPosterUrl}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleDurationChange}
        preload="metadata"
        onClick={handleVideoClick}
        playsInline
        controls={false}
      >
        <source src={getImageUrl(videoUrl)} type="video/mp4" />
        <source src={getImageUrl(videoUrl)} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Custom Controls - Always visible when playing, show on hover when paused */}
      <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {/* Progress Bar */}
        <div className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 pointer-events-auto">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 sm:h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4a8a8a 0%, #4a8a8a ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.2) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-black/40 backdrop-blur-md pointer-events-auto">
          {/* Left Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleVideoClick(); }}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              {isLoading ? (
                <div className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <FaPause className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white" />
              ) : (
                <FaPlay className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white ml-0.5" />
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                {isMuted ? (
                  <FaVolumeMute className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white" />
                ) : (
                  <FaVolumeUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => { e.stopPropagation(); handleVolumeChange(e); }}
                className="hidden sm:block w-16 md:w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4a8a8a 0%, #4a8a8a ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>

            {/* Time Display */}
            <div className="text-white text-xs sm:text-sm font-medium px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 bg-black/30 rounded-md sm:rounded-lg border border-white/10">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Fullscreen Button */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              {isFullscreen ? (
                <FaCompress className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white" />
              ) : (
                <FaExpand className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Center Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <button
            onClick={handleVideoClick}
            className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#4a8a8a]/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#5a9a9a] transition-all duration-200 hover:scale-110 border-2 border-white/20"
          >
            {isLoading ? (
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaPlay className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white ml-0.5 sm:ml-1" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
