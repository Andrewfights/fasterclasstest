import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, PenTool, ChevronRight, Trophy, Zap, Flame, Target, Clock, Star, ArrowRight, RefreshCw, Brain, TrendingUp } from 'lucide-react';
import { GLOSSARY_TERMS, COURSES } from '../../constants';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { FILL_BLANK_EXERCISES } from '../../data/fillblank';
import { useGamification } from '../../contexts/GamificationContext';

export const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, level, xpProgress, dailyMissions } = useGamification();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate progress stats
  const stats = useMemo(() => {
    const flashcardsMastered = Object.values(progress.flashcardProgress || {})
      .filter(f => f.masteryLevel >= 4).length;
    const flashcardsTotal = GLOSSARY_TERMS.length;

    const quizzesCompleted = progress.quizAttempts
      .filter(a => a.passed)
      .map(a => a.quizId)
      .filter((id, i, arr) => arr.indexOf(id) === i).length;
    const quizzesTotal = INITIAL_QUIZZES.length;

    // For fill-in-blank, we'd track in a similar way (simplified for now)
    const fillBlankCompleted = progress.learnedTerms?.length || 0;
    const fillBlankTotal = FILL_BLANK_EXERCISES.length;

    return {
      flashcards: { completed: flashcardsMastered, total: flashcardsTotal },
      quizzes: { completed: quizzesCompleted, total: quizzesTotal },
      fillBlank: { completed: Math.min(fillBlankCompleted, fillBlankTotal), total: fillBlankTotal },
    };
  }, [progress]);

  // Calculate skill breakdown by category
  const skillBreakdown = useMemo(() => {
    const categories: Record<string, { mastered: number; total: number }> = {};

    GLOSSARY_TERMS.forEach(term => {
      const category = term.category || 'General';
      if (!categories[category]) {
        categories[category] = { mastered: 0, total: 0 };
      }
      categories[category].total++;
      const termProgress = progress.flashcardProgress?.[term.term];
      if (termProgress && termProgress.masteryLevel >= 4) {
        categories[category].mastered++;
      }
    });

    return Object.entries(categories)
      .map(([name, data]) => ({
        name,
        mastered: data.mastered,
        total: data.total,
        percent: Math.round((data.mastered / data.total) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [progress]);

  // Get recommended exercises based on weak areas
  const recommendations = useMemo(() => {
    const recs: Array<{ type: string; title: string; description: string; path: string; priority: number }> = [];

    // Check for flashcards needing review (low mastery)
    const flashcardsNeedReview = Object.entries(progress.flashcardProgress || {})
      .filter(([_, p]) => p.masteryLevel < 3 && p.lastReviewed)
      .length;

    if (flashcardsNeedReview > 0) {
      recs.push({
        type: 'flashcards',
        title: `Review ${flashcardsNeedReview} Flashcards`,
        description: 'Cards you\'ve seen but haven\'t mastered yet',
        path: '/learn/flashcards',
        priority: 1,
      });
    }

    // Check for quizzes not yet passed
    const passedQuizIds = new Set(
      progress.quizAttempts.filter(a => a.passed).map(a => a.quizId)
    );
    const unpassedQuizzes = INITIAL_QUIZZES.filter(q => !passedQuizIds.has(q.id));

    if (unpassedQuizzes.length > 0) {
      const randomQuiz = unpassedQuizzes[Math.floor(Math.random() * unpassedQuizzes.length)];
      recs.push({
        type: 'quiz',
        title: randomQuiz.title,
        description: `${randomQuiz.questions.length} questions to test your knowledge`,
        path: `/learn/quiz/${randomQuiz.id}`,
        priority: 2,
      });
    }

    // Check for fill-in-blank exercises
    const completedFillBlank = progress.learnedTerms?.length || 0;
    if (completedFillBlank < FILL_BLANK_EXERCISES.length) {
      recs.push({
        type: 'fillblank',
        title: 'Fill-in-Blank Challenge',
        description: 'Complete sentences about startup concepts',
        path: '/learn/fill-blank',
        priority: 3,
      });
    }

    // If no flashcard progress, recommend starting
    if (Object.keys(progress.flashcardProgress || {}).length === 0) {
      recs.push({
        type: 'flashcards',
        title: 'Start with Flashcards',
        description: 'Master startup terminology first',
        path: '/learn/flashcards',
        priority: 0,
      });
    }

    return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [progress]);

  // Get continue learning items (in-progress)
  const continueLearning = useMemo(() => {
    const items: Array<{ type: string; title: string; description: string; path: string; progressPercent: number }> = [];

    // Find quizzes attempted but not passed
    const attemptedQuizIds = new Set(progress.quizAttempts.map(a => a.quizId));
    const passedQuizIds = new Set(progress.quizAttempts.filter(a => a.passed).map(a => a.quizId));

    attemptedQuizIds.forEach(quizId => {
      if (!passedQuizIds.has(quizId)) {
        const quiz = INITIAL_QUIZZES.find(q => q.id === quizId);
        if (quiz) {
          const attempts = progress.quizAttempts.filter(a => a.quizId === quizId);
          const bestScore = Math.max(...attempts.map(a => a.score));
          items.push({
            type: 'quiz',
            title: quiz.title,
            description: `Best score: ${bestScore}% - Keep trying!`,
            path: `/learn/quiz/${quiz.id}`,
            progressPercent: bestScore,
          });
        }
      }
    });

    // Find flashcard categories in progress
    const flashcardProgress = progress.flashcardProgress || {};
    const inProgressCount = Object.values(flashcardProgress).filter(
      p => p.masteryLevel > 0 && p.masteryLevel < 4
    ).length;

    if (inProgressCount > 0) {
      items.push({
        type: 'flashcards',
        title: 'Flashcards in Progress',
        description: `${inProgressCount} cards to review`,
        path: '/learn/flashcards',
        progressPercent: Math.round((stats.flashcards.completed / stats.flashcards.total) * 100),
      });
    }

    return items.slice(0, 3);
  }, [progress, stats]);

  const exerciseTypes = [
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Master startup terminology with spaced repetition',
      icon: BookOpen,
      color: '#c9a227',
      stats: stats.flashcards,
      path: '/learn/flashcards',
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      description: 'Test your knowledge with course quizzes',
      icon: HelpCircle,
      color: '#22C55E',
      stats: stats.quizzes,
      path: '/learn/quizzes',
    },
    {
      id: 'fillblank',
      title: 'Fill-in-Blank',
      description: 'Complete sentences about startup concepts',
      icon: PenTool,
      color: '#3B82F6',
      stats: stats.fillBlank,
      path: '/learn/fill-blank',
    },
  ];

  const getProgressPercent = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header with XP Progress */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#a88520] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Level Up</h1>
              <p className="text-[#9CA3AF] text-sm">Drills to lock in what you've learned</p>
            </div>
          </div>

          {/* XP & Level Badge */}
          <div className="flex items-center gap-4 p-3 bg-[#1A1A24] rounded-xl border border-[#2E2E3E]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#a88520] flex items-center justify-center">
                <span className="text-sm font-bold text-white">{level}</span>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Level {level}</p>
                <p className="text-sm font-medium text-white">{progress.xp.toLocaleString()} XP</p>
              </div>
            </div>
            <div className="w-px h-8 bg-[#2E2E3E]" />
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-[#6B7280]">Streak</p>
                <p className="text-sm font-medium text-white">{progress.currentStreak} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Missions */}
        {dailyMissions.length > 0 && (
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#c9a227]" />
                <h2 className="text-lg font-semibold text-white">Daily Missions</h2>
              </div>
              <span className="text-xs text-[#6B7280]">
                {dailyMissions.filter(m => m.completed).length}/{dailyMissions.length} complete
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {dailyMissions.map(mission => (
                <div
                  key={mission.id}
                  className={`p-3 rounded-lg border transition-all ${
                    mission.completed
                      ? 'bg-[#22C55E]/10 border-[#22C55E]/30'
                      : 'bg-[#13131A] border-[#2E2E3E] hover:border-[#c9a227]/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-medium text-sm ${mission.completed ? 'text-[#22C55E]' : 'text-white'}`}>
                      {mission.title}
                    </h3>
                    {mission.completed && (
                      <Star className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-2">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#c9a227]">+{mission.xpReward} XP</span>
                    {!mission.completed && mission.target && mission.target > 1 && (
                      <span className="text-xs text-[#6B7280]">
                        {mission.progress || 0}/{mission.target}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Learning Section */}
        {continueLearning.length > 0 && (
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-[#3B82F6]" />
              <h2 className="text-lg font-semibold text-white">Continue Learning</h2>
            </div>
            <div className="space-y-3">
              {continueLearning.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 p-3 bg-[#13131A] rounded-lg border border-[#2E2E3E] hover:border-[#3B82F6]/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                    {item.type === 'quiz' ? (
                      <HelpCircle className="w-5 h-5 text-[#3B82F6]" />
                    ) : item.type === 'flashcards' ? (
                      <BookOpen className="w-5 h-5 text-[#3B82F6]" />
                    ) : (
                      <PenTool className="w-5 h-5 text-[#3B82F6]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-[#3B82F6] transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF]">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-medium text-[#3B82F6]">{item.progressPercent}%</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recommended for You */}
        {recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-[#c9a227]/10 to-[#a88520]/10 rounded-xl border border-[#c9a227]/20 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-[#c9a227]" />
              <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {recommendations.map((rec, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(rec.path)}
                  className="p-4 bg-[#13131A]/50 rounded-lg border border-[#c9a227]/20 hover:border-[#c9a227]/50 transition-all text-left group"
                >
                  <h3 className="font-medium text-white group-hover:text-[#c9a227] transition-colors mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">{rec.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Cards */}
        <h2 className="text-lg font-semibold text-white mb-4">All Exercises</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {exerciseTypes.map(exercise => {
            const Icon = exercise.icon;
            const percent = getProgressPercent(exercise.stats.completed, exercise.stats.total);

            return (
              <button
                key={exercise.id}
                onClick={() => navigate(exercise.path)}
                className="p-5 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] hover:border-[#c9a227]/50 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: exercise.color + '20' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: exercise.color }} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-white transition-colors" />
                </div>

                <h3 className="font-semibold text-white mb-1 group-hover:text-[#c9a227] transition-colors">
                  {exercise.title}
                </h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  {exercise.description}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B7280]">
                      {exercise.stats.completed} / {exercise.stats.total} completed
                    </span>
                    <span style={{ color: exercise.color }}>{percent}%</span>
                  </div>
                  <div className="h-1.5 bg-[#2E2E3E] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: exercise.color,
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Overall Progress */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Exercise Progress */}
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#F5C518]" />
              Your Momentum
            </h2>

            <div className="space-y-4">
              {exerciseTypes.map(exercise => {
                const percent = getProgressPercent(exercise.stats.completed, exercise.stats.total);
                return (
                  <div key={exercise.id} className="flex items-center gap-4">
                    <span className="w-24 text-sm text-[#9CA3AF]">{exercise.title}</span>
                    <div className="flex-1 h-2 bg-[#2E2E3E] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: exercise.color,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium" style={{ color: exercise.color }}>
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#22C55E]" />
              Skill Breakdown
            </h2>

            <div className="space-y-3">
              {skillBreakdown.map((skill, idx) => {
                const colors = ['#c9a227', '#22C55E', '#3B82F6', '#F472B6', '#8B5CF6'];
                const color = colors[idx % colors.length];
                return (
                  <div key={skill.name} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-[#9CA3AF] truncate">{skill.name}</span>
                    <div className="flex-1 h-1.5 bg-[#2E2E3E] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${skill.percent}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-medium" style={{ color }}>
                      {skill.percent}%
                    </span>
                  </div>
                );
              })}
              {skillBreakdown.length === 0 && (
                <p className="text-sm text-[#6B7280] text-center py-4">
                  Start flashcards to see your skill breakdown
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-[#c9a227]/10 to-[#a88520]/10 rounded-xl border border-[#c9a227]/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#c9a227]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-[#c9a227]" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Pro Tips</h3>
              <ul className="text-sm text-[#9CA3AF] space-y-1">
                <li>Start with flashcards to master the terminology</li>
                <li>Take quizzes after crushing playbook sessions</li>
                <li>Use fill-in-the-blank to lock in key concepts</li>
                <li>Review cards you marked "Review" more frequently</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
