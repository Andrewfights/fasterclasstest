import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, CheckCircle, Clock, Trophy, ChevronRight, Zap, Filter, Target } from 'lucide-react';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { COURSES } from '../../constants';
import { useGamification } from '../../contexts/GamificationContext';

type ViewMode = 'all' | 'by-course' | 'incomplete';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useGamification();
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get quiz completion status
  const quizStatus = useMemo(() => {
    const status: Record<string, { completed: boolean; bestScore: number; attempts: number }> = {};

    INITIAL_QUIZZES.forEach(quiz => {
      const attempts = progress.quizAttempts.filter(a => a.quizId === quiz.id);
      const passedAttempts = attempts.filter(a => a.passed);
      const bestScore = attempts.length > 0
        ? Math.max(...attempts.map(a => a.score))
        : 0;

      status[quiz.id] = {
        completed: passedAttempts.length > 0,
        bestScore,
        attempts: attempts.length,
      };
    });

    return status;
  }, [progress.quizAttempts]);

  // Calculate difficulty based on question count and passing score
  const getDifficulty = (quiz: typeof INITIAL_QUIZZES[0]) => {
    const score = (quiz.questions.length * 2) + (quiz.passingScore / 10);
    if (score >= 18) return { label: 'Hard', color: '#EF4444' };
    if (score >= 14) return { label: 'Medium', color: '#F59E0B' };
    return { label: 'Easy', color: '#22C55E' };
  };

  // Calculate estimated time (30 seconds per question average)
  const getEstimatedTime = (questionCount: number) => {
    const minutes = Math.ceil(questionCount * 0.5);
    return `${minutes} min`;
  };

  // Group quizzes by course
  const quizzesByCourse = useMemo(() => {
    const grouped: Record<string, typeof INITIAL_QUIZZES> = {};
    INITIAL_QUIZZES.forEach(quiz => {
      if (!grouped[quiz.courseId]) {
        grouped[quiz.courseId] = [];
      }
      grouped[quiz.courseId].push(quiz);
    });
    return grouped;
  }, []);

  // Filter quizzes based on view mode
  const filteredQuizzes = useMemo(() => {
    if (viewMode === 'incomplete') {
      return INITIAL_QUIZZES.filter(q => !quizStatus[q.id]?.completed);
    }
    return INITIAL_QUIZZES;
  }, [viewMode, quizStatus]);

  const completedCount = Object.values(quizStatus).filter(s => s.completed).length;
  const incompleteCount = INITIAL_QUIZZES.length - completedCount;

  // Render quiz card
  const renderQuizCard = (quiz: typeof INITIAL_QUIZZES[0]) => {
    const course = COURSES.find(c => c.id === quiz.courseId);
    const status = quizStatus[quiz.id];
    const difficulty = getDifficulty(quiz);

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
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-[#9CA3AF]">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              {quiz.questions.length} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {getEstimatedTime(quiz.questions.length)}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#F5C518]" />
              {quiz.xpReward} XP
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: difficulty.color + '20', color: difficulty.color }}
            >
              {difficulty.label}
            </span>
          </div>
          {status.attempts > 0 && !status.completed && (
            <p className="text-xs text-[#F59E0B] mt-1">{status.attempts} attempt{status.attempts > 1 ? 's' : ''} - keep going!</p>
          )}
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
  };

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
        <div className="flex items-center justify-between mb-6">
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

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6 bg-[#1A1A24] p-1 rounded-xl">
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
              viewMode === 'all'
                ? 'bg-[#22C55E] text-white'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            All Quizzes
          </button>
          <button
            onClick={() => setViewMode('by-course')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
              viewMode === 'by-course'
                ? 'bg-[#22C55E] text-white'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            By Playbook
          </button>
          <button
            onClick={() => setViewMode('incomplete')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'incomplete'
                ? 'bg-[#22C55E] text-white'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            To Do ({incompleteCount})
          </button>
        </div>

        {/* Quiz List - All or Incomplete */}
        {viewMode !== 'by-course' && (
          <div className="space-y-3">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map(renderQuizCard)
            ) : (
              <div className="p-8 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] text-center">
                <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
                <p className="text-[#9CA3AF] text-sm">You've completed all available quizzes.</p>
              </div>
            )}
          </div>
        )}

        {/* Quiz List - By Course */}
        {viewMode === 'by-course' && (
          <div className="space-y-6">
            {COURSES.map(course => {
              const courseQuizzes = quizzesByCourse[course.id];
              if (!courseQuizzes || courseQuizzes.length === 0) return null;

              const completedInCourse = courseQuizzes.filter(q => quizStatus[q.id]?.completed).length;

              return (
                <div key={course.id}>
                  {/* Course Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: course.color + '20' }}
                    >
                      {course.iconEmoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{course.title}</h3>
                    </div>
                    <span className="text-sm text-[#6B7280]">
                      {completedInCourse}/{courseQuizzes.length}
                    </span>
                  </div>

                  {/* Course Quizzes */}
                  <div className="space-y-2 ml-11">
                    {courseQuizzes.map(renderQuizCard)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
