import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FastChannel, Video, ChannelSchedule } from '../../types';
import { ChannelCard } from './ChannelCard';

interface ChannelStripProps {
  channels: FastChannel[];
  currentChannel: FastChannel;
  onChannelSelect: (channel: FastChannel) => void;
  visible: boolean;
  videos: Video[];
}

// Calculate schedule for any channel
const getChannelSchedule = (channel: FastChannel, videos: Video[]): ChannelSchedule | null => {
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
      const startOffset = loopPosition - accumulated;
      const remaining = video.duration - startOffset;

      const upcoming: Video[] = [];
      for (let j = 1; j <= 5; j++) {
        upcoming.push(channelVideos[(i + j) % channelVideos.length]);
      }

      return {
        channelId: channel.id,
        currentVideo: video,
        startOffset,
        remaining,
        nextVideo: channelVideos[(i + 1) % channelVideos.length],
        upcomingVideos: upcoming,
      };
    }
    accumulated += video.duration;
  }

  return {
    channelId: channel.id,
    currentVideo: channelVideos[0],
    startOffset: 0,
    remaining: channelVideos[0].duration,
    nextVideo: channelVideos[1] || channelVideos[0],
    upcomingVideos: channelVideos.slice(1, 6),
  };
};

export const ChannelStrip: React.FC<ChannelStripProps> = ({
  channels,
  currentChannel,
  onChannelSelect,
  visible,
  videos,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to current channel when it changes
  useEffect(() => {
    if (scrollRef.current) {
      const currentIndex = channels.findIndex(c => c.id === currentChannel.id);
      const cardWidth = 208; // w-48 (192px) + gap (16px)
      const scrollPosition = currentIndex * cardWidth - scrollRef.current.clientWidth / 2 + cardWidth / 2;
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [currentChannel, channels]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="relative px-4 py-4">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-r-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-l-xl transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Channel Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {channels.map(channel => {
            const schedule = getChannelSchedule(channel, videos);
            return (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isSelected={channel.id === currentChannel.id}
                schedule={schedule}
                onClick={() => onChannelSelect(channel)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
