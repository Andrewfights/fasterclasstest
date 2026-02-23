import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Clock, User, ChevronLeft, Share2, Tag } from 'lucide-react';
import { INITIAL_VIDEOS, FAST_CHANNELS, formatDuration, COURSES } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { filterValidVideos } from '../../services/videoValidationService';

export const VideoDetailsPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { isVideoSaved, toggleSaveVideo, getVideoProgress } = useLibrary();

  const video = INITIAL_VIDEOS.find(v => v.id === videoId);
  const saved = videoId ? isVideoSaved(videoId) : false;
  const progress = videoId ? getVideoProgress(videoId) : undefined;

  // Find which course this video belongs to
  const course = video
    ? COURSES.find(c => c.videoIds.includes(video.id))
    : undefined;

  // Find which channel features this video (for live/linear context)
  const channel = video
    ? FAST_CHANNELS.find(c => c.videoIds.includes(video.id))
    : undefined;

  // Get related videos
  const relatedVideos = useMemo(() => {
    if (!video) return [];
    return filterValidVideos(
      INITIAL_VIDEOS.filter(v =>
        v.id !== video.id &&
        v.tags.some(tag => video.tags.includes(tag))
      )
    ).slice(0, 8);
  }, [video]);

  // Calculate progress percentage
  const progressPercent = progress && video
    ? Math.round((progress.timestamp / video.duration) * 100)
    : 0;

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#F5C518] text-black rounded-xl font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-14">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-[50vh]">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12] via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Content Info */}
        <div className="relative z-10 px-4 lg:px-8 pt-32 lg:pt-48 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Thumbnail - Mobile/Tablet */}
            <div className="lg:hidden w-full max-w-md mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {/* Progress bar */}
                {progressPercent > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                    <div
                      className="h-full bg-[#F5C518]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail - Desktop */}
            <div className="hidden lg:block flex-shrink-0 w-80">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {progressPercent > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                    <div
                      className="h-full bg-[#F5C518]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              {/* Title */}
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3">
                {video.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-white/60 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {video.expert}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(video.duration)}
                </span>
                {channel && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-[#F5C518]">{channel.name}</span>
                  </>
                )}
                {course && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-[#F5C518]">{course.title}</span>
                  </>
                )}
              </div>

              {/* Progress Info */}
              {progress && !progress.completed && progressPercent > 0 && (
                <div className="mb-4 px-4 py-2 bg-[#F5C518]/10 rounded-lg inline-flex items-center gap-2">
                  <span className="text-[#F5C518] text-sm font-medium">
                    {progressPercent}% watched • {formatDuration(video.duration - progress.timestamp)} remaining
                  </span>
                </div>
              )}
              {progress?.completed && (
                <div className="mb-4 px-4 py-2 bg-green-500/10 rounded-lg inline-flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Completed</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
                {video.tags.slice(0, 5).map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigate(`/watch/${video.id}${progress?.timestamp ? `?t=${progress.timestamp}` : ''}`)}
                  className="flex items-center gap-2 px-8 py-3 bg-[#F5C518] hover:bg-[#d4a820] text-black font-semibold rounded-xl transition-colors"
                >
                  <Play className="w-5 h-5" />
                  {progress && !progress.completed && progressPercent > 0 ? 'Resume' : 'Play'}
                </button>

                <button
                  onClick={() => videoId && toggleSaveVideo(videoId)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    saved
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {saved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {saved ? 'In Library' : 'Add to Library'}
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: video.title,
                        text: `Watch "${video.title}" by ${video.expert}`,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Info Section */}
      <div className="px-4 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Description placeholder - could be enhanced with actual video descriptions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">About</h2>
          <p className="text-white/70 leading-relaxed">
            Learn from {video.expert} in this {formatDuration(video.duration)} session.
            {course && ` Part of the ${course.title} curriculum.`}
            {channel && ` Featured on ${channel.name}.`}
          </p>
        </div>

        {/* Course Info */}
        {course && (
          <div className="mb-8 p-4 bg-[#1E1E2E] rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50 mb-1">Part of course</p>
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                <p className="text-sm text-white/60">{course.videoIds.length} videos</p>
              </div>
              <button
                onClick={() => navigate(`/course/${course.id}`)}
                className="px-4 py-2 bg-[#F5C518] text-black font-medium rounded-lg"
              >
                View Course
              </button>
            </div>
          </div>
        )}

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedVideos.map(relatedVideo => (
                <button
                  key={relatedVideo.id}
                  onClick={() => navigate(`/details/${relatedVideo.id}`)}
                  className="group text-left"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                    <img
                      src={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                      {formatDuration(relatedVideo.duration)}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#F5C518] transition-colors">
                    {relatedVideo.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">{relatedVideo.expert}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDetailsPage;
