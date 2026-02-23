import React from 'react';
import { FastChannel, ChannelSchedule } from '../../types';
import { formatDuration } from '../../constants';

interface NowPlayingProps {
  channel: FastChannel;
  schedule: ChannelSchedule;
  visible: boolean;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({ channel, schedule, visible }) => {
  const progress = ((schedule.currentVideo.duration - schedule.remaining) / schedule.currentVideo.duration) * 100;
  const remainingMinutes = Math.ceil(schedule.remaining / 60);

  return (
    <div
      className={`absolute bottom-24 left-4 right-4 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="max-w-2xl bg-black/80 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        {/* Channel Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: channel.color + '30' }}
          >
            {channel.logo}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-500 text-[10px] font-bold rounded animate-pulse">LIVE</span>
              <span className="text-white font-semibold">{channel.name}</span>
              <span className="text-white/40 text-sm">CH {channel.number}</span>
            </div>
          </div>
        </div>

        {/* Now Playing Info */}
        <div className="px-4 py-4">
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={schedule.currentVideo.thumbnail}
                alt={schedule.currentVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-medium">
                {formatDuration(schedule.currentVideo.duration)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white leading-tight truncate">
                {schedule.currentVideo.title}
              </h3>
              <p className="text-sm text-white/60 mt-0.5">
                with {schedule.currentVideo.expert}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                <span>{remainingMinutes} min remaining</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  backgroundColor: channel.color,
                }}
              />
            </div>
          </div>

          {/* Up Next */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 uppercase tracking-wide">Up Next</span>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-sm text-white truncate">{schedule.nextVideo.title}</span>
                <span className="text-xs text-white/40 flex-shrink-0">
                  {formatDuration(schedule.nextVideo.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
