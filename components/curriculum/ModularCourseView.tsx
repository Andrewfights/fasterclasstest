import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Trophy, BookOpen, Clock, Award, Download, X, CheckCircle } from 'lucide-react';
import { Course, getCourseVideoIds, Certificate } from '../../types';
import { INITIAL_VIDEOS, GLOSSARY_TERMS, formatDuration } from '../../constants';
import { INITIAL_QUIZZES } from '../../data/quizzes';
import { useLibrary } from '../../contexts/LibraryContext';
import { useGamification } from '../../contexts/GamificationContext';
import { ModuleCard } from './ModuleCard';

interface ModularCourseViewProps {
  course: Course;
}

export const ModularCourseView: React.FC<ModularCourseViewProps> = ({ course }) => {
  const navigate = useNavigate();
  const { watchHistory } = useLibrary();
  const { progress, completeCourse, isCourseCompleted, getCertificate } = useGamification();
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const modules = course.modules || [];
  const existingCertificate = getCertificate(course.id);
  const courseAlreadyCompleted = isCourseCompleted(course.id);

  // Get all videos for the course
  const allVideoIds = getCourseVideoIds(course);
  const videos = useMemo(
    () =>
      allVideoIds
        .map(id => INITIAL_VIDEOS.find(v => v.id === id))
        .filter(Boolean),
    [allVideoIds]
  );

  // Calculate overall course progress
  const courseStats = useMemo(() => {
    let totalVideos = 0;
    let watchedVideos = 0;
    let totalQuizzes = 0;
    let passedQuizzes = 0;
    let totalTerms = 0;
    let learnedTerms = 0;
    let completedModules = 0;

    modules.forEach(module => {
      // Videos
      totalVideos += module.videoIds.length;
      module.videoIds.forEach(videoId => {
        const historyItem = watchHistory.find(h => h.videoId === videoId);
        if (historyItem?.completed) watchedVideos++;
      });

      // Quizzes
      if (module.quizId) {
        totalQuizzes++;
        const passed = progress.quizAttempts.some(
          a => a.quizId === module.quizId && a.passed
        );
        if (passed) passedQuizzes++;
      }

      // Key terms
      totalTerms += module.keyTermIds.length;
      module.keyTermIds.forEach(termId => {
        if (progress.learnedTerms?.includes(termId)) learnedTerms++;
      });

      // Check if module is complete
      const moduleVideosWatched = module.videoIds.filter(videoId => {
        const historyItem = watchHistory.find(h => h.videoId === videoId);
        return historyItem?.completed;
      }).length;

      const moduleQuizPassed = module.quizId
        ? progress.quizAttempts.some(a => a.quizId === module.quizId && a.passed)
        : true;

      const moduleTermsReviewed = module.keyTermIds.filter(
        termId => progress.learnedTerms?.includes(termId)
      ).length;

      const isModuleComplete =
        moduleVideosWatched === module.videoIds.length &&
        moduleQuizPassed &&
        (module.keyTermIds.length === 0 || moduleTermsReviewed >= module.keyTermIds.length);

      if (isModuleComplete) completedModules++;
    });

    const totalDuration = videos.reduce((acc, v) => acc + (v?.duration || 0), 0);
    const overallProgress = modules.length > 0 ? (completedModules / modules.length) * 100 : 0;

    return {
      totalVideos,
      watchedVideos,
      totalQuizzes,
      passedQuizzes,
      totalTerms,
      learnedTerms,
      completedModules,
      totalModules: modules.length,
      totalDuration,
      overallProgress,
    };
  }, [modules, watchHistory, progress, videos]);

  // Find next video to watch
  const nextVideo = useMemo(() => {
    for (const module of modules) {
      for (const videoId of module.videoIds) {
        const historyItem = watchHistory.find(h => h.videoId === videoId);
        if (!historyItem?.completed) {
          return INITIAL_VIDEOS.find(v => v.id === videoId);
        }
      }
    }
    return videos[0]; // Return first video if all completed
  }, [modules, watchHistory, videos]);

  const handleContinue = () => {
    if (nextVideo) {
      navigate(`/watch/${nextVideo.id}`);
    }
  };

  // Claim certificate when course is completed
  const handleClaimCertificate = () => {
    if (courseStats.overallProgress === 100 && !courseAlreadyCompleted) {
      completeCourse(
        course.id,
        course.title,
        courseStats.totalModules,
        courseStats.passedQuizzes,
        200 // XP reward
      );
    }
    setShowCertificateModal(true);
  };

  // Format date for certificate display
  const formatCertificateDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div
          className="absolute inset-0 h-[400px]"
          style={{
            background: `linear-gradient(180deg, ${course.color}20 0%, transparent 100%)`,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </button>

          {/* Course header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Course icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ backgroundColor: `${course.color}20` }}
            >
              {course.iconEmoji}
            </div>

            {/* Course info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-[#9CA3AF] mb-4">{course.description}</p>

              {/* Course stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#9CA3AF]">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>{courseStats.totalModules} Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Play className="w-4 h-4" />
                  <span>{courseStats.totalVideos} Videos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  <span>{courseStats.totalQuizzes} Quizzes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(courseStats.totalDuration)}</span>
                </div>
              </div>

              {/* Overall progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#9CA3AF]">Course Progress</span>
                  <span className="text-white font-medium">
                    {courseStats.completedModules}/{courseStats.totalModules} modules completed
                  </span>
                </div>
                <div className="h-2 bg-[#2E2E3E] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      courseStats.overallProgress === 100
                        ? 'bg-[#22C55E]'
                        : 'bg-[#8B5CF6]'
                    }`}
                    style={{ width: `${courseStats.overallProgress}%` }}
                  />
                </div>
              </div>

              {/* Continue button */}
              {courseStats.overallProgress < 100 && nextVideo && (
                <button
                  onClick={handleContinue}
                  className="mt-4 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5 fill-white" />
                  {courseStats.watchedVideos > 0 ? 'Continue Learning' : 'Start Course'}
                </button>
              )}

              {courseStats.overallProgress === 100 && (
                <button
                  onClick={handleClaimCertificate}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#F97316] hover:from-[#D97706] hover:to-[#EA580C] text-white font-medium rounded-xl inline-flex items-center gap-2 transition-all shadow-lg shadow-[#F59E0B]/20"
                >
                  <Award className="w-5 h-5" />
                  {existingCertificate ? 'View Certificate' : 'Claim Certificate'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Course Syllabus</h2>
        <div className="space-y-3">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              course={course}
              moduleNumber={index + 1}
            />
          ))}
        </div>

        {/* Course summary */}
        <div className="mt-8 p-6 bg-[#1A1A24] rounded-xl border border-[#2E2E3E]">
          <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#8B5CF6]">
                {courseStats.watchedVideos}/{courseStats.totalVideos}
              </div>
              <div className="text-sm text-[#9CA3AF]">Videos Watched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F59E0B]">
                {courseStats.passedQuizzes}/{courseStats.totalQuizzes}
              </div>
              <div className="text-sm text-[#9CA3AF]">Quizzes Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#06B6D4]">
                {courseStats.learnedTerms}/{courseStats.totalTerms}
              </div>
              <div className="text-sm text-[#9CA3AF]">Terms Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#22C55E]">
                {Math.round(courseStats.overallProgress)}%
              </div>
              <div className="text-sm text-[#9CA3AF]">Complete</div>
            </div>
          </div>
        </div>

        {/* Certificate earned badge */}
        {existingCertificate && (
          <div className="mt-4 p-4 bg-gradient-to-r from-[#F59E0B]/10 to-[#F97316]/10 rounded-xl border border-[#F59E0B]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Certificate Earned!</p>
                  <p className="text-sm text-[#9CA3AF]">
                    Completed on {formatCertificateDate(existingCertificate.earnedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2 bg-[#F59E0B]/20 text-[#F59E0B] font-medium rounded-lg hover:bg-[#F59E0B]/30 transition-colors"
              >
                View Certificate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#1A1A24] rounded-2xl w-full max-w-2xl overflow-hidden border border-[#2E2E3E]">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2E2E3E]">
              <h3 className="text-lg font-semibold text-white">Certificate of Completion</h3>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-2 text-[#6B7280] hover:text-white hover:bg-[#2E2E3E] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate content */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-[#F59E0B]/5 to-[#F97316]/5 rounded-xl border-2 border-[#F59E0B]/30 p-8 text-center">
                {/* Certificate icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>

                {/* Certificate text */}
                <p className="text-[#9CA3AF] text-sm mb-2">This certifies that</p>
                <p className="text-2xl font-bold text-white mb-4">You</p>
                <p className="text-[#9CA3AF] text-sm mb-2">have successfully completed</p>
                <p className="text-xl font-semibold text-[#F59E0B] mb-6">{course.title}</p>

                {/* Completion stats */}
                <div className="flex justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#22C55E] mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-bold">{courseStats.totalModules}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">Modules</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#22C55E] mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-bold">{courseStats.totalQuizzes}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">Quizzes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#F59E0B] mb-1">
                      <Trophy className="w-4 h-4" />
                      <span className="font-bold">+200</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">XP Earned</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-sm text-[#6B7280]">
                  {existingCertificate
                    ? `Earned on ${formatCertificateDate(existingCertificate.earnedAt)}`
                    : `Earned on ${formatCertificateDate(Date.now())}`}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-[#2E2E3E]">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 bg-[#2E2E3E] text-white font-medium rounded-lg hover:bg-[#3E3E4E] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModularCourseView;
