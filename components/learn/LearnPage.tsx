import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, PenTool, ChevronRight, Trophy, Zap } from 'lucide-react';
import { GLOSSARY_TERMS } from '../../constants';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { FILL_BLANK_EXERCISES } from '../../data/fillblank';
import { useGamification } from '../../contexts/GamificationContext';

export const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useGamification();

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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#a88520] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Level Up</h1>
            <p className="text-[#9CA3AF] text-sm">Drills to lock in what you've learned</p>
          </div>
        </div>

        {/* Exercise Cards */}
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
        <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-6 mb-8">
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
