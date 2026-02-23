import React from 'react';
import { X, Play, Heart, Clock } from 'lucide-react';
import { EPGSlot, FastChannel } from '../../types';
import { formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

interface ProgramDetailModalProps {
  slot: EPGSlot;
  channel: FastChannel;
  isLive: boolean;
  onClose: () => void;
  onWatch: () => void;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  slot,
  channel,
  isLive,
  onClose,
  onWatch,
}) => {
  const { toggleSaveVideo, isVideoSaved } = useLibrary();
  const isSaved = isVideoSaved(slot.videoId);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveVideo(slot.videoId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="w-full max-w-lg mx-4 bg-[#1A1A24] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Header with channel info */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10" style={{ backgroundColor: channel.color + '20' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{channel.logo}</span>
            <span className="font-semibold text-white">{channel.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Thumbnail and title */}
          <div className="flex gap-4 mb-4">
            <div className="w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
              <img
                src={slot.video.thumbnail}
                alt={slot.video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white mb-1 line-clamp-2">{slot.video.title}</h2>
              <p className="text-sm text-[#9CA3AF] mb-2">with {slot.video.expert}</p>
              <div className="flex items-center gap-2">
                {isLive ? (
                  <span className="px-2 py-0.5 bg-green-500 text-xs font-bold rounded text-white">ON NOW</span>
                ) : (
                  <span className="px-2 py-0.5 bg-[#3B3B4F] text-xs font-medium rounded text-white/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    LATER
                  </span>
                )}
                <span className="text-xs text-[#9CA3AF]">{formatDuration(slot.video.duration)}</span>
              </div>
            </div>
          </div>

          {/* Air time */}
          <div className="px-4 py-3 bg-[#0D0D12] rounded-xl mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#9CA3AF]" />
              <span className="text-white font-medium">
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </span>
              {isLive && (
                <span className="ml-auto text-xs text-green-400">Airing Now</span>
              )}
            </div>
          </div>

          {/* Tags */}
          {slot.video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {slot.video.tags.slice(0, 5).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/5 rounded-full text-xs text-[#9CA3AF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {isLive ? (
              <button
                onClick={onWatch}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: channel.color, color: 'white' }}
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </button>
            ) : (
              <div className="flex-1 px-4 py-3 bg-[#2E2E3E] rounded-xl text-center">
                <p className="text-sm text-[#9CA3AF]">Starts at {formatTime(slot.startTime)}</p>
              </div>
            )}
            <button
              onClick={handleSave}
              className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                isSaved
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailModal;
