import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, RotateCcw, CheckCircle, XCircle, ChevronLeft, ChevronRight, Zap, Clock, Star, GraduationCap, Flame } from 'lucide-react';
import { GLOSSARY_TERMS, COURSES } from '../../constants';
import { GlossaryCategory, GlossaryTerm } from '../../types';
import { useGamification } from '../../contexts/GamificationContext';

type StudyState = 'selection' | 'studying' | 'complete';
type SelectionMode = 'category' | 'course' | 'daily';

const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  starting_company: 'Starting a Company',
  credit_cards: 'Credit Cards',
  raising_money: 'Raising Money',
  hiring: 'Hiring',
  prototyping: 'Prototyping',
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

export const FlashcardPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, updateFlashcardProgress, addXP } = useGamification();

  const [studyState, setStudyState] = useState<StudyState>('selection');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('category');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());

  // Get cards due for daily review (spaced repetition)
  const dailyReviewCards = useMemo(() => {
    const now = Date.now();
    return GLOSSARY_TERMS.filter(term => {
      const cardProgress = progress.flashcardProgress?.[term.id];
      if (!cardProgress) return false; // Only review cards we've seen
      if (cardProgress.masteryLevel >= 4) return false; // Skip mastered cards
      return cardProgress.nextReviewAt <= now; // Due for review
    });
  }, [progress]);

  // Get terms for a specific course
  const getCourseTerms = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course || !course.modules) return [];

    const termIds = new Set<string>();
    course.modules.forEach(module => {
      module.keyTermIds?.forEach(id => termIds.add(id));
    });

    return GLOSSARY_TERMS.filter(term => termIds.has(term.id));
  };

  // Get terms based on selection mode
  const terms = useMemo(() => {
    if (selectionMode === 'daily') {
      return dailyReviewCards;
    }
    if (selectionMode === 'course' && selectedCourseId) {
      return getCourseTerms(selectedCourseId);
    }
    if (selectedCategory === 'all') return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(t => t.category === selectedCategory);
  }, [selectionMode, selectedCategory, selectedCourseId, dailyReviewCards]);

  // Get mastery level for a term
  const getMasteryLevel = (termId: string) => {
    return progress.flashcardProgress?.[termId]?.masteryLevel || 0;
  };

  // Get mastery stats for current selection
  const masteryStats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let notStarted = 0;

    terms.forEach(term => {
      const level = getMasteryLevel(term.id);
      if (level >= 4) mastered++;
      else if (level > 0) learning++;
      else notStarted++;
    });

    return { mastered, learning, notStarted, total: terms.length };
  }, [terms, progress]);

  // Get categories with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = { all: GLOSSARY_TERMS.length };
    GLOSSARY_TERMS.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  const currentTerm = terms[currentIndex];

  // Reset when selection changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setReviewCards(new Set());
  }, [selectedCategory, selectedCourseId, selectionMode]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleGotIt = useCallback(() => {
    if (!currentTerm) return;

    setKnownCards(prev => new Set([...prev, currentTerm.id]));

    // Update flashcard progress
    const existingProgress = progress.flashcardProgress?.[currentTerm.id];
    updateFlashcardProgress(currentTerm.id, {
      cardId: currentTerm.id,
      lastReviewed: Date.now(),
      timesReviewed: (existingProgress?.timesReviewed || 0) + 1,
      timesCorrect: (existingProgress?.timesCorrect || 0) + 1,
      masteryLevel: Math.min((existingProgress?.masteryLevel || 0) + 1, 4),
      nextReviewAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day later
    });

    // Award XP for mastering a card
    if (!existingProgress || existingProgress.masteryLevel < 4) {
      addXP(2);
    }

    goToNext();
  }, [currentTerm, progress, updateFlashcardProgress, addXP]);

  const handleReview = useCallback(() => {
    if (!currentTerm) return;

    setReviewCards(prev => new Set([...prev, currentTerm.id]));

    // Update flashcard progress - wrong answer
    const existingProgress = progress.flashcardProgress?.[currentTerm.id];
    updateFlashcardProgress(currentTerm.id, {
      cardId: currentTerm.id,
      lastReviewed: Date.now(),
      timesReviewed: (existingProgress?.timesReviewed || 0) + 1,
      timesCorrect: existingProgress?.timesCorrect || 0,
      masteryLevel: Math.max((existingProgress?.masteryLevel || 0) - 1, 0),
      nextReviewAt: Date.now() + 60 * 60 * 1000, // 1 hour later
    });

    goToNext();
  }, [currentTerm, progress, updateFlashcardProgress]);

  const goToNext = () => {
    setIsFlipped(false);
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStudyState('complete');
    }
  };

  const goToPrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const startStudying = () => {
    setStudyState('studying');
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setReviewCards(new Set());
  };

  const resetAndChoose = () => {
    setStudyState('selection');
    setSelectedCategory('all');
    setSelectedCourseId(null);
    setSelectionMode('category');
  };

  // Selection Screen
  if (studyState === 'selection') {
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

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Flashcards</h1>
              <p className="text-[#9CA3AF] text-sm">Select a deck to study</p>
            </div>
          </div>

          {/* Daily Review Alert */}
          {dailyReviewCards.length > 0 && selectionMode !== 'daily' && (
            <button
              onClick={() => setSelectionMode('daily')}
              className="w-full mb-6 p-4 bg-gradient-to-r from-[#F59E0B]/20 to-[#F97316]/20 rounded-xl border border-[#F59E0B]/30 hover:border-[#F59E0B]/50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{dailyReviewCards.length} cards due for review</p>
                  <p className="text-sm text-[#9CA3AF]">Practice cards you've seen before</p>
                </div>
                <Flame className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </button>
          )}

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 bg-[#1A1A24] p-1 rounded-xl">
            <button
              onClick={() => setSelectionMode('category')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                selectionMode === 'category'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              By Category
            </button>
            <button
              onClick={() => setSelectionMode('course')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                selectionMode === 'course'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              By Playbook
            </button>
            <button
              onClick={() => setSelectionMode('daily')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                selectionMode === 'daily'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              Daily Review
            </button>
          </div>

          {/* Mastery Stats */}
          {terms.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-[#22C55E]/10 rounded-xl text-center">
                <p className="text-xl font-bold text-[#22C55E]">{masteryStats.mastered}</p>
                <p className="text-xs text-[#6B7280]">Mastered</p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-xl text-center">
                <p className="text-xl font-bold text-[#F59E0B]">{masteryStats.learning}</p>
                <p className="text-xs text-[#6B7280]">Learning</p>
              </div>
              <div className="p-3 bg-[#6B7280]/10 rounded-xl text-center">
                <p className="text-xl font-bold text-[#6B7280]">{masteryStats.notStarted}</p>
                <p className="text-xs text-[#6B7280]">New</p>
              </div>
            </div>
          )}

          {/* Daily Review Mode */}
          {selectionMode === 'daily' && (
            <div className="space-y-3 mb-8">
              {dailyReviewCards.length === 0 ? (
                <div className="p-8 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] text-center">
                  <Star className="w-12 h-12 text-[#22C55E] mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
                  <p className="text-[#9CA3AF] text-sm">No cards due for review. Come back later or study new cards.</p>
                </div>
              ) : (
                <div className="p-4 bg-[#1A1A24] rounded-xl border border-[#2E2E3E]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{dailyReviewCards.length} cards ready for review</p>
                      <p className="text-sm text-[#9CA3AF]">Strengthen your memory with spaced repetition</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category Selection */}
          {selectionMode === 'category' && (
            <div className="space-y-3 mb-8">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]'
                    : 'bg-[#1A1A24] border-[#2E2E3E] hover:border-[#8B5CF6]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <span className="font-medium text-white">All Categories</span>
                </div>
                <span className="text-[#9CA3AF]">{categories.all} cards</span>
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
                        ? 'border-[#8B5CF6]'
                        : 'bg-[#1A1A24] border-[#2E2E3E] hover:border-[#8B5CF6]/50'
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
                        <BookOpen className="w-5 h-5" style={{ color }} />
                      </div>
                      <span className="font-medium text-white">{CATEGORY_LABELS[cat]}</span>
                    </div>
                    <span className="text-[#9CA3AF]">{categories[cat]} cards</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Course/Playbook Selection */}
          {selectionMode === 'course' && (
            <div className="space-y-3 mb-8">
              {COURSES.map(course => {
                const courseTerms = getCourseTerms(course.id);
                if (courseTerms.length === 0) return null;

                const isSelected = selectedCourseId === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'border-[#8B5CF6]'
                        : 'bg-[#1A1A24] border-[#2E2E3E] hover:border-[#8B5CF6]/50'
                    }`}
                    style={{
                      backgroundColor: isSelected ? course.color + '20' : undefined,
                      borderColor: isSelected ? course.color : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: course.color + '20' }}
                      >
                        {course.iconEmoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{course.title}</p>
                        <p className="text-xs text-[#9CA3AF]">{course.topic}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-[#9CA3AF]">{courseTerms.length} cards</span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {COURSES.filter(c => getCourseTerms(c.id).length > 0).length === 0 && (
                <div className="p-8 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] text-center">
                  <p className="text-[#9CA3AF]">No playbook-specific cards available yet.</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={startStudying}
            disabled={terms.length === 0}
            className="w-full py-4 bg-[#8B5CF6] text-white font-bold rounded-xl hover:bg-[#7C3AED] transition-colors disabled:opacity-50"
          >
            {selectionMode === 'daily' && dailyReviewCards.length > 0
              ? `Start Daily Review (${terms.length} cards)`
              : `Start Studying (${terms.length} cards)`}
          </button>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (studyState === 'complete') {
    const xpEarned = knownCards.size * 2;
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#22C55E]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Deck Complete!</h1>
            <p className="text-[#9CA3AF] mb-8">Great job reviewing your flashcards</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{knownCards.size}</p>
                <p className="text-xs text-[#6B7280]">Got It</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-[#F59E0B]">{reviewCards.size}</p>
                <p className="text-xs text-[#6B7280]">Review</p>
              </div>
              <div className="p-4 bg-[#0D0D12] rounded-xl">
                <p className="text-2xl font-bold text-white">{terms.length}</p>
                <p className="text-xs text-[#6B7280]">Total</p>
              </div>
            </div>

            {xpEarned > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/20 rounded-full mb-8">
                <Zap className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] font-bold">+{xpEarned} XP earned!</span>
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
                onClick={startStudying}
                className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Study Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Studying Screen
  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={resetAndChoose}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-center">
            <p className="text-sm text-[#9CA3AF]">
              Card {currentIndex + 1} of {terms.length}
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs text-[#6B7280]" style={{ color: CATEGORY_COLORS[currentTerm?.category] }}>
                {CATEGORY_LABELS[currentTerm?.category]}
              </p>
              {/* Mastery Level Badge */}
              {currentTerm && (() => {
                const level = getMasteryLevel(currentTerm.id);
                const badges = [
                  { color: '#6B7280', label: 'New' },
                  { color: '#F59E0B', label: 'Seen' },
                  { color: '#F97316', label: 'Learning' },
                  { color: '#22C55E', label: 'Familiar' },
                  { color: '#8B5CF6', label: 'Mastered' },
                ];
                const badge = badges[Math.min(level, 4)];
                return (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: badge.color + '20', color: badge.color }}
                  >
                    {badge.label}
                  </span>
                );
              })()}
            </div>
          </div>
          <div className="w-16" />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-[#2E2E3E] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[#8B5CF6] transition-all"
            style={{ width: `${((currentIndex + 1) / terms.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div
          onClick={handleFlip}
          className="relative h-64 mb-8 cursor-pointer perspective-1000"
        >
          <div
            className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] flex flex-col items-center justify-center p-8 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-3xl font-bold text-white text-center">{currentTerm?.term}</p>
              <p className="text-sm text-[#6B7280] mt-4">Tap to flip</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-[#1A1A24] rounded-2xl border border-[#8B5CF6] flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <p className="text-lg text-white text-center leading-relaxed">
                {currentTerm?.definition}
              </p>
              {currentTerm?.examples?.[0] && (
                <p className="text-sm text-[#9CA3AF] mt-4 italic">
                  "{currentTerm.examples[0]}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleReview}
            className="flex items-center gap-2 px-8 py-4 bg-[#F59E0B]/20 text-[#F59E0B] font-semibold rounded-xl hover:bg-[#F59E0B]/30 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Review
          </button>
          <button
            onClick={handleGotIt}
            className="flex items-center gap-2 px-8 py-4 bg-[#22C55E]/20 text-[#22C55E] font-semibold rounded-xl hover:bg-[#22C55E]/30 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Got It!
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={goToNext}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
          >
            Skip
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
