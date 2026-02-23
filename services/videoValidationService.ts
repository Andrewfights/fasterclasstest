/**
 * Video Validation Service
 *
 * Tracks failed/unplayable videos and filters them out of the content library.
 * Uses localStorage to persist failed video IDs across sessions.
 */

const FAILED_VIDEOS_KEY = 'fasterclass_failed_videos';
const VALIDATION_CACHE_KEY = 'fasterclass_video_validation_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Known failed/unembeddable YouTube video IDs (validated 2024)
const KNOWN_FAILED_VIDEO_IDS = new Set([
  '1nECMnpRz00', '2MHnoob3HME', '2MJmPTOg0UU', '2lOqKcNSyww', '3L8sOdO0bOc',
  '3qlG4BHlJmU', '4CJPDfvf8Lk', '4duqI8WyfqQ', '5aIdSvXUZeo', '6FIuYOhL8gI',
  '6TfWgKL4I4A', '7qiTsfFHZQI', '7z4xyGjIZhQ', '8q5kPF4xLR4', '9xN4PJYVrLs',
  'A3aEvT-CqZE', 'BJ2sJNOCM9g', 'Cwi4Xo5KYog', 'E-MdX-YbWGo', 'E_vTg-H3c4g',
  'F3s_EDWNPQY', 'Fy12YYT8qSw', 'Gqh5NWKp_WU', 'HjcZ8kIKKM8', 'HlJU55g9xyc',
  'Hq89wYzG-GM', 'IKBnLZr0ckE', 'JnTvM3d2Hu8', 'Jx0VwJD9XPg', 'K0CQe2Q5Ww4',
  'K3y7Nm1Z9CM', 'K8nH_N6RLqQ', 'KfHsNqYPVIU', 'Oc3VN8z3dJw', 'QH0NJ0AKxDw',
  'Qjb5lz-kfUA', 'S5wKvYDJDyE', 'SLRpOp8t2rY', 'STM3VUvR7fM', 'Sb_-wfmJnRM',
  'T4z_VhJrwKM', 'TJ5v3RPVMig', 'UYN6W1cxn_I', 'UjL6NSVB5u4', 'V7z_Nj8RcL8',
  'VT1awJlbo8Q', 'VbKjWMNPbLk', 'Y5sL9VKg4n0', 'YxjpNsoP-jA', 'ZbrzdMaumNk',
  'aCfJuTGfIvU', 'b5qIEXC_F5c', 'bn_POjTJzts', 'cJ8sN2jLCz4', 'cQaXxNkjEWk',
  'c_DOGxFMgXY', 'dQ7ZvKyWP4Y', 'g5B6X2pPzF8', 'gDGR0p1-HpY', 'gkN0d3x7yME',
  'h3g8vLF4Ep4', 'hJLrnS6K9LI', 'i-7VLiSTqwU', 'iZvesrCPJm0', 'ij7E4CRp1dI',
  'jGwO_UgTS7I', 'jbx6tJf7kWY', 'lqDvikbLThM', 'mOLnYfZRYXA', 'nA-YSbzx6g8',
  'nB7KDrH_HzI', 'nM4e3Qcv7XU', 'oQOvIFM4nZc', 'qw76qfN5xXg', 'rBg5Pd8xjMA',
  'rZ3tY9n8cEA', 'rk9qBOGSLdM', 's3rYDqT7x8I', 'vL7gXqKJ8qc', 'v_mS-z7QGqw',
  'wMSB2oLqoJE', 'xSxBjXJrOdE', 'xdKb_m8mOjs', 'xkh3nTVvlYA', 'yR-_S0bqYsg',
  'zOPA0NaeTBk', 'zyxmjJGIjqY'
]);

interface ValidationCache {
  [videoId: string]: {
    isValid: boolean;
    checkedAt: number;
  };
}

interface FailedVideosStore {
  videoIds: string[];
  lastUpdated: number;
}

// Get failed videos from localStorage + known failed list
export const getFailedVideos = (): Set<string> => {
  // Start with known failed videos
  const failed = new Set(KNOWN_FAILED_VIDEO_IDS);

  // Add any runtime-detected failures from localStorage
  try {
    const stored = localStorage.getItem(FAILED_VIDEOS_KEY);
    if (stored) {
      const data: FailedVideosStore = JSON.parse(stored);
      data.videoIds.forEach(id => failed.add(id));
    }
  } catch (e) {
    console.warn('Failed to load failed videos from storage:', e);
  }

  return failed;
};

// Add a video to the failed list
export const markVideoAsFailed = (videoId: string): void => {
  try {
    const failed = getFailedVideos();
    failed.add(videoId);
    const data: FailedVideosStore = {
      videoIds: Array.from(failed),
      lastUpdated: Date.now(),
    };
    localStorage.setItem(FAILED_VIDEOS_KEY, JSON.stringify(data));
    console.warn(`Video marked as failed: ${videoId}`);
  } catch (e) {
    console.warn('Failed to save failed video:', e);
  }
};

