import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { CategorySidebar, SidebarCategory } from '../shared/CategorySidebar';
import { VOD_CATEGORIES, INITIAL_VIDEOS, formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { Video } from '../../types';
import { HeroCarousel } from './HeroCarousel';

export const VODPage: React.FC = () => {
  const navigate = useNavigate();
  const { continueWatching, savedVideos, getVideoProgress } = useLibrary();
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');

  // Helper to calculate progress percentage
  const getProgressPercent = (videoId: string, duration: number): number => {
    const historyItem = getVideoProgress(videoId);
    if (!historyItem) return 0;
    if (historyItem.completed) return 100;
    return Math.round((historyItem.timestamp / duration) * 100);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Convert VOD categories to sidebar format
  const sidebarCategories: SidebarCategory[] = useMemo(() => {
    return VOD_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      count: cat.id === 'continue'
        ? continueWatching.length
        : INITIAL_VIDEOS.filter(cat.filter).length,
    }));
  }, [continueWatching.length]);

  // Get videos for selected category
  const getVideosForCategory = (categoryId: string): Video[] => {
    if (categoryId === 'continue') {
      return continueWatching
        .map(h => INITIAL_VIDEOS.find(v => v.id === h.videoId))
        .filter(Boolean) as Video[];
    }
    const category = VOD_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return [];
    return INITIAL_VIDEOS.filter(category.filter);
  };

  const selectedVideos = getVideosForCategory(selectedCategory);
  const selectedCategoryData = VOD_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-14 bottom-0 z-40">
          <CategorySidebar
            categories={sidebarCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            title="Discover"
            accentColor="#F5C518"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-56 min-h-screen">
          {/* Category Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{selectedCategoryData?.icon}</span>
              <h1 className="text-3xl font-bold text-white">{selectedCategoryData?.name}</h1>
            </div>
            {selectedCategoryData?.description && (
              <p className="text-[#9CA3AF]">{selectedCategoryData.description}</p>
            )}
          </div>

          {/* Hero Carousel for Featured */}
          {selectedCategory === 'featured' && (
            <div className="mb-8">
              <HeroCarousel videos={selectedVideos.slice(0, 8)} />
            </div>
          )}

          {/* Video Grid */}
          <div className="px-8 pb-16">
            {selectedCategory !== 'featured' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {selectedVideos.map(video => (
                  <VODCard
                    key={video.id}
                    video={video}
                    progress={getProgressPercent(video.id, video.duration)}
                    onClick={() => navigate(`/watch/${video.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-10">
                {/* Most Popular Row */}
                <ContentRowSection
                  title="Most Popular"
                  videos={INITIAL_VIDEOS.slice(0, 10)}
                  onVideoClick={(v) => navigate(`/watch/${v.id}`)}
                  getProgressPercent={getProgressPercent}
                />

                {/* YC Content Row */}
                <ContentRowSection
                  title="YC Startup School"
                  videos={INITIAL_VIDEOS.filter(v => v.tags.includes('y-combinator')).slice(0, 10)}
                  onVideoClick={(v) => navigate(`/watch/${v.id}`)}
                  getProgressPercent={getProgressPercent}
                />

                {/* Mindset Row */}
                <ContentRowSection
                  title="Founder Mindset"
                  videos={INITIAL_VIDEOS.filter(v => v.tags.includes('mindset') || v.tags.includes('inspiration')).slice(0, 10)}
                  onVideoClick={(v) => navigate(`/watch/${v.id}`)}
                  getProgressPercent={getProgressPercent}
                />

                {/* Deep Dives Row */}
                <ContentRowSection
                  title="Deep Dives"
                  videos={INITIAL_VIDEOS.filter(v => v.duration >= 1800).slice(0, 10)}
                  onVideoClick={(v) => navigate(`/watch/${v.id}`)}
                  getProgressPercent={getProgressPercent}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Featured Row with large cards
interface FeaturedRowProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
}

const FeaturedRow: React.FC<FeaturedRowProps> = ({ videos, onVideoClick }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {videos.map((video, index) => (
        <button
          key={video.id}
          onClick={() => onVideoClick(video)}
          className={`relative rounded-xl overflow-hidden group ${
            index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
          }`}
        >
          <div className={`aspect-video ${index === 0 ? 'lg:aspect-[4/3]' : ''}`}>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className={`font-bold text-white mb-1 line-clamp-2 ${index === 0 ? 'text-xl lg:text-2xl' : 'text-sm'}`}>
              {video.title}
            </h3>
            <p className="text-xs text-white/70">{video.expert}</p>
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded text-xs font-medium text-white">
            {formatDuration(video.duration)}
          </div>
        </button>
      ))}
    </div>
  );
};

// Content Row with horizontal scroll
interface ContentRowSectionProps {
  title: string;
  videos: Video[];
  onVideoClick: (video: Video) => void;
  getProgressPercent: (videoId: string, duration: number) => number;
}

const ContentRowSection: React.FC<ContentRowSectionProps> = ({
  title,
  videos,
  onVideoClick,
  getProgressPercent,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 translate-y-2 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-r-lg transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 translate-y-2 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-l-lg transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map(video => (
          <VODCard
            key={video.id}
            video={video}
            progress={getProgressPercent(video.id, video.duration)}
            onClick={() => onVideoClick(video)}
            className="flex-shrink-0 w-48"
          />
        ))}
      </div>
    </div>
  );
};

// VOD Card Component
interface VODCardProps {
  video: Video;
  progress?: number;
  onClick: () => void;
  className?: string;
}

const VODCard: React.FC<VODCardProps> = ({ video, progress = 0, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`group text-left ${className}`}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-medium text-white">
          {formatDuration(video.duration)}
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-[#F5C518]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#F5C518] transition-colors">
        {video.title}
      </h3>
      <p className="text-xs text-[#6B7280] mt-0.5">{video.expert}</p>
    </button>
  );
};

export default VODPage;
