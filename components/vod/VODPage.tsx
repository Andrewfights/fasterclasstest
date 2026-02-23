import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Film, Smartphone } from 'lucide-react';
import { CategorySidebar, SidebarCategory } from '../shared/CategorySidebar';
import { VOD_CATEGORIES, INITIAL_VIDEOS, formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { Video, HeroCarouselItem } from '../../types';
import { HeroCarousel } from './HeroCarousel';
import { filterValidVideos } from '../../services/videoValidationService';

type ContentFormat = 'long' | 'short';

export const VODPage: React.FC = () => {
  const navigate = useNavigate();
  const { continueWatching, savedVideos, getVideoProgress } = useLibrary();
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');
  const [contentFormat, setContentFormat] = useState<ContentFormat>('long');

  // Get all valid videos first
  const validVideos = useMemo(() => filterValidVideos(INITIAL_VIDEOS), []);

  // Filter videos based on content format
  const formatFilteredVideos = useMemo(() => {
    if (contentFormat === 'short') {
      return validVideos.filter(v => v.isVertical === true || v.duration <= 120);
    }
    return validVideos.filter(v => !v.isVertical && v.duration > 120);
  }, [contentFormat, validVideos]);

  // Get shorts for the shorts section
  const shortsVideos = useMemo(() => {
    return validVideos.filter(v => v.isVertical === true || v.duration <= 120);
  }, [validVideos]);

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
        : validVideos.filter(cat.filter).length,
    }));
  }, [continueWatching.length, validVideos]);

  // Get videos for selected category (filtered by content format and validity)
  const getVideosForCategory = (categoryId: string): Video[] => {
    if (categoryId === 'continue') {
      return continueWatching
        .map(h => formatFilteredVideos.find(v => v.id === h.videoId))
        .filter(Boolean) as Video[];
    }
    const category = VOD_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return [];
    return formatFilteredVideos.filter(category.filter);
  };

  const selectedVideos = getVideosForCategory(selectedCategory);
  const selectedCategoryData = VOD_CATEGORIES.find(c => c.id === selectedCategory);

  // Mobile category sections for scroll-to functionality
  const mobileSections = [
    { id: 'continue', label: 'Continue Watching', show: continueWatching.length > 0 },
    { id: 'watchlist', label: 'Watch List', show: savedVideos.length > 0 },
    { id: 'featured', label: 'Featured', show: true },
    { id: 'popular', label: 'Most Popular', show: true },
    { id: 'yc', label: 'YC Startup School', show: true },
    { id: 'mindset', label: 'Founder Mindset', show: true },
    { id: 'deep', label: 'Deep Dives', show: true },
  ].filter(s => s.show);

  const [activeMobileSection, setActiveMobileSection] = useState(mobileSections[0]?.id || 'featured');

  // Scroll to section on mobile
  const scrollToSection = (sectionId: string) => {
    setActiveMobileSection(sectionId);
    const element = document.getElementById(`vod-section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#0D0D12] pt-14">
      <div className="flex">
        {/* Left Sidebar - Desktop only */}
        <div className="fixed left-0 top-14 bottom-0 z-40 hidden lg:block">
          <CategorySidebar
            categories={sidebarCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            title="Discover"
            accentColor="#F5C518"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-56 overflow-hidden">
          {/* Mobile Hero Carousel - Always show on mobile/tablet */}
          <div className="lg:hidden mb-4">
            <HeroCarousel
              items={validVideos.filter(v => !v.isVertical).slice(0, 8).map(v => ({ type: 'video', item: v }))}
              size="compact"
            />
          </div>

          {/* Mobile Category Pills - Scroll to sections */}
          <div className="lg:hidden sticky top-14 z-20 bg-[#0D0D12] px-4 py-3 overflow-x-auto border-b border-[#1E1E2E]" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-2">
              {mobileSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    activeMobileSection === section.id
                      ? 'bg-[#F5C518] text-black border-[#F5C518]'
                      : 'bg-transparent text-white/70 border-white/30 hover:border-white/50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Category Header with Format Toggle */}
          <div className="hidden lg:block px-6 lg:px-8 pt-8 pb-4 max-w-7xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCategoryData?.icon}</span>
                <h1 className="text-3xl font-bold text-white">{selectedCategoryData?.name}</h1>
              </div>

              {/* Content Format Toggle */}
              <div className="flex items-center gap-2 bg-[#1E1E2E] rounded-xl p-1">
                <button
                  onClick={() => setContentFormat('long')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    contentFormat === 'long'
                      ? 'bg-[#F5C518] text-black'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span className="hidden sm:inline">Long Form</span>
                </button>
                <button
                  onClick={() => setContentFormat('short')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    contentFormat === 'short'
                      ? 'bg-[#F5C518] text-black'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Shorts</span>
                </button>
              </div>
            </div>
            {selectedCategoryData?.description && (
              <p className="text-[#9CA3AF]">{selectedCategoryData.description}</p>
            )}
          </div>

          {/* Desktop Hero Carousel for Featured */}
          {selectedCategory === 'featured' && (
            <div className="hidden lg:block mb-8 px-6 lg:px-8 max-w-7xl">
              <div className="rounded-2xl overflow-hidden">
                <HeroCarousel
                  items={selectedVideos.slice(0, 8).map(v => ({ type: 'video', item: v }))}
                  size="compact"
                />
              </div>
            </div>
          )}

          {/* Video Grid */}
          <div className="px-4 lg:px-8 pb-4 max-w-7xl">
            {/* Desktop: Show based on selected category and format */}
            <div className="hidden lg:block">
              {/* Shorts Layout */}
              {contentFormat === 'short' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {shortsVideos.map(video => (
                    <ShortsCard
                      key={video.id}
                      video={video}
                      onClick={() => navigate(`/watch/${video.id}`)}
                    />
                  ))}
                </div>
              ) : selectedCategory !== 'featured' ? (
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
                  {continueWatching.length > 0 && (
                    <ContentRowSection
                      title="Continue Watching"
                      subtitle="Pick up where you left off"
                      videos={continueWatching.slice(0, 10).map(h => validVideos.find(v => v.id === h.videoId)).filter(Boolean) as Video[]}
                      onVideoClick={(v) => {
                        const historyItem = continueWatching.find(h => h.videoId === v.id);
                        navigate(`/watch/${v.id}${historyItem ? `?t=${historyItem.timestamp}` : ''}`);
                      }}
                      getProgressPercent={getProgressPercent}
                    />
                  )}
                  <ContentRowSection title="Most Popular" videos={validVideos.filter(v => !v.isVertical).slice(0, 10)} onVideoClick={(v) => navigate(`/watch/${v.id}`)} getProgressPercent={getProgressPercent} />
                  <ContentRowSection title="YC Startup School" videos={validVideos.filter(v => v.tags.includes('y-combinator')).slice(0, 10)} onVideoClick={(v) => navigate(`/watch/${v.id}`)} getProgressPercent={getProgressPercent} />
                  <ContentRowSection title="Founder Mindset" videos={validVideos.filter(v => v.tags.includes('mindset') || v.tags.includes('inspiration')).slice(0, 10)} onVideoClick={(v) => navigate(`/watch/${v.id}`)} getProgressPercent={getProgressPercent} />
                  <ContentRowSection title="Deep Dives" videos={validVideos.filter(v => v.duration >= 1800).slice(0, 10)} onVideoClick={(v) => navigate(`/watch/${v.id}`)} getProgressPercent={getProgressPercent} />
                </div>
              )}
            </div>

            {/* Mobile/Tablet: Show all sections with scroll-to IDs */}
            <div className="lg:hidden space-y-8">
              {/* Continue Watching Section */}
              {continueWatching.length > 0 && (
                <div id="vod-section-continue" className="scroll-mt-32">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#F5C518]/20 flex items-center justify-center">
                      <span className="text-[#F5C518] text-xs">▶</span>
                    </div>
                    <h2 className="text-lg font-bold text-white">Continue Watching</h2>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-3">Pick up where you left off</p>
                  <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {continueWatching.slice(0, 10).map(historyItem => {
                      const video = validVideos.find(v => v.id === historyItem.videoId);
                      if (!video) return null;
                      const progress = getProgressPercent(video.id, video.duration);
                      return (
                        <div key={video.id} className="flex-shrink-0 w-44">
                          <button onClick={() => navigate(`/watch/${video.id}?t=${historyItem.timestamp}`)} className="group text-left w-full">
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E2E3E]">
                                <div className="h-full bg-[#F5C518]" style={{ width: `${progress}%` }} />
                              </div>
                            </div>
                            <h3 className="text-xs font-medium text-white line-clamp-2">{video.title}</h3>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Watch List Section */}
              {savedVideos.length > 0 && (
                <div id="vod-section-watchlist" className="scroll-mt-32">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white text-xs">+</span>
                      </div>
                      <h2 className="text-lg font-bold text-white">Watch List</h2>
                    </div>
                    <button onClick={() => navigate('/my-list')} className="text-sm text-[#F5C518]">View All</button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {savedVideos.slice(0, 10).map(videoId => {
                      const video = validVideos.find(v => v.id === videoId);
                      if (!video) return null;
                      return (
                        <div key={video.id} className="flex-shrink-0 w-44">
                          <VODCard video={video} progress={getProgressPercent(video.id, video.duration)} onClick={() => navigate(`/watch/${video.id}`)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Featured Section */}
              <div id="vod-section-featured" className="scroll-mt-32">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#F5C518]/20 flex items-center justify-center">
                    <span className="text-[#F5C518] text-xs">⭐</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Featured</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {validVideos.filter(v => !v.isVertical).slice(0, 10).map(video => (
                    <div key={video.id} className="flex-shrink-0 w-44">
                      <VODCard video={video} progress={getProgressPercent(video.id, video.duration)} onClick={() => navigate(`/watch/${video.id}`)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Popular Section */}
              <div id="vod-section-popular" className="scroll-mt-32">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-xs">🔥</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Most Popular</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {validVideos.filter(v => !v.isVertical).slice(5, 15).map(video => (
                    <div key={video.id} className="flex-shrink-0 w-44">
                      <VODCard video={video} progress={getProgressPercent(video.id, video.duration)} onClick={() => navigate(`/watch/${video.id}`)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* YC Startup School Section */}
              <div id="vod-section-yc" className="scroll-mt-32">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="text-orange-400 text-xs">Y</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">YC Startup School</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {validVideos.filter(v => v.tags.includes('y-combinator')).slice(0, 10).map(video => (
                    <div key={video.id} className="flex-shrink-0 w-44">
                      <VODCard video={video} progress={getProgressPercent(video.id, video.duration)} onClick={() => navigate(`/watch/${video.id}`)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Founder Mindset Section */}
              <div id="vod-section-mindset" className="scroll-mt-32">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400 text-xs">🧠</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Founder Mindset</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {validVideos.filter(v => v.tags.includes('mindset') || v.tags.includes('inspiration')).slice(0, 10).map(video => (
                    <div key={video.id} className="flex-shrink-0 w-44">
                      <VODCard video={video} progress={getProgressPercent(video.id, video.duration)} onClick={() => navigate(`/watch/${video.id}`)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Dives Section */}
              <div id="vod-section-deep" className="scroll-mt-32">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-xs">📚</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Deep Dives</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {validVideos.filter(v => v.duration >= 1800).slice(0, 10).map(video => (
                    <div key={video.id} className="flex-shrink-0 w-44">
                      <VODCard video={video} progress={getProgressPercent(video.id, video.duration)} onClick={() => navigate(`/watch/${video.id}`)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
  subtitle?: string;
  videos: Video[];
  onVideoClick: (video: Video) => void;
  getProgressPercent: (videoId: string, duration: number) => number;
}

const ContentRowSection: React.FC<ContentRowSectionProps> = ({
  title,
  subtitle,
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
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-[#6B7280] mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}

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
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
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

// Shorts Card Component (vertical aspect ratio)
interface ShortsCardProps {
  video: Video;
  onClick: () => void;
}

const ShortsCard: React.FC<ShortsCardProps> = ({ video, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full"
    >
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-2 bg-[#1E1E2E]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-medium text-white">
          {formatDuration(video.duration)}
        </div>

        {/* Shorts icon */}
        <div className="absolute top-2 left-2 p-1.5 bg-[#FF0000]/90 rounded-full">
          <Smartphone className="w-3 h-3 text-white" />
        </div>

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>
      <h3 className="text-xs font-medium text-white line-clamp-2 group-hover:text-[#F5C518] transition-colors">
        {video.title}
      </h3>
      <p className="text-[10px] text-[#6B7280] mt-0.5">{video.expert}</p>
    </button>
  );
};

export default VODPage;
