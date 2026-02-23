import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Video, Course, HeroCarouselItem } from '../../types';
import { formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

interface HeroCarouselProps {
  items: HeroCarouselItem[];
  autoPlayInterval?: number;
}

// Helper to extract display properties from video or course
const getItemDisplayProps = (carouselItem: HeroCarouselItem) => {
  if (carouselItem.type === 'video') {
    const video = carouselItem.item;
    return {
      id: video.id,
      title: video.title,
      subtitle: video.expert,
      thumbnail: video.thumbnail,
      duration: formatDuration(video.duration),
      tags: video.tags,
      navigateTo: `/watch/${video.id}`,
      actionLabel: 'Watch Now',
      badgeLabel: 'Featured',
      itemType: 'video' as const,
    };
  } else {
    const course = carouselItem.item;
    return {
      id: course.id,
      title: course.title,
      subtitle: course.instructor || course.topic,
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
}) => {
  const navigate = useNavigate();
  const { toggleSaveVideo, isVideoSaved } = useLibrary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  if (!currentItem || !displayProps) return null;

  const isVideo = displayProps.itemType === 'video';
  const badgeColor = isVideo ? '#F5C518' : '#8B5CF6';

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
          style={{ backgroundImage: `url(${displayProps.thumbnail})` }}
        >
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12] via-[#0D0D12]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-[#0D0D12]/30" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl ml-8 md:ml-16 pr-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{
                backgroundColor: `${badgeColor}20`,
                borderWidth: 1,
                borderColor: `${badgeColor}66`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: badgeColor }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: badgeColor }}
              >
                {displayProps.badgeLabel}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {displayProps.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-sm text-white/70 mb-4">
              <span className="text-white font-medium">{displayProps.subtitle}</span>
              <span>•</span>
              <span>{displayProps.duration}</span>
              {displayProps.tags.slice(0, 2).map(tag => (
                <React.Fragment key={tag}>
                  <span>•</span>
                  <span className="capitalize">{tag}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(displayProps.navigateTo)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${
                  isVideo
                    ? 'bg-[#F5C518] text-black hover:bg-[#F5C518]/90'
                    : 'bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                {displayProps.actionLabel}
              </button>
              {isVideo && (
                <button
                  onClick={() => toggleSaveVideo(currentItem.item.id)}
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
              )}
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
          {items.map((item, index) => {
            const thumbProps = getItemDisplayProps(item);
            const ringColor = thumbProps.itemType === 'video' ? '#F5C518' : '#8B5CF6';
            return (
              <button
                key={thumbProps.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'w-24 h-14'
                    : 'opacity-60 hover:opacity-100 w-20 h-12'
                }`}
                style={index === currentIndex ? {
                  boxShadow: `0 0 0 2px ${ringColor}`,
                } : undefined}
              >
                <img
                  src={thumbProps.thumbnail}
                  alt={thumbProps.title}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `${ringColor}33` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dot Indicators (for mobile) */}
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {items.map((item, index) => {
            const dotColor = getItemDisplayProps(item).itemType === 'video' ? '#F5C518' : '#8B5CF6';
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentIndex ? dotColor : 'rgba(255,255,255,0.4)',
                  width: index === currentIndex ? '24px' : '8px',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
