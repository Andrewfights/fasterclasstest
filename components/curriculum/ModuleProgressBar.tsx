import React from 'react';
import { CheckCircle, Circle, BookOpen, Play } from 'lucide-react';
import { CourseModule } from '../../types';

interface ModuleProgressBarProps {
  module: CourseModule;
  videosWatched: number;
  quizPassed: boolean;
  termsReviewed: number;
}

export const ModuleProgressBar: React.FC<ModuleProgressBarProps> = ({
  module,
  videosWatched,
  quizPassed,
  termsReviewed,
}) => {
  const totalVideos = module.videoIds.length;
  const hasQuiz = !!module.quizId;
  const totalTerms = module.keyTermIds.length;

  // Calculate overall progress
  let completedItems = videosWatched;
  let totalItems = totalVideos;

  if (hasQuiz) {
    totalItems += 1;
    if (quizPassed) completedItems += 1;
  }

  if (totalTerms > 0) {
    totalItems += 1;
    if (termsReviewed >= totalTerms) completedItems += 1;
  }

  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isComplete = progressPercent === 100;

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="h-1.5 bg-[#2E2E3E] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete ? 'bg-[#22C55E]' : 'bg-[#8B5CF6]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Status items */}
      <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
        {/* Videos */}
        <div className="flex items-center gap-1.5">
          <Play className="w-3 h-3" />
          <span>
            {videosWatched}/{totalVideos} Videos
          </span>
          {videosWatched === totalVideos && (
            <CheckCircle className="w-3 h-3 text-[#22C55E]" />
          )}
        </div>

        {/* Quiz */}
        {hasQuiz && (
          <div className="flex items-center gap-1.5">
            {quizPassed ? (
              <>
                <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                <span className="text-[#22C55E]">Quiz Passed</span>
              </>
            ) : (
              <>
                <Circle className="w-3 h-3" />
                <span>Quiz</span>
              </>
            )}
          </div>
        )}

        {/* Key Terms */}
        {totalTerms > 0 && (
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" />
            <span>{totalTerms} Key Terms</span>
            {termsReviewed >= totalTerms && (
              <CheckCircle className="w-3 h-3 text-[#22C55E]" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleProgressBar;
