// CMS Data Service - Persistence layer for TV/FAST/VOD CMS management

import {
  CMSChannel,
  CMSEpisode,
  CMSClip,
  VODConfig,
  Collection,
  HeroSlide,
  VODSection,
  VODCategory,
  CMSScheduleBlock,
  ChangeLog,
  CMSStats,
  AutoRules,
} from '../types/cms';
import { FAST_CHANNELS, INITIAL_VIDEOS, EPISODES } from '../constants';
import { FastChannel, Video, Episode } from '../types';

const STORAGE_KEYS = {
  CHANNELS: 'cms_channels',
  EPISODES: 'cms_episodes',
  COLLECTIONS: 'cms_collections',
  VOD_CONFIG: 'cms_vod_config',
  CHANGE_LOG: 'cms_change_log',
};

// ============ CHANNEL MANAGEMENT ============

// Convert FastChannel to CMSChannel
const convertToCMSChannel = (channel: FastChannel): CMSChannel => ({
  ...channel,
  artwork: {
    thumbnail: '',
    banner: '',
    logo: channel.logo,
  },
  library: channel.videoIds,
  schedule: {
    draft: channel.videoIds.map((videoId, index) => ({
      id: `block-${channel.id}-${index}`,
      channelId: channel.id,
      videoId,
      startTime: 0,
      endTime: 0,
      order: index,
    })),
    published: channel.videoIds.map((videoId, index) => ({
      id: `block-${channel.id}-${index}`,
      channelId: channel.id,
      videoId,
      startTime: 0,
      endTime: 0,
      order: index,
    })),
    lastPublished: new Date().toISOString(),
  },
  settings: {
    autoSchedule: true,
    isPremium: false,
    loopContent: true,
  },
  status: 'published',
});

// Get all CMS channels
export const getCMSChannels = (): CMSChannel[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CHANNELS);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize from FAST_CHANNELS
  const channels = FAST_CHANNELS.map(convertToCMSChannel);
  localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  return channels;
};

// Get single channel
export const getCMSChannel = (channelId: string): CMSChannel | null => {
  const channels = getCMSChannels();
  return channels.find(c => c.id === channelId) || null;
};

// Save channel
export const saveCMSChannel = (channel: CMSChannel): CMSChannel => {
  const channels = getCMSChannels();
  const index = channels.findIndex(c => c.id === channel.id);

  const updatedChannel = {
    ...channel,
    schedule: {
      ...channel.schedule,
      lastSaved: new Date().toISOString(),
    },
    status: 'modified' as const,
  };

  if (index >= 0) {
    channels[index] = updatedChannel;
  } else {
    channels.push(updatedChannel);
  }

  localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  logChange('update', 'channel', channel.id, 'Channel saved');
  return updatedChannel;
};

// Publish channel
export const publishCMSChannel = (channelId: string): CMSChannel | null => {
  const channels = getCMSChannels();
  const index = channels.findIndex(c => c.id === channelId);

  if (index < 0) return null;

  const channel = channels[index];
  const publishedChannel: CMSChannel = {
    ...channel,
    schedule: {
      ...channel.schedule,
      published: [...channel.schedule.draft],
      lastPublished: new Date().toISOString(),
    },
    status: 'published',
  };

  channels[index] = publishedChannel;
  localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  logChange('update', 'channel', channelId, 'Channel published');
  return publishedChannel;
};

// Update channel library (assigned episodes)
export const updateChannelLibrary = (
  channelId: string,
  episodeIds: string[]
): CMSChannel | null => {
  const channels = getCMSChannels();
  const index = channels.findIndex(c => c.id === channelId);

  if (index < 0) return null;

  channels[index] = {
    ...channels[index],
    library: episodeIds,
    status: 'modified',
  };

  localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  logChange('update', 'channel', channelId, `Library updated with ${episodeIds.length} episodes`);
  return channels[index];
};

// Update channel schedule
export const updateChannelSchedule = (
  channelId: string,
  blocks: CMSScheduleBlock[]
): CMSChannel | null => {
  const channels = getCMSChannels();
  const index = channels.findIndex(c => c.id === channelId);

  if (index < 0) return null;

  channels[index] = {
    ...channels[index],
    schedule: {
      ...channels[index].schedule,
      draft: blocks,
      lastSaved: new Date().toISOString(),
    },
    status: 'modified',
  };

  localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  logChange('update', 'schedule', channelId, `Schedule updated with ${blocks.length} blocks`);
  return channels[index];
};

