import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Gamepad2, Trophy, Clock, Target, Zap, BookOpen, TrendingUp, Lock, DollarSign, Scale, Mic, Flame } from 'lucide-react';
import { TerminologySprint } from './TerminologySprint';
import { MetricMatch } from './MetricMatch';
import { ValuationGuesstimate } from './ValuationGuesstimate';
import { FoundersDilemma } from './FoundersDilemma';
import { PitchTank } from './PitchTank';
import { BurnRateBlitz } from './BurnRateBlitz';

// Placeholder leaderboard data
const LEADERBOARD = [
  { rank: 1, name: 'StartupPro', score: 12450, emoji: '1' },
  { rank: 2, name: 'VCHunter', score: 11200, emoji: '2' },
  { rank: 3, name: 'FounderX', score: 10890, emoji: '3' },
  { rank: 4, name: 'TechWiz', score: 9500, emoji: '' },
  { rank: 5, name: 'GrowthHacker', score: 8700, emoji: '' },
];

const GAMES = [
  {
    id: 'terminology-sprint',
    title: 'Terminology Sprint',
    description: 'Match startup terms to definitions as fast as you can',
    icon: BookOpen,
    color: '#8B5CF6',
    category: 'quick',
    duration: '1 min',
    available: true,
  },
  {
    id: 'metric-match',
    title: 'Metric Match',
    description: 'Identify the right startup metrics from values',
    icon: TrendingUp,
    color: '#22C55E',
    category: 'quick',
    duration: '1 min',
    available: true,
  },
  {
    id: 'valuation-guesstimate',
    title: 'Valuation Guesstimate',
    description: 'Guess startup valuations from their profiles',
    icon: DollarSign,
    color: '#22C55E',
    category: 'challenge',
    duration: '5 min',
    available: true,
  },
  {
    id: 'founders-dilemma',
    title: "Founder's Dilemma",
    description: 'Make tough decisions in realistic startup scenarios',
    icon: Scale,
    color: '#8B5CF6',
    category: 'challenge',
    duration: '5 min',
    available: true,
  },
  {
    id: 'pitch-tank',
    title: 'Pitch Tank',
    description: 'Build a compelling pitch and get scored on completeness',
    icon: Mic,
    color: '#FF6B6B',
    category: 'challenge',
    duration: '10 min',
    available: true,
  },
  {
    id: 'burn-rate-blitz',
    title: 'Burn Rate Blitz',
    description: 'Manage runway with tough financial decisions',
    icon: Flame,
    color: '#FF9600',
    category: 'challenge',
    duration: '3 min',
    available: true,
  },
];

const COMING_SOON = [
  { title: 'Talk to Users', description: 'User interview simulator' },
  { title: 'Cap Table Crunch', description: 'Equity dilution calculator' },
];

// Game component map
const GAME_COMPONENTS: Record<string, React.FC> = {
  'terminology-sprint': TerminologySprint,
  'metric-match': MetricMatch,
  'valuation-guesstimate': ValuationGuesstimate,
  'founders-dilemma': FoundersDilemma,
  'pitch-tank': PitchTank,
  'burn-rate-blitz': BurnRateBlitz,
};

export const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId?: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If a specific game is selected, render that game
  if (gameId && GAME_COMPONENTS[gameId]) {
    const GameComponent = GAME_COMPONENTS[gameId];
    return <GameComponent />;
  }

  // If game doesn't exist yet, show coming soon
  if (gameId) {
    const game = GAMES.find(g => g.id === gameId);
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8 text-center">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8">
            <div className="w-20 h-20 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {game?.title || 'Game'} Coming Soon
            </h1>
            <p className="text-[#9CA3AF] mb-6">
              This game is still in development. Check back soon!
            </p>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
            >
              Back to Challenges
            </button>
          </div>
        </div>
      </div>
    );
  }

  const quickGames = GAMES.filter(g => g.category === 'quick');
  const challenges = GAMES.filter(g => g.category === 'challenge');

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Challenges</h1>
            <p className="text-[#9CA3AF] text-sm">Train your founder instincts</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Games */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#8B5CF6]" />
                Quick Drills
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickGames.map(game => {
                  const Icon = game.icon;
                  return (
                    <button
                      key={game.id}
                      onClick={() => navigate(`/games/${game.id}`)}
                      className="p-5 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] hover:border-[#8B5CF6]/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: game.color + '20' }}
                        >
                          <Icon className="w-6 h-6" style={{ color: game.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">
                            {game.title}
                          </h3>
                          <p className="text-sm text-[#9CA3AF] mt-1 line-clamp-2">
                            {game.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7280]">
                            <Clock className="w-3 h-3" />
                            <span>{game.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Challenges */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#F5C518]" />
                Challenges
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {challenges.map(game => {
                  const Icon = game.icon;
                  return (
                    <button
                      key={game.id}
                      onClick={() => navigate(`/games/${game.id}`)}
                      className="p-5 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] hover:border-[#F5C518]/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: game.color + '20' }}
                        >
                          <Icon className="w-6 h-6" style={{ color: game.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white group-hover:text-[#F5C518] transition-colors">
                            {game.title}
                          </h3>
                          <p className="text-sm text-[#9CA3AF] mt-1 line-clamp-2">
                            {game.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7280]">
                            <Clock className="w-3 h-3" />
                            <span>{game.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Coming Soon */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#6B7280]" />
                Coming Soon
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {COMING_SOON.map(game => (
                  <div
                    key={game.title}
                    className="p-4 bg-[#1A1A24]/50 rounded-xl border border-[#2E2E3E]/50 opacity-60"
                  >
                    <h3 className="font-medium text-white/60">{game.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1">{game.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#2E2E3E] flex items-center justify-between">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#F5C518]" />
                    Leaderboard
                  </h2>
                  <span className="text-xs text-[#6B7280]">This Week</span>
                </div>
                <div className="divide-y divide-[#2E2E3E]">
                  {LEADERBOARD.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`px-5 py-3 flex items-center gap-3 ${
                        entry.rank <= 3 ? 'bg-[#F5C518]/5' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        entry.rank === 1 ? 'bg-[#F5C518] text-black' :
                        entry.rank === 2 ? 'bg-[#C0C0C0] text-black' :
                        entry.rank === 3 ? 'bg-[#CD7F32] text-white' :
                        'bg-[#2E2E3E] text-[#9CA3AF]'
                      }`}>
                        {entry.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{entry.name}</p>
                      </div>
                      <div className="text-sm font-semibold text-[#F5C518]">
                        {entry.score.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-[#2E2E3E] bg-[#0D0D12]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-sm font-bold text-white">
                      15
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">You</p>
                    </div>
                    <div className="text-sm font-semibold text-[#9CA3AF]">
                      2,340
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="mt-4 p-5 bg-[#1A1A24] rounded-xl border border-[#2E2E3E]">
                <h3 className="font-semibold text-white mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-[#8B5CF6]">12</p>
                    <p className="text-xs text-[#6B7280]">Challenges Crushed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#22C55E]">85%</p>
                    <p className="text-xs text-[#6B7280]">Avg. Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#F5C518]">3</p>
                    <p className="text-xs text-[#6B7280]">Grind Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">2,340</p>
                    <p className="text-xs text-[#6B7280]">Total HP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
