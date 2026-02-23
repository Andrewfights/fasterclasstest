import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Play, Clock } from 'lucide-react';
import { FastChannel, Video, EPGSlot } from '../../types';
import { formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

interface EPGGridProps {
  channels: FastChannel[];
  currentChannel: FastChannel;
  onChannelSelect: (channel: FastChannel) => void;
  videos: Video[];
}

// Generate EPG slots for a channel
const generateEPGSlots = (channel: FastChannel, videos: Video[], hoursAhead: number = 3): EPGSlot[] => {
  const slots: EPGSlot[] = [];
  const channelVideos = channel.videoIds
    .map(id => videos.find(v => v.id === id))
    .filter(Boolean) as Video[];

  if (channelVideos.length === 0) return slots;

  const totalDuration = channelVideos.reduce((acc, v) => acc + v.duration, 0);
  const now = Date.now() / 1000;
  const endTime = now + (hoursAhead * 3600);

  let loopPosition = now % totalDuration;
  let currentTime = now;
  let videoIndex = 0;

  let accumulated = 0;
  for (let i = 0; i < channelVideos.length; i++) {
    if (accumulated + channelVideos[i].duration > loopPosition) {
      videoIndex = i;
      currentTime = now - (loopPosition - accumulated);
      break;
    }
    accumulated += channelVideos[i].duration;
  }

  while (currentTime < endTime) {
    const video = channelVideos[videoIndex % channelVideos.length];
    const slotStart = currentTime;
    const slotEnd = currentTime + video.duration;

    slots.push({
      videoId: video.id,
      startTime: slotStart,
      endTime: slotEnd,
      video,
    });

    currentTime = slotEnd;
    videoIndex++;
  }

  return slots;
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const EPGGrid: React.FC<EPGGridProps> = ({
  channels,
  currentChannel,
  onChannelSelect,
  videos,
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isVideoSaved, toggleSaveVideo } = useLibrary();

  // Selected/expanded program
  const [selectedSlot, setSelectedSlot] = useState<{
    slot: EPGSlot;
    channel: FastChannel;
  } | null>(null);

  // Current time state
  const [now, setNow] = useState(() => Date.now() / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now() / 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate EPG data
  const epgData = useMemo(() => {
    return channels.map(channel => ({
      channel,
      slots: generateEPGSlots(channel, videos, 3),
    }));
  }, [channels, videos]);

  // Time markers (every 30 minutes)
  const timeMarkers = useMemo(() => {
    const markers: number[] = [];
    const startTime = Math.floor(now / 1800) * 1800;
    for (let i = 0; i < 7; i++) {
      markers.push(startTime + i * 1800);
    }
    return markers;
  }, [now]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    }
  };

  // Position calculations
  const baseTime = timeMarkers[0];
  const totalDuration = 3 * 3600;
  const pixelsPerSecond = 900 / totalDuration;

  const getSlotStyle = (slot: EPGSlot) => {
    const left = Math.max(0, (slot.startTime - baseTime) * pixelsPerSecond);
    const width = (slot.endTime - slot.startTime) * pixelsPerSecond;
    const adjustedWidth = Math.min(width, 900 - left);
    return { left: `${left}px`, width: `${Math.max(adjustedWidth, 60)}px` };
  };

  return (
    <div className="bg-[#0D0D12]">
      {/* Header with time markers */}
      <div className="flex border-b border-[#1E1E2E]">
        {/* Channel column header - responsive width */}
        <div className="w-32 sm:w-40 lg:w-52 flex-shrink-0 px-2 sm:px-4 py-3 bg-[#0D0D12] border-r border-[#1E1E2E]">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Now - 11:10 PM</span>
        </div>

        {/* Time header */}
        <div className="flex-1 relative overflow-hidden">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-[#0D0D12] to-transparent hover:from-[#1A1A24]"
          >
            <ChevronLeft className="w-4 h-4 text-white/40" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-[#0D0D12] to-transparent hover:from-[#1A1A24]"
          >
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          <div ref={scrollRef} className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            <div className="flex min-w-[900px]">
              {timeMarkers.map((time, i) => (
                <div
                  key={time}
                  className="flex-1 px-3 py-3 text-xs font-medium text-[#9CA3AF] border-l border-[#1E1E2E] first:border-l-0"
                >
                  {formatTime(time)}
                </div>
              ))}
            </div>
          </div>

          {/* Now indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
            style={{ left: `calc(52 * 4px + ${((now - baseTime) / totalDuration) * 100}%)` }}
          />
        </div>
      </div>

      {/* Channel rows */}
      <div className="max-h-[45vh] overflow-y-auto">
        {epgData.map(({ channel, slots }) => {
          const isCurrentChannel = channel.id === currentChannel.id;
          const isExpanded = selectedSlot?.channel.id === channel.id;

          return (
            <div key={channel.id}>
              {/* Main row */}
              <div
                className={`flex border-b border-[#1E1E2E] transition-colors ${
                  isCurrentChannel ? 'bg-[#F5C518]/5' : 'hover:bg-[#1A1A24]/50'
                }`}
              >
                {/* Channel info - responsive width */}
                <button
                  onClick={() => onChannelSelect(channel)}
                  className="w-32 sm:w-40 lg:w-52 flex-shrink-0 px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 text-left border-r border-[#1E1E2E] hover:bg-[#1E1E2E] transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
                      style={{ backgroundColor: channel.color + '25' }}
                    >
                      {channel.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-medium text-white block truncate">{channel.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#6B7280]">CH {channel.number}</span>
                        {isCurrentChannel && (
                          <span className="text-[10px] text-red-400 font-medium ml-1">LIVE</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Program slots */}
                <div className="flex-1 relative overflow-hidden" style={{ minWidth: '900px' }}>
                  <div className="absolute inset-y-0 left-0 right-0">
                    {slots.map((slot, i) => {
                      const isPlaying = slot.startTime <= now && slot.endTime > now;
                      const isSelected = selectedSlot?.slot.videoId === slot.videoId && selectedSlot?.channel.id === channel.id;
                      const style = getSlotStyle(slot);

                      if (parseFloat(style.left) > 900) return null;

                      return (
                        <button
                          key={`${slot.videoId}-${i}`}
                          onClick={() => setSelectedSlot(isSelected ? null : { slot, channel })}
                          className={`absolute top-1 bottom-1 rounded transition-all ${
                            isSelected
                              ? 'ring-2 ring-[#F5C518] bg-[#F5C518]/20 z-10'
                              : isPlaying
                                ? 'bg-[#1A1A24] ring-1 ring-[#F5C518]/50'
                                : 'bg-[#1A1A24]/80 hover:bg-[#2E2E3E]'
                          }`}
                          style={style}
                        >
                          <div className="h-full px-3 py-2 flex flex-col justify-center overflow-hidden">
                            <p className={`text-xs font-medium truncate ${
                              isSelected || isPlaying ? 'text-white' : 'text-white/70'
                            }`}>
                              {slot.video.title}
                            </p>
                            <p className="text-[10px] text-white/40 truncate">
                              {formatTime(slot.startTime)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Grid lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {timeMarkers.map((_, i) => (
                      <div key={i} className="flex-1 border-l border-[#1E1E2E]/50 first:border-l-0" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded program details */}
              {isExpanded && selectedSlot && (
                <div className="bg-[#F5C518]/10 border-b border-[#F5C518]/30">
                  <div className="flex flex-col sm:flex-row p-4 gap-4 ml-0 sm:ml-32 lg:ml-52">
                    {/* Thumbnail */}
                    <div className="w-48 flex-shrink-0">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={selectedSlot.slot.video.thumbnail}
                          alt={selectedSlot.slot.video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            {selectedSlot.slot.video.title}
                          </h3>
                          <p className="text-sm text-[#9CA3AF] mb-2">
                            with {selectedSlot.slot.video.expert}
                          </p>
                        </div>

                        {/* Save button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveVideo(selectedSlot.slot.videoId);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isVideoSaved(selectedSlot.slot.videoId)
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isVideoSaved(selectedSlot.slot.videoId) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Time and metadata */}
                      <div className="flex items-center gap-3 text-sm mb-3">
                        {selectedSlot.slot.startTime <= now && selectedSlot.slot.endTime > now ? (
                          <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                            ON NOW
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#2E2E3E] text-white/70 text-xs font-medium rounded">
                            {formatTime(selectedSlot.slot.startTime)}
                          </span>
                        )}
                        <span className="text-[#6B7280]">
                          {formatTime(selectedSlot.slot.startTime)} - {formatTime(selectedSlot.slot.endTime)}
                        </span>
                        <span className="text-[#6B7280]">•</span>
                        <span className="text-[#6B7280]">
                          {formatDuration(selectedSlot.slot.video.duration)}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {selectedSlot.slot.video.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/5 rounded text-xs text-[#9CA3AF]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Watch buttons */}
                      <div className="flex gap-3 mt-4">
                        {selectedSlot.slot.startTime <= now && selectedSlot.slot.endTime > now ? (
                          // Currently playing - watch live
                          <button
                            onClick={() => {
                              onChannelSelect(selectedSlot.channel);
                              setSelectedSlot(null);
                            }}
                            className="px-4 py-2 bg-[#F5C518] text-black font-semibold rounded-lg hover:bg-[#F5C518]/90 transition-colors flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Watch Live
                          </button>
                        ) : (
                          // Future content - show both options
                          <>
                            <button
                              onClick={() => {
                                setSelectedSlot(null);
                                navigate(`/watch/${selectedSlot.slot.videoId}`);
                              }}
                              className="px-4 py-2 bg-[#8B5CF6] text-white font-semibold rounded-lg hover:bg-[#7C3AED] transition-colors flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Watch Now
                            </button>
                            <button
                              onClick={() => {
                                onChannelSelect(selectedSlot.channel);
                                setSelectedSlot(null);
                              }}
                              className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Tune to Channel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EPGGrid;
