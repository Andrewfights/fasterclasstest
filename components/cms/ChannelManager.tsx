import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tv,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  GripVertical,
  Clock,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { FAST_CHANNELS, INITIAL_VIDEOS } from '../../constants';
import { FastChannel, Video, ScheduleBlock } from '../../types';
import { scheduleService } from '../../services/scheduleService';

// Helper to format duration
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Helper to format time
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper to get video by ID
const getVideoById = (id: string): Video | undefined => {
  return INITIAL_VIDEOS.find(v => v.id === id);
};

// Timeline zoom levels (pixels per hour)
const ZOOM_LEVELS = [60, 120, 240, 480];

interface ScheduleBlockUI extends ScheduleBlock {
  video: Video;
  left: number;  // Percentage position
  width: number; // Percentage width
}

export const ChannelManager: React.FC = () => {
  const navigate = useNavigate();
  const [channels] = useState<FastChannel[]>(FAST_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<FastChannel | null>(null);
  const [scheduleMode, setScheduleMode] = useState<'auto' | 'custom'>('auto');
  const [customBlocks, setCustomBlocks] = useState<ScheduleBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1); // Index into ZOOM_LEVELS
  const [timelineDate, setTimelineDate] = useState(new Date());
  const [draggedVideo, setDraggedVideo] = useState<Video | null>(null);
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);

  // Get start and end of day for timeline
  const dayStart = useMemo(() => {
    const date = new Date(timelineDate);
    date.setHours(0, 0, 0, 0);
    return Math.floor(date.getTime() / 1000);
  }, [timelineDate]);

  const dayEnd = useMemo(() => {
    return dayStart + 24 * 60 * 60;
  }, [dayStart]);

  // Filter videos for library
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return INITIAL_VIDEOS;
    const query = searchQuery.toLowerCase();
    return INITIAL_VIDEOS.filter(
      v =>
        v.title.toLowerCase().includes(query) ||
        v.expert.toLowerCase().includes(query) ||
        v.tags.some(t => t.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Generate schedule blocks for timeline display
  const scheduleBlocks = useMemo((): ScheduleBlockUI[] => {
    if (!selectedChannel) return [];

    let blocks: ScheduleBlock[];
    if (scheduleMode === 'custom' && customBlocks.length > 0) {
      blocks = customBlocks.filter(b =>
        b.startTime < dayEnd && b.endTime > dayStart
      );
    } else {
      blocks = scheduleService.getScheduleRange(
        selectedChannel.id,
        new Date(dayStart * 1000),
        new Date(dayEnd * 1000)
      );
    }

    return blocks.map(block => {
      const video = getVideoById(block.videoId);
      if (!video) return null;

      // Calculate position as percentage of day
      const blockStart = Math.max(block.startTime, dayStart);
      const blockEnd = Math.min(block.endTime, dayEnd);
      const dayDuration = dayEnd - dayStart;

      const left = ((blockStart - dayStart) / dayDuration) * 100;
      const width = ((blockEnd - blockStart) / dayDuration) * 100;

      return {
        ...block,
        video,
        left,
        width,
      };
    }).filter(Boolean) as ScheduleBlockUI[];
  }, [selectedChannel, scheduleMode, customBlocks, dayStart, dayEnd]);

  // Load channel schedule when selected
  useEffect(() => {
    if (selectedChannel) {
      const config = scheduleService.getChannelConfig(selectedChannel.id);
      if (config) {
        setScheduleMode(config.mode);
        setCustomBlocks(config.customBlocks || []);
      } else {
        setScheduleMode('auto');
        setCustomBlocks([]);
      }
      setHasChanges(false);
    }
  }, [selectedChannel]);

  // Handle drag start from video library
  const handleDragStart = (video: Video) => {
    setDraggedVideo(video);
  };

  // Handle drop on timeline
  const handleTimelineDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedVideo || !timelineRef.current || !selectedChannel) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;

    // Calculate time from percentage
    const dayDuration = dayEnd - dayStart;
    let startTime = dayStart + Math.floor(percentage * dayDuration);

    // Snap to 5-minute increments
    startTime = Math.round(startTime / 300) * 300;

    const endTime = startTime + draggedVideo.duration;

    const newBlock: ScheduleBlock = {
      id: `block-${Date.now()}`,
      channelId: selectedChannel.id,
      videoId: draggedVideo.id,
      startTime,
      endTime,
      isCustom: true,
    };

    setCustomBlocks(prev => [...prev, newBlock].sort((a, b) => a.startTime - b.startTime));
    setScheduleMode('custom');
    setHasChanges(true);
    setDraggedVideo(null);
  };

  // Handle drag over timeline
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Delete a block
  const handleDeleteBlock = (blockId: string) => {
    setCustomBlocks(prev => prev.filter(b => b.id !== blockId));
    setHasChanges(true);
  };

  // Save schedule
  const handleSave = () => {
    if (!selectedChannel) return;

    if (scheduleMode === 'custom') {
      scheduleService.setCustomSchedule(selectedChannel.id, customBlocks);
    } else {
      scheduleService.setAutoMode(selectedChannel.id);
    }
    setHasChanges(false);
  };

  // Reset to auto
  const handleReset = () => {
    if (!selectedChannel) return;
    setScheduleMode('auto');
    setCustomBlocks([]);
    scheduleService.setAutoMode(selectedChannel.id);
    setHasChanges(false);
  };

  // Navigate timeline date
  const navigateDate = (direction: 'prev' | 'next') => {
    setTimelineDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // Generate hour markers
  const hourMarkers = useMemo(() => {
    const markers = [];
    for (let hour = 0; hour < 24; hour++) {
      markers.push({
        hour,
        label: `${hour.toString().padStart(2, '0')}:00`,
        left: (hour / 24) * 100,
      });
    }
    return markers;
  }, []);

  // Zoom controls
  const pixelsPerHour = ZOOM_LEVELS[zoomLevel];
  const timelineWidth = (24 * pixelsPerHour);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Channel Manager</h1>
          <p className="text-[#6B7280] mt-1">Configure channels and schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channel List */}
        <div className="lg:col-span-1 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden">
          <div className="p-4 border-b border-[#2E2E3E]">
            <h2 className="font-semibold text-white">Channels</h2>
          </div>
          <div className="divide-y divide-[#2E2E3E] max-h-[600px] overflow-y-auto">
            {channels.map(channel => (
              <div
                key={channel.id}
                className={`p-4 flex items-center gap-3 transition-colors group ${
                  selectedChannel?.id === channel.id
                    ? 'bg-[#8B5CF6]/20'
                    : 'hover:bg-[#1E1E2E]'
                }`}
              >
                <button
                  onClick={() => setSelectedChannel(channel)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: channel.color + '30' }}
                  >
                    {channel.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{channel.name}</p>
                    <p className="text-xs text-[#6B7280]">Ch. {channel.number}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7280]">
                    {channel.videoIds.length} videos
                  </span>
                  <button
                    onClick={() => navigate(`/admin/channels/${channel.id}`)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#2E2E3E] opacity-0 group-hover:opacity-100 transition-all"
                    title="Edit channel"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Editor */}
        <div className="lg:col-span-3 space-y-4">
          {selectedChannel ? (
            <>
              {/* Channel Header */}
              <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: selectedChannel.color + '30' }}
                    >
                      {selectedChannel.logo}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {selectedChannel.name}
                      </h2>
                      <p className="text-sm text-[#6B7280]">
                        Channel {selectedChannel.number} • {selectedChannel.videoIds.length} videos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasChanges && (
                      <span className="text-amber-500 text-sm">Unsaved changes</span>
                    )}
                    <button
                      onClick={() => navigate(`/admin/channels/${selectedChannel.id}`)}
                      className="px-3 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Channel
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset to Auto
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!hasChanges}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                        hasChanges
                          ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                          : 'bg-[#2E2E3E] text-[#6B7280] cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      Save Schedule
                    </button>
                  </div>
                </div>

                {/* Schedule Mode Toggle */}
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-sm text-[#6B7280]">Schedule Mode:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setScheduleMode('auto');
                        setHasChanges(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        scheduleMode === 'auto'
                          ? 'bg-[#22C55E]/20 text-[#22C55E]'
                          : 'bg-[#2E2E3E] text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      Auto Loop
                    </button>
                    <button
                      onClick={() => {
                        setScheduleMode('custom');
                        setHasChanges(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        scheduleMode === 'custom'
                          ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                          : 'bg-[#2E2E3E] text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      Custom Schedule
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Library (for dragging) */}
              <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Video Library</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-lg text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {filteredVideos.slice(0, 20).map(video => (
                    <div
                      key={video.id}
                      draggable
                      onDragStart={() => handleDragStart(video)}
                      onDragEnd={() => setDraggedVideo(null)}
                      className="flex-shrink-0 w-32 p-2 bg-[#0D0D12] rounded-lg border border-[#2E2E3E] hover:border-[#8B5CF6]/50 cursor-grab active:cursor-grabbing transition-colors"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-16 object-cover rounded mb-2"
                      />
                      <p className="text-xs text-white truncate">{video.title}</p>
                      <p className="text-xs text-[#6B7280]">
                        {formatDuration(video.duration)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6B7280] mt-2">
                  Drag videos to the timeline below to schedule them
                </p>
              </div>

              {/* Timeline */}
              <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden">
                {/* Timeline Header */}
                <div className="p-4 border-b border-[#2E2E3E] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigateDate('prev')}
                      className="p-1.5 rounded-lg bg-[#2E2E3E] text-white hover:bg-[#3E3E4E] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-white font-medium">
                        {timelineDate.toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => navigateDate('next')}
                      className="p-1.5 rounded-lg bg-[#2E2E3E] text-white hover:bg-[#3E3E4E] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTimelineDate(new Date())}
                      className="px-2 py-1 text-xs text-[#8B5CF6] hover:underline"
                    >
                      Today
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6B7280]">Zoom:</span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(0, prev - 1))}
                      disabled={zoomLevel === 0}
                      className="p-1.5 rounded-lg bg-[#2E2E3E] text-white hover:bg-[#3E3E4E] disabled:opacity-50 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(ZOOM_LEVELS.length - 1, prev + 1))}
                      disabled={zoomLevel === ZOOM_LEVELS.length - 1}
                      className="p-1.5 rounded-lg bg-[#2E2E3E] text-white hover:bg-[#3E3E4E] disabled:opacity-50 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Timeline Content */}
                <div className="overflow-x-auto">
                  <div
                    ref={timelineRef}
                    className="relative h-48"
                    style={{ width: `${timelineWidth}px`, minWidth: '100%' }}
                    onDrop={handleTimelineDrop}
                    onDragOver={handleDragOver}
                  >
                    {/* Hour markers */}
                    <div className="absolute inset-0 pointer-events-none">
                      {hourMarkers.map(marker => (
                        <div
                          key={marker.hour}
                          className="absolute top-0 bottom-0 border-l border-[#2E2E3E]"
                          style={{ left: `${marker.left}%` }}
                        >
                          <span className="absolute top-1 left-1 text-xs text-[#6B7280]">
                            {marker.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Current time indicator */}
                    {timelineDate.toDateString() === new Date().toDateString() && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                        style={{
                          left: `${((Date.now() / 1000 - dayStart) / (dayEnd - dayStart)) * 100}%`,
                        }}
                      >
                        <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
                      </div>
                    )}

                    {/* Schedule blocks */}
                    <div className="absolute top-8 left-0 right-0 bottom-2">
                      {scheduleBlocks.map(block => (
                        <div
                          key={block.id}
                          className="absolute top-0 bottom-0 rounded-lg overflow-hidden cursor-pointer group"
                          style={{
                            left: `${block.left}%`,
                            width: `${Math.max(block.width, 0.5)}%`,
                            backgroundColor: selectedChannel.color + '40',
                            borderLeft: `3px solid ${selectedChannel.color}`,
                          }}
                          onClick={() => setEditingBlock(block)}
                        >
                          <div className="p-2 h-full flex flex-col">
                            <p className="text-xs font-medium text-white truncate">
                              {block.video.title}
                            </p>
                            <p className="text-xs text-[#9CA3AF] truncate">
                              {formatTime(block.startTime)} - {formatTime(block.endTime)}
                            </p>
                            <p className="text-xs text-[#6B7280]">
                              {formatDuration(block.video.duration)}
                            </p>
                          </div>
                          {scheduleMode === 'custom' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBlock(block.id);
                              }}
                              className="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Drop zone indicator */}
                    {draggedVideo && (
                      <div className="absolute inset-0 bg-[#8B5CF6]/10 border-2 border-dashed border-[#8B5CF6]/50 rounded-lg flex items-center justify-center">
                        <p className="text-[#8B5CF6] font-medium">
                          Drop to schedule "{draggedVideo.title}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Legend */}
                <div className="p-3 border-t border-[#2E2E3E] flex items-center justify-between text-xs text-[#6B7280]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Current time
                    </span>
                    <span>Click blocks to edit • Drag to add new</span>
                  </div>
                  <span>
                    Total: {scheduleBlocks.length} programs •
                    {' '}{formatDuration(scheduleBlocks.reduce((acc, b) => acc + b.video.duration, 0))}
                  </span>
                </div>
              </div>

              {/* Block Details Modal */}
              {editingBlock && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] w-full max-w-lg">
                    <div className="p-4 border-b border-[#2E2E3E] flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Schedule Block</h3>
                      <button
                        onClick={() => setEditingBlock(null)}
                        className="text-[#6B7280] hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex gap-4">
                        <img
                          src={editingBlock.video.thumbnail}
                          alt={editingBlock.video.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-white">{editingBlock.video.title}</h4>
                          <p className="text-sm text-[#6B7280]">{editingBlock.video.expert}</p>
                          <p className="text-sm text-[#9CA3AF] mt-1">
                            {formatDuration(editingBlock.video.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#6B7280] mb-1">Start Time</label>
                          <p className="text-white">
                            {new Date(editingBlock.startTime * 1000).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm text-[#6B7280] mb-1">End Time</label>
                          <p className="text-white">
                            {new Date(editingBlock.endTime * 1000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {scheduleMode === 'custom' && (
                        <button
                          onClick={() => {
                            handleDeleteBlock(editingBlock.id);
                            setEditingBlock(null);
                          }}
                          className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove from Schedule
                        </button>
                      )}
                    </div>
                    <div className="p-4 border-t border-[#2E2E3E] flex justify-end">
                      <button
                        onClick={() => setEditingBlock(null)}
                        className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-12 text-center">
              <Tv className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Channel</h3>
              <p className="text-[#6B7280]">
                Choose a channel from the list to view and edit its schedule
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelManager;
