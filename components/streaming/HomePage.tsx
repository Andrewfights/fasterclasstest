import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Clock, TrendingUp, Smartphone, Monitor, ChevronRight, Sparkles, Zap, Trophy, BookOpen, Star } from 'lucide-react';
import { ContentRow } from './ContentRow';
import { CourseCard } from './CourseCard';
import { VideoCard } from './VideoCard';
import { COURSES, INITIAL_VIDEOS } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { useGamification } from '../../contexts/GamificationContext';

// Marquee item types
interface MarqueeItem {
  type: 'progress' | 'video' | 'course' | 'news' | 'achievement';
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  link?: string;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { continueWatching, savedVideos } = useLibrary();
  const { level, levelDefinition, progress } = useGamification();
  const [videoLayout, setVideoLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Marquee items - dynamic based on user progress
  const marqueeItems: MarqueeItem[] = [
    { type: 'progress', title: `Level ${level}`, subtitle: levelDefinition.title, icon: '🚀', color: levelDefinition.color },
    { type: 'news', title: 'New Course', subtitle: 'AI for Founders', icon: '🤖', color: '#8B5CF6' },
    { type: 'achievement', title: `${progress.achievements.length} Achievements`, subtitle: 'Unlocked', icon: '🏆', color: '#FFD700' },
    { type: 'video', title: 'Trending Now', subtitle: 'YC Application Tips', icon: '🔥', color: '#FF6B35' },
    { type: 'course', title: '14 Courses', subtitle: 'Available', icon: '📚', color: '#22C55E' },
    { type: 'news', title: 'Feature Drop', subtitle: 'Certificates', icon: '🎓', color: '#06B6D4' },
  ];

  // Get vertical videos
  const verticalVideos = INITIAL_VIDEOS.filter(v => v.isVertical);
  const horizontalVideos = INITIAL_VIDEOS.filter(v => !v.isVertical);

  // Get videos for continue watching
  const continueWatchingVideos = continueWatching
    .map(h => INITIAL_VIDEOS.find(v => v.id === h.videoId))
    .filter(Boolean)
    .slice(0, 6);

  // Get saved videos
  const savedVideosList = savedVideos
    .map(id => INITIAL_VIDEOS.find(v => v.id === id))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Scrolling Marquee */}
      <div className="pt-16 bg-gradient-to-b from-[#1a1a2e] to-transparent">
        <div className="overflow-hidden py-3 border-b border-[#2E2E3E]/50">
          <div
            ref={marqueeRef}
            className="flex gap-6 animate-marquee whitespace-nowrap"
            style={{
              animation: 'marquee 30s linear infinite',
            }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2 bg-[#1E1E2E]/80 rounded-full border border-[#2E2E3E] hover:border-[#8B5CF6]/50 transition-colors cursor-pointer"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{item.title}</span>
                  {item.subtitle && (
                    <span className="text-[#9CA3AF] text-xs">{item.subtitle}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E1E2E] border border-[#2E2E3E] mb-6">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-sm text-[#9CA3AF] font-medium tracking-wide">CURATED FOR BUILDERS</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">Learn to Build </span>
                <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#22D3EE] bg-clip-text text-transparent">
                  Startups
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-[#9CA3AF] mb-6 max-w-lg">
                Expert-curated videos and courses from proven founders. No algorithms, no ads, just signal.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/courses')}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Learning
                </button>
                <button
                  onClick={() => navigate('/vod')}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#1E1E2E] border border-[#2E2E3E] text-white font-medium rounded-xl hover:border-[#8B5CF6]/50 transition-colors"
                >
                  Browse Videos
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 mt-8 pt-6 border-t border-[#2E2E3E]">
                <div>
                  <p className="text-2xl font-bold text-white">{INITIAL_VIDEOS.length}+</p>
                  <p className="text-sm text-[#6B7280]">Videos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{COURSES.length}</p>
                  <p className="text-sm text-[#6B7280]">Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-sm text-[#6B7280]">Free</p>
                </div>
              </div>
            </div>

            {/* Right: HeyGen Avatar Placeholder / Featured Video */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Avatar/Video Container */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E1E2E] to-[#2E2E3E] border border-[#3E3E4E]">
                  {/* Placeholder for HeyGen avatar - can be replaced with actual integration */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center mb-4">
                      <span className="text-4xl">👋</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Welcome, Founder!</h3>
                    <p className="text-[#9CA3AF] text-sm">
                      Your journey to building starts here
                    </p>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#22C55E] animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-[#22C55E] rounded-xl text-white font-medium text-sm shadow-lg">
                  🎓 Earn Certificates
                </div>
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-[#8B5CF6] rounded-xl text-white font-medium text-sm shadow-lg">
                  ⚡ Track Progress
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add marquee animation styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Feature Cards */}
      <section className="py-12 px-4 border-t border-[#1E1E2E]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<CheckCircle className="w-6 h-6" />}
            iconBg="bg-[#166534]"
            title="Vetted Experts"
            description="Advice from proven founders like Graham, Thiel, and real builders. No fake gurus."
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            iconBg="bg-[#854D0E]"
            title="Timeless Advice"
            description="Mental models and strategies that work regardless of the current hype cycle."
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            iconBg="bg-[#7E22CE]"
            title="Zero Doomscroll"
            description="A distraction-free environment designed for learning, not engagement hacking."
          />
        </div>
      </section>

      {/* Content Rows */}
      <section className="py-8 px-4 space-y-12">
        {/* Continue Watching - only show if there are videos */}
        {continueWatchingVideos.length > 0 && (
          <ContentRow
            title="Continue Watching"
            videos={continueWatchingVideos as any}
            showProgress
          />
        )}

        {/* Saved Videos - only show if there are videos */}
        {savedVideosList.length > 0 && (
          <ContentRow
            title="My List"
            videos={savedVideosList as any}
            onSeeAll={() => navigate('/my-list')}
          />
        )}

        {/* Video Format Toggle Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Browse Videos</h2>
            <div className="flex items-center gap-2">
              {/* Layout Toggle */}
              <div className="flex bg-[#1E1E2E] rounded-lg p-1 border border-[#2E2E3E]">
                <button
                  onClick={() => setVideoLayout('horizontal')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    videoLayout === 'horizontal'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                  title="Horizontal videos"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">Landscape</span>
                </button>
                <button
                  onClick={() => setVideoLayout('vertical')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    videoLayout === 'vertical'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                  title="Vertical videos (shorts)"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">Shorts</span>
                </button>
              </div>
              <button
                onClick={() => navigate('/vod')}
                className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
              >
                See All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Grid based on layout */}
          {videoLayout === 'horizontal' ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {horizontalVideos.slice(0, 12).map(video => (
                <VideoCard key={video.id} video={video} size="medium" layout="horizontal" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {verticalVideos.length > 0 ? (
                verticalVideos.map(video => (
                  <VideoCard key={video.id} video={video} size="medium" layout="vertical" />
                ))
              ) : (
                // If no vertical videos, show horizontal ones in vertical format
                horizontalVideos.slice(0, 8).map(video => (
                  <VideoCard key={video.id} video={video} size="medium" layout="vertical" />
                ))
              )}
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#8B5CF6]" />
              <h2 className="text-2xl font-bold text-white">Featured Courses</h2>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {COURSES.slice(0, 8).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* Popular Videos */}
        <ContentRow
          title="Popular This Week"
          videos={INITIAL_VIDEOS.slice(0, 10)}
        />

        {/* By Topic */}
        <ContentRow
          title="Fundraising & VC"
          videos={INITIAL_VIDEOS.filter(v => v.tags.includes('fundraising') || v.tags.includes('vc')).slice(0, 10)}
        />

        <ContentRow
          title="Product & MVP"
          videos={INITIAL_VIDEOS.filter(v => v.tags.includes('mvp') || v.tags.includes('product')).slice(0, 10)}
        />

        <ContentRow
          title="Growth & Marketing"
          videos={INITIAL_VIDEOS.filter(v => v.tags.includes('growth') || v.tags.includes('marketing')).slice(0, 10)}
        />

        <ContentRow
          title="Startup Basics"
          videos={INITIAL_VIDEOS.filter(v => v.tags.includes('startup') || v.tags.includes('founder')).slice(0, 10)}
        />

        {/* More Courses */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">More Courses</h2>
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {COURSES.slice(8).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* All Videos Section */}
        <ContentRow
          title="All Videos"
          videos={INITIAL_VIDEOS.slice(10, 20)}
        />
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, iconBg, title, description }) => (
  <div className="bg-[#13131A] border border-[#1E1E2E] rounded-2xl p-6 text-center">
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 text-white`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-[#6B7280] text-sm leading-relaxed">{description}</p>
  </div>
);

export default HomePage;
