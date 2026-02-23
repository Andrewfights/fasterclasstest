import React from 'react';

export interface Video {
  id: string;
  title: string;
  expert: string;
  thumbnail: string;
  url: string;
  embedUrl: string;
  duration: number;
  platform: 'youtube' | 'other';
  tags: string[];
  isVertical?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  videoIds: string[];
  locked: boolean;
  coverImage: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  videoIds: string[];
  category: string;
  logo: React.ReactNode;
}

export type ViewState = 'HOME' | 'PLAYLIST' | 'PLAYER' | 'ADMIN' | 'LIVETV';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  lastLoginTime: number | null;
}

export interface AdminUser {
  email: string;
  displayName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DataExport {
  videos: Video[];
  playlists: Playlist[];
  exportedAt: string;
}

// === STREAMING / VOD TYPES ===

// Course Module (part of a course curriculum)
export interface CourseModule {
  id: string;              // e.g., 'course-1-module-1'
  title: string;           // e.g., 'Finding Great Ideas'
  description: string;
  order: number;
  videoIds: string[];      // Videos in this module
  quizId?: string;         // Module quiz (optional)
  keyTermIds: string[];    // Glossary term IDs for flashcards
}

// Course (curated learning path)
export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  videoIds: string[];
  topic: string;
  instructor?: string;
  iconEmoji: string;
  color: string;
  order: number;
  // Module-based curriculum (optional, for enhanced courses)
  modules?: CourseModule[];
  hasModularCurriculum?: boolean;
}

// Helper to check if course has modular structure
export const isModularCourse = (course: Course): boolean => {
  return !!(course.modules && course.modules.length > 0);
};

// Helper to get all video IDs (works for both legacy and modular)
export const getCourseVideoIds = (course: Course): string[] => {
  if (isModularCourse(course) && course.modules) {
    return course.modules.flatMap(m => m.videoIds);
  }
  return course.videoIds;
};

// User Library
export interface UserLibrary {
  savedVideos: string[];
  playlists: UserPlaylist[];
  watchHistory: WatchHistoryItem[];
}

export interface UserPlaylist {
  id: string;
  title: string;
  description?: string;
  videoIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface WatchHistoryItem {
  videoId: string;
  timestamp: number;
  lastWatchedAt: number;
  completed: boolean;
}

// Glossary (keeping for resources section)
export type GlossaryCategory =
  'starting_company' | 'credit_cards' | 'raising_money' |
  'hiring' | 'prototyping' | 'ai' | 'growth' | 'legal' | 'general';

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  fullExplanation: string;
  category: GlossaryCategory;
  relatedTerms: string[];
  videoIds: string[];
  examples: string[];
}

// === FAST CHANNELS (PLUTO TV STYLE) ===

export type FastChannelCategory = 'learning' | 'inspiration' | 'tech' | 'mixed';

export interface FastChannel {
  id: string;
  number: number;           // Channel number (1-99)
  name: string;
  shortName: string;        // 3-4 char abbreviation
  description: string;
  category: FastChannelCategory;
  logo: string;             // Emoji or icon
  color: string;            // Brand color
  videoIds: string[];       // Videos in rotation
  isLive?: boolean;         // For future live streams
}

export interface ChannelSchedule {
  channelId: string;
  currentVideo: Video;
  startOffset: number;      // Seconds into current video
  remaining: number;        // Seconds until next video
  nextVideo: Video;
  upcomingVideos: Video[];  // Next 3-5 videos
}

export interface EPGSlot {
  videoId: string;
  startTime: number;        // Unix timestamp
  endTime: number;
  video: Video;
}

// === GAMIFICATION TYPES ===

export interface LevelDefinition {
  level: number;
  name: string;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'quiz' | 'milestone' | 'special';
  xpReward: number;
  condition: {
    type: 'first_video' | 'first_quiz' | 'perfect_quiz' | 'videos_watched' |
          'streak_days' | 'xp_total' | 'quizzes_passed' | 'module_complete' |
          'flashcards_mastered';
    value: number;
    moduleId?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserProgress {
  id: string;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakFreezes: number;
  modulesCompleted: string[];
  modulesInProgress: Record<string, ModuleProgress>;
  coursesCompleted: string[];
  certificates: Certificate[];
  videoProgress: Record<string, VideoProgress>;
  quizAttempts: QuizAttempt[];
  flashcardProgress: Record<string, FlashcardProgress>;
  achievements: UserAchievement[];
  activityHistory: DailyActivity[];
  learnedTerms: string[];
}

export interface ModuleProgress {
  moduleId: string;
  videosWatched: string[];
  quizzesPassed: string[];
  lessonsCompleted: string[];
  flashcardsReviewed: boolean;
  percentComplete: number;
  startedAt: number;
  completedAt?: number;
}

export interface VideoProgress {
  videoId: string;
  watched: boolean;
  timestamp: number;
  watchedAt: number | null;
}

export interface QuizAttempt {
  quizId: string;
  moduleId: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  attemptedAt: number;
  timeSpent: number;
  xpEarned: number;
}

export interface FlashcardProgress {
  cardId: string;
  lastReviewed: number;
  timesReviewed: number;
  timesCorrect: number;
  masteryLevel: number;
  nextReviewAt: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: number;
  celebrated: boolean;
}

// === CERTIFICATE TYPES ===

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  earnedAt: number;
  xpEarned: number;
  modulesCompleted: number;
  quizzesPassed: number;
  totalTime: number; // minutes spent
}

export interface DailyActivity {
  date: string;
  xpEarned: number;
  minutesLearned: number;
  videosWatched: number;
  quizzesTaken: number;
  flashcardsReviewed: number;
}

// === QUIZ TYPES ===

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  videoId?: string;
  questions: QuizQuestion[];
  passingScore: number;
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpValue: number;
}

// === FILL-IN-THE-BLANK TYPES ===

export interface FillBlankExercise {
  id: string;
  sentence: string;
  answer: string;
  acceptedAnswers: string[];
  hint: string;
  explanation: string;
  termId: string;
  category: GlossaryCategory;
  xpValue: number;
}

// === CMS TYPES ===

export interface ScheduleBlock {
  id: string;
  channelId: string;
  videoId: string;
  startTime: number;    // Unix timestamp (seconds)
  endTime: number;      // Unix timestamp (seconds)
  isCustom?: boolean;   // True if manually scheduled
}

export interface ChannelScheduleConfig {
  channelId: string;
  mode: 'auto' | 'custom';
  customBlocks?: ScheduleBlock[];
  loopAfterEnd: boolean;
}

export interface ScheduleConfig {
  channels: { [channelId: string]: ChannelScheduleConfig };
  updatedAt: number;
  updatedBy?: string;
}

export interface HomepageSection {
  id: string;
  type: 'hero' | 'continue' | 'courses' | 'videos' | 'category';
  title: string;
  enabled: boolean;
  order: number;
  config: {
    videoIds?: string[];
    courseIds?: string[];
    categoryFilter?: string;
    maxItems?: number;
    isAuto?: boolean;
  };
}

export interface CMSConfig {
  homepage: {
    sections: HomepageSection[];
    heroVideos: string[];
  };
  channels: {
    [channelId: string]: {
      scheduleMode: 'auto' | 'custom';
      customBlocks?: ScheduleBlock[];
    };
  };
  updatedAt: number;
  updatedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'video' | 'course' | 'channel' | 'schedule' | 'homepage';
  entityId: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  timestamp: number;
  userId?: string;
}
