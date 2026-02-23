import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Camera,
  Building2,
  Upload,
  CheckSquare,
  ChevronRight,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamificationService';
import { profileService } from '../../services/profileService';
import { ACHIEVEMENTS, LEARNING_MODULES } from '../../constants';
import { Card } from '../ui/Card';
import { ProgressBar, ProgressRing } from '../ui/ProgressRing';
import { ThemeMode } from '../../services/preferencesService';
import { UserProfile } from '../../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, level, levelDefinition, xpProgress } = useGamification();
  const { preferences, setTheme, isDark } = useTheme();
  const { authState } = useAuth();
  const stats = gamificationService.getStats();

  const userEmail = authState.user?.email || 'guest';
  const displayName = authState.user?.displayName || 'Founder';

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const companyLogoInputRef = useRef<HTMLInputElement>(null);

  // Load profile on mount
  useEffect(() => {
    let userProfile = profileService.getProfile(userEmail);
    if (!userProfile) {
      userProfile = profileService.createProfile(userEmail, displayName);
    }
    setProfile(userProfile);
    setCompanyName(userProfile.companyName || '');
  }, [userEmail, displayName]);

  // Handle profile picture upload
  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      profileService.updateProfilePicture(userEmail, base64);
      setProfile(profileService.getProfile(userEmail));
    };
    reader.readAsDataURL(file);
  };

  // Handle company logo upload
  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      profileService.updateCompanyInfo(userEmail, companyName || 'My Company', base64);
      setProfile(profileService.getProfile(userEmail));
    };
    reader.readAsDataURL(file);
  };

  // Save company name
  const handleSaveCompany = () => {
    if (companyName.trim()) {
      profileService.updateCompanyInfo(userEmail, companyName, profile?.companyLogo);
      setProfile(profileService.getProfile(userEmail));
    }
    setIsEditingCompany(false);
  };

  // Get checklist progress
  const checklistProgress = profileService.getChecklistProgress(userEmail);

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
            <div className="relative group">
              <input
                type="file"
                ref={profilePicInputRef}
                onChange={handleProfilePicUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-xl overflow-hidden cursor-pointer"
                style={{
                  background: profile?.profilePicture
                    ? 'transparent'
                    : `linear-gradient(135deg, ${levelDefinition.color} 0%, ${levelDefinition.color}99 100%)`,
                }}
                onClick={() => profilePicInputRef.current?.click()}
              >
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  '🚀'
                )}
              </div>
              {/* Upload overlay */}
              <div
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => profilePicInputRef.current?.click()}
              >
                <Camera className="w-8 h-8 text-white" />
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
                {displayName}
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-1">
                {levelDefinition.title}
              </p>
              <p className="text-[var(--color-text-tertiary)] text-sm mb-4">
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

        {/* Company Info */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Your Company
            </h3>
            {!isEditingCompany && (
              <button
                onClick={() => setIsEditingCompany(true)}
                className="flex items-center gap-1 text-sm text-[var(--color-accent)] hover:underline"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {isEditingCompany ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                  Company Logo
                </label>
                <input
                  type="file"
                  ref={companyLogoInputRef}
                  onChange={handleCompanyLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => companyLogoInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 bg-[var(--color-bg-secondary)] border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors w-full"
                >
                  {profile?.companyLogo ? (
                    <>
                      <img src={profile.companyLogo} alt="Logo" className="w-8 h-8 rounded object-cover" />
                      <span>Change Logo</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Logo (Max 2MB)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveCompany}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingCompany(false);
                    setCompanyName(profile?.companyName || '');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-xl"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {profile?.companyLogo ? (
                <img
                  src={profile.companyLogo}
                  alt="Company Logo"
                  className="w-16 h-16 rounded-xl object-cover border border-[var(--color-border)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border)]">
                  <Building2 className="w-8 h-8 text-[var(--color-text-tertiary)]" />
                </div>
              )}
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {profile?.companyName || 'No company set'}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {profile?.companyName ? 'Your startup' : 'Click edit to add your company'}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Startup Checklist Preview */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  Startup Launch Checklist
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {checklistProgress.completed} of {checklistProgress.total} tasks completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--color-accent)]">
                  {checklistProgress.percentage}%
                </div>
              </div>
              <button
                onClick={() => navigate('/checklist')}
                className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)]"
              >
                <ChevronRight className="w-6 h-6 text-[var(--color-text-secondary)]" />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar
              progress={checklistProgress.percentage}
              height={8}
              color="#8B5CF6"
            />
          </div>
          <button
            onClick={() => navigate('/checklist')}
            className="mt-4 w-full py-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-xl font-medium transition-colors"
          >
            Continue Building Your Startup
          </button>
        </Card>

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
