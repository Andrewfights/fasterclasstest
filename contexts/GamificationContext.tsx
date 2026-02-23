import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserProgress,
  Achievement,
  QuizAttempt,
  FlashcardProgress,
  LevelDefinition,
  Certificate,
  FounderJourney,
  DailyMission,
  JourneyMilestone,
  GameSessionState,
  FounderStage,
  IndustryType,
  MissionType,
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

  // Founder Journey State
  founderJourney: FounderJourney | null;
  dailyMissions: DailyMission[];
  currentMilestone: JourneyMilestone | null;
  gameSessions: Record<string, GameSessionState>;
  hasCompany: boolean;

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

  // Founder Journey Actions
  createCompany: (name: string, description: string, industry: IndustryType) => void;
  updateCompanyMetrics: (metrics: Partial<FounderJourney>) => void;
  completeDailyMission: (missionId: string) => void;
  refreshDailyMissions: () => void;
  checkMilestoneProgress: () => void;
  advanceToNextStage: () => void;
  saveGameSession: (gameType: string, state: Partial<GameSessionState>) => void;
  getGameSession: (gameType: string) => GameSessionState | null;
  clearGameSession: (gameType: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Storage keys for founder journey
const FOUNDER_JOURNEY_KEY = 'fasterclass_founder_journey';
const DAILY_MISSIONS_KEY = 'fasterclass_daily_missions';
const GAME_SESSIONS_KEY = 'fasterclass_game_sessions';
const MISSIONS_DATE_KEY = 'fasterclass_missions_date';

// Default daily missions generator
const generateDailyMissions = (): DailyMission[] => {
  const missionTemplates: Array<Omit<DailyMission, 'id' | 'completed' | 'progress'>> = [
    { type: 'watch_video', title: 'Watch a Video', description: 'Watch any educational video', xpReward: 50, target: 1 },
    { type: 'complete_quiz', title: 'Complete a Quiz', description: 'Test your knowledge with a quiz', xpReward: 75, target: 1 },
    { type: 'flashcards', title: 'Review Flashcards', description: 'Study flashcards for any topic', xpReward: 30, target: 10 },
    { type: 'play_game', title: 'Play a Learning Game', description: 'Complete any game session', xpReward: 40, target: 1 },
    { type: 'finish_module', title: 'Complete a Module', description: 'Finish all content in a module', xpReward: 100, target: 1 },
  ];

  // Pick 3 random missions for today
  const shuffled = [...missionTemplates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((template, index) => ({
    ...template,
    id: `mission-${Date.now()}-${index}`,
    completed: false,
    progress: 0,
  }));
};

// Stage definitions
const STAGE_DEFINITIONS: Record<FounderStage, { name: string; minValuation: number; nextStage: FounderStage | null }> = {
  idea: { name: 'Idea Stage', minValuation: 0, nextStage: 'preseed' },
  preseed: { name: 'Pre-Seed', minValuation: 100000, nextStage: 'seed' },
  seed: { name: 'Seed Round', minValuation: 1000000, nextStage: 'seriesA' },
  seriesA: { name: 'Series A', minValuation: 5000000, nextStage: 'seriesB' },
  seriesB: { name: 'Series B', minValuation: 25000000, nextStage: 'scale' },
  scale: { name: 'Scale', minValuation: 100000000, nextStage: 'exit' },
  exit: { name: 'Exit', minValuation: 500000000, nextStage: null },
};

// Milestone definitions
const MILESTONES: JourneyMilestone[] = [
  {
    id: 'milestone-preseed',
    stage: 'preseed',
    title: 'Complete Pre-Seed Round',
    description: 'Validate your idea and prepare for funding',
    requirements: [
      { type: 'videos', count: 5, description: 'Watch 5 videos' },
      { type: 'course', id: 'ideation-playbook', description: 'Complete Ideation Playbook' },
    ],
    rewards: { xp: 250, cash: 100000, valuationBoost: 500000, badge: 'Pre-Seed Founder' },
  },
  {
    id: 'milestone-seed',
    stage: 'seed',
    title: 'Raise Seed Round',
    description: 'Build your MVP and raise your first major funding',
    requirements: [
      { type: 'videos', count: 15, description: 'Watch 15 videos' },
      { type: 'game', id: 'scenario-challenge', description: 'Complete Scenario Challenge' },
      { type: 'xp', count: 1000, description: 'Earn 1,000 XP' },
    ],
    rewards: { xp: 500, cash: 1500000, valuationBoost: 5000000, badge: 'Funded Founder', teamUnlock: 5 },
  },
  {
    id: 'milestone-seriesA',
    stage: 'seriesA',
    title: 'Series A Fundraise',
    description: 'Scale your product and team',
    requirements: [
      { type: 'videos', count: 30, description: 'Watch 30 videos' },
      { type: 'module', count: 3, description: 'Complete 3 modules' },
      { type: 'xp', count: 3000, description: 'Earn 3,000 XP' },
    ],
    rewards: { xp: 1000, cash: 10000000, valuationBoost: 20000000, badge: 'Series A CEO', teamUnlock: 15 },
  },
];

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => gamificationService.getUserProgress());
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  // Founder Journey State
  const [founderJourney, setFounderJourney] = useState<FounderJourney | null>(() => {
    try {
      const stored = localStorage.getItem(FOUNDER_JOURNEY_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    try {
      const storedDate = localStorage.getItem(MISSIONS_DATE_KEY);
      const today = new Date().toDateString();
      if (storedDate === today) {
        const stored = localStorage.getItem(DAILY_MISSIONS_KEY);
        return stored ? JSON.parse(stored) : generateDailyMissions();
      }
      // New day, generate new missions
      const newMissions = generateDailyMissions();
      localStorage.setItem(MISSIONS_DATE_KEY, today);
      localStorage.setItem(DAILY_MISSIONS_KEY, JSON.stringify(newMissions));
      return newMissions;
    } catch {
      return generateDailyMissions();
    }
  });

  const [gameSessions, setGameSessions] = useState<Record<string, GameSessionState>>(() => {
    try {
      const stored = localStorage.getItem(GAME_SESSIONS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const hasCompany = founderJourney !== null;

  // Calculate current milestone based on stage
  const currentMilestone = founderJourney
    ? MILESTONES.find(m => m.stage === founderJourney.stage) || null
    : MILESTONES[0];

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

  // === FOUNDER JOURNEY METHODS ===

  // Persist founder journey to localStorage
  useEffect(() => {
    if (founderJourney) {
      localStorage.setItem(FOUNDER_JOURNEY_KEY, JSON.stringify(founderJourney));
    }
  }, [founderJourney]);

  // Persist daily missions
  useEffect(() => {
    localStorage.setItem(DAILY_MISSIONS_KEY, JSON.stringify(dailyMissions));
  }, [dailyMissions]);

  // Persist game sessions
  useEffect(() => {
    localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(gameSessions));
  }, [gameSessions]);

  const createCompany = useCallback((name: string, description: string, industry: IndustryType) => {
    const newJourney: FounderJourney = {
      companyName: name,
      companyDescription: description,
      industry,
      stage: 'idea',
      cashBalance: 0,
      valuation: 0,
      teamSize: 1,
      productScore: 0,
      mrr: 0,
      weekNumber: 1,
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
    };
    setFounderJourney(newJourney);
    earnXP(100, 'company_created');
  }, [earnXP]);

  const updateCompanyMetrics = useCallback((metrics: Partial<FounderJourney>) => {
    setFounderJourney(prev => {
      if (!prev) return prev;
      return { ...prev, ...metrics, lastPlayedAt: Date.now() };
    });
  }, []);

  const completeDailyMission = useCallback((missionId: string) => {
    setDailyMissions(prev => {
      const updated = prev.map(m => {
        if (m.id === missionId && !m.completed) {
          earnXP(m.xpReward, `mission_${missionId}`);
          if (m.cashReward && founderJourney) {
            updateCompanyMetrics({ cashBalance: founderJourney.cashBalance + m.cashReward });
          }
          return { ...m, completed: true, progress: m.target || 1 };
        }
        return m;
      });

      // Check if all missions completed for bonus
      const allComplete = updated.every(m => m.completed);
      if (allComplete && !prev.every(m => m.completed)) {
        earnXP(100, 'all_missions_bonus');
        if (founderJourney) {
          updateCompanyMetrics({ cashBalance: founderJourney.cashBalance + 10000 });
        }
      }

      return updated;
    });
  }, [earnXP, founderJourney, updateCompanyMetrics]);

  const updateMissionProgress = useCallback((type: MissionType, increment: number = 1) => {
    setDailyMissions(prev => prev.map(m => {
      if (m.type === type && !m.completed) {
        const newProgress = (m.progress || 0) + increment;
        if (newProgress >= (m.target || 1)) {
          // Auto-complete mission
          earnXP(m.xpReward, `mission_${m.id}`);
          return { ...m, completed: true, progress: m.target || 1 };
        }
        return { ...m, progress: newProgress };
      }
      return m;
    }));
  }, [earnXP]);

  // Track mission progress when actions happen
  const originalMarkVideoWatched = markVideoWatched;
  const enhancedMarkVideoWatched = useCallback((videoId: string, moduleId: string, xpReward: number = 10) => {
    originalMarkVideoWatched(videoId, moduleId, xpReward);
    updateMissionProgress('watch_video');
    // Update company metrics
    if (founderJourney) {
      const newProductScore = Math.min(100, founderJourney.productScore + 1);
      const valuationBoost = Math.floor(progress.xp * 100);
      updateCompanyMetrics({
        productScore: newProductScore,
        valuation: Math.max(founderJourney.valuation, valuationBoost),
      });
    }
  }, [originalMarkVideoWatched, updateMissionProgress, founderJourney, progress.xp, updateCompanyMetrics]);

  const refreshDailyMissions = useCallback(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(MISSIONS_DATE_KEY);
    if (storedDate !== today) {
      const newMissions = generateDailyMissions();
      setDailyMissions(newMissions);
      localStorage.setItem(MISSIONS_DATE_KEY, today);
    }
  }, []);

  const checkMilestoneProgress = useCallback(() => {
    if (!founderJourney || !currentMilestone) return;

    // Check if all requirements are met
    const videosWatched = Object.keys(progress.videoProgress || {}).length;
    const modulesCompleted = progress.modulesCompleted?.length || 0;

    let allMet = true;
    for (const req of currentMilestone.requirements) {
      switch (req.type) {
        case 'videos':
          if (videosWatched < (req.count || 0)) allMet = false;
          break;
        case 'module':
          if (modulesCompleted < (req.count || 0)) allMet = false;
          break;
        case 'xp':
          if (progress.xp < (req.count || 0)) allMet = false;
          break;
        case 'course':
          if (req.id && !progress.coursesCompleted?.includes(req.id)) allMet = false;
          break;
      }
    }

    // If all requirements met, apply rewards
    if (allMet) {
      const rewards = currentMilestone.rewards;
      earnXP(rewards.xp, `milestone_${currentMilestone.id}`);
      updateCompanyMetrics({
        cashBalance: founderJourney.cashBalance + rewards.cash,
        valuation: founderJourney.valuation + rewards.valuationBoost,
        teamSize: founderJourney.teamSize + (rewards.teamUnlock || 0),
      });
    }
  }, [founderJourney, currentMilestone, progress, earnXP, updateCompanyMetrics]);

  const advanceToNextStage = useCallback(() => {
    if (!founderJourney) return;
    const currentStageInfo = STAGE_DEFINITIONS[founderJourney.stage];
    if (currentStageInfo.nextStage) {
      updateCompanyMetrics({
        stage: currentStageInfo.nextStage,
        weekNumber: founderJourney.weekNumber + 1,
      });
      earnXP(200, `stage_advance_${currentStageInfo.nextStage}`);
    }
  }, [founderJourney, updateCompanyMetrics, earnXP]);

  const saveGameSession = useCallback((gameType: string, state: Partial<GameSessionState>) => {
    setGameSessions(prev => ({
      ...prev,
      [gameType]: {
        gameType,
        sessionId: prev[gameType]?.sessionId || `session-${Date.now()}`,
        startedAt: prev[gameType]?.startedAt || Date.now(),
        lastPlayedAt: Date.now(),
        isPaused: false,
        ...prev[gameType],
        ...state,
      },
    }));
  }, []);

  const getGameSession = useCallback((gameType: string): GameSessionState | null => {
    return gameSessions[gameType] || null;
  }, [gameSessions]);

  const clearGameSession = useCallback((gameType: string) => {
    setGameSessions(prev => {
      const updated = { ...prev };
      delete updated[gameType];
      return updated;
    });
    updateMissionProgress('play_game');
  }, [updateMissionProgress]);

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
        // Founder Journey State
        founderJourney,
        dailyMissions,
        currentMilestone,
        gameSessions,
        hasCompany,
        // Actions
        earnXP,
        addXP,
        updateStreak,
        markVideoWatched: enhancedMarkVideoWatched,
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
        // Founder Journey Actions
        createCompany,
        updateCompanyMetrics,
        completeDailyMission,
        refreshDailyMissions,
        checkMilestoneProgress,
        advanceToNextStage,
        saveGameSession,
        getGameSession,
        clearGameSession,
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
