import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check } from 'lucide-react';
import { Video } from '../../types';
import { formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

interface VideoCardProps {
  video: Video;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  layout?: 'horizontal' | 'vertical';
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  showProgress = false,
  size = 'medium',
  layout = 'horizontal',
}) => {
  const navigate = useNavigate();
  const { isVideoSaved, toggleSaveVideo, getVideoProgress } = useLibrary();
  const saved = isVideoSaved(video.id);
  const progress = getVideoProgress(video.id);

  const progressPercent = progress
    ? Math.min((progress.timestamp / video.duration) * 100, 100)
    : 0;

  const handlePlay = () => {
    navigate(`/watch/${video.id}`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveVideo(video.id);
  };

  // Width classes for horizontal layout
  const horizontalSizeClasses = {
    small: 'w-40',
    medium: 'w-56',
    large: 'w-72',
  };

  // Width classes for vertical layout (taller, narrower cards)
  const verticalSizeClasses = {
    small: 'w-32',
    medium: 'w-40',
    large: 'w-48',
  };

  const sizeClasses = layout === 'vertical' ? verticalSizeClasses : horizontalSizeClasses;
  const aspectClass = layout === 'vertical' ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <div
      className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer`}
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className={`relative ${aspectClass} rounded-xl overflow-hidden bg-[#1E1E2E] mb-3`}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Play className="w-5 h-5 text-[#0D0D12] fill-current ml-0.5" />
          </button>
          <button
            onClick={handleSave}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform ${
              saved
                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                : 'border-white/70 text-white hover:border-white'
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs text-white font-medium">
          {formatDuration(video.duration)}
        </div>

        {/* Progress Bar */}
        {showProgress && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E2E3E]">
            <div
              className="h-full bg-[#8B5CF6]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Completed Badge */}
        {progress?.completed && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#166534] rounded text-xs text-white font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            Watched
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2 group-hover:text-[#8B5CF6] transition-colors">
        {video.title}
      </h3>
      <p className="text-[#6B7280] text-xs">{video.expert}</p>
    </div>
  );
};

export default VideoCard;
