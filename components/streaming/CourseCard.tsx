import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen } from 'lucide-react';
import { Course } from '../../types';
import { formatDuration, getCourseDuration, INITIAL_VIDEOS } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';

interface CourseCardProps {
  course: Course;
  size?: 'small' | 'medium' | 'large';
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, size = 'medium' }) => {
  const navigate = useNavigate();
  const { watchHistory } = useLibrary();

  // Calculate progress
  const watchedVideos = course.videoIds.filter(videoId => {
    const progress = watchHistory.find(h => h.videoId === videoId);
    return progress?.completed;
  });
  const progressPercent = (watchedVideos.length / course.videoIds.length) * 100;

  const totalDuration = getCourseDuration(course);

  const handleClick = () => {
    navigate(`/course/${course.id}`);
  };

  const sizeClasses = {
    small: 'min-w-[180px]',
    medium: 'min-w-[240px]',
    large: 'min-w-[320px]',
  };

  return (
    <div
      onClick={handleClick}
      className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1E1E2E] mb-3">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Course Icon */}
        <div
          className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: course.color }}
        >
          {course.iconEmoji}
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
            <Play className="w-6 h-6 text-[#0D0D12] fill-current ml-0.5" />
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{course.videoIds.length} sessions</span>
            <span className="text-white/50">|</span>
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E2E3E]">
            <div
              className="h-full bg-[#8B5CF6]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="text-white font-semibold text-sm leading-tight mb-1 group-hover:text-[#8B5CF6] transition-colors">
        {course.title}
      </h3>
      <p className="text-[#6B7280] text-xs line-clamp-2">{course.description}</p>
    </div>
  );
};

export default CourseCard;
