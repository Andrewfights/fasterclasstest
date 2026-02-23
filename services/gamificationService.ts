import {
  UserProgress,
  ModuleProgress,
  VideoProgress,
  QuizAttempt,
  FlashcardProgress,
  UserAchievement,
  DailyActivity,
  LevelDefinition,
  Achievement,
  Certificate,
} from '../types';
import { LEVEL_DEFINITIONS, ACHIEVEMENTS } from '../constants';

const PROGRESS_STORAGE_KEY = 'fasterclass_user_progress';
const GAMIFICATION_VERSION = '1.0';

// Helper to get today's date as YYYY-MM-DD
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Calculate level from XP
export const calculateLevel = (xp: number): number => {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_DEFINITIONS[i].minXP) {
      return LEVEL_DEFINITIONS[i].level;
    }
  }
  return 1;
};

// Get level definition
export const getLevelDefinition = (level: number): LevelDefinition => {
  return LEVEL_DEFINITIONS.find(l => l.level === level) || LEVEL_DEFINITIONS[0];
};

// Get XP needed for next level
export const getXPForNextLevel = (currentXP: number): { current: number; needed: number; progress: number } => {
  const level = calculateLevel(currentXP);
  const currentLevelDef = getLevelDefinition(level);
  const nextLevelDef = getLevelDefinition(level + 1);

  if (!nextLevelDef || level >= LEVEL_DEFINITIONS.length) {
    return { current: currentXP, needed: currentLevelDef.maxXP, progress: 100 };
  }

  const xpInCurrentLevel = currentXP - currentLevelDef.minXP;
  const xpNeededForLevel = nextLevelDef.minXP - currentLevelDef.minXP;
  const progress = Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);

  return {
    current: xpInCurrentLevel,
    needed: xpNeededForLevel,
    progress,
  };
};

// Create initial user progress
const createInitialProgress = (): UserProgress => ({
  id: 'user-1',
  xp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: '',
  streakFreezes: 2,
  modulesCompleted: [],
  modulesInProgress: {},
  coursesCompleted: [],
  certificates: [],
  videoProgress: {},
  quizAttempts: [],
  flashcardProgress: {},
  achievements: [],
  activityHistory: [],
  learnedTerms: [],
});

