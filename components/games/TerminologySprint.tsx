import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, Zap, RotateCcw } from 'lucide-react';
import { GLOSSARY_TERMS } from '../../constants';
import { useGamification } from '../../contexts/GamificationContext';

interface Question {
  term: string;
  correctDefinition: string;
  options: string[];
  termId: string;
}

type GameState = 'ready' | 'playing' | 'finished';

const GAME_DURATION = 60; // seconds
const POINTS_CORRECT = 100;
const POINTS_STREAK_BONUS = 25;
const XP_PER_CORRECT = 5;

// Shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate a question with 4 options
const generateQuestion = (terms: typeof GLOSSARY_TERMS, usedIds: Set<string>): Question | null => {
  const availableTerms = terms.filter(t => !usedIds.has(t.id));
  if (availableTerms.length === 0) return null;

  const targetTerm = availableTerms[Math.floor(Math.random() * availableTerms.length)];
  const wrongOptions = shuffleArray(
    terms.filter(t => t.id !== targetTerm.id)
  )
    .slice(0, 3)
    .map(t => t.definition);

  const options = shuffleArray([targetTerm.definition, ...wrongOptions]);

  return {
    term: targetTerm.term,
    correctDefinition: targetTerm.definition,
    options,
    termId: targetTerm.id,
  };
};

export const TerminologySprint: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useGamification();

  const [gameState, setGameState] = useState<GameState>('ready');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);

  // Generate initial question
  const generateNextQuestion = useCallback(() => {
    const question = generateQuestion(GLOSSARY_TERMS, usedIds);
    if (question) {
      setUsedIds(prev => new Set([...prev, question.termId]));
      setCurrentQuestion(question);
    }
    setSelectedAnswer(null);
    setAnswerResult(null);
  }, [usedIds]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrect(0);
    setWrong(0);
    setUsedIds(new Set());
    const question = generateQuestion(GLOSSARY_TERMS, new Set());
    if (question) {
      setUsedIds(new Set([question.termId]));
      setCurrentQuestion(question);
    }
    setSelectedAnswer(null);
    setAnswerResult(null);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Handle answer selection
  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer || !currentQuestion || gameState !== 'playing') return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctDefinition;

    if (isCorrect) {
      setAnswerResult('correct');
      const streakBonus = streak >= 3 ? POINTS_STREAK_BONUS * Math.min(streak - 2, 5) : 0;
      setScore(prev => prev + POINTS_CORRECT + streakBonus);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrect(prev => prev + 1);
    } else {
      setAnswerResult('wrong');
      setStreak(0);
      setWrong(prev => prev + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      generateNextQuestion();
    }, 800);
  }, [selectedAnswer, currentQuestion, gameState, streak, generateNextQuestion]);

  // Award XP when game finishes
  useEffect(() => {
    if (gameState === 'finished' && correct > 0) {
      const totalXP = correct * XP_PER_CORRECT;
      addXP(totalXP);
    }
  }, [gameState, correct, addXP]);

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>

          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Terminology Sprint</h1>
            <p className="text-[#9CA3AF] mb-6 max-w-md mx-auto">
              Match startup terms to their definitions as fast as you can!
              You have {GAME_DURATION} seconds.
            </p>

            <div className="flex justify-center gap-8 mb-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-[#8B5CF6]">+{POINTS_CORRECT}</p>
                <p className="text-[#6B7280]">per correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F5C518]">+{POINTS_STREAK_BONUS}</p>
                <p className="text-[#6B7280]">streak bonus</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#22C55E]">+{XP_PER_CORRECT} XP</p>
                <p className="text-[#6B7280]">per correct</p>
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

  // Playing screen
  if (gameState === 'playing' && currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header Stats */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quit
            </button>

            <div className="flex items-center gap-6">
              {/* Streak */}
              {streak >= 3 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-[#F5C518]/20 rounded-full">
                  <Zap className="w-4 h-4 text-[#F5C518]" />
                  <span className="text-[#F5C518] font-bold">{streak}x</span>
                </div>
              )}

              {/* Score */}
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{score.toLocaleString()}</p>
                <p className="text-xs text-[#6B7280]">points</p>
              </div>

              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-[#1A1A24] text-white'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl font-bold font-mono">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[#22C55E] font-medium">{correct}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium">{wrong}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden">
            {/* Term */}
            <div className="p-6 bg-[#8B5CF6]/10 border-b border-[#2E2E3E]">
              <p className="text-sm text-[#8B5CF6] font-medium mb-2">What is...</p>
              <h2 className="text-2xl font-bold text-white">{currentQuestion.term}</h2>
            </div>

            {/* Options */}
            <div className="p-4 space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctDefinition;
                const showResult = selectedAnswer !== null;

                let bgClass = 'bg-[#0D0D12] hover:bg-[#2E2E3E] border-[#2E2E3E]';
                let textClass = 'text-white';

                if (showResult) {
                  if (isCorrect) {
                    bgClass = 'bg-[#22C55E]/20 border-[#22C55E]';
                    textClass = 'text-[#22C55E]';
                  } else if (isSelected && !isCorrect) {
                    bgClass = 'bg-red-500/20 border-red-500';
                    textClass = 'text-red-400';
                  } else {
                    bgClass = 'bg-[#0D0D12] border-[#2E2E3E] opacity-50';
                    textClass = 'text-[#6B7280]';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${bgClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        showResult && isCorrect ? 'bg-[#22C55E] text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        'bg-[#2E2E3E] text-[#9CA3AF]'
                      }`}>
                        {showResult && isCorrect ? <CheckCircle className="w-4 h-4" /> :
                         showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                         String.fromCharCode(65 + index)}
                      </span>
                      <p className={`text-sm leading-relaxed ${textClass}`}>{option}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    const xpEarned = correct * XP_PER_CORRECT;

    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#F5C518]/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-[#F5C518]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Time's Up!</h1>
            <p className="text-[#9CA3AF] mb-8">Here's how you did</p>

            {/* Score */}
            <div className="mb-8">
              <p className="text-6xl font-bold text-[#8B5CF6]">{score.toLocaleString()}</p>
              <p className="text-[#9CA3AF]">points</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{correct}</p>
                <p className="text-xs text-[#6B7280]">Correct</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-red-400">{wrong}</p>
                <p className="text-xs text-[#6B7280]">Wrong</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-white">{accuracy}%</p>
                <p className="text-xs text-[#6B7280]">Accuracy</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-[#F5C518]">{maxStreak}x</p>
                <p className="text-xs text-[#6B7280]">Best Streak</p>
              </div>
            </div>

            {/* XP Earned */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/20 rounded-full mb-8">
              <Zap className="w-5 h-5 text-[#22C55E]" />
              <span className="text-[#22C55E] font-bold">+{xpEarned} XP earned!</span>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/games')}
                className="px-6 py-3 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
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

export default TerminologySprint;
