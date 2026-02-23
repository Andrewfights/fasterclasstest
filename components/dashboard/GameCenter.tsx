import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Gamepad2, Brain, Zap, Users, BookOpen, Shuffle, Clock, ChevronRight, Star } from 'lucide-react';
import { GameSessionState, FounderStage } from '../../types';

interface GameInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  xpReward: number;
  route: string;
  stages?: FounderStage[]; // Recommended for these stages
}

const GAMES: GameInfo[] = [
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Master startup terminology',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    xpReward: 30,
    route: '/games?game=flashcards',
    stages: ['idea', 'preseed'],
  },
  {
    id: 'scenario-challenge',
    name: 'Scenario Challenge',
    description: 'Make tough founder decisions',
    icon: <Brain className="w-5 h-5" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    xpReward: 75,
    route: '/games?game=scenario',
    stages: ['seed', 'seriesA'],
  },
  {
    id: 'term-match',
    name: 'Term Match',
    description: 'Connect terms to definitions',
    icon: <Shuffle className="w-5 h-5" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    xpReward: 40,
    route: '/games?game=term-match',
    stages: ['idea', 'preseed'],
  },
  {
    id: 'advisor-match',
    name: 'Advisor Match',
    description: 'Find the right advisors',
    icon: <Users className="w-5 h-5" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    xpReward: 50,
    route: '/games?game=advisor',
    stages: ['preseed', 'seed'],
  },
  {
    id: 'time-pressure',
    name: 'Time Pressure Quiz',
    description: 'Answer under pressure',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    xpReward: 60,
    route: '/games?game=time-pressure',
    stages: ['seed', 'seriesA', 'seriesB'],
  },
  {
    id: 'video-quiz',
    name: 'Video Quiz',
    description: 'Test what you watched',
    icon: <Play className="w-5 h-5" />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    xpReward: 50,
    route: '/games?game=video-quiz',
  },
];

interface GameCenterProps {
  gameSessions?: Record<string, GameSessionState>;
  currentStage?: FounderStage;
  onSeeAll?: () => void;
}

export const GameCenter: React.FC<GameCenterProps> = ({
  gameSessions = {},
  currentStage = 'idea',
  onSeeAll,
}) => {
  const navigate = useNavigate();

  // Find in-progress games
  const inProgressGames = GAMES.filter(game => {
    const session = gameSessions[game.id];
    return session && !session.isPaused && session.currentRound;
  });

  // Recommended games for current stage
  const recommendedGames = GAMES.filter(game => {
    const session = gameSessions[game.id];
    const isInProgress = session && !session.isPaused && session.currentRound;
    return !isInProgress && (!game.stages || game.stages.includes(currentStage));
  }).slice(0, 3);

  return (
    <div className="bg-[#13131A] rounded-2xl border border-[#2E2E3E] overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#2E2E3E]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Game Center</h3>
            <p className="text-sm text-[#6B7280]">Learn while having fun</p>
          </div>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* In Progress Section */}
      {inProgressGames.length > 0 && (
        <div className="px-4 sm:px-6 py-4 border-b border-[#2E2E3E]/50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#c9a227]" />
            <span className="text-sm font-medium text-[#c9a227]">IN PROGRESS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inProgressGames.map(game => {
              const session = gameSessions[game.id];
              const progress = session?.currentRound && session?.totalRounds
                ? Math.round((session.currentRound / session.totalRounds) * 100)
                : 0;

              return (
                <button
                  key={game.id}
                  onClick={() => navigate(game.route + '&resume=true')}
                  className="flex items-center gap-3 p-3 bg-[#1A1A24] rounded-xl hover:bg-[#2E2E3E] transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-lg ${game.bgColor} flex items-center justify-center flex-shrink-0 ${game.color}`}>
                    {game.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{game.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-[#2E2E3E] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#c9a227] rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#6B7280]">
                        {session?.currentRound}/{session?.totalRounds}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Games */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[#9CA3AF]" />
          <span className="text-sm font-medium text-[#9CA3AF]">RECOMMENDED FOR YOU</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommendedGames.map(game => (
            <button
              key={game.id}
              onClick={() => navigate(game.route)}
              className="flex flex-col items-center p-4 bg-[#1A1A24] rounded-xl hover:bg-[#2E2E3E] transition-colors text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${game.bgColor} flex items-center justify-center mb-3 ${game.color}`}>
                {game.icon}
              </div>
              <p className="font-medium text-white text-sm">{game.name}</p>
              <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{game.description}</p>
              <span className="text-xs text-[#c9a227] mt-2">+{game.xpReward} XP</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Play */}
      <div className="px-4 sm:px-6 pb-4">
        <button
          onClick={() => navigate('/games')}
          className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-purple-400 font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" />
          Browse All Games
        </button>
      </div>
    </div>
  );
};

export default GameCenter;
