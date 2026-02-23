import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Check, Play } from 'lucide-react';
import { LearningModule, ModuleProgress } from '../../types';
import { ProgressRing } from '../ui/ProgressRing';

interface ModuleNodeProps {
  module: LearningModule;
  moduleProgress?: ModuleProgress;
  isLocked: boolean;
  isActive: boolean;
  position: 'left' | 'center' | 'right';
}

export const ModuleNode: React.FC<ModuleNodeProps> = ({
  module,
  moduleProgress,
  isLocked,
  isActive,
  position,
}) => {
  const totalItems = module.videoIds.length + module.quizIds.length;
  const completedItems = moduleProgress
    ? moduleProgress.videosWatched.length + moduleProgress.quizzesPassed.length
    : 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isCompleted = progress === 100;

  // Position offset for zigzag pattern
  const positionClasses = {
    left: 'ml-0 md:ml-8',
    center: 'ml-0 md:ml-24',
    right: 'ml-0 md:ml-40',
  };

  const getNodeContent = () => {
    if (isLocked) {
      return (
        <div className="w-20 h-20 rounded-full bg-[#E5E5E5] flex items-center justify-center shadow-md">
          <Lock className="w-8 h-8 text-[#AFAFAF]" />
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: module.color }}
        >
          <Check className="w-10 h-10 text-white" />
        </div>
      );
    }

    return (
      <ProgressRing
        progress={progress}
        size={80}
        strokeWidth={6}
        color={module.color}
        backgroundColor="#E5E5E5"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ backgroundColor: module.color }}
        >
          {module.iconEmoji}
        </div>
      </ProgressRing>
    );
  };

  const NodeWrapper = isLocked ? 'div' : Link;
  const wrapperProps = isLocked
    ? {}
    : { to: `/module/${module.id}` };

  return (
    <div className={`flex items-center ${positionClasses[position]}`}>
      <NodeWrapper
        {...wrapperProps}
        className={`
          relative flex flex-col items-center group
          ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        `}
      >
        {/* Active indicator */}
        {isActive && !isLocked && !isCompleted && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="bg-[#1CB0F6] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              Start here!
            </div>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#1CB0F6] mx-auto" />
          </div>
        )}

        {/* Node */}
        <div
          className={`
            transition-transform duration-200
            ${!isLocked && 'group-hover:scale-110'}
            ${isActive && !isLocked && 'animate-pulse-subtle'}
          `}
        >
          {getNodeContent()}
        </div>

        {/* Label */}
        <div className="mt-3 text-center max-w-[120px]">
          <h3
            className={`
              font-bold text-sm leading-tight
              ${isLocked ? 'text-[#AFAFAF]' : 'text-[#3C3C3C]'}
            `}
          >
            {module.title}
          </h3>
          {!isLocked && (
            <p className="text-xs text-[#777777] mt-0.5">
              {moduleProgress
                ? `${Math.round(progress)}% complete`
                : `${module.estimatedMinutes} min`
              }
            </p>
          )}
        </div>

        {/* Hover card (desktop) */}
        {!isLocked && (
          <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="bg-white rounded-xl shadow-xl p-4 border border-[#E5E5E5]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{module.iconEmoji}</span>
                <span className="font-bold text-[#3C3C3C]">{module.title}</span>
              </div>
              <p className="text-sm text-[#777777] mb-3">{module.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#777777]">
                  {module.videoIds.length} videos
                </span>
                <span className="text-[#777777]">
                  {module.quizIds.length} quizzes
                </span>
                <span className="font-bold text-[#FF9600]">
                  +{module.xpReward} XP
                </span>
              </div>
              {!isCompleted && (
                <div
                  className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold text-sm"
                  style={{ backgroundColor: module.color }}
                >
                  <Play className="w-4 h-4" />
                  {moduleProgress ? 'Continue' : 'Start'}
                </div>
              )}
            </div>
          </div>
        )}
      </NodeWrapper>

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
