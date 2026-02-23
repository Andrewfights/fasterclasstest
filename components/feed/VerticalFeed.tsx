import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, ChevronUp, ChevronDown, X, Play, Volume2, VolumeX } from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration } from '../../constants';
import { filterValidVideos } from '../../services/videoValidationService';
import { usePiP } from '../../contexts/PiPContext';

type Category = 'all' | 'mindset' | 'business' | 'motivation' | 'startup';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'business', label: 'Business' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'startup', label: 'Startup' },
];

export const VerticalFeed: React.FC = () => {
  const navigate = useNavigate();
  const { isActive: isPiPActive, pausePiP, resumePiP, isPaused: wasPiPPaused } = usePiP();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pipWasActiveRef = useRef(false);

  // Pause PiP when entering Shorts, resume when leaving
  useEffect(() => {
    if (isPiPActive && !wasPiPPaused) {
      pipWasActiveRef.current = true;
      pausePiP();
    }

    return () => {
      // Resume PiP when leaving Shorts (if it was active)
      if (pipWasActiveRef.current) {
        resumePiP();
        pipWasActiveRef.current = false;
      }
    };
  }, [isPiPActive, wasPiPPaused, pausePiP, resumePiP]);

  // Get validated shorts videos
  const shortsVideos = useMemo(() => {
    const allShorts = filterValidVideos(INITIAL_VIDEOS).filter(v => v.isVertical === true);
    return allShorts;
  }, []);

  // Filter by category
  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return shortsVideos;
    return shortsVideos.filter(v =>
      v.tags.some(tag => tag.toLowerCase().includes(selectedCategory))
    );
  }, [shortsVideos, selectedCategory]);

  const currentVideo = filteredVideos[currentIndex];

  // Navigate to next/previous video
  const goToNext = useCallback(() => {
    if (currentIndex < filteredVideos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, filteredVideos.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'm':
          e.preventDefault();
          setIsMuted(prev => !prev);
          break;
        case 'Escape':
          navigate(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, navigate]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // Wheel scroll handling with debounce
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (wheelTimeout.current) return;

    if (e.deltaY > 30) {
      goToNext();
    } else if (e.deltaY < -30) {
      goToPrevious();
    }

    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = null;
    }, 500);
  }, [goToNext, goToPrevious]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Build YouTube embed URL
  const getEmbedUrl = useCallback((video: typeof currentVideo) => {
    if (!video) return '';
    const videoId = video.embedUrl.split('/').pop()?.split('?')[0];
    const autoplay = isPlaying ? '1' : '0';
    const mute = isMuted ? '1' : '0';
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`;
  }, [isPlaying, isMuted]);

  if (filteredVideos.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-14 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">No shorts available</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#c9a227] text-black font-semibold rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-14">
      {/* Header with categories */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent pb-4">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-white font-semibold">Shorts</h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main feed container */}
      <div
        ref={containerRef}
        className="h-screen snap-y snap-mandatory overflow-hidden pt-24"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div className="h-full flex items-center justify-center relative">
          {/* Video container - vertical aspect ratio */}
          <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '9/16', maxHeight: 'calc(100vh - 180px)' }}>
            {currentVideo && (
              <>
                {/* YouTube Embed */}
                <div className="absolute inset-0 bg-[#1A1A24] rounded-2xl overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    key={`${currentVideo.id}-${isPlaying}-${isMuted}`}
                    src={getEmbedUrl(currentVideo)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  />
                </div>

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none rounded-b-2xl" />

                {/* Video info overlay */}
                <div className="absolute bottom-0 left-0 right-16 p-4">
                  <p className="text-white font-semibold text-sm mb-1">@{currentVideo.expert}</p>
                  <p className="text-white/80 text-sm line-clamp-2">{currentVideo.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-white/60 text-xs">{formatDuration(currentVideo.duration)}</span>
                    {currentVideo.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-white/40 text-xs">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Control buttons */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Side actions */}
          <div className="absolute right-4 bottom-1/3 flex flex-col gap-5">
            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-white/60 text-xs">Like</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-white/60 text-xs">Comment</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <Bookmark className="w-6 h-6" />
              </div>
              <span className="text-white/60 text-xs">Save</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-white/60 text-xs">Share</span>
            </button>
          </div>

          {/* Navigation arrows */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full transition-colors ${
                currentIndex === 0
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= filteredVideos.length - 1}
              className={`p-2 rounded-full transition-colors ${
                currentIndex >= filteredVideos.length - 1
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            {filteredVideos.slice(0, 10).map((_, idx) => (
              <div
                key={idx}
                className={`w-1 h-4 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/20'
                }`}
              />
            ))}
            {filteredVideos.length > 10 && (
              <span className="text-white/40 text-[8px]">+{filteredVideos.length - 10}</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
          <span className="text-white/60 text-sm">
            {currentIndex + 1} / {filteredVideos.length}
          </span>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="fixed bottom-20 left-4 text-white/30 text-xs hidden md:block">
        <p>↑↓ or J/K: Navigate</p>
        <p>Space: Play/Pause</p>
        <p>M: Mute/Unmute</p>
        <p>ESC: Exit</p>
      </div>
    </div>
  );
};

export default VerticalFeed;
