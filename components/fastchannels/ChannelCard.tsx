import React from 'react';
import { FastChannel, Video, ChannelSchedule } from '../../types';
import { formatDuration } from '../../constants';

interface ChannelCardProps {
  channel: FastChannel;
  isSelected: boolean;
  schedule: ChannelSchedule | null;
  onClick: () => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isSelected,
  schedule,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-48 p-3 rounded-xl transition-all duration-200 ${
        isSelected
          ? 'bg-white/20 ring-2 ring-white scale-105'
          : 'bg-white/5 hover:bg-white/10 hover:scale-102'
      }`}
    >
      {/* Channel Header */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: channel.color + '40' }}
        >
          {channel.logo}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs text-white/40">{channel.number}</span>
            {isSelected && (
              <span className="px-1 py-0.5 bg-red-500 text-[8px] font-bold rounded">LIVE</span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white truncate">{channel.shortName}</h4>
        </div>
      </div>

      {/* Now Playing */}
      {schedule && (
        <div className="mt-2">
          <div className="relative h-16 rounded-lg overflow-hidden mb-2">
            <img
              src={schedule.currentVideo.thumbnail}
              alt={schedule.currentVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-1 left-1 right-1">
              <p className="text-[10px] text-white font-medium truncate">
                {schedule.currentVideo.title}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((schedule.currentVideo.duration - schedule.remaining) / schedule.currentVideo.duration) * 100}%`,
                backgroundColor: channel.color,
              }}
            />
          </div>
        </div>
      )}
    </button>
  );
};
