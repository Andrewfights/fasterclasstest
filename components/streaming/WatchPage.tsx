import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Clock, User, RotateCcw, PictureInPicture2 } from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration, COURSES, getYoutubeId } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { usePiP } from '../../contexts/PiPContext';
import { VideoCard } from './VideoCard';

export const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isVideoSaved, toggleSaveVideo, updateVideoProgress, getVideoProgress, markVideoCompleted } = useLibrary();
  const { enablePiP, disablePiP, isActive: isPiPActive } = usePiP();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [watchFromStart, setWatchFromStart] = useState(false);
  const currentTimeRef = useRef<number>(0);
  const autoPiPEnabledRef = useRef<boolean>(true); // Track if auto-PiP should trigger

  const video = INITIAL_VIDEOS.find(v => v.id === videoId);
  const saved = videoId ? isVideoSaved(videoId) : false;
  const progress = videoId ? getVideoProgress(videoId) : undefined;

  // Get resume time from URL query param or saved progress
  const urlResumeTime = searchParams.get('t');
  const savedResumeTime = progress?.timestamp || 0;
  const resumeTime = watchFromStart ? 0 : (urlResumeTime ? parseInt(urlResumeTime) : savedResumeTime);
  const hasProgress = savedResumeTime > 10; // Only show restart if more than 10 seconds watched

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
    if (videoId && resumeTime > 0) {
      updateVideoProgress(videoId, resumeTime, false);
    } else if (videoId) {
      updateVideoProgress(videoId, 1, false);
    }
  }, [videoId]);

  // Auto-PiP when navigating away from video
  useEffect(() => {
    // Store current time from resume time (will be updated by progress tracking)
    currentTimeRef.current = resumeTime;

    // Cleanup - enable PiP when unmounting if not already in PiP
    return () => {
      if (video && autoPiPEnabledRef.current && !isPiPActive) {
        enablePiP({
          videoId: video.id,
          embedUrl: video.embedUrl,
          title: video.title,
          expert: video.expert,
          thumbnail: video.thumbnail,
          duration: video.duration,
          startTime: currentTimeRef.current || resumeTime,
          isLive: false,
        });
      }
    };
  }, [video, resumeTime]);

  // Disable auto-PiP when manually enabling PiP (prevents double activation)
  useEffect(() => {
    if (isPiPActive) {
      autoPiPEnabledRef.current = false;
    }
  }, [isPiPActive]);

  // Handle watch from start
  const handleWatchFromStart = useCallback(() => {
    setWatchFromStart(true);
    if (videoId) {
      updateVideoProgress(videoId, 0, false);
    }
  }, [videoId, updateVideoProgress]);

  // Handle enabling PiP before navigation
  const handleEnablePiP = useCallback(() => {
    if (video && !isPiPActive) {
      enablePiP({
        videoId: video.id,
        embedUrl: video.embedUrl,
        title: video.title,
        expert: video.expert,
        thumbnail: video.thumbnail,
        duration: video.duration,
        startTime: resumeTime,
        isLive: false,
      });
    }
  }, [video, resumeTime, enablePiP, isPiPActive]);

  // Handle back navigation with PiP option
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Session not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold"
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
      <div className="pt-16 bg-black relative">
        {/* Video Player - Paused when PiP is active */}
        <div className="relative w-full max-w-6xl mx-auto aspect-video bg-black">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* PiP Button */}
          {!isPiPActive && (
            <button
              onClick={handleEnablePiP}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              title="Continue in mini player"
            >
              <PictureInPicture2 className="w-5 h-5" />
            </button>
          )}

          {!isPiPActive ? (
            <iframe
              ref={iframeRef}
              key={`${videoId}-${watchFromStart}`}
              src={`${video.embedUrl}?autoplay=1&rel=0&start=${resumeTime}`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <p className="text-white/60 mb-2">Playing in mini player</p>
                <button
                  onClick={disablePiP}
                  className="px-4 py-2 bg-[#c9a227] text-black font-semibold rounded-lg"
                >
                  Return to Full Screen
                </button>
              </div>
            </div>
          )}
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
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                {hasProgress && !watchFromStart && (
                  <button
                    onClick={handleWatchFromStart}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-[#1E1E2E] text-white hover:bg-[#2E2E3E] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Watch from Start
                  </button>
                )}
                <button
                  onClick={() => toggleSaveVideo(video.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    saved
                      ? 'bg-[#c9a227] text-white'
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
                <div className="flex items-center gap-2 text-[#c9a227]">
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
                    <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#c9a227] transition-colors">
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
