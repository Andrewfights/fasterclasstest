import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';

interface ComingCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  releaseDate?: string;
}

interface ComingSoonSectionProps {
  courses?: ComingCourse[];
  onNotify?: (courseId: string) => void;
}

const DEFAULT_COMING_SOON: ComingCourse[] = [
  {
    id: 'ai-founders',
    title: 'AI for Startup Founders',
    description: 'Learn to leverage AI tools and LLMs to 10x your productivity and build smarter products.',
    image: 'https://img.youtube.com/vi/zjkBMFhNj_g/maxresdefault.jpg',
    releaseDate: 'Q2 2025',
  },
  {
    id: 'exit-playbook',
    title: 'The Exit Playbook',
    description: 'M&A strategies, IPO preparation, and strategic exits explained by founders who\'ve done it.',
    image: 'https://img.youtube.com/vi/CBYhVcO4WgI/maxresdefault.jpg',
    releaseDate: 'Coming Soon',
  },
];

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({
  courses = DEFAULT_COMING_SOON,
  onNotify,
}) => {
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const handleNotify = (courseId: string) => {
    setNotified((prev) => new Set([...prev, courseId]));
    onNotify?.(courseId);
  };

  return (
    <section className="py-16 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <span className="mc-label text-[#f59e0b]">Coming Soon</span>
          <h2 className="mc-heading text-3xl md:text-4xl text-white mt-2">
            On the Horizon
          </h2>
        </div>

        {/* Coming Soon Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const isNotified = notified.has(course.id);

            return (
              <div
                key={course.id}
                className="relative group rounded-xl overflow-hidden"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-8 min-h-[200px] flex flex-col justify-center">
                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold uppercase tracking-wide rounded-full w-fit mb-4">
                    {course.releaseDate}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#a3a3a3] text-sm mb-6 max-w-md">
                    {course.description}
                  </p>

                  {/* Notify Button */}
                  <button
                    onClick={() => handleNotify(course.id)}
                    disabled={isNotified}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm w-fit transition-all ${
                      isNotified
                        ? 'bg-white/10 text-white/60 cursor-default'
                        : 'border border-[#525252] text-[#a3a3a3] hover:border-white hover:text-white'
                    }`}
                  >
                    {isNotified ? (
                      <>
                        <Check className="w-4 h-4" />
                        You'll be notified
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        Notify Me
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
