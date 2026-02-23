import React, { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Check, X, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { INITIAL_FLASHCARD_DECKS, LEARNING_MODULES } from '../../constants';
import { Flashcard } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressRing';
import { CelebrationOverlay } from '../ui/Confetti';

interface FlashcardItemProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ card, isFlipped, onFlip }) => {
  return (
    <div
      className="relative w-full h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transition: 'transform 0.5s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-lg border-2 border-[#E5E5E5] p-8 flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-[#3C3C3C] text-center">
              {card.front}
            </p>
            <p className="text-sm text-[#AFAFAF] mt-4">Tap to flip</p>
          </div>
        </div>

        {/* Back */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-[#1CB0F6] to-[#0D94DD] rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center text-white">
            <p className="text-lg text-center mb-4">{card.back}</p>
            {card.example && (
              <p className="text-sm opacity-80 italic text-center">
                Example: {card.example}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlashcardDeck: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { progress, earnXP, refreshProgress } = useGamification();

  const module = LEARNING_MODULES.find((m) => m.id === moduleId);
  const deck = INITIAL_FLASHCARD_DECKS.find((d) => d.moduleId === moduleId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [reviewingCards, setReviewingCards] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!module || !deck) {
    return <Navigate to="/" replace />;
  }

  const currentCard = deck.cards[currentIndex];
  const totalCards = deck.cards.length;
  const progressPercent = ((knownCards.size + reviewingCards.size) / totalCards) * 100;

  const handleKnow = () => {
    setKnownCards(new Set([...knownCards, currentCard.id]));
    goToNext();
  };

  const handleReview = () => {
    setReviewingCards(new Set([...reviewingCards, currentCard.id]));
    goToNext();
  };

  const goToNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      // Complete the deck
      completeDeck();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const completeDeck = () => {
    // Mark flashcards as reviewed in progress
    const moduleProgress = progress.modulesInProgress[module.id];
    if (moduleProgress && !moduleProgress.flashcardsReviewed) {
      earnXP(25, `flashcards_${deck.id}`);
    }
    setIsComplete(true);
    setShowCelebration(true);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setReviewingCards(new Set());
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32 flex items-center justify-center">
        <CelebrationOverlay
          show={showCelebration}
          title="Flashcards Complete!"
          subtitle={`You reviewed all ${totalCards} cards`}
          icon="🧠"
          xpGained={25}
          onClose={() => setShowCelebration(false)}
        />

        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-[#E8F5E9] mx-auto mb-6 flex items-center justify-center">
              <Check className="w-12 h-12 text-[#58CC02]" />
            </div>

            <h1 className="text-2xl font-bold text-[#3C3C3C] mb-2">
              Great Job!
            </h1>

            <p className="text-[#777777] mb-6">
              You reviewed all {totalCards} flashcards in this deck.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#E8F5E9] rounded-xl p-4">
                <div className="text-2xl font-bold text-[#58CC02]">{knownCards.size}</div>
                <div className="text-sm text-[#777777]">Already knew</div>
              </div>
              <div className="bg-[#FFF3E0] rounded-xl p-4">
                <div className="text-2xl font-bold text-[#FF9600]">{reviewingCards.size}</div>
                <div className="text-sm text-[#777777]">Need review</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#FF9600] font-semibold mb-8">
              <Zap className="w-5 h-5" />
              <span>+25 XP earned</span>
            </div>

            <div className="space-y-3">
              <Link to={`/module/${module.id}`}>
                <Button variant="primary" fullWidth>
                  Continue Learning
                </Button>
              </Link>
              <Button variant="outline" fullWidth onClick={resetDeck}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Review Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#777777] hover:text-[#3C3C3C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Exit</span>
          </button>
          <span className="text-sm text-[#777777]">
            Card {currentIndex + 1} of {totalCards}
          </span>
        </div>

        {/* Progress bar */}
        <ProgressBar
          progress={progressPercent}
          height={8}
          color={module.color}
          className="mb-8"
        />

        {/* Flashcard */}
        <FlashcardItem
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`
              p-3 rounded-full transition-colors
              ${currentIndex === 0
                ? 'text-[#AFAFAF] cursor-not-allowed'
                : 'text-[#777777] hover:bg-[#E5E5E5]'
              }
            `}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleReview}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFF3E0] text-[#FF9600] font-semibold hover:bg-[#FFE0B2] transition-colors"
            >
              <X className="w-5 h-5" />
              Need Review
            </button>
            <button
              onClick={handleKnow}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8F5E9] text-[#58CC02] font-semibold hover:bg-[#C8E6C9] transition-colors"
            >
              <Check className="w-5 h-5" />
              Got It!
            </button>
          </div>

          <button
            onClick={() => {
              setIsFlipped(false);
              if (currentIndex < totalCards - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            disabled={currentIndex === totalCards - 1}
            className={`
              p-3 rounded-full transition-colors
              ${currentIndex === totalCards - 1
                ? 'text-[#AFAFAF] cursor-not-allowed'
                : 'text-[#777777] hover:bg-[#E5E5E5]'
              }
            `}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-xl font-bold text-[#58CC02]">{knownCards.size}</div>
            <div className="text-sm text-[#777777]">Known</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#FF9600]">{reviewingCards.size}</div>
            <div className="text-sm text-[#777777]">Reviewing</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#777777]">
              {totalCards - knownCards.size - reviewingCards.size}
            </div>
            <div className="text-sm text-[#777777]">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};
