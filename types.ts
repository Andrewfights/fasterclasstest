import React from 'react';

export type DistributionChannel = 'vod' | 'live' | 'both';

export interface Video {
  id: string;
  title: string;
  expert: string;
  thumbnail: string;
  customThumbnail?: string;     // Custom thumbnail URL (overrides auto-generated)
  url: string;
  embedUrl: string;
  duration: number;
  platform: 'youtube' | 'other';
  tags: string[];
  isVertical?: boolean;
  startTime?: number;           // Start playback from this second
  endTime?: number;             // End playback at this second (for clips)
  distribution?: DistributionChannel;  // Where this video appears
}

// Episode - combines multiple video clips into one playable unit
export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  clips: EpisodeClip[];
  totalDuration: number;        // Calculated from clips
  tags: string[];
  distribution: DistributionChannel;
  createdAt: number;
  updatedAt: number;
}

export interface EpisodeClip {
  videoId: string;
  startTime: number;            // Start of clip within source video
  endTime: number;              // End of clip within source video
  order: number;                // Position in episode
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

// User Profile Types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  profilePicture?: string;  // Base64 encoded image
  companyName?: string;
  companyLogo?: string;     // Base64 encoded image
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  createdAt: number;
  updatedAt: number;
}

// Startup Checklist Types
export type ChecklistCategory =
  | 'legal'
  | 'finance'
  | 'product'
  | 'marketing'
  | 'operations'
  | 'team';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: ChecklistCategory;
  order: number;
  resources?: {
    title: string;
    url?: string;
    videoId?: string;
  }[];
  tips?: string[];
}

export interface UserChecklist {
  completedItems: string[];
  notes: Record<string, string>;  // itemId -> user notes
  lastUpdated: number;
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
  homeworkId?: string;     // Homework assignment (optional)
}

// Homework Assignment (Action Items)
export interface HomeworkAssignment {
  id: string;
  title: string;
  description: string;
  actionItems: ActionItem[];
  dueAfterModule?: string;    // Module ID this homework follows
  xpReward: number;
}

export interface ActionItem {
  id: string;
  task: string;               // e.g., "Talk to 5 potential customers"
  hint?: string;              // Optional guidance
  isRequired: boolean;
}

export interface UserHomeworkProgress {
  assignmentId: string;
  completedItems: string[];   // Array of completed action item IDs
  notes?: string;             // Optional user notes
  completedAt?: number;
  startedAt: number;
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
  favorites: string[]; // Video IDs that are "hearted"
}

export interface UserPlaylist {
  id: string;
  title: string;
  description?: string;
  videoIds: string[];
  createdAt: number;
  updatedAt: number;
  isPublic?: boolean;           // Public/private toggle
  shareCode?: string;           // For shareable links
  thumbnail?: string;           // Custom thumbnail
  color?: string;               // Playlist accent color
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

export type FastChannelCategory = 'learning' | 'inspiration' | 'tech' | 'mixed' | 'entrepreneur' | 'creative' | 'education' | 'shorts';

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

// === HERO CAROUSEL TYPES ===

export interface HeroCarouselVideoItem {
  type: 'video';
  item: Video;
}

export interface HeroCarouselCourseItem {
  type: 'course';
  item: Course;
}

export type HeroCarouselItem = HeroCarouselVideoItem | HeroCarouselCourseItem;

// === FOUNDER JOURNEY TYPES ===

export type FounderStage = 'idea' | 'preseed' | 'seed' | 'seriesA' | 'seriesB' | 'scale' | 'exit';
export type IndustryType = 'saas' | 'consumer' | 'marketplace' | 'fintech' | 'healthtech' | 'other';

export interface FounderJourney {
  companyName: string;
  companyDescription: string;
  industry: IndustryType;
  stage: FounderStage;
  cashBalance: number;           // Virtual cash from funding
  valuation: number;             // Company valuation
  teamSize: number;              // Virtual team members
  productScore: number;          // 0-100 product strength
  mrr: number;                   // Monthly recurring revenue
  weekNumber: number;            // Simulated weeks in business
  createdAt: number;
  lastPlayedAt: number;
}

// Daily Missions (Duolingo-style)
export type MissionType = 'watch_video' | 'complete_quiz' | 'play_game' | 'finish_module' | 'homework' | 'flashcards';

export interface DailyMission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  xpReward: number;
  cashReward?: number;           // Virtual company cash
  completed: boolean;
  target?: number;               // e.g., watch 3 videos
  progress?: number;             // Current progress toward target
}

// Journey Milestones
export interface JourneyMilestone {
  id: string;
  stage: FounderStage;
  title: string;
  description: string;
  requirements: MilestoneRequirement[];
  rewards: {
    xp: number;
    cash: number;
    valuationBoost: number;
    badge?: string;
    teamUnlock?: number;
  };
}

export interface MilestoneRequirement {
  type: 'course' | 'module' | 'game' | 'homework' | 'xp' | 'videos';
  id?: string;                   // Specific course/module/game ID
  count?: number;                // For generic requirements
  description: string;           // Human-readable requirement
}

// Game State for save/resume
export interface GameSessionState {
  gameType: string;              // e.g., 'flashcards', 'scenario', 'term-match'
  sessionId: string;
  startedAt: number;
  lastPlayedAt: number;
  isPaused: boolean;
  currentRound?: number;
  totalRounds?: number;
  score?: number;
  data?: Record<string, unknown>; // Game-specific state
}

// Stage definitions with metadata
export interface StageDefinition {
  stage: FounderStage;
  name: string;
  description: string;
  icon: string;
  color: string;
  minValuation: number;
  maxValuation: number;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  companyName: string;
  valuation: number;
  xp: number;
  stage: FounderStage;
  weeklyXP: number;
}
