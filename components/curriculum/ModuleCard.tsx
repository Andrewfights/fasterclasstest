import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
  Circle,
  BookOpen,
  FileQuestion,
  Clock,
  FileText,
} from 'lucide-react';
import { CourseModule, Video, Course, UserHomeworkProgress } from '../../types';
import { INITIAL_VIDEOS, GLOSSARY_TERMS, formatDuration } from '../../constants';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { useLibrary } from '../../contexts/LibraryContext';
import { useGamification } from '../../contexts/GamificationContext';
import { ModuleProgressBar } from './ModuleProgressBar';
import { getHomeworkById } from '../../data/homework';

interface ModuleCardProps {
  module: CourseModule;
  course: Course;
  moduleNumber: number;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  course,
  moduleNumber,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { watchHistory } = useLibrary();
  const { progress } = useGamification();

  // Get video details
  const videos = useMemo(
    () =>
      module.videoIds
        .map(id => INITIAL_VIDEOS.find(v => v.id === id))
        .filter(Boolean) as Video[],
    [module.videoIds]
  );

  // Get quiz details
  const quiz = useMemo(
    () => module.quizId ? INITIAL_QUIZZES.find(q => q.id === module.quizId) : null,
    [module.quizId]
  );

  // Get key terms
  const keyTerms = useMemo(
    () =>
      module.keyTermIds
        .map(id => GLOSSARY_TERMS.find(t => t.id === id))
        .filter(Boolean),
    [module.keyTermIds]
  );

  // Get homework assignment
  const homework = useMemo(
    () => module.homeworkId ? getHomeworkById(module.homeworkId) : null,
    [module.homeworkId]
  );

  // Homework progress state (stored locally for now)
  const [homeworkProgress, setHomeworkProgress] = useState<UserHomeworkProgress | null>(() => {
    if (!homework) return null;
    const stored = localStorage.getItem(`homework_progress_${homework.id}`);
    return stored ? JSON.parse(stored) : null;
  });

  const [isHomeworkExpanded, setIsHomeworkExpanded] = useState(false);

  const handleToggleHomeworkItem = (itemId: string) => {
    if (!homework) return;

    const currentProgress = homeworkProgress || {
      assignmentId: homework.id,
      completedItems: [],
      startedAt: Date.now(),
    };

    const isCompleted = currentProgress.completedItems.includes(itemId);
    const newCompletedItems = isCompleted
      ? currentProgress.completedItems.filter(id => id !== itemId)
      : [...currentProgress.completedItems, itemId];

    const newProgress = {
      ...currentProgress,
      completedItems: newCompletedItems,
    };

    setHomeworkProgress(newProgress);
    localStorage.setItem(`homework_progress_${homework.id}`, JSON.stringify(newProgress));
  };

  const handleUpdateHomeworkNotes = (notes: string) => {
    if (!homework || !homeworkProgress) return;

    const newProgress = {
      ...homeworkProgress,
      notes,
    };

    setHomeworkProgress(newProgress);
    localStorage.setItem(`homework_progress_${homework.id}`, JSON.stringify(newProgress));
  };

  const handleCompleteHomework = () => {
    if (!homework || !homeworkProgress) return;

    const newProgress = {
      ...homeworkProgress,
      completedAt: Date.now(),
    };

    setHomeworkProgress(newProgress);
    localStorage.setItem(`homework_progress_${homework.id}`, JSON.stringify(newProgress));
    // TODO: Award XP through gamification context
  };

  // Calculate progress
  const videosWatched = videos.filter(v => {
    const historyItem = watchHistory.find(h => h.videoId === v.id);
    return historyItem?.completed;
  }).length;

  const quizPassed = quiz
    ? progress.quizAttempts.some(a => a.quizId === quiz.id && a.passed)
    : false;

  const termsReviewed = keyTerms.filter(
    t => progress.learnedTerms?.includes(t?.id || '')
  ).length;

  // Calculate total duration
  const totalDuration = videos.reduce((acc, v) => acc + v.duration, 0);

  // Check if module is complete
  const isComplete =
    videosWatched === videos.length &&
    (!quiz || quizPassed) &&
    (keyTerms.length === 0 || termsReviewed >= keyTerms.length);

  const handlePlayVideo = (videoId: string) => {
    navigate(`/watch/${videoId}`);
  };

  const handleTakeQuiz = () => {
    if (quiz) {
      navigate(`/learn/quiz/${quiz.id}`);
    }
  };

  const handleStudyTerms = () => {
    navigate('/learn/flashcards');
  };

