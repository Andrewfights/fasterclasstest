import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  Zap,
  BookOpen,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { LEARNING_MODULES, INITIAL_VIDEOS, INITIAL_QUIZZES, INITIAL_FLASHCARD_DECKS } from '../../constants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressRing';

export const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { progress } = useGamification();

  const module = LEARNING_MODULES.find((m) => m.id === moduleId);

  if (!module) {
    return <Navigate to="/" replace />;
  }

  // Check if module is locked
  const isLocked = module.prerequisiteIds.some(
    (prereqId) => !progress.modulesCompleted.includes(prereqId)
  );

  if (isLocked) {
    return <Navigate to="/" replace />;
  }

  const moduleProgress = progress.modulesInProgress[module.id];
  const videos = INITIAL_VIDEOS.filter((v) => module.videoIds.includes(v.id));
  const quizzes = INITIAL_QUIZZES.filter((q) => module.quizIds.includes(q.id));
  const flashcardDeck = INITIAL_FLASHCARD_DECKS.find((d) => d.id === module.flashcardDeckId);

  const totalItems = module.videoIds.length + module.quizIds.length + (flashcardDeck ? 1 : 0);
  const completedItems = moduleProgress
    ? moduleProgress.videosWatched.length +
      moduleProgress.quizzesPassed.length +
      (moduleProgress.flashcardsReviewed ? 1 : 0)
    : 0;
  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Find next uncompleted item
  const getNextItem = () => {
    for (const video of videos) {
      if (!moduleProgress?.videosWatched.includes(video.id)) {
        return { type: 'video', id: video.id };
      }
      // Check for quiz after this video
      const videoQuiz = quizzes.find((q) => q.videoId === video.id);
      if (videoQuiz && !moduleProgress?.quizzesPassed.includes(videoQuiz.id)) {
        return { type: 'quiz', id: videoQuiz.id };
      }
    }
    if (flashcardDeck && !moduleProgress?.flashcardsReviewed) {
      return { type: 'flashcards', id: flashcardDeck.id };
    }
    return null;
  };

  const nextItem = getNextItem();

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#777777] hover:text-[#3C3C3C] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Learning Path</span>
        </Link>

        {/* Module Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div
            className="h-48 bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.7)), url(${module.coverImage})`,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{module.iconEmoji}</span>
                <h1 className="text-3xl font-bold text-white">{module.title}</h1>
              </div>
              <p className="text-white/90">{module.description}</p>
            </div>
          </div>

          <div className="p-6">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#777777]">Progress</span>
                <span className="font-semibold text-[#3C3C3C]">{Math.round(progressPercent)}%</span>
              </div>
              <ProgressBar
                progress={progressPercent}
                height={12}
                color={module.color}
              />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-[#777777]">
                <Clock className="w-5 h-5" />
                <span>{module.estimatedMinutes} min</span>
              </div>
              <div className="flex items-center gap-2 text-[#777777]">
                <Play className="w-5 h-5" />
                <span>{videos.length} videos</span>
              </div>
              <div className="flex items-center gap-2 text-[#777777]">
                <HelpCircle className="w-5 h-5" />
                <span>{quizzes.length} quizzes</span>
              </div>
              <div className="flex items-center gap-2 text-[#FF9600] font-semibold">
                <Zap className="w-5 h-5" />
                <span>+{module.xpReward} XP</span>
              </div>
            </div>

            {/* Continue button */}
            {nextItem && (
              <div className="mt-6">
                <Link to={
                  nextItem.type === 'video'
                    ? `/module/${module.id}/video/${nextItem.id}`
                    : nextItem.type === 'quiz'
                    ? `/module/${module.id}/quiz/${nextItem.id}`
                    : `/module/${module.id}/flashcards`
                }>
                  <Button variant="primary" fullWidth size="lg" style={{ backgroundColor: module.color }}>
                    <Play className="w-5 h-5 mr-2" />
                    {moduleProgress ? 'Continue Learning' : 'Start Module'}
                  </Button>
                </Link>
              </div>
            )}

            {!nextItem && progressPercent === 100 && (
              <div className="mt-6 bg-[#E8F5E9] rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-[#58CC02]" />
                <div>
                  <div className="font-bold text-[#3C3C3C]">Module Complete!</div>
                  <div className="text-sm text-[#777777]">You&apos;ve earned {module.xpReward} XP</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#3C3C3C] mb-4">Module Content</h2>

          {/* Videos */}
          {videos.map((video, index) => {
            const isWatched = moduleProgress?.videosWatched.includes(video.id);
            const videoQuiz = quizzes.find((q) => q.videoId === video.id);
            const quizPassed = videoQuiz && moduleProgress?.quizzesPassed.includes(videoQuiz.id);

            // Determine if this video is locked (previous video not watched)
            const previousVideo = index > 0 ? videos[index - 1] : null;
            const isVideoLocked = previousVideo && !moduleProgress?.videosWatched.includes(previousVideo.id);

            return (
              <div key={video.id}>
                {/* Video card */}
                <Card
                  hover={!isVideoLocked}
                  className={`${isVideoLocked ? 'opacity-60' : ''}`}
                >
                  {isVideoLocked ? (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#E5E5E5] flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#AFAFAF]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#AFAFAF]">{video.title}</h3>
                        <p className="text-sm text-[#AFAFAF]">Complete previous video to unlock</p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={`/module/${module.id}/video/${video.id}`}
                      className="flex items-center gap-4"
                    >
                      <div
                        className="w-16 h-16 rounded-xl bg-cover bg-center relative overflow-hidden"
                        style={{ backgroundImage: `url(${video.thumbnail})` }}
                      >
                        {isWatched ? (
                          <div className="absolute inset-0 bg-[#58CC02]/80 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#3C3C3C]">{video.title}</h3>
                        <p className="text-sm text-[#777777]">by {video.expert}</p>
                      </div>
                      <div className="text-sm text-[#777777]">
                        {Math.floor(video.duration / 60)} min
                      </div>
                      {isWatched && (
                        <span className="text-sm font-semibold text-[#58CC02]">+10 XP</span>
                      )}
                    </Link>
                  )}
                </Card>

                {/* Quiz card (if exists for this video) */}
                {videoQuiz && (
                  <div className="ml-8 mt-2 mb-4">
                    <Card
                      hover={isWatched && !quizPassed}
                      className={`bg-[#FFF8E1] border-[#FFE082] ${!isWatched ? 'opacity-60' : ''}`}
                    >
                      {!isWatched ? (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#E5E5E5] flex items-center justify-center">
                            <Lock className="w-5 h-5 text-[#AFAFAF]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#AFAFAF]">Quiz: {videoQuiz.title}</h3>
                            <p className="text-sm text-[#AFAFAF]">Watch video to unlock</p>
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={`/module/${module.id}/quiz/${videoQuiz.id}`}
                          className="flex items-center gap-4"
                        >
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center
                            ${quizPassed ? 'bg-[#58CC02]' : 'bg-[#FF9600]'}
                          `}>
                            {quizPassed ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <HelpCircle className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#3C3C3C]">Quiz: {videoQuiz.title}</h3>
                            <p className="text-sm text-[#777777]">
                              {videoQuiz.questions.length} questions
                            </p>
                          </div>
                          {quizPassed ? (
                            <span className="text-sm font-semibold text-[#58CC02]">+{videoQuiz.xpReward} XP</span>
                          ) : (
                            <span className="text-sm font-semibold text-[#FF9600]">+{videoQuiz.xpReward} XP</span>
                          )}
                        </Link>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            );
          })}

          {/* Flashcards */}
          {flashcardDeck && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#3C3C3C] mb-4">Review Flashcards</h3>
              <Card hover className="bg-[#E3F2FD] border-[#90CAF9]">
                <Link
                  to={`/module/${module.id}/flashcards`}
                  className="flex items-center gap-4"
                >
                  <div className={`
                    w-16 h-16 rounded-xl flex items-center justify-center
                    ${moduleProgress?.flashcardsReviewed ? 'bg-[#58CC02]' : 'bg-[#1CB0F6]'}
                  `}>
                    {moduleProgress?.flashcardsReviewed ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#3C3C3C]">{flashcardDeck.title}</h3>
                    <p className="text-sm text-[#777777]">
                      {flashcardDeck.cards.length} cards to review
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${moduleProgress?.flashcardsReviewed ? 'text-[#58CC02]' : 'text-[#1CB0F6]'}`}>
                    +25 XP
                  </span>
                </Link>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
