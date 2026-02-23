import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Video, Course, HeroCarouselItem } from '../../types';
import { formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

interface HeroCarouselProps {
  items: HeroCarouselItem[];
  autoPlayInterval?: number;
  variant?: 'default' | 'landing';
  size?: 'default' | 'compact';
  onMoreInfo?: (item: HeroCarouselItem) => void;
  onPlayClick?: (item: HeroCarouselItem) => void;
}

// Helper to extract display properties from video or course
const getItemDisplayProps = (carouselItem: HeroCarouselItem) => {
  if (carouselItem.type === 'video') {
    const video = carouselItem.item;
    return {
      id: video.id,
      title: video.title,
      subtitle: video.expert,
      description: `Learn from ${video.expert} in this insightful session about ${video.tags[0] || 'startups'}.`,
      thumbnail: video.thumbnail,
      duration: formatDuration(video.duration),
      tags: video.tags,
      navigateTo: `/watch/${video.id}`,
      actionLabel: 'Play',
      badgeLabel: 'Featured',
      itemType: 'video' as const,
    };
  } else {
    const course = carouselItem.item;
    return {
      id: course.id,
      title: course.title,
      subtitle: course.instructor || course.topic,
      description: course.description,
      thumbnail: course.coverImage,
      duration: `${course.videoIds.length} sessions`,
      tags: [course.topic],
      navigateTo: `/course/${course.id}`,
      actionLabel: 'Start Course',
      badgeLabel: 'Course',
      itemType: 'course' as const,
    };
  }
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  autoPlayInterval = 8000,
  variant = 'default',
  size = 'default',
  onMoreInfo,
  onPlayClick,
}) => {
  const navigate = useNavigate();
  const { toggleSaveVideo, isVideoSaved } = useLibrary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const OVERLAY_HIDE_DELAY = 5000; // 5 seconds

  const currentItem = items[currentIndex];
  const displayProps = currentItem ? getItemDisplayProps(currentItem) : null;
  const isSaved = currentItem && currentItem.type === 'video'
    ? isVideoSaved(currentItem.item.id)
    : false;

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, items.length, autoPlayInterval]);

  // Trigger entrance animation on slide change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Auto-hide overlay logic
  useEffect(() => {
    const startHideTimer = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, OVERLAY_HIDE_DELAY);
    };

    const handleMouseMove = () => {
      setShowOverlay(true);
      startHideTimer();
    };

    // Start timer on mount
    startHideTimer();

    // Listen for mouse movement on the container
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Reset overlay visibility when slide changes
  useEffect(() => {
    setShowOverlay(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, OVERLAY_HIDE_DELAY);
  }, [currentIndex]);

  if (!currentItem || !displayProps) return null;

  const isVideo = displayProps.itemType === 'video';
  // Use Masterclass gold for landing variant
  const accentColor = variant === 'landing' ? '#c9a227' : isVideo ? '#F5C518' : '#8B5CF6';

  return (
    <div
      ref={containerRef}
      className="relative w-full group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Background - full width, fixed height */}
      <div className={`relative w-full overflow-hidden ${
        size === 'compact'
          ? 'h-[40vh] min-h-[280px] max-h-[400px]'
          : 'h-[60vh] min-h-[400px] sm:min-h-[500px] md:min-h-[550px] max-h-[700px]'
      }`}>
        {/* Background Image with smooth transition */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url(${displayProps.thumbnail})` }}
        />

        {/* Gradient Overlays - centered vignette for both variants */}
        {/* Center-focused vignette gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)'
          }}
        />
        {/* Bottom gradient for page blend */}
        <div
          className="absolute inset-0"
          style={{
            background: variant === 'landing'
              ? 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.8) 20%, transparent 50%)'
              : 'linear-gradient(to top, #0D0D12 0%, rgba(13,13,18,0.8) 20%, transparent 50%)'
          }}
        />
        {/* Top vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(13,13,18,0.3) 0%, transparent 15%)'
          }}
        />

        {/* Content - centered on both variants - with auto-hide */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div
            key={animationKey}
            className={`animate-fade-up text-center px-4 sm:px-6 md:px-8 ${size === 'compact' ? 'max-w-xl' : 'max-w-2xl'}`}
            style={{
              animation: 'fadeUp 0.6s ease-out forwards',
            }}
          >
            {/* Category Badge - Masterclass style label */}
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 justify-center">
              <span
                className="mc-label px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                {displayProps.badgeLabel}
              </span>
              <span className="text-xs sm:text-sm text-white/60 capitalize">
                {displayProps.tags[0]}
              </span>
            </div>

            {/* Title - Masterclass serif style, responsive sizing */}
            <h1 className={`mc-heading text-white leading-tight ${
              size === 'compact'
                ? 'text-xl sm:text-2xl md:text-3xl mb-2'
                : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 sm:mb-4'
            }`}>
              {displayProps.title}
            </h1>

            {/* Description - hidden on very small screens and in compact mode */}
            {size !== 'compact' && (
              <p className="hidden sm:block text-sm md:text-base lg:text-lg text-white/80 mb-3 sm:mb-4 line-clamp-2 leading-relaxed max-w-lg mx-auto">
                {displayProps.description}
              </p>
            )}

            {/* Compact metadata */}
            <div className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/50 justify-center ${size === 'compact' ? 'mb-3' : 'mb-4 sm:mb-6'}`}>
              <span className="font-medium text-white/70">{displayProps.subtitle}</span>
              <span>•</span>
              <span>{displayProps.duration}</span>
            </div>

            {/* Netflix-style Buttons - responsive */}
            <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
              {/* Primary Play Button */}
              <button
                onClick={() => {
                  if (variant === 'landing' && onPlayClick) {
                    onPlayClick(currentItem);
                  } else {
                    navigate(displayProps.navigateTo);
                  }
                }}
                className={`flex items-center gap-2 font-bold rounded-md transition-all ${
                  size === 'compact'
                    ? 'px-4 py-2.5 text-sm'
                    : 'sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg'
                } ${
                  variant === 'landing'
                    ? 'bg-[#c9a227] text-black hover:bg-[#d4af37]'
                    : isVideo
                      ? 'bg-white text-[#0D0D12] hover:bg-white/90'
                      : 'bg-[#c9a227] text-black hover:bg-[#d4af37]'
                }`}
              >
                <Play className={`fill-current ${size === 'compact' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'}`} />
                <span>{variant === 'landing' ? 'Start Free' : displayProps.actionLabel}</span>
              </button>

              {/* More Info Button */}
              <button
                onClick={() => {
                  if (onMoreInfo) {
                    onMoreInfo(currentItem);
                  } else {
                    navigate(displayProps.navigateTo);
                  }
                }}
                className={`flex items-center gap-2 bg-white/20 text-white font-semibold rounded-md hover:bg-white/30 transition-all backdrop-blur-sm ${
                  size === 'compact'
                    ? 'px-4 py-2.5 text-sm'
                    : 'sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base'
                }`}
              >
                <Info className={size === 'compact' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} />
                <span>{size === 'compact' ? 'Info' : <><span className="hidden sm:inline">More Info</span><span className="sm:hidden">Info</span></>}</span>
              </button>

              {/* My List Button - hidden on mobile and in compact mode */}
              {isVideo && variant === 'default' && size !== 'compact' && (
                <button
                  onClick={() => toggleSaveVideo(currentItem.item.id)}
                  className={`hidden sm:flex p-3 sm:p-4 rounded-full border-2 transition-all ${
                    isSaved
                      ? 'bg-white/20 border-white text-white'
                      : 'border-white/50 text-white/70 hover:border-white hover:text-white'
                  }`}
                >
                  {isSaved ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows - visible on hover and when overlay is shown */}
        {items.length > 1 && (
          <div className={`transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar Navigation - Netflix style, centered - with auto-hide */}
      <div className={`absolute bottom-8 left-0 right-0 flex justify-center px-8 transition-opacity duration-500 ${
        showOverlay ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex gap-1 max-w-md w-full">
          {items.map((item, index) => {
            // Use gold for landing variant, otherwise video/course colors
            const itemColor = variant === 'landing'
              ? '#c9a227'
              : getItemDisplayProps(item).itemType === 'video' ? '#F5C518' : '#8B5CF6';
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;

            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="flex-1 h-1 rounded-full overflow-hidden bg-white/30 hover:bg-white/40 transition-colors relative"
                title={getItemDisplayProps(item).title}
              >
                {/* Progress fill for active item */}
                {isActive && (
                  <div
                    className="h-full rounded-full absolute inset-0"
                    style={{
                      backgroundColor: itemColor,
                      animation: isPaused ? 'none' : `progressFill ${autoPlayInterval}ms linear forwards`,
                    }}
                  />
                )}
                {/* Completed indicator for past items */}
                {isPast && (
                  <div
                    className="h-full w-full rounded-full"
                    style={{ backgroundColor: itemColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