// ============ EPISODE MANAGEMENT ============

// Convert Episode to CMSEpisode
const convertToCMSEpisode = (episode: Episode): CMSEpisode => ({
  ...episode,
  channelIds: [],
  clips: episode.clips.map((clip, index) => {
    const video = INITIAL_VIDEOS.find(v => v.id === clip.videoId);
    return {
      id: `clip-${episode.id}-${index}`,
      title: video?.title || `Clip ${index + 1}`,
      sourceVideoId: clip.videoId,
      embedUrl: video?.embedUrl || '',
      startTime: clip.startTime,
      endTime: clip.endTime,
      duration: clip.endTime - clip.startTime,
      thumbnail: video?.thumbnail,
      order: clip.order,
    };
  }),
  artwork: {
    thumbnail: episode.thumbnail,
    poster: episode.thumbnail,
  },
  status: 'published',
  createdAt: new Date(episode.createdAt).toISOString(),
  updatedAt: new Date(episode.updatedAt).toISOString(),
});

// Get all CMS episodes
export const getCMSEpisodes = (): CMSEpisode[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EPISODES);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize from EPISODES
  const episodes = EPISODES.map(convertToCMSEpisode);
  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
  return episodes;
};

// Get single episode
export const getCMSEpisode = (episodeId: string): CMSEpisode | null => {
  const episodes = getCMSEpisodes();
  return episodes.find(e => e.id === episodeId) || null;
};

// Save episode
export const saveCMSEpisode = (episode: CMSEpisode): CMSEpisode => {
  const episodes = getCMSEpisodes();
  const index = episodes.findIndex(e => e.id === episode.id);

  const updatedEpisode = {
    ...episode,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    episodes[index] = updatedEpisode;
  } else {
    episodes.push(updatedEpisode);
  }

  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
  logChange('update', 'episode', episode.id, 'Episode saved');
  return updatedEpisode;
};

// Create episode
export const createCMSEpisode = (data: Partial<CMSEpisode>): CMSEpisode => {
  const episodes = getCMSEpisodes();

  const newEpisode: CMSEpisode = {
    id: `episode-${Date.now()}`,
    title: data.title || 'New Episode',
    description: data.description || '',
    thumbnail: data.thumbnail || '',
    clips: data.clips || [],
    totalDuration: data.totalDuration || 0,
    tags: data.tags || [],
    distribution: data.distribution || 'vod',
    channelIds: data.channelIds || [],
    artwork: data.artwork || { thumbnail: '', poster: '' },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  episodes.push(newEpisode);
  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
  logChange('add', 'episode', newEpisode.id, 'Episode created');
  return newEpisode;
};

// Delete episode
export const deleteCMSEpisode = (episodeId: string): boolean => {
  const episodes = getCMSEpisodes();
  const filtered = episodes.filter(e => e.id !== episodeId);

  if (filtered.length === episodes.length) return false;

  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(filtered));
  logChange('remove', 'episode', episodeId, 'Episode deleted');
  return true;
};

// Update episode clips
export const updateEpisodeClips = (
  episodeId: string,
  clips: CMSClip[]
): CMSEpisode | null => {
  const episodes = getCMSEpisodes();
  const index = episodes.findIndex(e => e.id === episodeId);

  if (index < 0) return null;

  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);

  episodes[index] = {
    ...episodes[index],
    clips,
    totalDuration,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
  logChange('update', 'episode', episodeId, `Clips updated (${clips.length} clips)`);
  return episodes[index];
};

// ============ COLLECTION MANAGEMENT ============

// Get all collections
export const getCollections = (): Collection[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with empty array
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify([]));
  return [];
};

// Get single collection
export const getCollection = (collectionId: string): Collection | null => {
  const collections = getCollections();
  return collections.find(c => c.id === collectionId) || null;
};

// Save collection
export const saveCollection = (collection: Collection): Collection => {
  const collections = getCollections();
  const index = collections.findIndex(c => c.id === collection.id);

  const updatedCollection = {
    ...collection,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    collections[index] = updatedCollection;
  } else {
    collections.push(updatedCollection);
  }

  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  logChange('update', 'collection', collection.id, 'Collection saved');
  return updatedCollection;
};

