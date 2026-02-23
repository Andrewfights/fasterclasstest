import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Clock, User } from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration, COURSES } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { VideoCard } from './VideoCard';

export const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { isVideoSaved, toggleSaveVideo, updateVideoProgress, getVideoProgress, markVideoCompleted } = useLibrary();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const video = INITIAL_VIDEOS.find(v => v.id === videoId);
  const saved = videoId ? isVideoSaved(videoId) : false;
  const progress = videoId ? getVideoProgress(videoId) : undefined;

  // Find related videos (same tags or from same course)
  const relatedVideos = video
    ? INITIAL_VIDEOS.filter(v =>
        v.id !== video.id &&
        v.tags.some(tag => video.tags.includes(tag))
      ).slice(0, 6)
    : [];

  // Find which course this video belongs to
  const course = video
    ? COURSES.find(c => c.videoIds.includes(video.id))
    : undefined;

  useEffect(() => {
    // Mark video as started when page loads
    if (videoId) {
      updateVideoProgress(videoId, 1, false);
    }
  }, [videoId]);

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Session not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#8B5CF6] text-white rounded-xl font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (videoId) {
      markVideoCompleted(videoId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Video Player Section */}
      <div className="pt-16 bg-black">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Video Player */}
        <div className="relative w-full max-w-6xl mx-auto aspect-video bg-black">
          <iframe
            ref={iframeRef}
            src={`${video.embedUrl}?autoplay=1&rel=0`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Title & Actions */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {video.title}
              </h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleSaveVideo(video.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    saved
                      ? 'bg-[#8B5CF6] text-white'
                      : 'bg-[#1E1E2E] text-white hover:bg-[#2E2E3E]'
                  }`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {saved ? 'Saved' : 'Save'}
                </button>
                {!progress?.completed && (
                  <button
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-[#1E1E2E] text-white hover:bg-[#2E2E3E] transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Crushed
                  </button>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{video.expert}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(video.duration)}</span>
              </div>
              {progress?.completed && (
                <div className="flex items-center gap-2 text-[#8B5CF6]">
                  <Check className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {video.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#1E1E2E] text-[#9CA3AF] rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Course Link */}
            {course && (
              <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-4 mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: course.color }}
                  >
                    {course.iconEmoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#6B7280] text-sm">Part of</p>
                    <h3 className="text-white font-semibold">{course.title}</h3>
                  </div>
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="px-4 py-2 bg-[#1E1E2E] text-white rounded-xl font-medium hover:bg-[#2E2E3E] transition-colors"
                  >
                    View Playbook
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:w-80">
            <h3 className="text-lg font-semibold text-white mb-4">Next Moves</h3>
            <div className="space-y-4">
              {relatedVideos.map(v => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/watch/${v.id}`)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-[#1E1E2E] flex-shrink-0">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-white">
                      {formatDuration(v.duration)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#8B5CF6] transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-[#6B7280] text-xs mt-1">{v.expert}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
