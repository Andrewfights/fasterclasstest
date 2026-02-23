import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Flame,
  Trophy,
  Zap,
  RotateCcw,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Timer,
} from 'lucide-react';
import {
  BURNRATE_SCENARIOS,
  BURNRATE_SCORING,
  BURNRATE_GAME_DURATION,
  SCENARIOS_PER_GAME,
  BurnRateScenario,
  BurnRateDecision,
} from '../../data/games/burnrateData';
import { useGamification } from '../../contexts/GamificationContext';

type GameState = 'ready' | 'playing' | 'reveal' | 'finished';

// Shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Format currency
const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

export const BurnRateBlitz: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useGamification();

  const [gameState, setGameState] = useState<GameState>('ready');
  const [timeLeft, setTimeLeft] = useState(BURNRATE_GAME_DURATION);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scenarios, setScenarios] = useState<BurnRateScenario[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<BurnRateDecision | null>(null);
  const [results, setResults] = useState<Array<{
    scenario: BurnRateScenario;
    decision: BurnRateDecision;
    isOptimal: boolean;
  }>>([]);

  // Start game
  const startGame = useCallback(() => {
    const shuffled = shuffleArray(BURNRATE_SCENARIOS).slice(0, SCENARIOS_PER_GAME);
    setScenarios(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTotalXP(0);
    setTimeLeft(BURNRATE_GAME_DURATION);
    setSelectedDecision(null);
    setResults([]);
    setGameState('playing');
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Submit decision
  const handleDecision = useCallback((decision: BurnRateDecision) => {
    if (gameState !== 'playing' || !scenarios[currentIndex]) return;

    setSelectedDecision(decision);
    const scenario = scenarios[currentIndex];

    const scoring = decision.isOptimal ? BURNRATE_SCORING.optimal :
                    decision.effect.risk === 'low' ? BURNRATE_SCORING.acceptable :
                    BURNRATE_SCORING.poor;
    setScore((prev) => prev + scoring.points);
    setTotalXP((prev) => prev + scoring.xp);

    setResults((prev) => [...prev, { scenario, decision, isOptimal: decision.isOptimal }]);
    setGameState('reveal');
  }, [gameState, scenarios, currentIndex]);

  // Continue to next scenario
  const handleContinue = useCallback(() => {
    if (currentIndex + 1 >= SCENARIOS_PER_GAME) {
      setGameState('finished');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedDecision(null);
      setGameState('playing');
    }
  }, [currentIndex]);

  // Award XP when game finishes
  useEffect(() => {
    if (gameState === 'finished' && totalXP > 0) {
      addXP(totalXP);
    }
  }, [gameState, totalXP, addXP]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>

          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-[var(--shadow-card)]">
            <div className="w-20 h-20 rounded-2xl bg-[#FF9600]/20 flex items-center justify-center mx-auto mb-6">
              <Flame className="w-10 h-10 text-[#FF9600]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Burn Rate Blitz</h1>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              Manage your startup's runway. Make quick decisions about hiring, spending, and pivots to extend your survival.
            </p>

            <div className="flex justify-center gap-6 mb-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-[#FF9600]">{SCENARIOS_PER_GAME}</p>
                <p className="text-[var(--color-text-muted)]">scenarios</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-accent)]">{Math.floor(BURNRATE_GAME_DURATION / 60)} min</p>
                <p className="text-[var(--color-text-muted)]">time limit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#22C55E]">+{BURNRATE_SCORING.optimal.xp} XP</p>
                <p className="text-[var(--color-text-muted)]">per optimal</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-[#FF9600] text-white font-bold text-lg rounded-xl hover:bg-[#E88B00] transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing & Reveal screens
  if ((gameState === 'playing' || gameState === 'reveal') && scenarios[currentIndex]) {
    const scenario = scenarios[currentIndex];
    const netBurn = scenario.initialState.monthlyBurn - scenario.initialState.monthlyRevenue;

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] pt-14 pb-32">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header Stats */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quit
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xl font-bold text-[var(--color-text-primary)]">{score}</p>
                <p className="text-xs text-[var(--color-text-muted)]">points</p>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                timeLeft <= 30 ? 'bg-red-500/20 text-red-400' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: SCENARIOS_PER_GAME }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full ${
                  i < currentIndex
                    ? results[i]?.isOptimal ? 'bg-[#22C55E]' : 'bg-[var(--color-accent)]'
                    : i === currentIndex
                    ? 'bg-[#FF9600]'
                    : 'bg-[var(--color-bg-secondary)]'
                }`}
              />
            ))}
          </div>

          {/* Scenario Card */}
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)] mb-6">
            {/* Financial Dashboard */}
            <div className="p-6 bg-gradient-to-r from-[#FF9600]/10 to-[#FF9600]/5 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{scenario.title}</h2>
                <span className="text-sm text-[var(--color-text-muted)]">
                  Scenario {currentIndex + 1} of {SCENARIOS_PER_GAME}
                </span>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--color-bg-primary)] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#22C55E] mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-semibold">Cash</span>
                  </div>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(scenario.initialState.cash)}
                  </p>
                </div>
                <div className="bg-[var(--color-bg-primary)] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs font-semibold">Monthly Burn</span>
                  </div>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(scenario.initialState.monthlyBurn)}
                  </p>
                </div>
                <div className="bg-[var(--color-bg-primary)] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#1CB0F6] mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-semibold">Revenue</span>
                  </div>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(scenario.initialState.monthlyRevenue)}
                  </p>
                </div>
                <div className="bg-[var(--color-bg-primary)] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#FF9600] mb-1">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-semibold">Runway</span>
                  </div>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {scenario.initialState.runway.toFixed(1)} mo
                  </p>
                </div>
              </div>

              {/* Net Burn */}
              <div className="mt-4 p-3 bg-red-500/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-red-400 font-semibold">Net Monthly Burn</span>
                </div>
                <span className="text-lg font-bold text-red-400">-{formatCurrency(netBurn)}</span>
              </div>
            </div>

            {/* Context & Situation */}
            <div className="p-6">
              <p className="text-[var(--color-text-secondary)] mb-4">{scenario.context}</p>
              <div className="p-4 bg-[#FF9600]/10 border border-[#FF9600]/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#FF9600] flex-shrink-0 mt-0.5" />
                  <p className="text-[var(--color-text-primary)]">{scenario.situation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reveal State */}
          {gameState === 'reveal' && selectedDecision && (
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-6 mb-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-4">
                {selectedDecision.isOptimal ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                    <h3 className="text-lg font-bold text-[#22C55E]">Optimal Decision!</h3>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-[var(--color-accent)]" />
                    <h3 className="text-lg font-bold text-[var(--color-accent)]">There's a Better Move</h3>
                  </>
                )}
              </div>

              {/* Decision outcome */}
              <div className={`p-4 rounded-xl mb-4 ${
                selectedDecision.isOptimal ? 'bg-[#22C55E]/10 border border-[#22C55E]' : 'bg-[var(--color-bg-primary)] border border-[var(--color-border)]'
              }`}>
                <p className="font-semibold text-[var(--color-text-primary)] mb-2">{selectedDecision.label}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{selectedDecision.outcome}</p>
              </div>

              {/* Impact */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {selectedDecision.effect.burnRateChange !== 0 && (
                  <div className="p-3 bg-[var(--color-bg-primary)] rounded-xl text-center">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Burn Rate</p>
                    <p className={`font-bold ${
                      selectedDecision.effect.burnRateChange < 0 ? 'text-[#22C55E]' : 'text-red-400'
                    }`}>
                      {selectedDecision.effect.burnRateChange > 0 ? '+' : ''}{formatCurrency(selectedDecision.effect.burnRateChange)}
                    </p>
                  </div>
                )}
                {selectedDecision.effect.revenueChange !== 0 && (
                  <div className="p-3 bg-[var(--color-bg-primary)] rounded-xl text-center">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Revenue</p>
                    <p className={`font-bold ${
                      selectedDecision.effect.revenueChange > 0 ? 'text-[#22C55E]' : 'text-red-400'
                    }`}>
                      {selectedDecision.effect.revenueChange > 0 ? '+' : ''}{formatCurrency(selectedDecision.effect.revenueChange)}
                    </p>
                  </div>
                )}
                <div className="p-3 bg-[var(--color-bg-primary)] rounded-xl text-center">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Risk Level</p>
                  <p className={`font-bold ${
                    selectedDecision.effect.risk === 'low' ? 'text-[#22C55E]' :
                    selectedDecision.effect.risk === 'medium' ? 'text-[var(--color-accent)]' :
                    'text-red-400'
                  }`}>
                    {selectedDecision.effect.risk.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Optimal choice if different */}
              {!selectedDecision.isOptimal && (
                <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E] rounded-xl mb-4">
                  <p className="font-semibold text-[#22C55E] mb-2">
                    Better Choice: {scenario.decisions.find(d => d.isOptimal)?.label}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {scenario.decisions.find(d => d.isOptimal)?.outcome}
                  </p>
                </div>
              )}

              {/* Lesson */}
              <div className="flex items-start gap-3 p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <Flame className="w-5 h-5 text-[#FF9600] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#FF9600] mb-1">Key Lesson</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{scenario.lesson}</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full mt-4 px-6 py-3 bg-[#FF9600] text-white font-semibold rounded-xl hover:bg-[#E88B00] transition-colors flex items-center justify-center gap-2"
              >
                {currentIndex + 1 >= SCENARIOS_PER_GAME ? 'See Results' : 'Next Scenario'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Decisions */}
          {gameState === 'playing' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">What's your move?</h3>
              {scenario.decisions.map((decision) => (
                <button
                  key={decision.id}
                  onClick={() => handleDecision(decision)}
                  className="w-full p-5 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl text-left hover:border-[#FF9600] hover:bg-[#FF9600]/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)] mb-1">{decision.label}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{decision.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      decision.effect.risk === 'low' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                      decision.effect.risk === 'medium' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {decision.effect.risk} risk
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const optimalCount = results.filter((r) => r.isOptimal).length;
    const accuracy = Math.round((optimalCount / results.length) * 100) || 0;

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-[var(--shadow-card)]">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Game Complete!</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Here's how you managed your runway</p>

            {/* Score */}
            <div className="mb-8">
              <p className="text-6xl font-bold text-[#FF9600]">{score}</p>
              <p className="text-[var(--color-text-secondary)]">points</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{optimalCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Optimal</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--color-accent)]">{results.length - optimalCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Suboptimal</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{accuracy}%</p>
                <p className="text-xs text-[var(--color-text-muted)]">Accuracy</p>
              </div>
            </div>

            {/* XP Earned */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/20 rounded-full mb-8">
              <Zap className="w-5 h-5 text-[#22C55E]" />
              <span className="text-[#22C55E] font-bold">+{totalXP} XP earned!</span>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/games')}
                className="px-6 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-semibold rounded-xl hover:bg-[var(--color-border)] transition-colors"
              >
                Back to Games
              </button>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF9600] text-white font-semibold rounded-xl hover:bg-[#E88B00] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BurnRateBlitz;