export const gamificationService = {
  // Get user progress
  getUserProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.version === GAMIFICATION_VERSION) {
          return data.progress;
        }
        // Migration from old version could go here
      }
      return createInitialProgress();
    } catch {
      return createInitialProgress();
    }
  },

  // Save user progress
  saveUserProgress(progress: UserProgress): void {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
      version: GAMIFICATION_VERSION,
      progress,
      savedAt: Date.now(),
    }));
  },

  // Add XP and check for level up
  addXP(amount: number, source: string): { newXP: number; leveledUp: boolean; newLevel: number } {
    const progress = this.getUserProgress();
    const oldLevel = progress.level;
    progress.xp += amount;
    progress.level = calculateLevel(progress.xp);

    // Update daily activity
    this.recordActivity({ xpEarned: amount });

    this.saveUserProgress(progress);

    return {
      newXP: progress.xp,
      leveledUp: progress.level > oldLevel,
      newLevel: progress.level,
    };
  },

  // Update streak
  updateStreak(): { currentStreak: number; isNewDay: boolean; streakBroken: boolean } {
    const progress = this.getUserProgress();
    const today = getTodayDate();
    const lastActivity = progress.lastActivityDate;

    let isNewDay = false;
    let streakBroken = false;

    if (lastActivity !== today) {
      isNewDay = true;

      // Check if streak should continue
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === yesterdayStr) {
        // Continue streak
        progress.currentStreak += 1;
      } else if (lastActivity && lastActivity < yesterdayStr) {
        // Streak broken - check for streak freeze
        if (progress.streakFreezes > 0) {
          progress.streakFreezes -= 1;
          // Keep streak but don't increment
        } else {
          streakBroken = true;
          progress.currentStreak = 1; // Start new streak
        }
      } else {
        // First activity ever
        progress.currentStreak = 1;
      }

      // Update longest streak
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak;
      }

      progress.lastActivityDate = today;
      this.saveUserProgress(progress);
    }

    return {
      currentStreak: progress.currentStreak,
      isNewDay,
      streakBroken,
    };
  },

  // Record daily activity
  recordActivity(activity: Partial<DailyActivity>): void {
    const progress = this.getUserProgress();
    const today = getTodayDate();

    let todayActivity = progress.activityHistory.find(a => a.date === today);

    if (!todayActivity) {
      todayActivity = {
        date: today,
        xpEarned: 0,
        minutesLearned: 0,
        videosWatched: 0,
        quizzesTaken: 0,
        flashcardsReviewed: 0,
      };
      progress.activityHistory.push(todayActivity);
    }

    // Update activity
    if (activity.xpEarned) todayActivity.xpEarned += activity.xpEarned;
    if (activity.minutesLearned) todayActivity.minutesLearned += activity.minutesLearned;
    if (activity.videosWatched) todayActivity.videosWatched += activity.videosWatched;
    if (activity.quizzesTaken) todayActivity.quizzesTaken += activity.quizzesTaken;
    if (activity.flashcardsReviewed) todayActivity.flashcardsReviewed += activity.flashcardsReviewed;

    // Keep only last 365 days
    progress.activityHistory = progress.activityHistory.slice(-365);

    this.saveUserProgress(progress);
  },

  // Mark video as watched
  markVideoWatched(videoId: string, moduleId: string): void {
    const progress = this.getUserProgress();

    progress.videoProgress[videoId] = {
      videoId,
      watched: true,
      timestamp: 0,
      watchedAt: Date.now(),
    };

    // Update module progress
    if (!progress.modulesInProgress[moduleId]) {
      progress.modulesInProgress[moduleId] = {
        moduleId,
        videosWatched: [],
        quizzesPassed: [],
        lessonsCompleted: [],
        flashcardsReviewed: false,
        percentComplete: 0,
        startedAt: Date.now(),
      };
    }

    if (!progress.modulesInProgress[moduleId].videosWatched.includes(videoId)) {
      progress.modulesInProgress[moduleId].videosWatched.push(videoId);
    }

    this.recordActivity({ videosWatched: 1 });
    this.saveUserProgress(progress);
  },

  // Update video timestamp
  updateVideoTimestamp(videoId: string, timestamp: number): void {
    const progress = this.getUserProgress();

    if (!progress.videoProgress[videoId]) {
      progress.videoProgress[videoId] = {
        videoId,
        watched: false,
        timestamp,
        watchedAt: null,
      };
    } else {
      progress.videoProgress[videoId].timestamp = timestamp;
    }

    this.saveUserProgress(progress);
  },

  // Record quiz attempt
  recordQuizAttempt(attempt: QuizAttempt, moduleId: string): void {
    const progress = this.getUserProgress();

    progress.quizAttempts.push(attempt);

    if (attempt.passed && progress.modulesInProgress[moduleId]) {
      if (!progress.modulesInProgress[moduleId].quizzesPassed.includes(attempt.quizId)) {
        progress.modulesInProgress[moduleId].quizzesPassed.push(attempt.quizId);
      }
    }

    this.recordActivity({ quizzesTaken: 1 });
    this.saveUserProgress(progress);
  },

  // Update flashcard progress
  updateFlashcardProgress(cardId: string, progress: FlashcardProgress): void {
    const userProgress = this.getUserProgress();
    userProgress.flashcardProgress[cardId] = progress;
    this.recordActivity({ flashcardsReviewed: 1 });
    this.saveUserProgress(userProgress);
  },

  // Mark module as completed
  completeModule(moduleId: string): void {
    const progress = this.getUserProgress();

    if (!progress.modulesCompleted.includes(moduleId)) {
      progress.modulesCompleted.push(moduleId);
    }

    this.saveUserProgress(progress);
  },

  // Mark course as completed and add certificate
  completeCourse(courseId: string, certificate: Certificate): void {
    const progress = this.getUserProgress();

    if (!progress.coursesCompleted) {
      progress.coursesCompleted = [];
    }
    if (!progress.certificates) {
      progress.certificates = [];
    }

    if (!progress.coursesCompleted.includes(courseId)) {
      progress.coursesCompleted.push(courseId);
    }

    // Add certificate if not already present
    const existingCert = progress.certificates.find(c => c.courseId === courseId);
    if (!existingCert) {
      progress.certificates.push(certificate);
    }

    this.saveUserProgress(progress);
  },

  // Unlock achievement
  unlockAchievement(achievementId: string): UserAchievement | null {
    const progress = this.getUserProgress();

    // Check if already unlocked
    if (progress.achievements.find(a => a.achievementId === achievementId)) {
      return null;
    }

    const achievement: UserAchievement = {
      achievementId,
      unlockedAt: Date.now(),
      celebrated: false,
    };

    progress.achievements.push(achievement);
    this.saveUserProgress(progress);

    return achievement;
  },

  // Mark achievement as celebrated
  markAchievementCelebrated(achievementId: string): void {
    const progress = this.getUserProgress();
    const achievement = progress.achievements.find(a => a.achievementId === achievementId);
    if (achievement) {
      achievement.celebrated = true;
      this.saveUserProgress(progress);
    }
  },

  // Check achievements based on current progress
  checkAchievements(): Achievement[] {
    const progress = this.getUserProgress();
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (progress.achievements.find(a => a.achievementId === achievement.id)) {
        continue;
      }

      let unlocked = false;

      switch (achievement.condition.type) {
        case 'first_video':
          unlocked = Object.values(progress.videoProgress).some(v => v.watched);
          break;
        case 'first_quiz':
          unlocked = progress.quizAttempts.length > 0;
          break;
        case 'perfect_quiz':
          unlocked = progress.quizAttempts.some(a => a.score === 100);
          break;
        case 'videos_watched':
          unlocked = Object.values(progress.videoProgress).filter(v => v.watched).length >= achievement.condition.value;
          break;
        case 'streak_days':
          unlocked = progress.currentStreak >= achievement.condition.value;
          break;
        case 'xp_total':
          unlocked = progress.xp >= achievement.condition.value;
          break;
        case 'quizzes_passed':
          unlocked = progress.quizAttempts.filter(a => a.passed).length >= achievement.condition.value;
          break;
        case 'module_complete':
          if (achievement.condition.moduleId) {
            unlocked = progress.modulesCompleted.includes(achievement.condition.moduleId);
          } else {
            unlocked = progress.modulesCompleted.length >= achievement.condition.value;
          }
          break;
        case 'flashcards_mastered':
          unlocked = Object.values(progress.flashcardProgress).filter(f => f.masteryLevel >= 4).length >= achievement.condition.value;
          break;
      }

      if (unlocked) {
        this.unlockAchievement(achievement.id);
        this.addXP(achievement.xpReward, `achievement_${achievement.id}`);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  },

  // Mark term as learned
  learnTerm(termId: string): void {
    const progress = this.getUserProgress();
    if (!progress.learnedTerms.includes(termId)) {
      progress.learnedTerms.push(termId);
      this.saveUserProgress(progress);
    }
  },

  // Get stats for profile
  getStats() {
    const progress = this.getUserProgress();

    return {
      totalXP: progress.xp,
      level: progress.level,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      videosWatched: Object.values(progress.videoProgress).filter(v => v.watched).length,
      quizzesTaken: progress.quizAttempts.length,
      quizzesPassed: progress.quizAttempts.filter(a => a.passed).length,
      averageQuizScore: progress.quizAttempts.length > 0
        ? Math.round(progress.quizAttempts.reduce((sum, a) => sum + a.score, 0) / progress.quizAttempts.length)
        : 0,
      modulesCompleted: progress.modulesCompleted.length,
      coursesCompleted: progress.coursesCompleted?.length || 0,
      certificatesEarned: progress.certificates?.length || 0,
      achievementsUnlocked: progress.achievements.length,
      termsLearned: progress.learnedTerms.length,
      totalDaysActive: progress.activityHistory.length,
    };
  },

  // Reset all progress
  resetProgress(): void {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  },
};
