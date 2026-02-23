import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2, Play, Pause, Volume2, VolumeX, Heart } from 'lucide-react';
import { usePiP } from '../contexts/PiPContext';
import { useLibrary } from '../contexts/LibraryContext';
import { getYoutubeId } from '../constants';

export const PiPPlayer: React.FC = () => {
  const {
    isActive,
    video,
    currentTime,
    isPlaying,
    isMinimized,
    isPaused,
    disablePiP,
    updateCurrentTime,
    setIsPlaying,
    toggleMinimize,
    expandToFull,
  } = usePiP();
  const { isFavorited, toggleFavorite } = useLibrary();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<number | null>(null);

  // Calculate progress percentage
  useEffect(() => {
    if (video && video.duration > 0) {
      setProgress((currentTime / video.duration) * 100);
    }
  }, [currentTime, video]);

  // Handle pause/resume when isPaused changes
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPaused) {
      playerRef.current.pauseVideo();
    } else if (isActive && video) {
      playerRef.current.playVideo();
    }
  }, [isPaused, isActive, video]);

  // Initialize YouTube player
  useEffect(() => {
    if (!isActive || !video) return;

    const videoId = getYoutubeId(video.embedUrl);
    if (!videoId) return;

    // Ensure YouTube API is loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('pip-youtube-player', {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          start: Math.floor(video.startTime || currentTime || 0),
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            // Ensure volume is on by default
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.unMute();
              event.target.setVolume(100);
            }
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              // Start tracking progress
              progressInterval.current = window.setInterval(() => {
                if (playerRef.current) {
                  const time = playerRef.current.getCurrentTime();
                  updateCurrentTime(time);
                }
              }, 1000);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
              }
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
              }
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isActive, video?.embedUrl]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  // Don't render if not active, no video, or paused (e.g., on Shorts page)
  if (!isActive || !video || isPaused) return null;

  const isFav = video ? isFavorited(video.videoId) : false;

  // Minimized state - compact audio bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 z-[60] bg-[#1A1A24] rounded-xl border border-white/10 shadow-2xl overflow-hidden w-80">
        <div className="flex items-center gap-3 p-3">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{video.title}</p>
            <p className="text-xs text-[#9CA3AF] truncate">{video.expert}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(video.videoId); }}
              className={`p-2 rounded-lg transition-colors ${isFav ? 'bg-red-500/20 text-red-500' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); disablePiP(); }}
              className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-[#2E2E3E]">
          <div
            className="h-full bg-[#F5C518] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Full PiP window
  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 right-4 z-[60] bg-black rounded-xl shadow-2xl overflow-hidden border border-white/10"
      style={{ width: 320, height: 180 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* YouTube Player */}
      <div id="pip-youtube-player" className="w-full h-full" />

      {/* Always visible X and Fullscreen buttons - top right */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); expandToFull(); }}
          className="p-2 bg-black/70 hover:bg-black/90 rounded-lg transition-colors"
          title="Full Screen"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); disablePiP(); }}
          className="p-2 bg-black/70 hover:bg-red-500/80 rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Controls Overlay - shows on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Title bar */}
        <div className="absolute top-0 left-0 right-20 p-2 z-10">
          <p className="text-xs font-medium text-white truncate">{video.title}</p>
        </div>

        {/* Center play/pause */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm pointer-events-auto"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white" />
            )}
          </button>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(video.videoId); }}
              className={`p-1 rounded transition-colors pointer-events-auto ${isFav ? 'text-red-500' : 'text-white hover:bg-white/20'}`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="p-1 hover:bg-white/20 rounded transition-colors pointer-events-auto"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
              className="p-1 hover:bg-white/20 rounded transition-colors pointer-events-auto"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
            <span className="text-[10px] text-white/70 flex-1 truncate">
              {video.expert}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5C518] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiPPlayer;
