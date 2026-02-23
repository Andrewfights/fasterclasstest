import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 8,
  color = '#58CC02',
  backgroundColor = '#E5E5E5',
  showPercentage = false,
  children,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? (
          children
        ) : showPercentage ? (
          <span className="text-sm font-bold text-[#3C3C3C]">
            {Math.round(clampedProgress)}%
          </span>
        ) : null}
      </div>
    </div>
  );
};

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 12,
  color = '#58CC02',
  backgroundColor = '#E5E5E5',
  showPercentage = false,
  animated = true,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor }}
      >
        <div
          className={`h-full rounded-full ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showPercentage && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-2 text-sm font-semibold text-[#3C3C3C]">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
};

interface XPBarProps {
  currentXP: number;
  neededXP: number;
  level: number;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  neededXP,
  level,
  className = '',
}) => {
  const progress = Math.min(100, (currentXP / neededXP) * 100);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Level badge */}
      <div className="w-10 h-10 rounded-full bg-[#FF9600] flex items-center justify-center text-white font-bold shadow-md">
        {level}
      </div>

      {/* Progress bar */}
      <div className="flex-1">
        <div className="h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF9600] to-[#FFB347] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1 text-[#777777]">
          <span>{currentXP} XP</span>
          <span>{neededXP} XP</span>
        </div>
      </div>
    </div>
  );
};
