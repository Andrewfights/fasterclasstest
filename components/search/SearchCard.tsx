import React from 'react';
import { Heart, Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

export type BadgeType = 'ON DEMAND' | 'ON NOW' | 'LIVE' | 'COURSE' | 'UPCOMING';

export interface SearchResultItem {
  type: 'video' | 'course' | 'live' | 'upcoming';
  id: string;
  title: string;
  thumbnail: string;
  subtitle: string;
  badge: BadgeType | string;
  badgeColor: string;
  progress?: number;
  duration?: number;
  channelId?: string;
  airTime?: string;
  videoId?: string; // For saving
}

interface SearchCardProps {
  result: SearchResultItem;
  onSelect?: () => void;
}

const getBadgeStyle = (badge: string, badgeColor: string) => {
  return {
    backgroundColor: badgeColor + '20',
    color: badgeColor,
    borderColor: badgeColor + '40',
  };
};

export const SearchCard: React.FC<SearchCardProps> = ({ result, onSelect }) => {
  const navigate = useNavigate();
  const { toggleSaveVideo, isVideoSaved } = useLibrary();

  const videoIdToSave = result.videoId || (result.type === 'video' ? result.id : null);
  const isSaved = videoIdToSave ? isVideoSaved(videoIdToSave) : false;

  const handleClick = () => {
    if (onSelect) {
      onSelect();
      return;
    }

    switch (result.type) {
      case 'video':
        navigate(`/watch/${result.id}`);
        break;
      case 'course':
        navigate(`/course/${result.id}`);
        break;
      case 'live':
      case 'upcoming':
        navigate('/live');
        break;
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoIdToSave) {
      toggleSaveVideo(videoIdToSave);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group text-left w-full"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
        <img
          src={result.thumbnail}
          alt={result.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

        {/* Badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded border"
          style={getBadgeStyle(result.badge, result.badgeColor)}
        >
          {result.badge === 'UPCOMING' && result.airTime ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {result.airTime}
            </span>
          ) : (
            result.badge
          )}
        </div>

        {/* Duration */}
        {result.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-medium text-white">
            {formatDuration(result.duration)}
          </div>
        )}

        {/* Progress bar */}
        {result.progress !== undefined && result.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-[#F5C518]"
              style={{ width: `${Math.min(result.progress, 100)}%` }}
            />
          </div>
        )}

        {/* Save button */}
        {videoIdToSave && (
          <div
            onClick={handleSave}
            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </div>
        )}

        {/* Play indicator for live */}
        {(result.badge === 'ON NOW' || result.badge === 'LIVE') && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#F5C518] transition-colors">
        {result.title}
      </h3>
      <p className="text-xs text-[#6B7280] mt-0.5">{result.subtitle}</p>
    </button>
  );
};

export default SearchCard;
