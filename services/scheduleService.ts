import { FastChannel, Video } from '../types';
import { FAST_CHANNELS, INITIAL_VIDEOS } from '../constants';

// ============================================
// TYPES
// ============================================

export interface ScheduleBlock {
  id: string;
  channelId: string;
  videoId: string;
  video: Video;
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

export interface CurrentPlayback {
  block: ScheduleBlock;
  startOffset: number;    // Seconds into the video
  remaining: number;      // Seconds until video ends
  progress: number;       // 0-100 percentage
}

// ============================================
// CONSTANTS
// ============================================

// Time anchor: All schedules sync to this epoch
// Using a fixed date ensures all clients calculate the same position
const SCHEDULE_ANCHOR = new Date('2024-01-01T00:00:00Z').getTime() / 1000;

const STORAGE_KEY = 'fasterclass_schedules';

// ============================================
// SCHEDULE SERVICE
// ============================================

class ScheduleService {
  private config: ScheduleConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  // Load saved config from localStorage
  private loadConfig(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.config = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load schedule config:', e);
    }
  }

  // Save config to localStorage
  private saveConfig(): void {
    if (this.config) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    }
  }

  // Get schedule config for a channel
  getChannelConfig(channelId: string): ChannelScheduleConfig | null {
    return this.config?.channels?.[channelId] || null;
  }

  // Set schedule config for a channel
  setChannelConfig(channelId: string, config: Partial<ChannelScheduleConfig>): void {
    if (!this.config) {
      this.config = {
        channels: {},
        updatedAt: Date.now(),
      };
    }

    this.config.channels[channelId] = {
      channelId,
      mode: 'auto',
      loopAfterEnd: true,
      ...this.config.channels[channelId],
      ...config,
    };
    this.config.updatedAt = Date.now();
    this.saveConfig();
  }

  // Calculate what's playing on a channel right now
  getCurrentPlayback(channelId: string): CurrentPlayback | null {
    const channel = FAST_CHANNELS.find(c => c.id === channelId);
    if (!channel) return null;

    const config = this.getChannelConfig(channelId);

    // If custom mode with blocks, use those
    if (config?.mode === 'custom' && config.customBlocks?.length) {
      return this.getCustomCurrentPlayback(config.customBlocks);
    }

    // Otherwise use auto-loop mode
    return this.getAutoLoopPlayback(channel);
  }

  // Auto-loop: Calculate position based on time-anchored loop
  private getAutoLoopPlayback(channel: FastChannel): CurrentPlayback | null {
    const videos = channel.videoIds
      .map(id => INITIAL_VIDEOS.find(v => v.id === id))
      .filter(Boolean) as Video[];

    if (videos.length === 0) return null;

    const totalDuration = videos.reduce((acc, v) => acc + v.duration, 0);
    const now = Date.now() / 1000;

    // Calculate position in the loop based on anchor time
    const elapsed = now - SCHEDULE_ANCHOR;
    const loopPosition = elapsed % totalDuration;

    let accumulated = 0;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      if (accumulated + video.duration > loopPosition) {
        const startOffset = loopPosition - accumulated;
        const remaining = video.duration - startOffset;
        const startTime = now - startOffset;
        const endTime = startTime + video.duration;

        return {
          block: {
            id: `auto-${channel.id}-${i}`,
            channelId: channel.id,
            videoId: video.id,
            video,
            startTime,
            endTime,
          },
          startOffset,
          remaining,
          progress: (startOffset / video.duration) * 100,
        };
      }
      accumulated += video.duration;
    }

    // Fallback to first video
    const video = videos[0];
    return {
      block: {
        id: `auto-${channel.id}-0`,
        channelId: channel.id,
        videoId: video.id,
        video,
        startTime: now,
        endTime: now + video.duration,
      },
      startOffset: 0,
      remaining: video.duration,
      progress: 0,
    };
  }

  // Custom: Find the block playing at the current time
  private getCustomCurrentPlayback(blocks: ScheduleBlock[]): CurrentPlayback | null {
    const now = Date.now() / 1000;

    const currentBlock = blocks.find(b => b.startTime <= now && b.endTime > now);
    if (!currentBlock) return null;

    const startOffset = now - currentBlock.startTime;
    const remaining = currentBlock.endTime - now;
    const duration = currentBlock.endTime - currentBlock.startTime;

    return {
      block: currentBlock,
      startOffset,
      remaining,
      progress: (startOffset / duration) * 100,
    };
  }

  // Generate EPG slots for a time range
  getScheduleRange(
    channelId: string,
    startTime: Date,
    endTime: Date
  ): ScheduleBlock[] {
    const channel = FAST_CHANNELS.find(c => c.id === channelId);
    if (!channel) return [];

    const config = this.getChannelConfig(channelId);

    // If custom mode with blocks, filter to range
    if (config?.mode === 'custom' && config.customBlocks?.length) {
      const start = startTime.getTime() / 1000;
      const end = endTime.getTime() / 1000;
      return config.customBlocks.filter(b =>
        (b.startTime >= start && b.startTime < end) ||
        (b.endTime > start && b.endTime <= end) ||
        (b.startTime <= start && b.endTime >= end)
      );
    }

    // Auto-loop: Generate schedule for the range
    return this.generateAutoSchedule(channel, startTime, endTime);
  }

  // Generate auto-loop schedule for a time range
  private generateAutoSchedule(
    channel: FastChannel,
    startTime: Date,
    endTime: Date
  ): ScheduleBlock[] {
    const videos = channel.videoIds
      .map(id => INITIAL_VIDEOS.find(v => v.id === id))
      .filter(Boolean) as Video[];

    if (videos.length === 0) return [];

    const blocks: ScheduleBlock[] = [];
    const totalDuration = videos.reduce((acc, v) => acc + v.duration, 0);

    const startTs = startTime.getTime() / 1000;
    const endTs = endTime.getTime() / 1000;

    // Find where we are in the loop at startTime
    const elapsedAtStart = startTs - SCHEDULE_ANCHOR;
    const loopPositionAtStart = elapsedAtStart % totalDuration;

    // Find starting video index
    let accumulated = 0;
    let startIndex = 0;
    let firstBlockOffset = 0;

    for (let i = 0; i < videos.length; i++) {
      if (accumulated + videos[i].duration > loopPositionAtStart) {
        startIndex = i;
        firstBlockOffset = loopPositionAtStart - accumulated;
        break;
      }
      accumulated += videos[i].duration;
    }

    // Generate blocks
    let currentTime = startTs - firstBlockOffset;
    let videoIndex = startIndex;
    let blockCount = 0;

    while (currentTime < endTs && blockCount < 100) { // Safety limit
      const video = videos[videoIndex % videos.length];
      const blockStart = currentTime;
      const blockEnd = currentTime + video.duration;

      // Only include if it overlaps with our range
      if (blockEnd > startTs) {
        blocks.push({
          id: `auto-${channel.id}-${blockCount}`,
          channelId: channel.id,
          videoId: video.id,
          video,
          startTime: blockStart,
          endTime: blockEnd,
        });
      }

      currentTime = blockEnd;
      videoIndex++;
      blockCount++;
    }

    return blocks;
  }

  // Get upcoming videos on a channel
  getUpcoming(channelId: string, count: number = 5): ScheduleBlock[] {
    const now = new Date();
    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const blocks = this.getScheduleRange(channelId, now, future);
    const nowTs = now.getTime() / 1000;

    // Filter to only future blocks
    return blocks
      .filter(b => b.startTime > nowTs)
      .slice(0, count);
  }

  // Save custom schedule blocks for a channel
  setCustomSchedule(channelId: string, blocks: ScheduleBlock[]): void {
    this.setChannelConfig(channelId, {
      mode: 'custom',
      customBlocks: blocks,
    });
  }

  // Switch channel to auto mode
  setAutoMode(channelId: string): void {
    this.setChannelConfig(channelId, {
      mode: 'auto',
      customBlocks: undefined,
    });
  }

  // Clear all custom schedules
  resetToDefaults(): void {
    this.config = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export config
  exportConfig(): ScheduleConfig | null {
    return this.config;
  }

  // Import config
  importConfig(config: ScheduleConfig): void {
    this.config = config;
    this.saveConfig();
  }
}

// Singleton instance
export const scheduleService = new ScheduleService();

// ============================================
// HELPER FUNCTIONS
// ============================================

// Format time for EPG display
export function formatEPGTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Get schedule blocks for EPG grid (3 hours default)
export function getEPGBlocks(
  channelId: string,
  hoursAhead: number = 3
): ScheduleBlock[] {
  const now = new Date();
  // Start 30 minutes ago to show current program
  const start = new Date(now.getTime() - 30 * 60 * 1000);
  const end = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  return scheduleService.getScheduleRange(channelId, start, end);
}

// Check if a block is currently playing
export function isBlockPlaying(block: ScheduleBlock): boolean {
  const now = Date.now() / 1000;
  return block.startTime <= now && block.endTime > now;
}

// Check if a block is in the future
export function isBlockFuture(block: ScheduleBlock): boolean {
  const now = Date.now() / 1000;
  return block.startTime > now;
}

// Calculate playback offset for syncing
export function getPlaybackOffset(block: ScheduleBlock): number {
  const now = Date.now() / 1000;
  if (now < block.startTime) return 0;
  if (now > block.endTime) return block.endTime - block.startTime;
  return now - block.startTime;
}
