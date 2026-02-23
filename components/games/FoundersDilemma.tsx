import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Scale,
  Trophy,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import {
  DILEMMA_SCENARIOS,
  DILEMMA_SCORING,
  DilemmaScenario,
  DilemmaChoice,
} from '../../data/games/dilemmaData';
import { useGamification } from '../../contexts/GamificationContext';

type GameState = 'ready' | 'playing' | 'reveal' | 'finished';

const GAME_DURATION = 300; // 5 minutes
const SCENARIOS_PER_GAME = 5;

// Shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const FoundersDilemma: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useGamification();

  const [gameState, setGameState] = useState<GameState>('ready');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scenarios, setScenarios] = useState<DilemmaScenario[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<DilemmaChoice | null>(null);
  const [results, setResults] = useState<Array<{
    scenario: DilemmaScenario;
    choice: DilemmaChoice;
    isOptimal: boolean;
  }>>([]);

  // Start game
  const startGame = useCallback(() => {
    const shuffled = shuffleArray(DILEMMA_SCENARIOS).slice(0, SCENARIOS_PER_GAME);
    setScenarios(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTotalXP(0);
    setTimeLeft(GAME_DURATION);
    setSelectedChoice(null);
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

  // Submit choice
  const handleChoice = useCallback((choice: DilemmaChoice) => {
    if (gameState !== 'playing' || !scenarios[currentIndex]) return;

    setSelectedChoice(choice);
    const scenario = scenarios[currentIndex];

    const scoring = choice.isOptimal ? DILEMMA_SCORING.optimal : DILEMMA_SCORING.suboptimal;
    setScore((prev) => prev + scoring.points);
    setTotalXP((prev) => prev + scoring.xp);

    setResults((prev) => [...prev, { scenario, choice, isOptimal: choice.isOptimal }]);
    setGameState('reveal');
  }, [gameState, scenarios, currentIndex]);

  // Continue to next scenario
  const handleContinue = useCallback(() => {
    if (currentIndex + 1 >= SCENARIOS_PER_GAME) {
      setGameState('finished');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
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

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Fundraising: '#22C55E',
      Team: '#8B5CF6',
      Product: '#1CB0F6',
      Finance: '#F5C518',
      Strategy: '#FF6B6B',
    };
    return colors[category] || '#8B5CF6';
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
            <div className="w-20 h-20 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Founder's Dilemma</h1>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              Navigate tough startup decisions. Read the scenario, choose wisely, and learn from the outcomes.
            </p>

            <div className="flex justify-center gap-6 mb-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-[#8B5CF6]">{SCENARIOS_PER_GAME}</p>
                <p className="text-[var(--color-text-muted)]">scenarios</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-accent)]">{Math.floor(GAME_DURATION / 60)} min</p>
                <p className="text-[var(--color-text-muted)]">time limit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#22C55E]">+{DILEMMA_SCORING.optimal.xp} XP</p>
                <p className="text-[var(--color-text-muted)]">per optimal</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-[#8B5CF6] text-white font-bold text-lg rounded-xl hover:bg-[#7C3AED] transition-colors"
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
    const categoryColor = getCategoryColor(scenario.category);

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
            {Array.from({ length: SCENARIOS_PER_GAME }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full ${
                  i < currentIndex
                    ? results[i]?.isOptimal ? 'bg-[#22C55E]' : 'bg-[var(--color-accent)]'
                    : i === currentIndex
                    ? 'bg-[#8B5CF6]'
                    : 'bg-[var(--color-bg-secondary)]'
                }`}
              />
            ))}
          </div>

          {/* Scenario Card */}
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)] mb-6">
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-border)]" style={{ backgroundColor: `${categoryColor}10` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                  >
                    {scenario.category}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                    {scenario.stage}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Scenario {currentIndex + 1} of {SCENARIOS_PER_GAME}
                </p>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{scenario.title}</h2>
            </div>

            {/* Context & Situation */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">CONTEXT</p>
                <p className="text-[var(--color-text-primary)]">{scenario.context}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">THE SITUATION</p>
                <p className="text-[var(--color-text-primary)]">{scenario.situation}</p>
              </div>
            </div>
          </div>

          {/* Reveal State */}
          {gameState === 'reveal' && selectedChoice && (
            <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-6 mb-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-4">
                {selectedChoice.isOptimal ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                    <h3 className="text-lg font-bold text-[#22C55E]">Optimal Decision!</h3>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-[var(--color-accent)]" />
                    <h3 className="text-lg font-bold text-[var(--color-accent)]">There's a Better Path</h3>
                  </>
                )}
              </div>

              {/* Your Choice */}
              <div className={`p-4 rounded-xl mb-4 ${
                selectedChoice.isOptimal ? 'bg-[#22C55E]/10 border border-[#22C55E]' : 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]'
              }`}>
                <p className="font-semibold text-[var(--color-text-primary)] mb-2">Your Choice: {selectedChoice.label}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{selectedChoice.outcome}</p>
              </div>

              {/* Optimal choice if different */}
              {!selectedChoice.isOptimal && (
                <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E] rounded-xl mb-4">
                  <p className="font-semibold text-[#22C55E] mb-2">
                    Better Option: {scenario.choices.find(c => c.isOptimal)?.label}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {scenario.choices.find(c => c.isOptimal)?.outcome}
                  </p>
                </div>
              )}

              {/* Lesson */}
              <div className="flex items-start gap-3 p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <BookOpen className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#8B5CF6] mb-1">Key Lesson</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{scenario.lesson}</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full mt-4 px-6 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors flex items-center justify-center gap-2"
              >
                {currentIndex + 1 >= SCENARIOS_PER_GAME ? 'See Results' : 'Next Scenario'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Choices */}
          {gameState === 'playing' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">What do you do?</h3>
              {scenario.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full p-5 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl text-left hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all"
                >
                  <p className="font-semibold text-[var(--color-text-primary)] mb-1">{choice.label}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{choice.description}</p>
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
    const accuracy = Math.round((optimalCount / SCENARIOS_PER_GAME) * 100);

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-[var(--shadow-card)]">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Game Complete!</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Here's how you navigated the dilemmas</p>

            {/* Score */}
            <div className="mb-8">
              <p className="text-6xl font-bold text-[#8B5CF6]">{score.toLocaleString()}</p>
              <p className="text-[var(--color-text-secondary)]">points</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{optimalCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Optimal</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--color-accent)]">{SCENARIOS_PER_GAME - optimalCount}</p>
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
                className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
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

export default FoundersDilemma;
