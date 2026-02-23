import React, { useState, useMemo, useCallback } from 'react';
import { Search, Plus, X, Clock, ChevronRight } from 'lucide-react';
import { CMSChannel } from '../../types/cms';
import { cmsDataService } from '../../services/cmsDataService';
import { INITIAL_VIDEOS } from '../../constants';
import { DraggableList, DraggableItem } from './DraggableList';

interface ChannelLibraryProps {
  channel: CMSChannel;
  onChange: (updates: Partial<CMSChannel>) => void;
}

export const ChannelLibrary: React.FC<ChannelLibraryProps> = ({
  channel,
  onChange,
}) => {
  const [search, setSearch] = useState('');
  const [selectedAvailable, setSelectedAvailable] = useState<Set<string>>(new Set());

  // Get all available videos/episodes
  const allVideos = useMemo(() => INITIAL_VIDEOS, []);

  // Videos in the channel library
  const libraryVideos = useMemo(() => {
    return channel.library
      .map(id => allVideos.find(v => v.id === id))
      .filter(Boolean) as typeof allVideos;
  }, [channel.library, allVideos]);

  // Available videos (not in library)
  const availableVideos = useMemo(() => {
    const librarySet = new Set(channel.library);
    return allVideos.filter(v => !librarySet.has(v.id));
  }, [allVideos, channel.library]);

  // Filtered available videos
  const filteredAvailable = useMemo(() => {
    if (!search) return availableVideos.slice(0, 50);
    return availableVideos
      .filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.expert.toLowerCase().includes(search.toLowerCase()) ||
        v.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
      .slice(0, 50);
  }, [availableVideos, search]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = useMemo(() => {
    return libraryVideos.reduce((sum, v) => sum + v.duration, 0);
  }, [libraryVideos]);

  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const toggleSelectAvailable = useCallback((id: string) => {
    setSelectedAvailable(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAddSelected = useCallback(() => {
    if (selectedAvailable.size === 0) return;
    const newLibrary = [...channel.library, ...Array.from(selectedAvailable)];
    onChange({ library: newLibrary });
    setSelectedAvailable(new Set());
  }, [channel.library, selectedAvailable, onChange]);

  const handleRemoveFromLibrary = useCallback((id: string) => {
    const newLibrary = channel.library.filter(vid => vid !== id);
    onChange({ library: newLibrary });
  }, [channel.library, onChange]);

  const handleReorderLibrary = useCallback((items: DraggableItem[]) => {
    const newLibrary = items.map(item => item.id);
    onChange({ library: newLibrary });
  }, [onChange]);

  const handleAddAll = useCallback(() => {
    const newLibrary = [...channel.library, ...filteredAvailable.map(v => v.id)];
    onChange({ library: newLibrary });
  }, [channel.library, filteredAvailable, onChange]);

  const handleClearLibrary = useCallback(() => {
    if (confirm('Are you sure you want to clear the library?')) {
      onChange({ library: [] });
    }
  }, [onChange]);

  // Convert library videos to draggable items
  const libraryItems: DraggableItem[] = libraryVideos.map(v => ({
    id: v.id,
    title: v.title,
    subtitle: v.expert,
    thumbnail: v.thumbnail,
    duration: v.duration,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Episodes */}
        <div className="bg-[#1E1E2E] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2E2E3E]">
            <h2 className="text-lg font-semibold text-white mb-3">Available Content</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto p-3 space-y-2">
            {filteredAvailable.map(video => (
              <div
                key={video.id}
                onClick={() => toggleSelectAvailable(video.id)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedAvailable.has(video.id)
                    ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]'
                    : 'hover:bg-[#2E2E3E] border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAvailable.has(video.id)}
                  onChange={() => {}}
                  className="w-4 h-4 rounded border-[#3E3E4E] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <img
                  src={video.thumbnail}
                  alt=""
                  className="w-16 h-10 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{video.title}</p>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <span>{video.expert}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredAvailable.length === 0 && (
              <div className="text-center py-8 text-[#6B7280]">
                {search ? 'No videos match your search' : 'All videos are in the library'}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#2E2E3E] flex gap-2">
            <button
              onClick={handleAddSelected}
              disabled={selectedAvailable.size === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-[#3E3E4E] disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Selected ({selectedAvailable.size})
            </button>
            <button
              onClick={handleAddAll}
              disabled={filteredAvailable.length === 0}
              className="px-4 py-2 bg-[#3E3E4E] hover:bg-[#4E4E5E] disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
            >
              Add All
            </button>
          </div>
        </div>

        {/* Channel Library */}
        <div className="bg-[#1E1E2E] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2E2E3E] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Channel Library</h2>
              <p className="text-sm text-[#6B7280]">
                {libraryVideos.length} episodes • {formatTotalDuration(totalDuration)} total
              </p>
            </div>
            {libraryVideos.length > 0 && (
              <button
                onClick={handleClearLibrary}
                className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto p-3">
            <DraggableList
              items={libraryItems}
              onReorder={handleReorderLibrary}
              onRemove={handleRemoveFromLibrary}
              showDuration={true}
              showIndex={true}
              emptyMessage="Drag content here or select from the left panel"
            />
          </div>

          {libraryVideos.length > 0 && (
            <div className="p-3 border-t border-[#2E2E3E]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">Schedule Preview</span>
                <span className="text-white font-medium">
                  Loops every {formatTotalDuration(totalDuration)}
                </span>
              </div>
              <div className="mt-2 h-2 bg-[#13131A] rounded-full overflow-hidden flex">
                {libraryVideos.slice(0, 10).map((video, index) => (
                  <div
                    key={video.id}
                    className="h-full"
                    style={{
                      width: `${(video.duration / totalDuration) * 100}%`,
                      backgroundColor: `hsl(${(index * 360) / Math.min(10, libraryVideos.length)}, 70%, 50%)`,
                    }}
                    title={`${video.title} (${formatDuration(video.duration)})`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-[#1E1E2E] rounded-xl p-4">
        <h3 className="text-sm font-medium text-white mb-3">Quick Add by Tag</h3>
        <div className="flex flex-wrap gap-2">
          {['startup', 'growth', 'fundraising', 'product', 'ai', 'leadership', 'hiring', 'marketing'].map(tag => {
            const matchingVideos = availableVideos.filter(v => v.tags.includes(tag));
            if (matchingVideos.length === 0) return null;
            return (
              <button
                key={tag}
                onClick={() => {
                  const newLibrary = [...channel.library, ...matchingVideos.map(v => v.id)];
                  onChange({ library: newLibrary });
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#3E3E4E] hover:bg-[#4E4E5E] text-white text-sm rounded-lg transition-colors"
              >
                #{tag}
                <span className="text-[#6B7280]">({matchingVideos.length})</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChannelLibrary;
