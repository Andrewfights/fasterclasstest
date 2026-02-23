import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { FastChannel, Video, EPGSlot } from '../../types';
import { formatDuration } from '../../constants';

interface EPGGuideProps {
  channels: FastChannel[];
  currentChannel: FastChannel;
  onChannelSelect: (channel: FastChannel) => void;
  onClose: () => void;
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

  // Find current position in the loop
  let loopPosition = now % totalDuration;
  let currentTime = now;
  let videoIndex = 0;

  // Find which video is currently playing
  let accumulated = 0;
  for (let i = 0; i < channelVideos.length; i++) {
    if (accumulated + channelVideos[i].duration > loopPosition) {
      videoIndex = i;
      currentTime = now - (loopPosition - accumulated);
      break;
    }
    accumulated += channelVideos[i].duration;
  }

  // Generate slots
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

export const EPGGuide: React.FC<EPGGuideProps> = ({
  channels,
  currentChannel,
  onChannelSelect,
  onClose,
  videos,
}) => {
  const now = Date.now() / 1000;

  // Generate EPG data for all channels
  const epgData = useMemo(() => {
    return channels.map(channel => ({
      channel,
      slots: generateEPGSlots(channel, videos, 3),
    }));
  }, [channels, videos]);

  // Calculate time markers (every 30 minutes)
  const timeMarkers = useMemo(() => {
    const markers: number[] = [];
    const startTime = Math.floor(now / 1800) * 1800; // Round to nearest 30 min
    for (let i = 0; i < 7; i++) {
      markers.push(startTime + i * 1800);
    }
    return markers;
  }, [now]);

  // Calculate pixel position for a timestamp
  const getPosition = (timestamp: number): number => {
    const baseTime = timeMarkers[0];
    const totalWidth = 100; // percentage
    const totalDuration = 3 * 3600; // 3 hours in seconds
    return ((timestamp - baseTime) / totalDuration) * totalWidth;
  };

  // Calculate width for a slot
  const getSlotWidth = (slot: EPGSlot): number => {
    const totalDuration = 3 * 3600;
    const slotDuration = slot.endTime - slot.startTime;
    return (slotDuration / totalDuration) * 100;
  };

  return (
    <div className="absolute inset-0 bg-[#0D0D12]/95 backdrop-blur-lg z-30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Program Guide</h2>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Time Headers */}
      <div className="flex border-b border-white/10">
        <div className="w-48 flex-shrink-0 px-4 py-2 bg-[#1A1A24]">
          <span className="text-sm text-white/40">Channel</span>
        </div>
        <div className="flex-1 relative">
          <div className="flex">
            {timeMarkers.map((time, i) => (
              <div
                key={time}
                className="flex-1 px-2 py-2 text-sm text-white/60 border-l border-white/10"
              >
                {formatTime(time)}
              </div>
            ))}
          </div>
          {/* Now indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: `${getPosition(now)}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-red-500 rounded text-[10px] font-bold">
              NOW
            </div>
          </div>
        </div>
      </div>

      {/* Channel Rows */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {epgData.map(({ channel, slots }) => {
          const isCurrentChannel = channel.id === currentChannel.id;

          return (
            <div
              key={channel.id}
              className={`flex border-b border-white/5 ${
                isCurrentChannel ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              {/* Channel Info */}
              <button
                onClick={() => onChannelSelect(channel)}
                className="w-48 flex-shrink-0 px-4 py-3 flex items-center gap-3 text-left hover:bg-white/10 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: channel.color + '30' }}
                >
                  {channel.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{channel.number}</span>
                    {isCurrentChannel && (
                      <span className="px-1 py-0.5 bg-red-500 text-[8px] font-bold rounded">LIVE</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white">{channel.name}</span>
                </div>
              </button>

              {/* Program Slots */}
              <div className="flex-1 relative py-2">
                <div className="absolute inset-0 flex">
                  {slots.map((slot, i) => {
                    const left = getPosition(slot.startTime);
                    const width = getSlotWidth(slot);
                    const isPlaying = slot.startTime <= now && slot.endTime > now;

                    // Skip if slot is before visible area
                    if (left + width < 0) return null;
                    // Skip if slot starts after visible area
                    if (left > 100) return null;

                    return (
                      <button
                        key={`${slot.videoId}-${i}`}
                        onClick={() => onChannelSelect(channel)}
                        className={`absolute top-2 bottom-2 rounded-lg overflow-hidden transition-all hover:ring-2 hover:ring-white/40 ${
                          isPlaying
                            ? 'ring-2 ring-white/60'
                            : 'bg-white/5'
                        }`}
                        style={{
                          left: `${Math.max(0, left)}%`,
                          width: `${Math.min(width, 100 - Math.max(0, left))}%`,
                          backgroundColor: isPlaying ? channel.color + '30' : undefined,
                        }}
                      >
                        <div className="h-full px-2 py-1 flex flex-col justify-center">
                          <p className="text-xs font-medium text-white truncate">
                            {slot.video.title}
                          </p>
                          <p className="text-[10px] text-white/50 truncate">
                            {slot.video.expert} · {formatDuration(slot.video.duration)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-sm text-white/60">
        Press <span className="text-white font-medium">G</span> or <span className="text-white font-medium">ESC</span> to close guide
      </div>
    </div>
  );
};
