import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Trophy,
  Zap,
  RotateCcw,
  TrendingUp,
  Users,
  Calendar,
  Lightbulb,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  STARTUP_PROFILES,
  VALUATION_OPTIONS,
  VALUATION_SCORING,
  StartupProfile,
} from '../../data/games/valuationData';
import { useGamification } from '../../contexts/GamificationContext';

type GameState = 'ready' | 'playing' | 'reveal' | 'finished';

const GAME_DURATION = 300; // 5 minutes
const QUESTIONS_PER_GAME = 5;

// Shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Check if guess is correct
const evaluateGuess = (
  guess: { min: number; max: number },
  actual: { min: number; max: number }
): 'exact' | 'close' | 'reasonable' | 'miss' => {
  // Check for overlap (exact match)
  if (guess.min <= actual.max && guess.max >= actual.min) {
    return 'exact';
  }

  // Calculate center points and check proximity
  const guessMid = (guess.min + guess.max) / 2;
  const actualMid = (actual.min + actual.max) / 2;
  const actualRange = actual.max - actual.min;

  const distance = Math.abs(guessMid - actualMid);
  const percentOff = distance / actualMid;

  if (percentOff <= 0.25) return 'close';
  if (percentOff <= 0.50) return 'reasonable';
  return 'miss';
};

