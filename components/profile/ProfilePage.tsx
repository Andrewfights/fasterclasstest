import React from 'react';
import {
  Flame,
  Zap,
  Trophy,
  PlayCircle,
  HelpCircle,
  BookOpen,
  Calendar,
  TrendingUp,
  Sun,
  Moon,
  Monitor,
  Palette,
} from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { gamificationService } from '../../services/gamificationService';
import { ACHIEVEMENTS, LEARNING_MODULES } from '../../constants';
import { Card } from '../ui/Card';
import { ProgressBar, ProgressRing } from '../ui/ProgressRing';
import { ThemeMode } from '../../services/preferencesService';

export const ProfilePage: React.FC = () => {
  const { progress, level, levelDefinition, xpProgress } = useGamification();
  const { preferences, setTheme, isDark } = useTheme();
  const stats = gamificationService.getStats();

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
  ];

  // Get recent activity (last 7 days)
  const recentActivity = progress.activityHistory.slice(-7);
  const totalRecentXP = recentActivity.reduce((sum, day) => sum + day.xpEarned, 0);

  // Calculate module completion
  const completedModules = progress.modulesCompleted.length;
  const totalModules = LEARNING_MODULES.length;
  const moduleProgress = (completedModules / totalModules) * 100;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-[var(--color-bg-elevated)] rounded-3xl shadow-[var(--shadow-card)] p-8 mb-8 border border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar & Level */}
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${levelDefinition.color} 0%, ${levelDefinition.color}99 100%)`,
                }}
              >
                🚀
              </div>
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: levelDefinition.color }}
              >
                Level {level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                {levelDefinition.title}
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Every session gets you closer to launch!
              </p>

              {/* HP Progress to next level */}
              <div className="max-w-sm">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--color-text-secondary)]">Momentum to Level {level + 1}</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {xpProgress.current} / {xpProgress.needed} HP
                  </span>
                </div>
                <ProgressBar
                  progress={xpProgress.progress}
                  height={12}
                  color={levelDefinition.color}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#FF9600] to-[#FFB347] p-4 rounded-2xl text-white text-center shadow-md">
                <Flame className="w-6 h-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-xs opacity-90">Grind Streak</div>
              </div>
              <div className="bg-gradient-to-br from-[#58CC02] to-[#89E219] p-4 rounded-2xl text-white text-center shadow-md">
                <Zap className="w-6 h-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.totalXP}</div>
                <div className="text-xs opacity-90">Total HP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <PlayCircle className="w-8 h-8 mx-auto mb-2 text-[#1CB0F6]" />
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.videosWatched}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Sessions Crushed</div>
          </Card>
          <Card className="text-center">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-[#FF9600]" />
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.quizzesPassed}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Challenges Won</div>
          </Card>
          <Card className="text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-[#FFD700]" />
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.achievementsUnlocked}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Milestones</div>
          </Card>
          <Card className="text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-[#8B5CF6]" />
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.termsLearned}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Terms Locked In</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Module Progress */}
          <Card>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Learning Progress
            </h3>

            <div className="flex items-center gap-6 mb-6">
              <ProgressRing
                progress={moduleProgress}
                size={100}
                strokeWidth={10}
                color="#58CC02"
                showPercentage
              />
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {completedModules} / {totalModules}
                </div>
                <div className="text-[var(--color-text-secondary)]">Modules Completed</div>
              </div>
            </div>

            <div className="space-y-3">
              {LEARNING_MODULES.map((module) => {
                const isCompleted = progress.modulesCompleted.includes(module.id);
                const moduleProgress = progress.modulesInProgress[module.id];
                const percentComplete = moduleProgress?.percentComplete || 0;

                return (
                  <div key={module.id} className="flex items-center gap-3">
                    <span className="text-xl">{module.iconEmoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-[var(--color-text-primary)]">{module.title}</span>
                        <span className={isCompleted ? 'text-[#58CC02]' : 'text-[var(--color-text-secondary)]'}>
                          {isCompleted ? '100%' : `${Math.round(percentComplete)}%`}
                        </span>
                      </div>
                      <ProgressBar
                        progress={isCompleted ? 100 : percentComplete}
                        height={6}
                        color={module.color}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              This Week
            </h3>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-[#FF9600]">{totalRecentXP}</div>
              <div className="text-[var(--color-text-secondary)]">HP earned this week</div>
            </div>

            {/* Activity Calendar (simplified) */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs text-[var(--color-text-secondary)]">
                  {day}
                </div>
              ))}
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toISOString().split('T')[0];
                const activity = progress.activityHistory.find((a) => a.date === dateStr);
                const hasActivity = activity && activity.xpEarned > 0;

                return (
                  <div
                    key={i}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-xs font-semibold
                      ${hasActivity
                        ? 'bg-[#58CC02] text-white'
                        : 'bg-[var(--color-bg-secondary)] text-[#AFAFAF]'
                      }
                    `}
                    title={`${dateStr}: ${activity?.xpEarned || 0} HP`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>

            {/* Streak info */}
            <div className="bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-[#FF9600]" />
                <div>
                  <div className="font-bold text-[var(--color-text-primary)]">
                    {stats.currentStreak} Day Grind Streak
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Best grind: {stats.longestStreak} days
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Appearance Settings */}
        <Card className="mt-8">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-text-secondary)] mb-3 block">
                Theme
              </label>
              <div className="flex gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                      transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)]
                      border-2
                      ${preferences.theme === option.value
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                        : 'border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50'
                      }
                    `}
                  >
                    {option.icon}
                    <span className="font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Milestones */}
        <Card className="mt-8">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Recent Milestones
          </h3>

          {progress.achievements.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-secondary)]">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-[#AFAFAF]" />
              <p>Start grinding to unlock milestones!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {progress.achievements.slice(-6).map((userAchievement) => {
                const achievement = ACHIEVEMENTS.find((a) => a.id === userAchievement.achievementId);
                if (!achievement) return null;

                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 bg-[var(--color-bg-secondary)] rounded-xl p-3"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold text-[var(--color-text-primary)] text-sm">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
