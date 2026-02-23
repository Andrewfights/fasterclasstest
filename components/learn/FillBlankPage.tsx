import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenTool, CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, Zap, Lightbulb } from 'lucide-react';
import { FILL_BLANK_EXERCISES } from '../../data/fillblank';
import { FillBlankExercise, GlossaryCategory } from '../../types';
import { useGamification } from '../../contexts/GamificationContext';

type ExerciseState = 'selection' | 'playing' | 'complete';

const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  starting_company: 'Starting a Company',
  credit_cards: 'Credit Cards',
  raising_money: 'Raising Money',
  hiring: 'Hiring',
  prototyping: 'Product',
  ai: 'AI',
  growth: 'Growth',
  legal: 'Legal',
  general: 'General',
};

const CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  starting_company: '#8B5CF6',
  credit_cards: '#F59E0B',
  raising_money: '#22C55E',
  hiring: '#3B82F6',
  prototyping: '#EC4899',
  ai: '#06B6D4',
  growth: '#F97316',
  legal: '#6366F1',
  general: '#9CA3AF',
};

export const FillBlankPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, learnTerm, addXP } = useGamification();

  const [exerciseState, setExerciseState] = useState<ExerciseState>('selection');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Get exercises based on category
  const exercises = useMemo(() => {
    if (selectedCategory === 'all') return FILL_BLANK_EXERCISES;
    return FILL_BLANK_EXERCISES.filter(e => e.category === selectedCategory);
  }, [selectedCategory]);

  // Get categories with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = { all: FILL_BLANK_EXERCISES.length };
    FILL_BLANK_EXERCISES.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, []);

  const currentExercise = exercises[currentIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setUserInput('');
    setShowResult(false);
    setShowHint(false);
    setCorrectCount(0);
    setWrongCount(0);
  }, [selectedCategory]);

  const checkAnswer = useCallback(() => {
    if (!currentExercise || showResult) return;

    const normalizedInput = userInput.trim().toLowerCase();
    const correct = currentExercise.acceptedAnswers.some(
      ans => ans.toLowerCase() === normalizedInput
    );

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      learnTerm(currentExercise.termId);
      addXP(currentExercise.xpValue);
    } else {
      setWrongCount(prev => prev + 1);
    }
  }, [currentExercise, userInput, showResult, learnTerm, addXP]);

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
      setShowHint(false);
    } else {
      setExerciseState('complete');
    }
  };

  const startExercises = () => {
    setExerciseState('playing');
    setCurrentIndex(0);
    setUserInput('');
    setShowResult(false);
    setShowHint(false);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const resetAndChoose = () => {
    setExerciseState('selection');
    setSelectedCategory('all');
  };

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showResult) {
        handleNext();
      } else {
        checkAnswer();
      }
    }
  };

  // Selection Screen
  if (exerciseState === 'selection') {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learn
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
              <PenTool className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Fill-in-the-Blank</h1>
              <p className="text-[#9CA3AF] text-sm">Select a category</p>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                selectedCategory === 'all'
                  ? 'bg-[#3B82F6]/20 border-[#3B82F6]'
                  : 'bg-[#1A1A24] border-[#2E2E3E] hover:border-[#3B82F6]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <span className="font-medium text-white">All Categories</span>
              </div>
              <span className="text-[#9CA3AF]">{categories.all} exercises</span>
            </button>

            {(Object.keys(CATEGORY_LABELS) as GlossaryCategory[]).map(cat => {
              if (!categories[cat]) return null;
              const color = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'border-[#3B82F6]'
                      : 'bg-[#1A1A24] border-[#2E2E3E] hover:border-[#3B82F6]/50'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === cat ? color + '20' : undefined,
                    borderColor: selectedCategory === cat ? color : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: color + '20' }}
                    >
                      <PenTool className="w-5 h-5" style={{ color }} />
                    </div>
                    <span className="font-medium text-white">{CATEGORY_LABELS[cat]}</span>
                  </div>
                  <span className="text-[#9CA3AF]">{categories[cat]} exercises</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={startExercises}
            disabled={exercises.length === 0}
            className="w-full py-4 bg-[#3B82F6] text-white font-bold rounded-xl hover:bg-[#2563EB] transition-colors disabled:opacity-50"
          >
            Start ({exercises.length} exercises)
          </button>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (exerciseState === 'complete') {
    const total = correctCount + wrongCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const xpEarned = correctCount * 5;

    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#3B82F6]/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-[#3B82F6]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Exercises Complete!</h1>
            <p className="text-[#9CA3AF] mb-8">Great practice session</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{correctCount}</p>
                <p className="text-xs text-[#6B7280]">Correct</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-red-400">{wrongCount}</p>
                <p className="text-xs text-[#6B7280]">Wrong</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-white">{accuracy}%</p>
                <p className="text-xs text-[#6B7280]">Accuracy</p>
              </div>
            </div>

            {xpEarned > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/20 rounded-full mb-8">
                <Zap className="w-5 h-5 text-[#3B82F6]" />
                <span className="text-[#3B82F6] font-bold">+{xpEarned} XP earned!</span>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={resetAndChoose}
                className="px-6 py-3 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
              >
                Choose Category
              </button>
              <button
                onClick={startExercises}
                className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-xl hover:bg-[#2563EB] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Practice Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={resetAndChoose}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-center">
            <p className="text-sm text-[#9CA3AF]">
              Exercise {currentIndex + 1} of {exercises.length}
            </p>
            <p className="text-xs" style={{ color: CATEGORY_COLORS[currentExercise?.category] }}>
              {CATEGORY_LABELS[currentExercise?.category]}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#22C55E]">{correctCount}</span>
            <span className="text-[#6B7280]">/</span>
            <span className="text-red-400">{wrongCount}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-1 bg-[#2E2E3E] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[#3B82F6] transition-all"
            style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
          />
        </div>

        {/* Exercise */}
        <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-6 mb-6">
          <p className="text-sm text-[#6B7280] mb-4">Complete the sentence:</p>
          <p className="text-lg text-white leading-relaxed">
            {currentExercise?.sentence.replace('_______', '________')}
          </p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={showResult}
            placeholder="Type your answer..."
            className={`w-full p-4 bg-[#0D0D12] border rounded-xl text-white placeholder-[#6B7280] focus:outline-none transition-colors ${
              showResult
                ? isCorrect
                  ? 'border-[#22C55E] bg-[#22C55E]/10'
                  : 'border-red-500 bg-red-500/10'
                : 'border-[#2E2E3E] focus:border-[#3B82F6]'
            }`}
            autoFocus
          />
        </div>

        {/* Hint */}
        {!showResult && (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-2 text-[#F59E0B] hover:text-[#FBBF24] transition-colors mb-6"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm">{showHint ? currentExercise?.hint : 'Show hint'}</span>
          </button>
        )}

        {/* Result */}
        {showResult && (
          <div className={`p-4 rounded-xl mb-6 ${
            isCorrect
              ? 'bg-[#22C55E]/10 border border-[#22C55E]/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium mb-1 ${isCorrect ? 'text-[#22C55E]' : 'text-red-400'}`}>
                  {isCorrect ? 'Correct!' : `The answer is: ${currentExercise?.answer}`}
                </p>
                <p className="text-sm text-[#9CA3AF]">{currentExercise?.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {showResult ? (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-[#3B82F6] text-white font-bold rounded-xl hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
          >
            {currentIndex < exercises.length - 1 ? (
              <>
                Next Exercise
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'See Results'
            )}
          </button>
        ) : (
          <button
            onClick={checkAnswer}
            disabled={!userInput.trim()}
            className="w-full py-4 bg-[#3B82F6] text-white font-bold rounded-xl hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default FillBlankPage;