  return (
    <div
      className={`bg-[#1A1A24] rounded-xl border transition-all ${
        isComplete
          ? 'border-[#22C55E]/30'
          : isExpanded
          ? 'border-[#8B5CF6]/50'
          : 'border-[#2E2E3E]'
      }`}
    >
      {/* Header (always visible) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-4">
          {/* Module number */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
              isComplete
                ? 'bg-[#22C55E]/20 text-[#22C55E]'
                : 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
            }`}
          >
            {isComplete ? <CheckCircle className="w-5 h-5" /> : moduleNumber}
          </div>

          {/* Title and description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white truncate">{module.title}</h3>
              {isComplete && (
                <span className="px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] text-xs font-medium rounded">
                  Complete
                </span>
              )}
            </div>
            <p className="text-sm text-[#9CA3AF] line-clamp-2">
              {module.description}
            </p>

            {/* Progress bar (collapsed view) */}
            {!isExpanded && (
              <div className="mt-3">
                <ModuleProgressBar
                  module={module}
                  videosWatched={videosWatched}
                  quizPassed={quizPassed}
                  termsReviewed={termsReviewed}
                />
              </div>
            )}
          </div>

          {/* Expand/collapse button */}
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#6B7280]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#6B7280]" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#2E2E3E] pt-4">
          {/* Videos section */}
          <div>
            <h4 className="text-sm font-medium text-[#9CA3AF] mb-2 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Videos ({videosWatched}/{videos.length})
            </h4>
            <div className="space-y-2">
              {videos.map(video => {
                const isWatched = watchHistory.find(
                  h => h.videoId === video.id && h.completed
                );
                return (
                  <button
                    key={video.id}
                    onClick={() => handlePlayVideo(video.id)}
                    className="w-full p-3 bg-[#0D0D12] rounded-lg flex items-center gap-3 hover:bg-[#13131A] transition-colors text-left group"
                  >
                    <div className="relative w-24 h-14 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {video.title}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {video.expert} • {formatDuration(video.duration)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {isWatched ? (
                        <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#6B7280]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz section */}
          {quiz && (
            <div>
              <h4 className="text-sm font-medium text-[#9CA3AF] mb-2 flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                Quiz
              </h4>
              <button
                onClick={handleTakeQuiz}
                className="w-full p-3 bg-[#0D0D12] rounded-lg flex items-center justify-between hover:bg-[#13131A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      quizPassed
                        ? 'bg-[#22C55E]/20 text-[#22C55E]'
                        : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}
                  >
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{quiz.title}</p>
                    <p className="text-xs text-[#6B7280]">
                      {quiz.questions.length} questions • {quiz.xpReward} XP
                    </p>
                  </div>
                </div>
                {quizPassed ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#22C55E] font-medium">Passed</span>
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  </div>
                ) : (
                  <span className="text-xs text-[#8B5CF6] font-medium">
                    Take Quiz
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Key Terms section */}
          {keyTerms.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[#9CA3AF] mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Key Terms ({termsReviewed}/{keyTerms.length})
              </h4>
              <button
                onClick={handleStudyTerms}
                className="w-full p-3 bg-[#0D0D12] rounded-lg flex items-center justify-between hover:bg-[#13131A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">
                      {keyTerms.map(t => t?.term).join(', ')}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      Study flashcards to learn these terms
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#06B6D4] font-medium">
                  Study
                </span>
              </button>
            </div>
          )}

          {/* Homework section */}
          {homework && (
            <div>
              <h4 className="text-sm font-medium text-[#9CA3AF] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Homework
              </h4>
              <div
                className={`bg-[#0D0D12] rounded-lg overflow-hidden border transition-colors ${
                  homeworkProgress?.completedAt
                    ? 'border-green-500/30'
                    : 'border-transparent'
                }`}
              >
                <button
                  onClick={() => setIsHomeworkExpanded(!isHomeworkExpanded)}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#13131A] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        homeworkProgress?.completedAt
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-[#c9a227]/20 text-[#c9a227]'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{homework.title}</p>
                      <p className="text-xs text-[#6B7280]">
                        {homeworkProgress?.completedItems?.length || 0}/{homework.actionItems.length} tasks • {homework.xpReward} XP
                      </p>
                    </div>
                  </div>
                  {homeworkProgress?.completedAt ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-500 font-medium">Completed</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ) : (
                    <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${isHomeworkExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Expanded homework content */}
                {isHomeworkExpanded && (
                  <div className="px-3 pb-3 border-t border-[#1E1E2E]">
                    <p className="text-sm text-[#9CA3AF] py-3">{homework.description}</p>
                    <div className="space-y-2">
                      {homework.actionItems.map(item => {
                        const isCompleted = homeworkProgress?.completedItems?.includes(item.id) || false;
                        return (
                          <div
                            key={item.id}
                            className={`flex items-start gap-3 p-2 rounded-lg ${
                              isCompleted ? 'bg-green-500/10' : 'bg-[#13131A]'
                            }`}
                          >
                            <button
                              onClick={() => handleToggleHomeworkItem(item.id)}
                              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'border-2 border-[#4E4E5E] hover:border-[#c9a227]'
                              }`}
                            >
                              {isCompleted && <CheckCircle className="w-3 h-3" />}
                            </button>
                            <div className="flex-1">
                              <p className={`text-xs ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                                {item.task}
                              </p>
                              {item.hint && !isCompleted && (
                                <p className="text-xs text-[#6B7280] mt-1 italic">{item.hint}</p>
                              )}
                            </div>
                            {!item.isRequired && (
                              <span className="px-1.5 py-0.5 bg-[#2E2E3E] rounded text-[10px] text-[#6B7280]">
                                Optional
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Complete button */}
                    {!homeworkProgress?.completedAt && (
                      <button
                        onClick={handleCompleteHomework}
                        disabled={
                          !homework.actionItems
                            .filter(i => i.isRequired)
                            .every(i => homeworkProgress?.completedItems?.includes(i.id))
                        }
                        className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Complete & Earn {homework.xpReward} XP
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module duration */}
          <div className="flex items-center gap-2 text-xs text-[#6B7280] pt-2 border-t border-[#2E2E3E]">
            <Clock className="w-3 h-3" />
            <span>Total: {formatDuration(totalDuration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
