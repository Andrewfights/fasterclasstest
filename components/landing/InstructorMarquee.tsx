import React from 'react';

interface Instructor {
  name: string;
  role: string;
  image: string;
}

interface InstructorMarqueeProps {
  instructors: Instructor[];
  onInstructorClick?: () => void;
}

export const InstructorMarquee: React.FC<InstructorMarqueeProps> = ({
  instructors,
  onInstructorClick,
}) => {
  // Double the instructors for seamless infinite scroll
  const duplicatedInstructors = [...instructors, ...instructors];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 px-2">
        <span className="mc-label text-[#c9a227] text-[10px] sm:text-xs">Featured Instructors</span>
        <h2 className="mc-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mt-1 sm:mt-2">
          Learn from World-Class Experts
        </h2>
      </div>

      {/* Marquee Container with fade edges */}
      <div className="mask-fade-edges">
        <div className="flex animate-marquee">
          {duplicatedInstructors.map((instructor, index) => (
            <div
              key={`${instructor.name}-${index}`}
              className="flex-shrink-0 px-2 sm:px-3 md:px-4 group cursor-pointer"
              onClick={onInstructorClick}
            >
              {/* Circular Image */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-2 sm:mb-3 md:mb-4 border-2 sm:border-4 border-transparent group-hover:border-[#c9a227] transition-all duration-300 mx-auto">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              {/* Name & Role */}
              <h3 className="text-white font-semibold text-center text-xs sm:text-sm md:text-base">
                {instructor.name}
              </h3>
              <p className="text-[#737373] text-[10px] sm:text-xs md:text-sm text-center">
                {instructor.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorMarquee;
