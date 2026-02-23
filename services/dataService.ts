import { Video, Playlist, DataExport } from '../types';
import { INITIAL_VIDEOS, INITIAL_PLAYLISTS } from '../constants';

const VIDEOS_STORAGE_KEY = 'fasterclass_videos';
const PLAYLISTS_STORAGE_KEY = 'fasterclass_playlists';
const DATA_VERSION_KEY = 'fasterclass_data_version';

// Increment this when content structure changes to force a reset
const CURRENT_DATA_VERSION = '2.0-curriculum';

export const dataService = {
  // Check if data version matches, reset if outdated
  checkAndMigrateData(): void {
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
    if (storedVersion !== CURRENT_DATA_VERSION) {
      // Clear old data and reset to new defaults
      this.clearAll();
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
    }
  },

  // Videos
  getVideos(): Video[] {
    this.checkAndMigrateData();
    try {
      const stored = localStorage.getItem(VIDEOS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure we have valid data
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [...INITIAL_VIDEOS];
    } catch {
      return [...INITIAL_VIDEOS];
    }
  },

  saveVideos(videos: Video[]): void {
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
  },

  // Playlists
  getPlaylists(): Playlist[] {
    this.checkAndMigrateData();
    try {
      const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [...INITIAL_PLAYLISTS];
    } catch {
      return [...INITIAL_PLAYLISTS];
    }
  },

  savePlaylists(playlists: Playlist[]): void {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  },

  // Export all data as JSON string
  exportData(): string {
    const data: DataExport = {
      videos: this.getVideos(),
      playlists: this.getPlaylists(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  // Import data from JSON string
  importData(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);

      if (!data.videos || !Array.isArray(data.videos)) {
        return { success: false, error: 'Invalid data format: missing videos array' };
      }

      if (!data.playlists || !Array.isArray(data.playlists)) {
        return { success: false, error: 'Invalid data format: missing playlists array' };
      }

      this.saveVideos(data.videos);
      this.savePlaylists(data.playlists);

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to parse JSON file' };
    }
  },

  // Reset to initial/default data
  resetToDefaults(): void {
    this.saveVideos([...INITIAL_VIDEOS]);
    this.savePlaylists([...INITIAL_PLAYLISTS]);
  },

  // Clear all stored data
  clearAll(): void {
    localStorage.removeItem(VIDEOS_STORAGE_KEY);
    localStorage.removeItem(PLAYLISTS_STORAGE_KEY);
  },

  // Check if using stored data or defaults
  hasStoredData(): boolean {
    return localStorage.getItem(VIDEOS_STORAGE_KEY) !== null ||
           localStorage.getItem(PLAYLISTS_STORAGE_KEY) !== null;
  }
};
