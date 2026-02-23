import React from 'react';
import { RotateCcw, Rewind, Radio, Play, Pause, SkipBack } from 'lucide-react';

interface DVRControlsProps {
  isLive: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  livePosition: number; // Where "live" currently is (seconds from video start)
  onRestart: () => void;
  onRewind: (seconds: number) => void;
  onGoLive: () => void;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  className?: string;
}

// Format seconds to MM:SS or HH:MM:SS
const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const DVRControls: React.FC<DVRControlsProps> = ({
  isLive,
  isPaused,
  currentTime,
  duration,
  livePosition,
  onRestart,
  onRewind,
  onGoLive,
  onPlayPause,
  onSeek,
  className = '',
}) => {
  // Calculate how far behind live we are
  const behindLive = Math.max(0, livePosition - currentTime);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Progress bar */}
      <div className="relative group">
        <div
          className="h-1 bg-white/20 rounded-full cursor-pointer group-hover:h-2 transition-all"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            onSeek(percentage * duration);
          }}
        >
          {/* Buffered/available */}
          <div
            className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
            style={{ width: `${Math.min(100, (livePosition / duration) * 100)}%` }}
          />
          {/* Progress */}
          <div
            className="absolute inset-y-0 left-0 bg-red-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Scrubber */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Left: Time info */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-white/70 tabular-nums">
            {formatTime(currentTime)}
          </span>
          <span className="text-white/40">/</span>
          <span className="text-white/50 tabular-nums">
            {formatTime(duration)}
          </span>
          {!isLive && behindLive > 0 && (
            <span className="text-amber-400 text-xs">
              -{formatTime(behindLive)} behind
            </span>
          )}
        </div>

        {/* Center: Main controls */}
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={onRestart}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Restart from beginning"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Rewind 30s */}
          <button
            onClick={() => onRewind(30)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Rewind 30 seconds"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="p-3 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
            title={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <Play className="w-6 h-6 ml-0.5" />
            ) : (
              <Pause className="w-6 h-6" />
            )}
          </button>

          {/* Go Live */}
          <button
            onClick={onGoLive}
            disabled={isLive}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              isLive
                ? 'bg-red-500 text-white cursor-default'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Jump to live"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-white animate-pulse' : 'bg-red-500'
              }`}
            />
            {isLive ? 'LIVE' : 'Go Live'}
          </button>
        </div>

        {/* Right: Spacer for balance */}
        <div className="w-32" />
      </div>
    </div>
  );
};

// Compact version for overlay
export const DVRControlsCompact: React.FC<{
  isLive: boolean;
  onRestart: () => void;
  onRewind: (seconds: number) => void;
  onGoLive: () => void;
  className?: string;
}> = ({ isLive, onRestart, onRewind, onGoLive, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onRestart}
        className="p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
        title="Restart"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={() => onRewind(30)}
        className="p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
        title="-30s"
      >
        <SkipBack className="w-4 h-4" />
      </button>
      <button
        onClick={onGoLive}
        disabled={isLive}
        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors ${
          isLive
            ? 'bg-red-500 text-white'
            : 'bg-black/60 text-white hover:bg-black/80'
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isLive ? 'bg-white animate-pulse' : 'bg-red-400'
          }`}
        />
        {isLive ? 'LIVE' : 'GO LIVE'}
      </button>
    </div>
  );
};

export default DVRControls;
