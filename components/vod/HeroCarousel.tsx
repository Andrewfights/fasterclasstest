import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Video } from '../../types';
import { formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

interface HeroCarouselProps {
  videos: Video[];
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  videos,
  autoPlayInterval = 8000,
}) => {
  const navigate = useNavigate();
  const { toggleSaveVideo, isVideoSaved } = useLibrary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentVideo = videos[currentIndex];
  const isSaved = currentVideo ? isVideoSaved(currentVideo.id) : false;

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || videos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, videos.length, autoPlayInterval]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  if (!currentVideo) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Background */}
      <div className="relative aspect-[21/9] min-h-[400px] max-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
        >
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12] via-[#0D0D12]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-[#0D0D12]/30" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl ml-8 md:ml-16 pr-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5C518]/20 border border-[#F5C518]/40 rounded-full mb-4">
              <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-[#F5C518] uppercase tracking-wide">
                Featured
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {currentVideo.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-sm text-white/70 mb-4">
              <span className="text-white font-medium">{currentVideo.expert}</span>
              <span>•</span>
              <span>{formatDuration(currentVideo.duration)}</span>
              {currentVideo.tags.slice(0, 2).map(tag => (
                <React.Fragment key={tag}>
                  <span>•</span>
                  <span className="capitalize">{tag}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/watch/${currentVideo.id}`)}
                className="flex items-center gap-2 px-6 py-3 bg-[#F5C518] text-black font-semibold rounded-lg hover:bg-[#F5C518]/90 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </button>
              <button
                onClick={() => toggleSaveVideo(currentVideo.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                  isSaved
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-5 h-5" />
                    In My List
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    My List
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
          style={{ opacity: isPaused ? 1 : 0 }}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors opacity-0 hover:opacity-100"
          style={{ opacity: isPaused ? 1 : 0 }}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="absolute bottom-4 left-0 right-0 px-8 md:px-16">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-[#F5C518] w-24 h-14'
                  : 'opacity-60 hover:opacity-100 w-20 h-12'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-[#F5C518]/20" />
              )}
            </button>
          ))}
        </div>

        {/* Dot Indicators (for mobile) */}
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#F5C518] w-6'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
