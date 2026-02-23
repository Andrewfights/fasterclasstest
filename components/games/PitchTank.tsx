import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mic,
  Trophy,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  Target,
} from 'lucide-react';
import {
  PITCH_SECTIONS,
  PITCH_SCORING,
  PITCH_FEEDBACK,
  SAMPLE_PITCH,
  PitchSection,
} from '../../data/games/pitchData';
import { useGamification } from '../../contexts/GamificationContext';

type GameState = 'ready' | 'playing' | 'finished';

// Count words in a string
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Score a section
const scoreSection = (text: string, section: PitchSection): number => {
  const wordCount = countWords(text);
  if (wordCount === 0) return PITCH_SCORING.perSection.empty;
  if (wordCount < section.minWords) return PITCH_SCORING.perSection.minimal;
  if (wordCount >= section.optimalWords) return PITCH_SCORING.perSection.optimal;
  return PITCH_SCORING.perSection.complete;
};

export const PitchTank: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useGamification();

  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [pitchContent, setPitchContent] = useState<Record<string, string>>({});
  const [showSample, setShowSample] = useState(false);

  const currentSection = PITCH_SECTIONS[currentSectionIndex];

  // Calculate scores
  const sectionScores = useMemo(() => {
    return PITCH_SECTIONS.map((section) => ({
      section,
      score: scoreSection(pitchContent[section.id] || '', section),
      wordCount: countWords(pitchContent[section.id] || ''),
    }));
  }, [pitchContent]);

  const totalScore = useMemo(() => {
    const sectionTotal = sectionScores.reduce((sum, s) => sum + s.score, 0);
    const allComplete = sectionScores.every(s => s.score >= PITCH_SCORING.perSection.complete);
    return sectionTotal + (allComplete ? PITCH_SCORING.bonuses.allSections : 0);
  }, [sectionScores]);

  const totalXP = useMemo(() => {
    const sectionXP = sectionScores.filter(s => s.score >= PITCH_SCORING.perSection.complete).length * PITCH_SCORING.xpRates.perSection;
    const allComplete = sectionScores.every(s => s.score >= PITCH_SCORING.perSection.complete);
    return sectionXP + (allComplete ? PITCH_SCORING.xpRates.allComplete : 0);
  }, [sectionScores]);

  // Get feedback
  const getFeedback = () => {
    if (totalScore >= PITCH_FEEDBACK.excellent.threshold) return PITCH_FEEDBACK.excellent;
    if (totalScore >= PITCH_FEEDBACK.good.threshold) return PITCH_FEEDBACK.good;
    if (totalScore >= PITCH_FEEDBACK.developing.threshold) return PITCH_FEEDBACK.developing;
    return PITCH_FEEDBACK.needsWork;
  };

  // Start game
  const startGame = useCallback(() => {
    setPitchContent({});
    setCurrentSectionIndex(0);
    setShowSample(false);
    setGameState('playing');
  }, []);

  // Handle content change
  const handleContentChange = (value: string) => {
    setPitchContent((prev) => ({
      ...prev,
      [currentSection.id]: value,
    }));
  };

  // Navigate sections
  const goToSection = (index: number) => {
    if (index >= 0 && index < PITCH_SECTIONS.length) {
      setCurrentSectionIndex(index);
      setShowSample(false);
    }
  };

  // Submit pitch
  const handleSubmit = useCallback(() => {
    setGameState('finished');
    if (totalXP > 0) {
      addXP(totalXP);
    }
  }, [totalXP, addXP]);

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
            <div className="w-20 h-20 rounded-2xl bg-[#FF6B6B]/20 flex items-center justify-center mx-auto mb-6">
              <Mic className="w-10 h-10 text-[#FF6B6B]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Pitch Tank</h1>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              Build a compelling startup pitch by filling in each section. Score points based on completeness and quality.
            </p>

            <div className="flex justify-center gap-6 mb-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-[#FF6B6B]">{PITCH_SECTIONS.length}</p>
                <p className="text-[var(--color-text-muted)]">sections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-accent)]">+{PITCH_SCORING.bonuses.allSections}</p>
                <p className="text-[var(--color-text-muted)]">bonus for complete</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#22C55E]">+{PITCH_SCORING.xpRates.allComplete} XP</p>
                <p className="text-[var(--color-text-muted)]">complete bonus</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-[#FF6B6B] text-white font-bold text-lg rounded-xl hover:bg-[#EF4444] transition-colors"
            >
              Start Pitching
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
  if (gameState === 'playing') {
    const currentContent = pitchContent[currentSection.id] || '';
    const currentWordCount = countWords(currentContent);
    const currentScore = sectionScores[currentSectionIndex];
    const isComplete = currentScore.score >= PITCH_SCORING.perSection.complete;
    const isOptimal = currentScore.score >= PITCH_SCORING.perSection.optimal;

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] pt-14 pb-32">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quit
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xl font-bold text-[var(--color-text-primary)]">{totalScore}</p>
                <p className="text-xs text-[var(--color-text-muted)]">points</p>
              </div>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#EF4444] transition-colors"
              >
                Submit Pitch
              </button>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {PITCH_SECTIONS.map((section, index) => {
              const sectionScore = sectionScores[index];
              const sectionComplete = sectionScore.score >= PITCH_SCORING.perSection.complete;
              const sectionOptimal = sectionScore.score >= PITCH_SCORING.perSection.optimal;

              return (
                <button
                  key={section.id}
                  onClick={() => goToSection(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    index === currentSectionIndex
                      ? 'bg-[#FF6B6B] text-white'
                      : sectionOptimal
                      ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]'
                      : sectionComplete
                      ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {sectionOptimal && <CheckCircle className="w-4 h-4" />}
                  <span className="font-semibold text-sm">{section.title}</span>
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="md:col-span-2">
              <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)]">
                {/* Section Header */}
                <div className="p-6 border-b border-[var(--color-border)] bg-[#FF6B6B]/10">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{currentSection.title}</h2>
                    <div className="flex items-center gap-2">
                      {isOptimal && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-[#22C55E]/20 text-[#22C55E] text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Optimal
                        </span>
                      )}
                      {!isOptimal && isComplete && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{currentSection.description}</p>
                </div>

                {/* Editor */}
                <div className="p-6">
                  <textarea
                    value={currentContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder={currentSection.placeholder}
                    className="w-full h-48 p-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] resize-none focus:outline-none focus:border-[#FF6B6B]"
                  />

                  {/* Word Count */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`${
                        currentWordCount >= currentSection.optimalWords
                          ? 'text-[#22C55E]'
                          : currentWordCount >= currentSection.minWords
                          ? 'text-[var(--color-accent)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}>
                        {currentWordCount} words
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        Min: {currentSection.minWords} | Optimal: {currentSection.optimalWords}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowSample(!showSample)}
                      className="flex items-center gap-2 text-sm text-[#FF6B6B] hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      {showSample ? 'Hide' : 'Show'} Example
                    </button>
                  </div>

                  {/* Sample */}
                  {showSample && (
                    <div className="mt-4 p-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl">
                      <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">EXAMPLE</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {SAMPLE_PITCH[currentSection.id as keyof typeof SAMPLE_PITCH]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="p-6 border-t border-[var(--color-border)] flex justify-between">
                  <button
                    onClick={() => goToSection(currentSectionIndex - 1)}
                    disabled={currentSectionIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                      currentSectionIndex === 0
                        ? 'text-[var(--color-text-muted)] cursor-not-allowed'
                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  {currentSectionIndex < PITCH_SECTIONS.length - 1 ? (
                    <button
                      onClick={() => goToSection(currentSectionIndex + 1)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-xl font-semibold hover:bg-[#EF4444] transition-colors"
                    >
                      Next Section
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-xl font-semibold hover:bg-[#16A34A] transition-colors"
                    >
                      Submit Pitch
                      <Target className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tips Sidebar */}
            <div className="space-y-4">
              <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-card)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Tips for {currentSection.title}</h3>
                <ul className="space-y-3">
                  {currentSection.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress Overview */}
              <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-card)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Progress</h3>
                <div className="space-y-3">
                  {sectionScores.map((s, i) => (
                    <div key={s.section.id} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        s.score >= PITCH_SCORING.perSection.optimal
                          ? 'bg-[#22C55E] text-white'
                          : s.score >= PITCH_SCORING.perSection.complete
                          ? 'bg-[var(--color-accent)] text-black'
                          : s.score > 0
                          ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                          : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                      }`}>
                        {i + 1}
                      </div>
                      <span className={`text-sm ${
                        i === currentSectionIndex ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                      }`}>
                        {s.section.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'finished') {
    const feedback = getFeedback();
    const completedCount = sectionScores.filter(s => s.score >= PITCH_SCORING.perSection.complete).length;
    const optimalCount = sectionScores.filter(s => s.score >= PITCH_SCORING.perSection.optimal).length;

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] pt-14">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-[var(--shadow-card)]">
            <div className="text-5xl mb-4">{feedback.emoji}</div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Pitch Complete!</h1>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">{feedback.message}</p>

            {/* Score */}
            <div className="mb-8">
              <p className="text-6xl font-bold text-[#FF6B6B]">{totalScore}</p>
              <p className="text-[var(--color-text-secondary)]">points</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[#22C55E]">{optimalCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Optimal</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--color-accent)]">{completedCount - optimalCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Complete</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-primary)] rounded-xl">
                <p className="text-2xl font-bold text-[var(--color-text-secondary)]">{PITCH_SECTIONS.length - completedCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Incomplete</p>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-[var(--color-bg-primary)] rounded-xl p-4 mb-8">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-3 text-left">Section Breakdown</h3>
              <div className="space-y-2">
                {sectionScores.map((s) => (
                  <div key={s.section.id} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">{s.section.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-text-muted)]">{s.wordCount} words</span>
                      <span className={`font-semibold ${
                        s.score >= PITCH_SCORING.perSection.optimal
                          ? 'text-[#22C55E]'
                          : s.score >= PITCH_SCORING.perSection.complete
                          ? 'text-[var(--color-accent)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}>
                        +{s.score}
                      </span>
                    </div>
                  </div>
                ))}
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
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#EF4444] transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PitchTank;
