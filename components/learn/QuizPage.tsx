import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, CheckCircle, Clock, Trophy, ChevronRight } from 'lucide-react';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { COURSES } from '../../constants';
import { useGamification } from '../../contexts/GamificationContext';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useGamification();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get quiz completion status
  const quizStatus = useMemo(() => {
    const status: Record<string, { completed: boolean; bestScore: number }> = {};

    INITIAL_QUIZZES.forEach(quiz => {
      const attempts = progress.quizAttempts.filter(a => a.quizId === quiz.id);
      const passedAttempts = attempts.filter(a => a.passed);
      const bestScore = attempts.length > 0
        ? Math.max(...attempts.map(a => a.score))
        : 0;

      status[quiz.id] = {
        completed: passedAttempts.length > 0,
        bestScore,
      };
    });

    return status;
  }, [progress.quizAttempts]);

  const completedCount = Object.values(quizStatus).filter(s => s.completed).length;

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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Quizzes</h1>
              <p className="text-[#9CA3AF] text-sm">Test your knowledge</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-[#22C55E]">{completedCount}/{INITIAL_QUIZZES.length}</p>
            <p className="text-xs text-[#6B7280]">Completed</p>
          </div>
        </div>

        {/* Quiz List */}
        <div className="space-y-3">
          {INITIAL_QUIZZES.map(quiz => {
            const course = COURSES.find(c => c.id === quiz.courseId);
            const status = quizStatus[quiz.id];

            return (
              <button
                key={quiz.id}
                onClick={() => navigate(`/learn/quiz/${quiz.id}`)}
                className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group ${
                  status.completed
                    ? 'bg-[#22C55E]/10 border-[#22C55E]/30 hover:border-[#22C55E]'
                    : 'bg-[#1A1A24] border-[#2E2E3E] hover:border-[#22C55E]/50'
                }`}
              >
                {/* Course Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: (course?.color || '#8B5CF6') + '20' }}
                >
                  {course?.iconEmoji || '📚'}
                </div>

                {/* Quiz Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white group-hover:text-[#22C55E] transition-colors">
                      {quiz.title}
                    </h3>
                    {status.completed && (
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {quiz.questions.length} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-[#F5C518]" />
                      {quiz.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Score/Status */}
                <div className="text-right flex-shrink-0">
                  {status.bestScore > 0 ? (
                    <>
                      <p className={`text-lg font-bold ${status.completed ? 'text-[#22C55E]' : 'text-white'}`}>
                        {status.bestScore}%
                      </p>
                      <p className="text-xs text-[#6B7280]">Best Score</p>
                    </>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-white transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