// Remove a video from the failed list (if it starts working again)
export const markVideoAsWorking = (videoId: string): void => {
  try {
    const failed = getFailedVideos();
    failed.delete(videoId);
    const data: FailedVideosStore = {
      videoIds: Array.from(failed),
      lastUpdated: Date.now(),
    };
    localStorage.setItem(FAILED_VIDEOS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to update failed video:', e);
  }
};

// Check if a video is in the failed list
export const isVideoFailed = (videoId: string): boolean => {
  return getFailedVideos().has(videoId);
};

// Get validation cache
const getValidationCache = (): ValidationCache => {
  try {
    const stored = localStorage.getItem(VALIDATION_CACHE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load validation cache:', e);
  }
  return {};
};

// Save validation cache
const saveValidationCache = (cache: ValidationCache): void => {
  try {
    localStorage.setItem(VALIDATION_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Failed to save validation cache:', e);
  }
};

// Extract YouTube video ID from URL or embed URL
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

// Check if a YouTube video is embeddable using oEmbed
export const checkVideoEmbeddable = async (videoId: string): Promise<boolean> => {
  // Check cache first
  const cache = getValidationCache();
  const cached = cache[videoId];
  if (cached && Date.now() - cached.checkedAt < CACHE_DURATION) {
    return cached.isValid;
  }

  try {
    // Use YouTube oEmbed API to check if video is embeddable
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { method: 'HEAD' }
    );

    const isValid = response.ok;

    // Update cache
    cache[videoId] = { isValid, checkedAt: Date.now() };
    saveValidationCache(cache);

    if (!isValid) {
      markVideoAsFailed(videoId);
    }

    return isValid;
  } catch (e) {
    // Network error - don't mark as failed, just return false
    console.warn(`Failed to validate video ${videoId}:`, e);
    return false;
  }
};

// Validate multiple videos in batch
export const validateVideos = async (videoIds: string[]): Promise<Map<string, boolean>> => {
  const results = new Map<string, boolean>();

  // Check cache and failed list first
  const cache = getValidationCache();
  const failed = getFailedVideos();
  const toCheck: string[] = [];

  for (const videoId of videoIds) {
    if (failed.has(videoId)) {
      results.set(videoId, false);
    } else {
      const cached = cache[videoId];
      if (cached && Date.now() - cached.checkedAt < CACHE_DURATION) {
        results.set(videoId, cached.isValid);
      } else {
        toCheck.push(videoId);
      }
    }
  }

  // Check remaining videos (limit concurrency)
  const batchSize = 5;
  for (let i = 0; i < toCheck.length; i += batchSize) {
    const batch = toCheck.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (videoId) => {
        const isValid = await checkVideoEmbeddable(videoId);
        return { videoId, isValid };
      })
    );

    for (const { videoId, isValid } of batchResults) {
      results.set(videoId, isValid);
    }
  }

  return results;
};

// Filter an array of videos to only include valid ones
export const filterValidVideos = <T extends { id: string; embedUrl?: string }>(
  videos: T[]
): T[] => {
  const failed = getFailedVideos();
  return videos.filter(video => {
    // Check if video ID is in failed list
    if (failed.has(video.id)) {
      return false;
    }

    // Check if YouTube video ID is in failed list
    if (video.embedUrl) {
      const ytId = extractYouTubeId(video.embedUrl);
      if (ytId && failed.has(ytId)) {
        return false;
      }
    }

    return true;
  });
};

// Report a video error from the player
export const reportVideoError = (videoId: string, embedUrl?: string): void => {
  markVideoAsFailed(videoId);

  // Also mark the YouTube ID if different
  if (embedUrl) {
    const ytId = extractYouTubeId(embedUrl);
    if (ytId && ytId !== videoId) {
      markVideoAsFailed(ytId);
    }
  }
};

// Clear all failed videos (for testing/reset)
export const clearFailedVideos = (): void => {
  localStorage.removeItem(FAILED_VIDEOS_KEY);
  localStorage.removeItem(VALIDATION_CACHE_KEY);
};

// Get stats about failed videos
export const getValidationStats = (): { failedCount: number; failedIds: string[] } => {
  const failed = getFailedVideos();
  return {
    failedCount: failed.size,
    failedIds: Array.from(failed),
  };
};

export default {
  getFailedVideos,
  markVideoAsFailed,
  markVideoAsWorking,
  isVideoFailed,
  checkVideoEmbeddable,
  validateVideos,
  filterValidVideos,
  reportVideoError,
  clearFailedVideos,
  getValidationStats,
  extractYouTubeId,
};
