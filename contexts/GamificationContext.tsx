import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserProgress,
  Achievement,
  QuizAttempt,
  FlashcardProgress,
  LevelDefinition,
  Certificate,
} from '../types';
import {
  gamificationService,
  calculateLevel,
  getLevelDefinition,
  getXPForNextLevel,
} from '../services/gamificationService';

interface GamificationContextType {
  // State
  progress: UserProgress;
  level: number;
  levelDefinition: LevelDefinition;
  xpProgress: { current: number; needed: number; progress: number };
  isLoading: boolean;

  // Pending celebrations
  pendingAchievements: Achievement[];
  showLevelUp: boolean;
  newLevel: number | null;

  // Actions
  earnXP: (amount: number, source: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  markVideoWatched: (videoId: string, moduleId: string, xpReward?: number) => void;
  updateVideoTimestamp: (videoId: string, timestamp: number) => void;
  recordQuizAttempt: (attempt: QuizAttempt, moduleId: string) => void;
  updateFlashcardProgress: (cardId: string, progress: FlashcardProgress) => void;
  completeModule: (moduleId: string, xpReward?: number) => void;
  completeCourse: (courseId: string, courseName: string, modulesCount: number, quizzesCount: number, xpReward?: number) => Certificate;
  isCourseCompleted: (courseId: string) => boolean;
  getCertificate: (courseId: string) => Certificate | undefined;
  learnTerm: (termId: string) => void;
  checkAchievements: () => void;
  dismissAchievement: (achievementId: string) => void;
  dismissLevelUp: () => void;
  refreshProgress: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => gamificationService.getUserProgress());
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  // Derived state
  const level = calculateLevel(progress.xp);
  const levelDefinition = getLevelDefinition(level);
  const xpProgress = getXPForNextLevel(progress.xp);

  // Initialize and update streak on mount
  useEffect(() => {
    const storedProgress = gamificationService.getUserProgress();
    setProgress(storedProgress);

    // Update streak for today
    gamificationService.updateStreak();

    // Check for new achievements
    const newAchievements = gamificationService.checkAchievements();
    if (newAchievements.length > 0) {
      setPendingAchievements(prev => [...prev, ...newAchievements]);
    }

    setIsLoading(false);
  }, []);

  const refreshProgress = useCallback(() => {
    setProgress(gamificationService.getUserProgress());
  }, []);

  const earnXP = useCallback((amount: number, source: string) => {
    const result = gamificationService.addXP(amount, source);

    if (result.leveledUp) {
      setShowLevelUp(true);
      setNewLevel(result.newLevel);
    }

    refreshProgress();

    // Check for XP-related achievements
    const newAchievements = gamificationService.checkAchievements();
    if (newAchievements.length > 0) {
      setPendingAchievements(prev => [...prev, ...newAchievements]);
    }
  }, [refreshProgress]);

  const updateStreak = useCallback(() => {
    gamificationService.updateStreak();
    refreshProgress();

    // Check for streak achievements
    const newAchievements = gamificationService.checkAchievements();
    if (newAchievements.length > 0) {
      setPendingAchievements(prev => [...prev, ...newAchievements]);
    }
  }, [refreshProgress]);

  const markVideoWatched = useCallback((videoId: string, moduleId: string, xpReward: number = 10) => {
    gamificationService.markVideoWatched(videoId, moduleId);
    earnXP(xpReward, `video_${videoId}`);
    refreshProgress();
  }, [earnXP, refreshProgress]);

  const updateVideoTimestamp = useCallback((videoId: string, timestamp: number) => {
    gamificationService.updateVideoTimestamp(videoId, timestamp);
  }, []);

  const recordQuizAttempt = useCallback((attempt: QuizAttempt, moduleId: string) => {
    gamificationService.recordQuizAttempt(attempt, moduleId);
    earnXP(attempt.xpEarned, `quiz_${attempt.quizId}`);
    refreshProgress();
  }, [earnXP, refreshProgress]);

  const updateFlashcardProgress = useCallback((cardId: string, cardProgress: FlashcardProgress) => {
    gamificationService.updateFlashcardProgress(cardId, cardProgress);
    refreshProgress();
  }, [refreshProgress]);

  const completeModule = useCallback((moduleId: string, xpReward: number = 50) => {
    gamificationService.completeModule(moduleId);
    earnXP(xpReward, `module_${moduleId}`);
    refreshProgress();
  }, [earnXP, refreshProgress]);

  const completeCourse = useCallback((
    courseId: string,
    courseName: string,
    modulesCount: number,
    quizzesCount: number,
    xpReward: number = 200
  ): Certificate => {
    const certificate: Certificate = {
      id: `cert-${courseId}-${Date.now()}`,
      courseId,
      courseName,
      earnedAt: Date.now(),
      xpEarned: xpReward,
      modulesCompleted: modulesCount,
      quizzesPassed: quizzesCount,
      totalTime: 0, // Could calculate from activity history
    };

    gamificationService.completeCourse(courseId, certificate);
    earnXP(xpReward, `course_${courseId}`);
    refreshProgress();

    return certificate;
  }, [earnXP, refreshProgress]);

  const isCourseCompleted = useCallback((courseId: string): boolean => {
    return progress.coursesCompleted?.includes(courseId) ?? false;
  }, [progress.coursesCompleted]);

  const getCertificate = useCallback((courseId: string): Certificate | undefined => {
    return progress.certificates?.find(c => c.courseId === courseId);
  }, [progress.certificates]);

  const learnTerm = useCallback((termId: string) => {
    gamificationService.learnTerm(termId);
    earnXP(5, `term_${termId}`);
    refreshProgress();
  }, [earnXP, refreshProgress]);

  // Simple addXP wrapper for games
  const addXP = useCallback((amount: number) => {
    earnXP(amount, 'game');
  }, [earnXP]);

  const checkAchievements = useCallback(() => {
    const newAchievements = gamificationService.checkAchievements();
    if (newAchievements.length > 0) {
      setPendingAchievements(prev => [...prev, ...newAchievements]);
    }
    refreshProgress();
  }, [refreshProgress]);

  const dismissAchievement = useCallback((achievementId: string) => {
    gamificationService.markAchievementCelebrated(achievementId);
    setPendingAchievements(prev => prev.filter(a => a.id !== achievementId));
  }, []);

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
    setNewLevel(null);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        progress,
        level,
        levelDefinition,
        xpProgress,
        isLoading,
        pendingAchievements,
        showLevelUp,
        newLevel,
        earnXP,
        addXP,
        updateStreak,
        markVideoWatched,
        updateVideoTimestamp,
        recordQuizAttempt,
        updateFlashcardProgress,
        completeModule,
        completeCourse,
        isCourseCompleted,
        getCertificate,
        learnTerm,
        checkAchievements,
        dismissAchievement,
        dismissLevelUp,
        refreshProgress,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
