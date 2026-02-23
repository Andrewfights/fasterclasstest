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
} from 'lucide-react';
import { CourseModule, Video, Course } from '../../types';
import { INITIAL_VIDEOS, GLOSSARY_TERMS, formatDuration } from '../../constants';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { useLibrary } from '../../contexts/LibraryContext';
import { useGamification } from '../../contexts/GamificationContext';
import { ModuleProgressBar } from './ModuleProgressBar';

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