// Create collection
export const createCollection = (data: Partial<Collection>): Collection => {
  const collections = getCollections();

  const newCollection: Collection = {
    id: `collection-${Date.now()}`,
    name: data.name || 'New Collection',
    description: data.description || '',
    type: data.type || 'manual',
    episodeIds: data.episodeIds || [],
    autoRules: data.autoRules,
    thumbnail: data.thumbnail || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  collections.push(newCollection);
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  logChange('add', 'collection', newCollection.id, 'Collection created');
  return newCollection;
};

// Delete collection
export const deleteCollection = (collectionId: string): boolean => {
  const collections = getCollections();
  const filtered = collections.filter(c => c.id !== collectionId);

  if (filtered.length === collections.length) return false;

  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(filtered));
  logChange('remove', 'collection', collectionId, 'Collection deleted');
  return true;
};

// ============ VOD CONFIG MANAGEMENT ============

// Default VOD config
const getDefaultVODConfig = (): VODConfig => ({
  heroCarousel: INITIAL_VIDEOS.slice(0, 5).map((video, index) => ({
    id: `hero-${index}`,
    episodeId: video.id,
    title: video.title,
    description: `Watch ${video.expert} share insights`,
    ctaText: 'Watch Now',
    order: index,
    isVisible: true,
  })),
  sections: [
    {
      id: 'section-continue',
      title: 'Continue Watching',
      type: 'continue-watching',
      isVisible: true,
      order: 0,
    },
    {
      id: 'section-featured',
      title: 'Featured This Week',
      type: 'manual',
      isVisible: true,
      order: 1,
      episodeIds: INITIAL_VIDEOS.slice(0, 8).map(v => v.id),
    },
    {
      id: 'section-new',
      title: 'New Releases',
      type: 'auto',
      isVisible: true,
      order: 2,
      autoRules: {
        includeTags: [],
        excludeTags: [],
        sortBy: 'recent',
        sortOrder: 'desc',
        limit: 12,
      },
    },
    {
      id: 'section-quick',
      title: 'Quick Wins (Under 10 min)',
      type: 'auto',
      isVisible: true,
      order: 3,
      autoRules: {
        includeTags: [],
        excludeTags: [],
        sortBy: 'duration',
        sortOrder: 'asc',
        limit: 10,
        maxDuration: 600,
      },
    },
  ],
  categories: [
    { id: 'cat-all', name: 'All', slug: 'all', order: 0, isVisible: true },
    { id: 'cat-startup', name: 'Startup', slug: 'startup', order: 1, isVisible: true },
    { id: 'cat-growth', name: 'Growth', slug: 'growth', order: 2, isVisible: true },
    { id: 'cat-product', name: 'Product', slug: 'product', order: 3, isVisible: true },
    { id: 'cat-ai', name: 'AI', slug: 'ai', order: 4, isVisible: true },
    { id: 'cat-leadership', name: 'Leadership', slug: 'leadership', order: 5, isVisible: true },
  ],
  status: 'published',
  lastPublished: new Date().toISOString(),
});

// Get VOD config
export const getVODConfig = (): VODConfig => {
  const stored = localStorage.getItem(STORAGE_KEYS.VOD_CONFIG);
  if (stored) {
    return JSON.parse(stored);
  }
  const defaultConfig = getDefaultVODConfig();
  localStorage.setItem(STORAGE_KEYS.VOD_CONFIG, JSON.stringify(defaultConfig));
  return defaultConfig;
};

// Save VOD config
export const saveVODConfig = (config: VODConfig): VODConfig => {
  const updatedConfig = {
    ...config,
    lastSaved: new Date().toISOString(),
    status: 'modified' as const,
  };

  localStorage.setItem(STORAGE_KEYS.VOD_CONFIG, JSON.stringify(updatedConfig));
  logChange('update', 'section', 'vod-config', 'VOD config saved');
  return updatedConfig;
};

// Publish VOD config
export const publishVODConfig = (): VODConfig => {
  const config = getVODConfig();
  const publishedConfig: VODConfig = {
    ...config,
    lastPublished: new Date().toISOString(),
    status: 'published',
  };

  localStorage.setItem(STORAGE_KEYS.VOD_CONFIG, JSON.stringify(publishedConfig));
  logChange('update', 'section', 'vod-config', 'VOD config published');
  return publishedConfig;
};

// Update hero carousel
export const updateHeroCarousel = (slides: HeroSlide[]): VODConfig => {
  const config = getVODConfig();
  return saveVODConfig({
    ...config,
    heroCarousel: slides,
  });
};

// Update VOD sections
export const updateVODSections = (sections: VODSection[]): VODConfig => {
  const config = getVODConfig();
  return saveVODConfig({
    ...config,
    sections,
  });
};

