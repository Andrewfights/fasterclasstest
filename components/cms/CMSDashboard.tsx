import React from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  BookOpen,
  Tv,
  Users,
  TrendingUp,
  Clock,
  Play,
  Award,
} from 'lucide-react';
import { INITIAL_VIDEOS, COURSES, FAST_CHANNELS } from '../../constants';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, link }) => {
  const content = (
    <div className="p-5 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] hover:border-[#8B5CF6]/30 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-[#6B7280]">{label}</p>
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
};

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  to: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, description, to, color }) => (
  <Link
    to={to}
    className="p-4 bg-[#1A1A24] rounded-xl border border-[#2E2E3E] hover:border-[#8B5CF6]/50 transition-all group"
  >
    <div className="flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: color + '20' }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <h3 className="font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">
          {label}
        </h3>
        <p className="text-sm text-[#6B7280]">{description}</p>
      </div>
    </div>
  </Link>
);

export const CMSDashboard: React.FC = () => {
  // Calculate stats
  const totalVideos = INITIAL_VIDEOS.length;
  const totalCourses = COURSES.length;
  const totalChannels = FAST_CHANNELS.length;
  const totalDuration = INITIAL_VIDEOS.reduce((acc, v) => acc + v.duration, 0);
  const hoursOfContent = Math.floor(totalDuration / 3600);

  // Get unique experts
  const uniqueExperts = new Set(INITIAL_VIDEOS.map(v => v.expert)).size;

  // Get unique tags
  const allTags = INITIAL_VIDEOS.flatMap(v => v.tags);
  const uniqueTags = new Set(allTags).size;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#6B7280] mt-1">Welcome to the Fasterclass Content Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Video className="w-6 h-6" />}
          label="Total Videos"
          value={totalVideos}
          color="#8B5CF6"
          link="/admin/videos"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Courses"
          value={totalCourses}
          color="#22C55E"
          link="/admin/courses"
        />
        <StatCard
          icon={<Tv className="w-6 h-6" />}
          label="Channels"
          value={totalChannels}
          color="#F59E0B"
          link="/admin/channels"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Hours of Content"
          value={hoursOfContent}
          color="#3B82F6"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Expert Contributors"
          value={uniqueExperts}
          color="#EC4899"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Content Tags"
          value={uniqueTags}
          color="#06B6D4"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Avg. Video Length"
          value={`${Math.floor(totalDuration / totalVideos / 60)}m`}
          color="#10B981"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            icon={<Video className="w-5 h-5" />}
            label="Add Video"
            description="Add a new video from YouTube"
            to="/admin/videos"
            color="#8B5CF6"
          />
          <QuickAction
            icon={<BookOpen className="w-5 h-5" />}
            label="Create Course"
            description="Build a new learning path"
            to="/admin/courses"
            color="#22C55E"
          />
          <QuickAction
            icon={<Tv className="w-5 h-5" />}
            label="Manage Schedule"
            description="Edit channel programming"
            to="/admin/channels"
            color="#F59E0B"
          />
          <QuickAction
            icon={<Play className="w-5 h-5" />}
            label="Preview Live TV"
            description="Watch channels in action"
            to="/live"
            color="#EF4444"
          />
          <QuickAction
            icon={<TrendingUp className="w-5 h-5" />}
            label="Homepage Editor"
            description="Curate featured content"
            to="/admin/homepage"
            color="#3B82F6"
          />
          <QuickAction
            icon={<Award className="w-5 h-5" />}
            label="Learning Content"
            description="Manage quizzes & flashcards"
            to="/admin/learn"
            color="#EC4899"
          />
        </div>
      </div>

      {/* Recent Activity (placeholder) */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Content Overview</h2>
        <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden">
          <div className="p-4 border-b border-[#2E2E3E]">
            <h3 className="font-medium text-white">Latest Videos</h3>
          </div>
          <div className="divide-y divide-[#2E2E3E]">
            {INITIAL_VIDEOS.slice(0, 5).map((video) => (
              <div key={video.id} className="p-4 flex items-center gap-4 hover:bg-[#1E1E2E] transition-colors">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-16 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{video.title}</p>
                  <p className="text-sm text-[#6B7280]">{video.expert}</p>
                </div>
                <div className="text-sm text-[#6B7280]">
                  {Math.floor(video.duration / 60)}m
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#2E2E3E] text-center">
            <Link to="/admin/videos" className="text-sm text-[#8B5CF6] hover:underline">
              View all videos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
