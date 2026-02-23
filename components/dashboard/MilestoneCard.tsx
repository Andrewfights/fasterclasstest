import React from 'react';
import { Check, Lock, Trophy, DollarSign, Users, Award, ChevronRight } from 'lucide-react';
import { JourneyMilestone, UserProgress, FounderStage } from '../../types';

interface MilestoneCardProps {
  milestone: JourneyMilestone;
  userProgress: UserProgress;
  currentStage: FounderStage;
  onViewDetails?: () => void;
}

const STAGE_ORDER: FounderStage[] = ['idea', 'preseed', 'seed', 'seriesA', 'seriesB', 'scale', 'exit'];

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  userProgress,
  currentStage,
  onViewDetails,
}) => {
  // Calculate requirement progress
  const getRequirementProgress = (req: typeof milestone.requirements[0]): { current: number; target: number; completed: boolean } => {
    switch (req.type) {
      case 'videos': {
        const count = Object.keys(userProgress.videoProgress || {}).filter(
          id => userProgress.videoProgress[id]?.watched
        ).length;
        return { current: count, target: req.count || 0, completed: count >= (req.count || 0) };
      }
      case 'module': {
        const count = userProgress.modulesCompleted?.length || 0;
        return { current: count, target: req.count || 0, completed: count >= (req.count || 0) };
      }
      case 'xp': {
        return { current: userProgress.xp, target: req.count || 0, completed: userProgress.xp >= (req.count || 0) };
      }
      case 'course': {
        const completed = userProgress.coursesCompleted?.includes(req.id || '') || false;
        return { current: completed ? 1 : 0, target: 1, completed };
      }
      case 'game': {
        // For now, assume games aren't tracked individually
        return { current: 0, target: 1, completed: false };
      }
      default:
        return { current: 0, target: 1, completed: false };
    }
  };

  const requirementsProgress = milestone.requirements.map(req => ({
    ...req,
    progress: getRequirementProgress(req),
  }));

  const completedRequirements = requirementsProgress.filter(r => r.progress.completed).length;
  const totalRequirements = milestone.requirements.length;
  const overallProgress = Math.round((completedRequirements / totalRequirements) * 100);

  // Check if this milestone is locked (stage hasn't been reached)
  const currentStageIndex = STAGE_ORDER.indexOf(currentStage);
  const milestoneStageIndex = STAGE_ORDER.indexOf(milestone.stage);
  const isLocked = milestoneStageIndex > currentStageIndex + 1;
  const isComplete = completedRequirements === totalRequirements;

  const formatReward = (amount: number): string => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className={`bg-[#13131A] rounded-2xl border overflow-hidden ${
      isComplete
        ? 'border-green-500/50 bg-green-500/5'
        : isLocked
          ? 'border-[#2E2E3E] opacity-60'
          : 'border-[#2E2E3E]'
    }`}>
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#2E2E3E]/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isComplete
              ? 'bg-green-500/20 text-green-400'
              : isLocked
                ? 'bg-[#2E2E3E] text-[#6B7280]'
                : 'bg-[#c9a227]/20 text-[#c9a227]'
          }`}>
            {isComplete ? (
              <Trophy className="w-5 h-5" />
            ) : isLocked ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Trophy className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white">
              {isLocked ? 'Locked Milestone' : milestone.title}
            </h3>
            <p className="text-sm text-[#6B7280]">
              {isLocked ? 'Complete previous milestones to unlock' : milestone.description}
            </p>
          </div>
        </div>
        {isComplete && (
          <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
            <Check className="w-4 h-4" />
            Complete
          </div>
        )}
      </div>

      {!isLocked && (
        <>
          {/* Progress bar */}
          <div className="px-4 sm:px-6 py-3 border-b border-[#2E2E3E]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#9CA3AF]">Progress</span>
              <span className="text-sm font-medium text-white">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-[#2E2E3E] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-[#c9a227] to-[#d4af37]'
                }`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="px-4 sm:px-6 py-3 space-y-2">
            <p className="text-sm font-medium text-[#9CA3AF] mb-3">Requirements</p>
            {requirementsProgress.map((req, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  req.progress.completed
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-[#2E2E3E] text-[#6B7280]'
                }`}>
                  {req.progress.completed ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className={`flex-1 text-sm ${
                  req.progress.completed ? 'text-[#6B7280] line-through' : 'text-white'
                }`}>
                  {req.description}
                </span>
                {req.progress.target > 1 && (
                  <span className="text-xs text-[#6B7280]">
                    {req.progress.current}/{req.progress.target}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Rewards */}
          <div className="px-4 sm:px-6 py-3 bg-[#0D0D12] border-t border-[#2E2E3E]/50">
            <p className="text-xs font-medium text-[#6B7280] mb-2">REWARDS</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-sm">
                <div className="w-6 h-6 rounded-md bg-[#c9a227]/20 flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-[#c9a227]" />
                </div>
                <span className="text-[#c9a227] font-medium">+{milestone.rewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <div className="w-6 h-6 rounded-md bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-green-400 font-medium">{formatReward(milestone.rewards.cash)}</span>
              </div>
              {milestone.rewards.teamUnlock && (
                <div className="flex items-center gap-1.5 text-sm">
                  <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="text-purple-400 font-medium">+{milestone.rewards.teamUnlock} team</span>
                </div>
              )}
              {milestone.rewards.badge && (
                <div className="flex items-center gap-1.5 text-sm">
                  <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                    <Award className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-medium">{milestone.rewards.badge}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* CTA */}
      {!isComplete && !isLocked && onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full px-4 sm:px-6 py-3 flex items-center justify-center gap-2 text-[#c9a227] hover:bg-[#1A1A24] transition-colors border-t border-[#2E2E3E]/50"
        >
          <span className="font-medium">View Requirements</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default MilestoneCard;