// Update VOD categories
export const updateVODCategories = (categories: VODCategory[]): VODConfig => {
  const config = getVODConfig();
  return saveVODConfig({
    ...config,
    categories,
  });
};

// ============ CHANGE LOG ============

// Log a change
const logChange = (
  type: 'add' | 'remove' | 'update' | 'reorder',
  entity: 'episode' | 'channel' | 'schedule' | 'collection' | 'section',
  entityId: string,
  description: string
): void => {
  const logs = getChangeLog();

  const newLog: ChangeLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    entity,
    entityId,
    description,
  };

  // Keep last 100 entries
  const updatedLogs = [newLog, ...logs].slice(0, 100);
  localStorage.setItem(STORAGE_KEYS.CHANGE_LOG, JSON.stringify(updatedLogs));
};

// Get change log
export const getChangeLog = (): ChangeLog[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CHANGE_LOG);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// ============ STATS ============

// Get CMS stats
export const getCMSStats = (): CMSStats => {
  const channels = getCMSChannels();
  const episodes = getCMSEpisodes();
  const collections = getCollections();
  const logs = getChangeLog();

  const totalScheduledMinutes = channels.reduce((sum, channel) => {
    const channelMinutes = channel.schedule.published.reduce((blockSum, block) => {
      const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
      return blockSum + (video?.duration || 0) / 60;
    }, 0);
    return sum + channelMinutes;
  }, 0);

  return {
    totalChannels: channels.length,
    totalEpisodes: episodes.length,
    totalCollections: collections.length,
    publishedChannels: channels.filter(c => c.status === 'published').length,
    draftChannels: channels.filter(c => c.status !== 'published').length,
    totalScheduledMinutes: Math.round(totalScheduledMinutes),
    recentChanges: logs.slice(0, 10),
  };
};

// ============ UTILITIES ============

// Get episodes for auto-rules
export const getEpisodesByRules = (rules: AutoRules): CMSEpisode[] => {
  let episodes = getCMSEpisodes();

  // Filter by include tags
  if (rules.includeTags.length > 0) {
    episodes = episodes.filter(ep =>
      rules.includeTags.some(tag => ep.tags.includes(tag))
    );
  }

  // Filter by exclude tags
  if (rules.excludeTags.length > 0) {
    episodes = episodes.filter(ep =>
      !rules.excludeTags.some(tag => ep.tags.includes(tag))
    );
  }

  // Filter by duration
  if (rules.minDuration) {
    episodes = episodes.filter(ep => ep.totalDuration >= rules.minDuration!);
  }
  if (rules.maxDuration) {
    episodes = episodes.filter(ep => ep.totalDuration <= rules.maxDuration!);
  }

  // Sort
  switch (rules.sortBy) {
    case 'recent':
      episodes.sort((a, b) =>
        rules.sortOrder === 'desc'
          ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      break;
    case 'duration':
      episodes.sort((a, b) =>
        rules.sortOrder === 'desc'
          ? b.totalDuration - a.totalDuration
          : a.totalDuration - b.totalDuration
      );
      break;
    case 'title':
      episodes.sort((a, b) =>
        rules.sortOrder === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      );
      break;
    // 'popular' would need view data - defaulting to recent
    default:
      break;
  }

  // Limit
  return episodes.slice(0, rules.limit);
};

// Get all available videos for clip creation
export const getAvailableVideos = (): Video[] => {
  return INITIAL_VIDEOS;
};

// Reset CMS data (for development)
export const resetCMSData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CHANNELS);
  localStorage.removeItem(STORAGE_KEYS.EPISODES);
  localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
  localStorage.removeItem(STORAGE_KEYS.VOD_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.CHANGE_LOG);
};

export const cmsDataService = {
  // Channels
  getCMSChannels,
  getCMSChannel,
  saveCMSChannel,
  publishCMSChannel,
  updateChannelLibrary,
  updateChannelSchedule,

  // Episodes
  getCMSEpisodes,
  getCMSEpisode,
  saveCMSEpisode,
  createCMSEpisode,
  deleteCMSEpisode,
  updateEpisodeClips,

  // Collections
  getCollections,
  getCollection,
  saveCollection,
  createCollection,
  deleteCollection,

  // VOD Config
  getVODConfig,
  saveVODConfig,
  publishVODConfig,
  updateHeroCarousel,
  updateVODSections,
  updateVODCategories,

  // Utils
  getChangeLog,
  getCMSStats,
  getEpisodesByRules,
  getAvailableVideos,
  resetCMSData,
};

export default cmsDataService;
