import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { ACHIEVEMENTS } from '../../constants';
import { Achievement } from '../../types';
import { Card } from '../ui/Card';

const rarityColors = {
  common: { bg: 'bg-[#E5E5E5]', border: 'border-[#AFAFAF]', text: 'text-[#777777]' },
  rare: { bg: 'bg-[#E3F2FD]', border: 'border-[#1CB0F6]', text: 'text-[#1CB0F6]' },
  epic: { bg: 'bg-[#F3E5F5]', border: 'border-[#8B5CF6]', text: 'text-[#8B5CF6]' },
  legendary: { bg: 'bg-[#FFF8E1]', border: 'border-[#FFD700]', text: 'text-[#FF9600]' },
};

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isUnlocked,
  unlockedAt,
}) => {
  const colors = rarityColors[achievement.rarity];

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${isUnlocked
          ? `${colors.bg} border-2 ${colors.border}`
          : 'bg-[#F7F7F7] border-2 border-[#E5E5E5] opacity-60'
        }
      `}
    >
      {/* Rarity badge */}
      <div className={`
        absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize
        ${isUnlocked ? `${colors.text} bg-white/80` : 'text-[#AFAFAF] bg-[#E5E5E5]'}
      `}>
        {achievement.rarity}
      </div>

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
          ${isUnlocked ? 'bg-white shadow-md' : 'bg-[#E5E5E5]'}
        `}>
          {isUnlocked ? (
            achievement.icon
          ) : (
            <Lock className="w-6 h-6 text-[#AFAFAF]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-bold text-lg truncate
            ${isUnlocked ? 'text-[#3C3C3C]' : 'text-[#AFAFAF]'}
          `}>
            {achievement.title}
          </h3>
          <p className={`
            text-sm truncate
            ${isUnlocked ? 'text-[#777777]' : 'text-[#AFAFAF]'}
          `}>
            {achievement.description}
          </p>
          {isUnlocked && unlockedAt && (
            <p className="text-xs text-[#AFAFAF] mt-1">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* XP reward */}
        <div className={`
          flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold
          ${isUnlocked
            ? 'bg-white text-[#FF9600]'
            : 'bg-[#E5E5E5] text-[#AFAFAF]'
          }
        `}>
          <Zap className="w-4 h-4" />
          <span>+{achievement.xpReward}</span>
        </div>
      </div>
    </Card>
  );
};

export const AchievementsPage: React.FC = () => {
  const { progress } = useGamification();

  const unlockedAchievementIds = new Set(progress.achievements.map((a) => a.achievementId));

  const categorizedAchievements = {
    progress: ACHIEVEMENTS.filter((a) => a.category === 'progress'),
    streak: ACHIEVEMENTS.filter((a) => a.category === 'streak'),
    mastery: ACHIEVEMENTS.filter((a) => a.category === 'mastery'),
    special: ACHIEVEMENTS.filter((a) => a.category === 'special'),
  };

  const totalUnlocked = progress.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-[#3C3C3C] mb-2">Achievements</h1>
              <p className="text-[#777777]">
                Collect badges by completing challenges and reaching milestones.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl p-6 text-white text-center shadow-lg">
              <div className="text-4xl font-bold">{totalUnlocked}</div>
              <div className="text-sm opacity-90">of {totalAchievements} unlocked</div>
            </div>
          </div>
        </div>

        {/* Achievement Categories */}
        {Object.entries(categorizedAchievements).map(([category, achievements]) => {
          if (achievements.length === 0) return null;

          const categoryLabels: Record<string, string> = {
            progress: 'Progress',
            streak: 'Streaks',
            mastery: 'Mastery',
            special: 'Special',
          };

          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold text-[#3C3C3C] mb-4 flex items-center gap-2">
                <span>{categoryLabels[category]}</span>
                <span className="text-sm font-normal text-[#777777]">
                  ({achievements.filter((a) => unlockedAchievementIds.has(a.id)).length}/{achievements.length})
                </span>
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((achievement) => {
                  const userAchievement = progress.achievements.find(
                    (a) => a.achievementId === achievement.id
                  );
                  return (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={unlockedAchievementIds.has(achievement.id)}
                      unlockedAt={userAchievement?.unlockedAt}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
