import React, { useState, useEffect, useCallback } from 'react';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroCarouselItem, Course, Video } from '../../types';
import { formatDuration } from '../../constants';
import { InstructorGrid } from './InstructorGrid';

interface Instructor {
  name: string;
  image: string;
  topic?: string;
}

interface SplitHeroProps {
  carouselItems: HeroCarouselItem[];
  instructors: Instructor[];
  autoPlayInterval?: number;
  onPlayClick?: () => void;
  onMoreInfo?: (item: HeroCarouselItem) => void;
  onInstructorClick?: () => void;
}

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
      badgeLabel: 'Course',
      itemType: 'course' as const,
    };
  }
};

export const SplitHero: React.FC<SplitHeroProps> = ({
  carouselItems,
  instructors,
  autoPlayInterval = 8000,
  onPlayClick,
  onMoreInfo,
  onInstructorClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const currentItem = carouselItems[currentIndex];
  const displayProps = currentItem ? getItemDisplayProps(currentItem) : null;

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || carouselItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, carouselItems.length, autoPlayInterval]);

  // Trigger entrance animation on slide change
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [currentIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  }, [carouselItems.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  }, [carouselItems.length]);

  if (!currentItem || !displayProps) return null;

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-4 h-[calc(100vh-120px)] min-h-[600px]">
          {/* Left: Carousel */}
          <div
            className="lg:col-span-3 relative rounded-2xl overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{ backgroundImage: `url(${displayProps.thumbnail})` }}
            />

            {/* Gradient Overlays */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)',
              }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-12">
              <div
                key={animationKey}
                className="max-w-lg"
                style={{ animation: 'fadeUp 0.6s ease-out forwards' }}
              >
                {/* Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="mc-label px-3 py-1 rounded bg-[#c9a227]/20 text-[#c9a227]">
                    {displayProps.badgeLabel}
                  </span>
                  <span className="text-sm text-white/60 capitalize">
                    {displayProps.tags[0]}
                  </span>
                </div>

                {/* Title */}
                <h1 className="mc-heading text-4xl lg:text-5xl xl:text-6xl text-white mb-4">
                  {displayProps.title}
                </h1>

                {/* Description */}
                <p className="text-white/80 text-base lg:text-lg mb-4 line-clamp-2 leading-relaxed">
                  {displayProps.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-white/50 mb-6">
                  <span className="text-white/70">{displayProps.subtitle}</span>
                  <span>•</span>
                  <span>{displayProps.duration}</span>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onPlayClick}
                    className="flex items-center gap-3 px-8 py-4 bg-[#c9a227] text-black font-bold rounded-lg hover:bg-[#d4af37] transition-colors text-lg"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Start Free
                  </button>
                  <button
                    onClick={() => onMoreInfo?.(currentItem)}
                    className="flex items-center gap-3 px-6 py-4 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                  >
                    <Info className="w-5 h-5" />
                    More Info
                  </button>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-8 left-8 lg:left-12 right-8 lg:right-12">
                <div className="flex gap-1 max-w-sm">
                  {carouselItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="flex-1 h-1 rounded-full overflow-hidden bg-white/30 hover:bg-white/40 transition-colors"
                    >
                      {index === currentIndex && (
                        <div
                          className="h-full rounded-full bg-[#c9a227]"
                          style={{
                            animation: isPaused ? 'none' : `progressFill ${autoPlayInterval}ms linear forwards`,
                          }}
                        />
                      )}
                      {index < currentIndex && (
                        <div className="h-full w-full rounded-full bg-[#c9a227]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {carouselItems.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: Instructor Grid */}
          <div className="lg:col-span-2 hidden lg:block">
            <InstructorGrid
              instructors={instructors}
              onInstructorClick={onInstructorClick}
            />
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default SplitHero;
