import React, { useState, useMemo, useCallback } from 'react';
import { Search, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { CMSChannel, CMSScheduleBlock } from '../../types/cms';
import { INITIAL_VIDEOS } from '../../constants';
import { ScheduleTimeline } from './ScheduleTimeline';

interface ChannelSchedulerProps {
  channel: CMSChannel;
  onChange: (updates: Partial<CMSChannel>) => void;
}

export const ChannelScheduler: React.FC<ChannelSchedulerProps> = ({
  channel,
  onChange,
}) => {
  const [search, setSearch] = useState('');
  const [draggedVideoId, setDraggedVideoId] = useState<string | null>(null);

  // Get videos in the channel library
  const libraryVideos = useMemo(() => {
    return channel.library
      .map(id => INITIAL_VIDEOS.find(v => v.id === id))
      .filter(Boolean) as typeof INITIAL_VIDEOS;
  }, [channel.library]);

  // Filtered library videos
  const filteredLibrary = useMemo(() => {
    if (!search) return libraryVideos;
    return libraryVideos.filter(v =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.expert.toLowerCase().includes(search.toLowerCase())
    );
  }, [libraryVideos, search]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalScheduledDuration = useMemo(() => {
    return channel.schedule.draft.reduce((sum, block) => {
      const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
      return sum + (video?.duration || 0);
    }, 0);
  }, [channel.schedule.draft]);

  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleScheduleChange = useCallback((blocks: CMSScheduleBlock[]) => {
    onChange({
      schedule: {
        ...channel.schedule,
        draft: blocks,
        lastSaved: new Date().toISOString(),
      },
    });
  }, [channel.schedule, onChange]);

  const handleDragStart = useCallback((e: React.DragEvent, videoId: string) => {
    setDraggedVideoId(videoId);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ videoId }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedVideoId(null);
  }, []);

  const handleDropOnTimeline = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const { videoId } = JSON.parse(data);
      if (!videoId) return;

      const video = INITIAL_VIDEOS.find(v => v.id === videoId);
      if (!video) return;

      const newBlock: CMSScheduleBlock = {
        id: `block-${Date.now()}`,
        channelId: channel.id,
        videoId,
        startTime: 0,
        endTime: 0,
        order: channel.schedule.draft.length,
      };

      handleScheduleChange([...channel.schedule.draft, newBlock]);
    } catch (e) {
      console.error('Failed to parse drag data', e);
    }
  }, [channel.id, channel.schedule.draft, handleScheduleChange]);

  const handleAutoSchedule = useCallback(() => {
    // Create blocks from library in order
    const blocks: CMSScheduleBlock[] = libraryVideos.map((video, index) => ({
      id: `block-${video.id}-${Date.now()}`,
      channelId: channel.id,
      videoId: video.id,
      startTime: 0,
      endTime: 0,
      order: index,
    }));

    handleScheduleChange(blocks);
  }, [channel.id, libraryVideos, handleScheduleChange]);

  const handleClearSchedule = useCallback(() => {
    if (confirm('Are you sure you want to clear the schedule?')) {
      handleScheduleChange([]);
    }
  }, [handleScheduleChange]);

  // Check if schedule matches library
  const isInSync = useMemo(() => {
    if (channel.schedule.draft.length !== libraryVideos.length) return false;
    return channel.schedule.draft.every((block, index) =>
      block.videoId === libraryVideos[index]?.id
    );
  }, [channel.schedule.draft, libraryVideos]);

  // Check for unpublished changes
  const hasUnpublishedChanges = useMemo(() => {
    return JSON.stringify(channel.schedule.draft) !== JSON.stringify(channel.schedule.published);
  }, [channel.schedule.draft, channel.schedule.published]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Status Banner */}
      {hasUnpublishedChanges && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-500 font-medium">Unpublished Changes</p>
            <p className="text-xs text-yellow-500/70">
              The schedule has been modified. Publish to make changes live.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Library Sidebar */}
        <div className="bg-[#1E1E2E] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2E2E3E]">
            <h2 className="text-lg font-semibold text-white mb-3">Library</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search library..."
                className="w-full pl-10 pr-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-3 space-y-2">
            {filteredLibrary.map(video => (
              <div
                key={video.id}
                draggable
                onDragStart={(e) => handleDragStart(e, video.id)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                  draggedVideoId === video.id
                    ? 'bg-[#8B5CF6]/20 opacity-50'
                    : 'hover:bg-[#2E2E3E]'
                }`}
              >
                <img
                  src={video.thumbnail}
                  alt=""
                  className="w-14 h-8 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{video.title}</p>
                  <p className="text-xs text-[#6B7280] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(video.duration)}
                  </p>
                </div>
              </div>
            ))}

            {libraryVideos.length === 0 && (
              <div className="text-center py-8 text-[#6B7280] text-sm">
                Add content to the library first
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#2E2E3E]">
            <p className="text-xs text-[#6B7280] mb-2">
              {libraryVideos.length} videos • {formatTotalDuration(
                libraryVideos.reduce((sum, v) => sum + v.duration, 0)
              )} total
            </p>
            <button
              onClick={handleAutoSchedule}
              disabled={libraryVideos.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#3E3E4E] hover:bg-[#4E4E5E] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Auto-Schedule Library
            </button>
          </div>
        </div>

        {/* Schedule Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E1E2E] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2E2E3E] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Schedule</h2>
                <p className="text-sm text-[#6B7280]">
                  {channel.schedule.draft.length} blocks • {formatTotalDuration(totalScheduledDuration)} runtime
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isInSync && channel.schedule.draft.length > 0 && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                    Custom
                  </span>
                )}
                {channel.schedule.draft.length > 0 && (
                  <button
                    onClick={handleClearSchedule}
                    className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div
              onDrop={handleDropOnTimeline}
              onDragOver={(e) => e.preventDefault()}
            >
              <ScheduleTimeline
                blocks={channel.schedule.draft}
                onChange={handleScheduleChange}
              />
            </div>

            {channel.settings.loopContent && channel.schedule.draft.length > 0 && (
              <div className="p-3 border-t border-[#2E2E3E] bg-[#1A1A24]">
                <p className="text-xs text-[#6B7280] text-center">
                  <RefreshCw className="w-3 h-3 inline mr-1" />
                  Schedule will loop continuously
                </p>
              </div>
            )}
          </div>

          {/* Schedule Info */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-[#1E1E2E] rounded-xl p-4">
              <h3 className="text-sm font-medium text-[#6B7280] mb-1">Last Published</h3>
              <p className="text-white">
                {channel.schedule.lastPublished
                  ? new Date(channel.schedule.lastPublished).toLocaleString()
                  : 'Never'}
              </p>
            </div>
            <div className="bg-[#1E1E2E] rounded-xl p-4">
              <h3 className="text-sm font-medium text-[#6B7280] mb-1">Published Blocks</h3>
              <p className="text-white">
                {channel.schedule.published.length} blocks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelScheduler;
