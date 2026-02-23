import React from 'react';
import { X, Play, Clock, BookOpen, User } from 'lucide-react';
import { Course, Video } from '../../types';
import { formatDuration } from '../../constants';

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
  item: Course | Video | null;
  itemType: 'course' | 'video';
}

export const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
  item,
  itemType,
}) => {
  if (!isOpen || !item) return null;

  const isCourse = itemType === 'course';
  const course = isCourse ? (item as Course) : null;
  const video = !isCourse ? (item as Video) : null;

  const title = isCourse ? course!.title : video!.title;
  const description = isCourse ? course!.description : `Learn from ${video!.expert} in this insightful session.`;
  const thumbnail = isCourse ? course!.coverImage : video!.thumbnail;
  const subtitle = isCourse ? (course!.instructor || course!.topic) : video!.expert;
  const duration = isCourse ? `${course!.videoIds.length} lessons` : formatDuration(video!.duration);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#141414] rounded-2xl overflow-hidden shadow-2xl animate-fade-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-video">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={onGetStarted}
              className="w-20 h-20 rounded-full bg-[#c9a227] flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
              <Play className="w-8 h-8 text-black fill-black ml-1" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Badge */}
          <span className="mc-label text-[#c9a227] mb-2 block">
            {isCourse ? 'Course' : 'Featured Video'}
          </span>

          {/* Title */}
          <h2 className="mc-heading text-2xl md:text-3xl text-white mb-3">
            {title}
          </h2>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[#a3a3a3] mb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {subtitle}
            </span>
            <span className="flex items-center gap-1.5">
              {isCourse ? <BookOpen className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {duration}
            </span>
          </div>

          {/* Description */}
          <p className="text-[#a3a3a3] leading-relaxed mb-6">
            {description}
          </p>

          {/* What you'll learn (for courses) */}
          {isCourse && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">What you'll learn:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[#a3a3a3]">
                  <span className="text-[#c9a227] mt-0.5">•</span>
                  Core frameworks and mental models for building startups
                </li>
                <li className="flex items-start gap-2 text-sm text-[#a3a3a3]">
                  <span className="text-[#c9a227] mt-0.5">•</span>
                  Real-world examples from successful founders
                </li>
                <li className="flex items-start gap-2 text-sm text-[#a3a3a3]">
                  <span className="text-[#c9a227] mt-0.5">•</span>
                  Actionable strategies you can apply immediately
                </li>
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3">
            <button
              onClick={onGetStarted}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#c9a227] text-black font-semibold rounded-lg hover:bg-[#d4af37] transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              {isCourse ? 'Start Course Free' : 'Watch Free'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CoursePreviewModal;
