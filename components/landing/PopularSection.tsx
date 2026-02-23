import React from 'react';
import { Play } from 'lucide-react';
import { Course } from '../../types';

interface PopularSectionProps {
  courses: Course[];
  onCourseClick?: () => void;
}

export const PopularSection: React.FC<PopularSectionProps> = ({
  courses,
  onCourseClick,
}) => {
  return (
    <section className="py-16 px-6 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <span className="mc-label text-[#c9a227]">Popular Now</span>
          <h2 className="mc-heading text-3xl md:text-4xl text-white mt-2">
            Trending Courses
          </h2>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <div
              key={course.id}
              className="group cursor-pointer"
              onClick={onCourseClick}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-black fill-black ml-1" />
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <h3 className="font-display text-lg font-semibold text-white group-hover:text-[#c9a227] transition-colors">
                {course.title}
              </h3>
              <p className="text-[#a3a3a3] text-sm mt-1">
                {course.instructor || course.topic}
              </p>
              <p className="text-[#737373] text-xs mt-1">
                {course.videoIds.length} lessons
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSection;
