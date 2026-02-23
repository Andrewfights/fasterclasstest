import React, { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Tv,
  Flame,
  Zap,
  ChevronRight,
  BookOpen,
  Trophy,
  PlayCircle,
  Gamepad2,
  Smartphone,
} from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { gamificationService } from '../../services/gamificationService';
import { INITIAL_VIDEOS, FAST_CHANNELS, COURSES, formatDuration } from '../../constants';
import { filterValidVideos } from '../../services/videoValidationService';
import { FastChannel, Video, HeroCarouselItem } from '../../types';
import { HeroCarousel } from '../vod/HeroCarousel';

// Get what's currently playing on a channel
const getChannelNowPlaying = (channel: FastChannel, videos: Video[]): Video | null => {
  const channelVideos = channel.videoIds
    .map(id => videos.find(v => v.id === id))
    .filter(Boolean) as Video[];

  if (channelVideos.length === 0) return null;

  const totalDuration = channelVideos.reduce((acc, v) => acc + v.duration, 0);
  const now = Date.now() / 1000;
  const loopPosition = now % totalDuration;

  let accumulated = 0;
  for (const video of channelVideos) {
    if (accumulated + video.duration > loopPosition) {
      return video;
    }
    accumulated += video.duration;
  }
  return channelVideos[0];
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { level, levelDefinition, xpProgress, progress } = useGamification();
  const { continueWatching, savedVideos, getVideoProgress } = useLibrary();
  const stats = gamificationService.getStats();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get all valid videos
  const validVideos = useMemo(() => filterValidVideos(INITIAL_VIDEOS), []);

  // Get continue watching video
  const continueVideo = useMemo(() => {
    if (continueWatching.length === 0) return null;
    const historyItem = continueWatching[0];
    const video = validVideos.find(v => v.id === historyItem.videoId);
    if (!video) return null;
    const progressPercent = Math.round((historyItem.timestamp / video.duration) * 100);
    return { video, progress: progressPercent, timestamp: historyItem.timestamp };
  }, [continueWatching, validVideos]);

  // Get recommended videos (based on tags from watched videos)
  const recommendedVideos = useMemo(() => {
    // For now, just return popular videos not in continue watching
    const watchedIds = new Set(continueWatching.map(h => h.videoId));
    return validVideos
      .filter(v => !watchedIds.has(v.id) && !v.isVertical)
      .slice(0, 10);
  }, [continueWatching, validVideos]);

  // Get shorts videos for the shorts section
  const shortsVideos = useMemo(() => {
    return validVideos
      .filter(v => v.isVertical === true)
      .slice(0, 12);
  }, [validVideos]);

  // Get featured channels with current video
  const featuredChannels = useMemo(() => {
    return FAST_CHANNELS.slice(0, 3).map(channel => ({
      channel,
      nowPlaying: getChannelNowPlaying(channel, validVideos),
    }));
  }, [validVideos]);

  // Get time-based greeting (hustle style)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Rise and grind';
    if (hour < 17) return "Let's build";
    return 'Time to build';
  }, []);

  // Hero carousel items - mix of courses and videos
  const heroCarouselItems: HeroCarouselItem[] = useMemo(() => {
    const longFormVideos = validVideos.filter(v => !v.isVertical && v.duration > 300);
    return [
      { type: 'course', item: COURSES[0] },
      ...(longFormVideos[0] ? [{ type: 'video' as const, item: longFormVideos[0] }] : []),
      { type: 'course', item: COURSES[1] },
      ...(longFormVideos[4] ? [{ type: 'video' as const, item: longFormVideos[4] }] : []),
      { type: 'course', item: COURSES[2] },
      ...(longFormVideos[8] ? [{ type: 'video' as const, item: longFormVideos[8] }] : []),
    ].filter(Boolean);
  }, [validVideos]);

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Hero Carousel - with top padding for nav */}
      <div className="pt-14">
        <HeroCarousel items={heroCarouselItems} autoPlayInterval={8000} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header - Below Carousel */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="mc-heading text-2xl md:text-3xl text-white">
                {greeting}, Founder!
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                <span
                  className="px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: levelDefinition.color, color: 'white' }}
                >
                  Level {level} - {levelDefinition.title}
                </span>
                <span className="flex items-center gap-1 text-[#FF9600]">
                  <Flame className="w-4 h-4" />
                  {stats.currentStreak} day grind streak
                </span>
                <span className="flex items-center gap-1 text-[#58CC02]">
                  <Zap className="w-4 h-4" />
                  {stats.totalXP.toLocaleString()} HP
                </span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="w-full md:w-64">
              <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                <span>Level {level + 1}</span>
                <span>{xpProgress.current}/{xpProgress.needed} HP</span>
              </div>
              <div className="h-2 bg-[#1E1E2E] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${xpProgress.progress}%`, backgroundColor: levelDefinition.color }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Continue Watching / Live Now Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Continue Learning or Start Building */}
          <div className="lg:col-span-2">
            {continueVideo ? (
              <button
                onClick={() => navigate(`/watch/${continueVideo.video.id}?t=${continueVideo.timestamp}`)}
                className="w-full bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden hover:border-[#c9a227]/50 transition-all group"
              >
                <div className="relative aspect-video">
                  <img
                    src={continueVideo.video.thumbnail}
                    alt={continueVideo.video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="mc-label text-[#c9a227] mb-1">
                      Pick Up The Grind
                    </p>
                    <h3 className="font-display text-xl font-bold text-white mb-1">{continueVideo.video.title}</h3>
                    <p className="text-sm text-white/70">{continueVideo.video.expert}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                    <div
                      className="h-full bg-[#c9a227]"
                      style={{ width: `${continueVideo.progress}%` }}
                    />
                  </div>
                </div>
              </button>
            ) : (
              <Link
                to="/courses"
                className="flex flex-col items-center justify-center w-full h-full min-h-[280px] bg-gradient-to-br from-[#c9a227] to-[#a88520] rounded-2xl p-8 text-center hover:opacity-90 transition-opacity"
              >
                <BookOpen className="w-16 h-16 text-black mb-6" />
                <h3 className="font-display text-2xl font-bold text-black mb-3">Start Building</h3>
                <p className="text-black/80 text-lg max-w-md">Battle-tested playbooks from founders who've done it</p>
              </Link>
            )}
          </div>

          {/* Live Now */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] overflow-hidden h-full">
              <div className="px-5 py-4 border-b border-[#2E2E3E] flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-red-500" />
                  Live Drops
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>

              {featuredChannels[0] && featuredChannels[0].nowPlaying && (
                <button
                  onClick={() => navigate('/live')}
                  className="w-full text-left hover:bg-[#2E2E3E]/50 transition-colors"
                >
                  <div className="relative aspect-video">
                    <img
                      src={featuredChannels[0].nowPlaying.thumbnail}
                      alt={featuredChannels[0].nowPlaying.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{featuredChannels[0].channel.logo}</span>
                        <span className="text-xs text-white/60">{featuredChannels[0].channel.name}</span>
                      </div>
                      <p className="text-sm font-medium text-white line-clamp-2">
                        {featuredChannels[0].nowPlaying.title}
                      </p>
                    </div>
                  </div>
                </button>
              )}

              <Link
                to="/live"
                className="flex items-center justify-between px-5 py-3 text-sm text-[#c9a227] hover:bg-[#2E2E3E]/30 transition-colors"
              >
                <span>View All Channels</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#1A1A24] rounded-xl p-5 border border-[#2E2E3E]">
            <PlayCircle className="w-8 h-8 text-[#1CB0F6] mb-3" />
            <p className="text-2xl font-bold text-white">{stats.videosWatched}</p>
            <p className="text-sm text-[#9CA3AF]">Sessions Crushed</p>
          </div>
          <div className="bg-[#1A1A24] rounded-xl p-5 border border-[#2E2E3E]">
            <BookOpen className="w-8 h-8 text-[#8B5CF6] mb-3" />
            <p className="text-2xl font-bold text-white">{progress.modulesCompleted.length}</p>
            <p className="text-sm text-[#9CA3AF]">Playbooks Mastered</p>
          </div>
          <div className="bg-[#1A1A24] rounded-xl p-5 border border-[#2E2E3E]">
            <Trophy className="w-8 h-8 text-[#FFD700] mb-3" />
            <p className="text-2xl font-bold text-white">{stats.achievementsUnlocked}</p>
            <p className="text-sm text-[#9CA3AF]">Milestones</p>
          </div>
          <div className="bg-[#1A1A24] rounded-xl p-5 border border-[#2E2E3E]">
            <Flame className="w-8 h-8 text-[#FF9600] mb-3" />
            <p className="text-2xl font-bold text-white">{stats.longestStreak}</p>
            <p className="text-sm text-[#9CA3AF]">Best Grind</p>
          </div>
        </div>

        {/* Shorts Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#FF0000]" />
              Quick Hits
            </h2>
            <Link
              to="/vod"
              className="text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              View All Shorts <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {shortsVideos.map(video => (
              <button
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                className="flex-shrink-0 w-28 sm:w-32 group"
              >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-2 bg-[#1E1E2E]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute top-2 left-2 p-1.5 bg-[#FF0000]/90 rounded-full">
                    <Smartphone className="w-3 h-3 text-white" />
                  </div>
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xs font-medium text-white line-clamp-2 group-hover:text-[#c9a227] transition-colors">
                  {video.title}
                </h3>
                <p className="text-[10px] text-[#6B7280] mt-0.5">{video.expert}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Recommended Videos */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Curated For Your Hustle</h2>
            <Link
              to="/vod"
              className="text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              Explore More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {recommendedVideos.map(video => (
              <button
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                className="flex-shrink-0 w-36 sm:w-44 md:w-48 group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-2 group-hover:text-[#c9a227] transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{video.expert}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Live TV Channels */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Founders Are Tuning In</h2>
            <Link
              to="/live"
              className="text-sm text-[#c9a227] hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              All Channels <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredChannels.map(({ channel, nowPlaying }) => (
              <button
                key={channel.id}
                onClick={() => navigate('/live')}
                className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden hover:border-[#8B5CF6]/50 transition-all text-left group"
              >
                <div className="relative aspect-video">
                  {nowPlaying && (
                    <img
                      src={nowPlaying.thumbnail}
                      alt={nowPlaying.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: channel.color + '40' }}
                    >
                      {channel.logo}
                    </div>
                    <span className="text-xs font-medium text-white">{channel.name}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.5 bg-red-500 text-[8px] font-bold rounded">LIVE</span>
                    </div>
                    {nowPlaying && (
                      <p className="text-sm font-medium text-white line-clamp-1">
                        {nowPlaying.title}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Actions Row */}
        <section className="grid md:grid-cols-2 gap-4">
          <Link
            to="/games"
            className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-5 hover:border-[#c9a227]/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#a88520] flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white group-hover:text-[#c9a227] transition-colors">
                  Sharpen Your Edge
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Quick challenges to test your knowledge
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-white transition-colors flex-shrink-0" />
            </div>
          </Link>
          <Link
            to="/learn"
            className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-5 hover:border-[#c9a227]/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white group-hover:text-[#c9a227] transition-colors">
                  Flashcards & Quizzes
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Reinforce key startup concepts
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-white transition-colors flex-shrink-0" />
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
