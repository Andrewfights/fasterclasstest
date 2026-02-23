import React from 'react';

interface Instructor {
  name: string;
  image: string;
  topic?: string;
}

interface InstructorGridProps {
  instructors: Instructor[];
  onInstructorClick?: () => void;
}

export const InstructorGrid: React.FC<InstructorGridProps> = ({
  instructors,
  onInstructorClick,
}) => {
  // Take first 6 instructors for the grid
  const gridInstructors = instructors.slice(0, 6);

  return (
    <div className="grid grid-cols-2 gap-2 h-full">
      {gridInstructors.map((instructor, index) => {
        // Make some images larger for visual interest (masonry-like effect)
        const isLarge = index === 0 || index === 3;

        return (
          <button
            key={instructor.name}
            onClick={onInstructorClick}
            className={`relative overflow-hidden rounded-lg group ${
              isLarge ? 'row-span-2' : ''
            }`}
          >
            <img
              src={instructor.image}
              alt={instructor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Name on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-sm font-medium">{instructor.name}</p>
              {instructor.topic && (
                <p className="text-white/70 text-xs">{instructor.topic}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default InstructorGrid;
