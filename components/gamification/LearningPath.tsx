import React from 'react';
import { ModuleNode } from './ModuleNode';
import { LearningModule } from '../../types';
import { useGamification } from '../../contexts/GamificationContext';
import { LEARNING_MODULES } from '../../constants';
import { Flame, Trophy, Zap } from 'lucide-react';

export const LearningPath: React.FC = () => {
  const { progress, level, levelDefinition } = useGamification();

  // Determine which modules are locked based on prerequisites
  const getModuleLockStatus = (module: LearningModule): boolean => {
    if (module.prerequisiteIds.length === 0) return false;
    return !module.prerequisiteIds.every((prereqId) =>
      progress.modulesCompleted.includes(prereqId)
    );
  };

  // Find the first incomplete, unlocked module
  const getActiveModule = (): string | null => {
    for (const module of LEARNING_MODULES) {
      const isLocked = getModuleLockStatus(module);
      const isCompleted = progress.modulesCompleted.includes(module.id);
      if (!isLocked && !isCompleted) {
        return module.id;
      }
    }
    return null;
  };

  const activeModuleId = getActiveModule();

  // Positions for zigzag pattern
  const getPosition = (index: number): 'left' | 'center' | 'right' => {
    const positions: ('left' | 'center' | 'right')[] = ['center', 'right', 'center', 'left'];
    return positions[index % 4];
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-[#E5E5E5]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Welcome text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#3C3C3C] mb-2">
                Welcome to Fasterclass!
              </h1>
              <p className="text-[#777777] text-lg">
                Master the art of building startups with our gamified curriculum.
              </p>
            </div>

            {/* Stats cards */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-[#FF9600] to-[#FFB347] p-4 rounded-2xl text-white shadow-md">
                <Flame className="w-8 h-8 mb-1" />
                <div className="text-2xl font-bold">{progress.currentStreak}</div>
                <div className="text-xs opacity-90">day streak</div>
              </div>
              <div className="bg-gradient-to-br from-[#58CC02] to-[#89E219] p-4 rounded-2xl text-white shadow-md">
                <Zap className="w-8 h-8 mb-1" />
                <div className="text-2xl font-bold">{progress.xp}</div>
                <div className="text-xs opacity-90">total XP</div>
              </div>
              <div
                className="p-4 rounded-2xl text-white shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${levelDefinition.color} 0%, ${levelDefinition.color}99 100%)`,
                }}
              >
                <Trophy className="w-8 h-8 mb-1" />
                <div className="text-2xl font-bold">Lv {level}</div>
                <div className="text-xs opacity-90">{levelDefinition.title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold text-[#3C3C3C] mb-8 text-center">
          Your Learning Journey
        </h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#E5E5E5] -translate-x-1/2 hidden md:block" />

          {/* Modules */}
          <div className="space-y-8 md:space-y-12">
            {LEARNING_MODULES.map((module, index) => {
              const isLocked = getModuleLockStatus(module);
              const isActive = module.id === activeModuleId;
              const moduleProgress = progress.modulesInProgress[module.id];

              return (
                <div key={module.id} className="relative">
                  {/* Connection dot on line (desktop) */}
                  <div className="hidden md:block absolute left-1/2 top-10 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#E5E5E5] z-10" />

                  <ModuleNode
                    module={module}
                    moduleProgress={moduleProgress}
                    isLocked={isLocked}
                    isActive={isActive}
                    position={getPosition(index)}
                  />
                </div>
              );
            })}
          </div>

          {/* End marker */}
          <div className="mt-12 flex justify-center">
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] w-24 h-24 rounded-full flex items-center justify-center shadow-xl">
              <div className="text-center">
                <Trophy className="w-10 h-10 text-white mx-auto" />
                <span className="text-white text-xs font-bold mt-1 block">
                  Graduate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Section */}
      <div className="max-w-4xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-3xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Unlock Bonus Content</h3>
              <p className="opacity-90">
                Complete all 7 modules to unlock exclusive bonus content including AI tools and advanced strategies.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🚀</div>
              <div className="text-sm font-semibold opacity-90">
                {progress.modulesCompleted.length} / 7 completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
