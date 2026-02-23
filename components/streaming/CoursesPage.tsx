import React, { useEffect } from 'react';
import { CourseCard } from './CourseCard';
import { COURSES } from '../../constants';

export const CoursesPage: React.FC = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Playbooks</h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl">
            Battle-tested strategies from founders who've done it. Each playbook contains
            curated sessions to level up your game.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} size="large" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
