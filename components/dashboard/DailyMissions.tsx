import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Play, BookOpen, Gamepad2, GraduationCap, FileText, Flame, Gift, ChevronRight } from 'lucide-react';
import { DailyMission, MissionType } from '../../types';

interface DailyMissionsProps {
  missions: DailyMission[];
  streak: number;
  onMissionClick?: (mission: DailyMission) => void;
}

const MISSION_ICONS: Record<MissionType, React.ReactNode> = {
  watch_video: <Play className="w-4 h-4" />,
  complete_quiz: <BookOpen className="w-4 h-4" />,
  play_game: <Gamepad2 className="w-4 h-4" />,
  finish_module: <GraduationCap className="w-4 h-4" />,
  homework: <FileText className="w-4 h-4" />,
  flashcards: <BookOpen className="w-4 h-4" />,
};

const MISSION_ROUTES: Record<MissionType, string> = {
  watch_video: '/vod',
  complete_quiz: '/games',
  play_game: '/games',
  finish_module: '/courses',
  homework: '/courses',
  flashcards: '/games',
};

export const DailyMissions: React.FC<DailyMissionsProps> = ({ missions, streak, onMissionClick }) => {
  const navigate = useNavigate();
  const completedCount = missions.filter(m => m.completed).length;
  const allComplete = completedCount === missions.length;

  const handleMissionClick = (mission: DailyMission) => {
    if (onMissionClick) {
      onMissionClick(mission);
    } else if (!mission.completed) {
      navigate(MISSION_ROUTES[mission.type]);
    }
  };

  return (
    <div className="bg-[#13131A] rounded-2xl border border-[#2E2E3E] overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#2E2E3E]/50">
        <div>
          <h3 className="text-lg font-bold text-white">Today's Missions</h3>
          <p className="text-sm text-[#6B7280]">{completedCount}/{missions.length} completed</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 rounded-full">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">{streak}</span>
          </div>
        )}
      </div>

      {/* Missions list */}
      <div className="divide-y divide-[#2E2E3E]/50">
        {missions.map((mission) => (
          <button
            key={mission.id}
            onClick={() => handleMissionClick(mission)}
            disabled={mission.completed}
            className={`w-full px-4 sm:px-6 py-3 flex items-center gap-4 text-left transition-colors ${
              mission.completed
                ? 'bg-green-500/5'
                : 'hover:bg-[#1A1A24]'
            }`}
          >
            {/* Status icon */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                mission.completed
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-[#2E2E3E] text-[#9CA3AF]'
              }`}
            >
              {mission.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                MISSION_ICONS[mission.type]
              )}
            </div>

            {/* Mission info */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${mission.completed ? 'text-[#6B7280] line-through' : 'text-white'}`}>
                {mission.title}
              </p>
              <p className="text-sm text-[#6B7280] truncate">{mission.description}</p>
              {/* Progress bar for multi-target missions */}
              {!mission.completed && mission.target && mission.target > 1 && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#2E2E3E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a227] rounded-full transition-all"
                      style={{ width: `${((mission.progress || 0) / mission.target) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6B7280]">
                    {mission.progress || 0}/{mission.target}
                  </span>
                </div>
              )}
            </div>

            {/* XP reward */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-sm font-semibold ${mission.completed ? 'text-[#6B7280]' : 'text-[#c9a227]'}`}>
                +{mission.xpReward} XP
              </span>
              {!mission.completed && (
                <ChevronRight className="w-4 h-4 text-[#6B7280]" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Bonus section */}
      <div className={`px-4 sm:px-6 py-3 border-t border-[#2E2E3E]/50 ${allComplete ? 'bg-[#c9a227]/10' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            allComplete ? 'bg-[#c9a227]/20 text-[#c9a227]' : 'bg-[#2E2E3E] text-[#6B7280]'
          }`}>
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className={`font-medium ${allComplete ? 'text-[#c9a227]' : 'text-[#9CA3AF]'}`}>
              {allComplete ? 'Bonus Unlocked!' : 'Complete all missions for bonus'}
            </p>
            <p className="text-sm text-[#6B7280]">
              +100 XP and $10K virtual funding
            </p>
          </div>
          {allComplete && (
            <Check className="w-5 h-5 text-[#c9a227]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyMissions;
