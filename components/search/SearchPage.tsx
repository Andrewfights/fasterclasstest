import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { SearchCard, SearchResultItem } from './SearchCard';
import { INITIAL_VIDEOS, COURSES, FAST_CHANNELS } from '../../constants';
import { FastChannel, Video } from '../../types';
import { useLibrary } from '../../contexts/LibraryContext';

// Get channel schedule for searching live content
const getChannelSchedule = (channel: FastChannel, videos: Video[]) => {
  const channelVideos = channel.videoIds
    .map(id => videos.find(v => v.id === id))
    .filter(Boolean) as Video[];

  if (channelVideos.length === 0) return null;

  const totalDuration = channelVideos.reduce((acc, v) => acc + v.duration, 0);
  const now = Date.now() / 1000;
  const loopPosition = now % totalDuration;

  let accumulated = 0;
  for (let i = 0; i < channelVideos.length; i++) {
    const video = channelVideos[i];
    if (accumulated + video.duration > loopPosition) {
      return {
        currentVideo: video,
        nextVideo: channelVideos[(i + 1) % channelVideos.length],
        upcoming: channelVideos.slice(i + 1, i + 4).concat(
          channelVideos.slice(0, Math.max(0, 4 - (channelVideos.length - i - 1)))
        ),
      };
    }
    accumulated += video.duration;
  }
  return null;
};

// Format time for upcoming shows
const formatAirTime = (hoursFromNow: number): string => {
  const date = new Date(Date.now() + hoursFromNow * 3600 * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const SUGGESTED_SEARCHES = [
  'startup',
  'Y Combinator',
  'fundraising',
  'product',
  'growth',
  'hiring',
  'AI',
  'business model',
];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { getVideoProgress } = useLibrary();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('fasterclass_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Save recent searches
  const addToRecent = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('fasterclass_recent_searches', JSON.stringify(updated));
  };

  // Calculate progress percentage
  const getProgressPercent = (videoId: string, duration: number): number => {
    const historyItem = getVideoProgress(videoId);
    if (!historyItem) return 0;
    if (historyItem.completed) return 100;
    return Math.round((historyItem.timestamp / duration) * 100);
  };

  // Search logic
  const searchResults = useMemo((): SearchResultItem[] => {
    if (!query.trim()) return [];

    const results: SearchResultItem[] = [];
    const q = query.toLowerCase().trim();

    // 1. Search videos (ON DEMAND)
    INITIAL_VIDEOS.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.expert.toLowerCase().includes(q) ||
      v.tags.some(t => t.toLowerCase().includes(q))
    ).forEach(v => {
      results.push({
        type: 'video',
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
        subtitle: v.expert,
        badge: 'ON DEMAND',
        badgeColor: '#F5C518',
        progress: getProgressPercent(v.id, v.duration),
        duration: v.duration,
        videoId: v.id,
      });
    });

    // 2. Search courses
    COURSES.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q)
    ).forEach(c => {
      results.push({
        type: 'course',
        id: c.id,
        title: c.title,
        thumbnail: c.coverImage,
        subtitle: c.instructor || c.topic,
        badge: 'COURSE',
        badgeColor: '#c9a227',
      });
    });

    // 3. Search currently playing (ON NOW)
    FAST_CHANNELS.forEach(channel => {
      const schedule = getChannelSchedule(channel, INITIAL_VIDEOS);
      if (schedule) {
        if (
          schedule.currentVideo.title.toLowerCase().includes(q) ||
          schedule.currentVideo.expert.toLowerCase().includes(q) ||
          channel.name.toLowerCase().includes(q)
        ) {
          // Avoid duplicates with ON DEMAND
          if (!results.some(r => r.id === schedule.currentVideo.id && r.type === 'video')) {
            results.push({
              type: 'live',
              id: `live-${channel.id}`,
              title: schedule.currentVideo.title,
              thumbnail: schedule.currentVideo.thumbnail,
              subtitle: `${channel.logo} ${channel.name}`,
              badge: 'ON NOW',
              badgeColor: '#22C55E',
              duration: schedule.currentVideo.duration,
              channelId: channel.id,
              videoId: schedule.currentVideo.id,
            });
          }
        }

        // 4. Search upcoming on channels
        schedule.upcoming.forEach((video, idx) => {
          if (
            video.title.toLowerCase().includes(q) ||
            video.expert.toLowerCase().includes(q)
          ) {
            const hoursFromNow = (idx + 1) * 0.5; // Approximate
            results.push({
              type: 'upcoming',
              id: `upcoming-${channel.id}-${video.id}`,
              title: video.title,
              thumbnail: video.thumbnail,
              subtitle: `${channel.logo} ${channel.name}`,
              badge: 'UPCOMING',
              badgeColor: '#6B7280',
              airTime: formatAirTime(hoursFromNow),
              channelId: channel.id,
              videoId: video.id,
            });
          }
        });
      }
    });

    return results;
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.trim()) {
      addToRecent(searchTerm.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Hunt</h1>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search sessions, playbooks, live drops..."
            className="w-full pl-12 pr-12 py-4 bg-[#1A1A24] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227] transition-colors"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          )}
        </div>

        {/* Search Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {query && (
            <span className="px-3 py-1.5 bg-[#c9a227]/20 text-[#c9a227] rounded-full text-sm font-medium border border-[#c9a227]/40">
              "{query}"
            </span>
          )}
          {(query ? SUGGESTED_SEARCHES.filter(s => s.toLowerCase() !== query.toLowerCase()).slice(0, 6) : [...recentSearches, ...SUGGESTED_SEARCHES.filter(s => !recentSearches.includes(s))].slice(0, 8)).map(term => (
            <button
              key={term}
              onClick={() => handleSearch(term)}
              className="px-3 py-1.5 bg-[#1A1A24] hover:bg-[#2E2E3E] text-[#9CA3AF] rounded-full text-sm transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results */}
        {query ? (
          <>
            {searchResults.length > 0 ? (
              <>
                <p className="text-sm text-[#6B7280] mb-4">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {searchResults.map(result => (
                    <SearchCard key={result.id} result={result} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-[#6B7280] mb-2">No results found for "{query}"</p>
                <p className="text-sm text-[#4B5563]">Try different keywords or browse our categories</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-[#2E2E3E] mx-auto mb-4" />
            <p className="text-[#6B7280] mb-2">Hunt for sessions, playbooks, and live drops</p>
            <p className="text-sm text-[#4B5563]">Type to start your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