export const ValuationGuesstimate: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useGamification();

  const [gameState, setGameState] = useState<GameState>('ready');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<StartupProfile[]>([]);
  const [selectedGuess, setSelectedGuess] = useState<typeof VALUATION_OPTIONS[0] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<Array<{
    startup: StartupProfile;
    guess: typeof VALUATION_OPTIONS[0];
    result: 'exact' | 'close' | 'reasonable' | 'miss';
  }>>([]);

  // Start game
  const startGame = useCallback(() => {
    const shuffled = shuffleArray(STARTUP_PROFILES).slice(0, QUESTIONS_PER_GAME);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTotalXP(0);
    setTimeLeft(GAME_DURATION);
    setSelectedGuess(null);
    setShowHint(false);
    setResults([]);
    setGameState('playing');
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'reveal') return;

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

  // Submit guess
  const handleGuess = useCallback((option: typeof VALUATION_OPTIONS[0]) => {
    if (gameState !== 'playing' || !questions[currentIndex]) return;

    setSelectedGuess(option);
    const startup = questions[currentIndex];
    const result = evaluateGuess(option, startup.actualValuation);

    const scoring = VALUATION_SCORING[result];
    setScore((prev) => prev + scoring.points);
    setTotalXP((prev) => prev + scoring.xp);

    setResults((prev) => [...prev, { startup, guess: option, result }]);
    setGameState('reveal');
  }, [gameState, questions, currentIndex]);

  // Continue to next question
  const handleContinue = useCallback(() => {
    if (currentIndex + 1 >= QUESTIONS_PER_GAME) {
      setGameState('finished');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedGuess(null);
      setShowHint(false);
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
            <div className="w-20 h-20 rounded-2xl bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-[#22C55E]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Valuation Guesstimate</h1>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              Review startup profiles and guess their valuation. Use metrics, stage, and industry knowledge to estimate accurately.
            </p>

            <div className="flex justify-center gap-6 mb-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-[#22C55E]">{QUESTIONS_PER_GAME}</p>
                <p className="text-[var(--color-text-muted)]">startups</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-accent)]">{Math.floor(GAME_DURATION / 60)} min</p>
                <p className="text-[var(--color-text-muted)]">time limit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B5CF6]">+20 XP</p>
                <p className="text-[var(--color-text-muted)]">per exact</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-[#22C55E] text-white font-bold text-lg rounded-xl hover:bg-[#16A34A] transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing & Reveal screens
  if ((gameState === 'playing' || gameState === 'reveal') && questions[currentIndex]) {
    const startup = questions[currentIndex];

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
                <p className="text-xl font-bold text-[var(--color-text-primary)]">{score.toLocaleString()}</p>
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
            {Array.from({ length: QUESTIONS_PER_GAME }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full ${
                  i < currentIndex
                    ? 'bg-[#22C55E]'
                    : i === currentIndex
                    ? 'bg-[var(--color-accent)]'
                    : 'bg-[var(--color-bg-secondary)]'
                }`}
              />
            ))}
          </div>

          {/* Startup Profile Card */}
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)] mb-6">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#22C55E]/10 to-[#22C55E]/5 border-b border-[var(--color-border)]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#22C55E]/20 text-[#22C55E] text-xs font-semibold rounded-full mb-2">
                    {startup.stage}
                  </span>
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{startup.name}</h2>
                  <p className="text-[var(--color-text-secondary)] text-sm">{startup.industry}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-[var(--color-text-muted)]">Startup {currentIndex + 1} of {QUESTIONS_PER_GAME}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 border-b border-[var(--color-border)]">
              <p className="text-[var(--color-text-primary)]">{startup.description}</p>
            </div>

            {/* Metrics Grid */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {startup.metrics.arr && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#22C55E]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--color-text-primary)]">{startup.metrics.arr}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">ARR</p>
                  </div>
                </div>
              )}
              {startup.metrics.mrr && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--color-text-primary)]">{startup.metrics.mrr}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">MRR</p>
                  </div>
                </div>
              )}
              {startup.metrics.users && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1CB0F6]/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#1CB0F6]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--color-text-primary)]">{startup.metrics.users}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Users/Customers</p>
                  </div>
                </div>
              )}
              {startup.metrics.growth && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--color-text-primary)]">{startup.metrics.growth}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Growth Rate</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{startup.teamSize}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Team Size</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{startup.founded}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Founded</p>
                </div>
              </div>
            </div>

            {/* Funding History */}
            {startup.fundingHistory && (
              <div className="px-6 pb-6">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  <span className="font-semibold">Previous Funding:</span> {startup.fundingHistory}
                </p>
              </div>
            )}

            {/* Hint */}
            {showHint && gameState === 'playing' && (
              <div className="px-6 pb-6">
                <div className="flex items-start gap-3 p-4 bg-[var(--color-accent)]/10 rounded-xl">
                  <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--color-text-secondary)]">{startup.hint}</p>
                </div>
              </div>
            )}
          </div>

          {/* Reveal State */}
          {gameState === 'reveal' && selectedGuess && (
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-6 mb-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Results</h3>
                {results[results.length - 1]?.result === 'exact' && (
                  <span className="flex items-center gap-2 text-[#22C55E]">
                    <CheckCircle className="w-5 h-5" />
                    Exact Match!
                  </span>
                )}
                {results[results.length - 1]?.result === 'close' && (
                  <span className="flex items-center gap-2 text-[var(--color-accent)]">
                    <CheckCircle className="w-5 h-5" />
                    Very Close!
                  </span>
                )}
                {results[results.length - 1]?.result === 'reasonable' && (
                  <span className="flex items-center gap-2 text-[#8B5CF6]">
                    Reasonable
                  </span>
                )}
                {results[results.length - 1]?.result === 'miss' && (
                  <span className="flex items-center gap-2 text-red-400">
                    <XCircle className="w-5 h-5" />
                    Off Target
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Your Guess</p>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">{selectedGuess.label}</p>
                </div>
                <div className="p-4 bg-[#22C55E]/10 rounded-xl">
                  <p className="text-xs text-[#22C55E] mb-1">Actual Valuation</p>
                  <p className="text-xl font-bold text-[#22C55E]">{startup.actualValuation.label}</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full mt-4 px-6 py-3 bg-[var(--color-accent)] text-black font-semibold rounded-xl hover:bg-[var(--color-accent-dark)] transition-colors"
              >
                {currentIndex + 1 >= QUESTIONS_PER_GAME ? 'See Results' : 'Next Startup'}
              </button>
            </div>
          )}

          {/* Valuation Options */}
          {gameState === 'playing' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">What's the valuation?</h3>
                {!showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Show Hint
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {VALUATION_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleGuess(option)}
                    className="p-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl text-center hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all"
                  >
                    <p className="font-bold text-[var(--color-text-primary)]">{option.label}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const exactCount = results.filter((r) => r.result === 'exact').length;
    const closeCount = results.filter((r) => r.result === 'close').length;

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-[var(--shadow-card)]">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Game Complete!</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Here's how you did</p>

            {/* Score */}
            <div className="mb-8">
              <p className="text-6xl font-bold text-[#22C55E]">{score.toLocaleString()}</p>
              <p className="text-[var(--color-text-secondary)]">points</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{exactCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Exact</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--color-accent)]">{closeCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Close</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{QUESTIONS_PER_GAME}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Total</p>
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
                className="flex items-center gap-2 px-6 py-3 bg-[#22C55E] text-white font-semibold rounded-xl hover:bg-[#16A34A] transition-colors"
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

export default ValuationGuesstimate;
