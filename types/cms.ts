// CMS-specific type definitions for TV/FAST/VOD management

import { FastChannel, Episode, ScheduleBlock, Video } from '../types';

// Extended Channel with CMS capabilities
export interface CMSChannel extends Omit<FastChannel, 'videoIds'> {
  artwork: {
    thumbnail: string;
    banner: string;
    logo?: string;
  };
  library: string[];  // Episode IDs assigned to channel
  schedule: {
    draft: CMSScheduleBlock[];
    published: CMSScheduleBlock[];
    lastPublished?: string;  // ISO date string
    lastSaved?: string;
  };
  settings: {
    autoSchedule: boolean;
    isPremium: boolean;
    loopContent: boolean;
  };
  status: 'draft' | 'published' | 'modified';
}

// Extended schedule block with more metadata
export interface CMSScheduleBlock extends ScheduleBlock {
  id: string;
  order: number;
}

// Extended Episode with CMS capabilities
export interface CMSEpisode extends Omit<Episode, 'clips'> {
  channelIds: string[];
  clips: CMSClip[];
  artwork: {
    thumbnail: string;
    poster?: string;
  };
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

// Clip within an episode
export interface CMSClip {
  id: string;
  title: string;
  sourceVideoId: string;
  embedUrl: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnail?: string;
  order: number;
}

// VOD configuration
export interface VODConfig {
  heroCarousel: HeroSlide[];
  sections: VODSection[];
  categories: VODCategory[];
  lastPublished?: string;
  lastSaved?: string;
  status: 'draft' | 'published' | 'modified';
}

// Hero carousel slide
export interface HeroSlide {
  id: string;
  episodeId: string;
  title: string;
  description?: string;
  customThumbnail?: string;
  ctaText: string;
  order: number;
  isVisible: boolean;
}

// VOD section (row of content)
export interface VODSection {
  id: string;
  title: string;
  type: 'auto' | 'manual' | 'collection' | 'continue-watching';
  isVisible: boolean;
  order: number;
  // For manual sections
  episodeIds?: string[];
  // For auto sections
  autoRules?: AutoRules;
  // For collection reference
  collectionId?: string;
}

// Auto-population rules
export interface AutoRules {
  includeTags: string[];
  excludeTags: string[];
  sortBy: 'recent' | 'popular' | 'duration' | 'title';
  sortOrder: 'asc' | 'desc';
  limit: number;
  minDuration?: number;
  maxDuration?: number;
}

// VOD category
export interface VODCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  isVisible: boolean;
  icon?: string;
}

// Collection of episodes
export interface Collection {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'auto';
  episodeIds?: string[];
  autoRules?: AutoRules;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// CMS state for a channel being edited
export interface ChannelEditorState {
  channel: CMSChannel;
  originalChannel: CMSChannel;
  hasUnsavedChanges: boolean;
  activeTab: 'details' | 'library' | 'schedule';
  selectedEpisodes: string[];
  isDirty: boolean;
}

// CMS state for VOD being edited
export interface VODEditorState {
  config: VODConfig;
  originalConfig: VODConfig;
  hasUnsavedChanges: boolean;
  activeTab: 'hero' | 'sections' | 'categories';
  isDirty: boolean;
}

// Change tracking
export interface ChangeLog {
  id: string;
  timestamp: string;
  type: 'add' | 'remove' | 'update' | 'reorder';
  entity: 'episode' | 'channel' | 'schedule' | 'collection' | 'section';
  entityId: string;
  description: string;
  previousValue?: unknown;
  newValue?: unknown;
}

// Artwork upload
export interface ArtworkUpload {
  file: File;
  preview: string;
  type: 'thumbnail' | 'banner' | 'logo' | 'poster';
  aspectRatio: string;
}

// Schedule drag and drop
export interface ScheduleDragItem {
  id: string;
  type: 'episode' | 'scheduled-block';
  episodeId: string;
  title: string;
  duration: number;
  thumbnail?: string;
}

// Time slot for schedule
export interface TimeSlot {
  startTime: string;  // HH:mm format
  endTime: string;
  date: string;  // YYYY-MM-DD
  block?: CMSScheduleBlock;
  isDropTarget: boolean;
}

// CMS Dashboard stats
export interface CMSStats {
  totalChannels: number;
  totalEpisodes: number;
  totalCollections: number;
  publishedChannels: number;
  draftChannels: number;
  totalScheduledMinutes: number;
  recentChanges: ChangeLog[];
}

// Export helper types
export type TabId = 'details' | 'library' | 'schedule';
export type VODTabId = 'hero' | 'sections' | 'categories';
export type PublishStatus = 'draft' | 'published' | 'modified';
export type SectionType = 'auto' | 'manual' | 'collection' | 'continue-watching';
export type SortOption = 'recent' | 'popular' | 'duration' | 'title';
