import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Gamepad2, BookOpen, FileText, ChevronRight, Clock } from 'lucide-react';
import { Video, GameSessionState, WatchHistoryItem } from '../../types';
import { formatDuration } from '../../constants';

interface ContinueItem {
  type: 'video' | 'game' | 'module' | 'homework';
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  progress: number; // 0-100
  timeEstimate?: string;
  xpReward?: number;
  route: string;
}

interface ContinueJourneyProps {
  watchHistory?: WatchHistoryItem[];
  gameSessions?: Record<string, GameSessionState>;
  videos?: Video[];
  inProgressModules?: Array<{ moduleId: string; title: string; progress: number; courseTitle: string }>;
}

const GAME_NAMES: Record<string, string> = {
  'flashcards': 'Flashcards',
  'scenario-challenge': 'Scenario Challenge',
  'term-match': 'Term Match',
  'video-quiz': 'Video Quiz',
  'advisor-match': 'Advisor Match',
  'word-scramble': 'Word Scramble',
  'time-pressure': 'Time Pressure Quiz',
};

export const ContinueJourney: React.FC<ContinueJourneyProps> = ({
  watchHistory = [],
  gameSessions = {},
  videos = [],
  inProgressModules = [],
}) => {
  const navigate = useNavigate();

  // Build continue items from various sources
  const continueItems: ContinueItem[] = [];

  // Add in-progress games
  Object.entries(gameSessions).forEach(([gameType, session]) => {
    if (!session.isPaused && session.currentRound && session.totalRounds) {
      const progress = Math.round((session.currentRound / session.totalRounds) * 100);
      continueItems.push({
        type: 'game',
        id: gameType,
        title: GAME_NAMES[gameType] || gameType,
        subtitle: `Round ${session.currentRound}/${session.totalRounds}`,
        progress,
        xpReward: 50,
        route: `/games?resume=${gameType}`,
      });
    }
  });

  // Add in-progress videos
  watchHistory
    .filter(h => !h.completed && h.timestamp > 30)
    .slice(0, 3)
    .forEach(historyItem => {
      const video = videos.find(v => v.id === historyItem.videoId);
      if (video) {
        const progress = Math.round((historyItem.timestamp / video.duration) * 100);
        continueItems.push({
          type: 'video',
          id: video.id,
          title: video.title,
          subtitle: video.expert,
          thumbnail: video.thumbnail,
          progress,
          timeEstimate: formatDuration(video.duration - historyItem.timestamp) + ' left',
          xpReward: 10,
          route: `/watch/${video.id}?t=${historyItem.timestamp}`,
        });
      }
    });

  // Add in-progress modules
  inProgressModules.slice(0, 2).forEach(mod => {
    continueItems.push({
      type: 'module',
      id: mod.moduleId,
      title: mod.title,
      subtitle: mod.courseTitle,
      progress: mod.progress,
      xpReward: 100,
      route: `/courses`,
    });
  });

  if (continueItems.length === 0) {
    return null;
  }

  const getIcon = (type: ContinueItem['type']) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      case 'module': return <BookOpen className="w-4 h-4" />;
      case 'homework': return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ContinueItem['type']) => {
    switch (type) {
      case 'video': return 'bg-blue-500/20 text-blue-400';
      case 'game': return 'bg-purple-500/20 text-purple-400';
      case 'module': return 'bg-green-500/20 text-green-400';
      case 'homework': return 'bg-orange-500/20 text-orange-400';
    }
  };

  return (
    <div className="bg-[#13131A] rounded-2xl border border-[#2E2E3E] overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#2E2E3E]/50">
        <div>
          <h3 className="text-lg font-bold text-white">Continue Your Journey</h3>
          <p className="text-sm text-[#6B7280]">Pick up where you left off</p>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-[#2E2E3E]/50">
        {continueItems.slice(0, 4).map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() => navigate(item.route)}
            className="w-full px-4 sm:px-6 py-4 flex items-center gap-4 text-left hover:bg-[#1A1A24] transition-colors"
          >
            {/* Thumbnail or icon */}
            {item.thumbnail ? (
              <div className="relative w-20 h-12 sm:w-24 sm:h-14 rounded-lg overflow-hidden bg-[#2E2E3E] flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Progress overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div
                    className="h-full bg-[#c9a227]"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(item.type)}`}>
                {getIcon(item.type)}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                {item.xpReward && (
                  <span className="text-xs text-[#c9a227]">+{item.xpReward} XP</span>
                )}
              </div>
              <p className="font-medium text-white truncate mt-1">{item.title}</p>
              <div className="flex items-center gap-3 mt-0.5">
                {item.subtitle && (
                  <p className="text-sm text-[#6B7280] truncate">{item.subtitle}</p>
                )}
                {item.timeEstimate && (
                  <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <Clock className="w-3 h-3" />
                    {item.timeEstimate}
                  </div>
                )}
              </div>
              {/* Progress bar */}
              {!item.thumbnail && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#2E2E3E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a227] rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6B7280]">{item.progress}%</span>
                </div>
              )}
            </div>

            {/* Resume button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline text-sm font-medium text-[#c9a227]">Resume</span>
              <ChevronRight className="w-4 h-4 text-[#c9a227]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContinueJourney;
