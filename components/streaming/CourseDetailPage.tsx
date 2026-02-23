import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, BookOpen, Check, Plus } from 'lucide-react';
import { COURSES, INITIAL_VIDEOS, formatDuration, getCourseDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { isModularCourse } from '../../types';
import { ModularCourseView } from '../curriculum';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { watchHistory, isVideoSaved, toggleSaveVideo } = useLibrary();

  const course = COURSES.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Playbook not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-[#8B5CF6] text-white rounded-xl font-semibold"
          >
            View All Playbooks
          </button>
        </div>
      </div>
    );
  }

  // Render modular course view for courses with curriculum modules
  if (isModularCourse(course)) {
    return <ModularCourseView course={course} />;
  }

  const videos = course.videoIds
    .map(id => INITIAL_VIDEOS.find(v => v.id === id))
    .filter(Boolean) as typeof INITIAL_VIDEOS;

  const watchedCount = videos.filter(v => {
    const progress = watchHistory.find(h => h.videoId === v.id);
    return progress?.completed;
  }).length;

  const totalDuration = getCourseDuration(course);
  const progressPercent = (watchedCount / videos.length) * 100;

  const handlePlayVideo = (videoId: string) => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12]/80 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Course Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-3xl">
            {/* Course Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl"
              style={{ backgroundColor: course.color }}
            >
              {course.iconEmoji}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {course.title}
            </h1>

            <p className="text-lg text-[#9CA3AF] mb-6 max-w-2xl">
              {course.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <BookOpen className="w-5 h-5" />
                <span>{videos.length} sessions</span>
              </div>
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Clock className="w-5 h-5" />
                <span>{formatDuration(totalDuration)} total</span>
              </div>
              {watchedCount > 0 && (
                <div className="flex items-center gap-2 text-[#8B5CF6]">
                  <Check className="w-5 h-5" />
                  <span>{watchedCount}/{videos.length} crushed</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {progressPercent > 0 && (
              <div className="w-full max-w-md mb-6">
                <div className="h-2 bg-[#1E1E2E] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Play Button */}
            <button
              onClick={() => handlePlayVideo(videos[0]?.id || '')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0D0D12] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              {watchedCount > 0 ? 'Resume The Grind' : 'Start Playbook'}
            </button>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Playbook Sessions
        </h2>

        <div className="space-y-3">
          {videos.map((video, index) => {
            const progress = watchHistory.find(h => h.videoId === video.id);
            const isWatched = progress?.completed;
            const saved = isVideoSaved(video.id);

            return (
              <div
                key={video.id}
                className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-4 hover:bg-[#1A1A24] transition-colors cursor-pointer group"
                onClick={() => handlePlayVideo(video.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E1E2E]">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                    {isWatched && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#6B7280] text-sm">{index + 1}.</span>
                      <h3 className="text-white font-medium truncate group-hover:text-[#8B5CF6] transition-colors">
                        {video.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                      <span>{video.expert}</span>
                      <span>|</span>
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveVideo(video.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      saved
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-[#1E1E2E] text-[#6B7280] hover:text-white'
                    }`}
                  >
                    {saved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
