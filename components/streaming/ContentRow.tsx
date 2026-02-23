import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Video } from '../../types';
import { VideoCard } from './VideoCard';

interface ContentRowProps {
  title: string;
  videos: Video[];
  showProgress?: boolean;
  onSeeAll?: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  videos,
  showProgress = false,
  onSeeAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm font-medium transition-colors mr-2"
            >
              See All
            </button>
          )}
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-[#1E1E2E] text-white hover:bg-[#2E2E3E] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-[#1E1E2E] text-white hover:bg-[#2E2E3E] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            showProgress={showProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentRow;
