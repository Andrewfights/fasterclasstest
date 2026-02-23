import { UserLibrary, UserPlaylist, WatchHistoryItem } from '../types';

const LIBRARY_STORAGE_KEY = 'fasterclass_library';

const getDefaultLibrary = (): UserLibrary => ({
  savedVideos: [],
  playlists: [],
  watchHistory: [],
});

class LibraryService {
  private library: UserLibrary;

  constructor() {
    this.library = this.loadLibrary();
  }

  private loadLibrary(): UserLibrary {
    try {
      const stored = localStorage.getItem(LIBRARY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load library:', e);
    }
    return getDefaultLibrary();
  }

  private saveLibrary(): void {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(this.library));
    } catch (e) {
      console.error('Failed to save library:', e);
    }
  }

  getLibrary(): UserLibrary {
    return { ...this.library };
  }

  // Saved Videos
  getSavedVideos(): string[] {
    return [...this.library.savedVideos];
  }

  isVideoSaved(videoId: string): boolean {
    return this.library.savedVideos.includes(videoId);
  }

  saveVideo(videoId: string): void {
    if (!this.library.savedVideos.includes(videoId)) {
      this.library.savedVideos.push(videoId);
      this.saveLibrary();
    }
  }

  unsaveVideo(videoId: string): void {
    this.library.savedVideos = this.library.savedVideos.filter(id => id !== videoId);
    this.saveLibrary();
  }

  toggleSaveVideo(videoId: string): boolean {
    if (this.isVideoSaved(videoId)) {
      this.unsaveVideo(videoId);
      return false;
    } else {
      this.saveVideo(videoId);
      return true;
    }
  }

  // Playlists
  getPlaylists(): UserPlaylist[] {
    return [...this.library.playlists];
  }

  getPlaylist(playlistId: string): UserPlaylist | undefined {
    return this.library.playlists.find(p => p.id === playlistId);
  }

  createPlaylist(title: string, description?: string): UserPlaylist {
    const playlist: UserPlaylist = {
      id: `playlist_${Date.now()}`,
      title,
      description,
      videoIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.library.playlists.push(playlist);
    this.saveLibrary();
    return playlist;
  }

  updatePlaylist(playlistId: string, updates: Partial<Pick<UserPlaylist, 'title' | 'description'>>): void {
    const playlist = this.library.playlists.find(p => p.id === playlistId);
    if (playlist) {
      if (updates.title !== undefined) playlist.title = updates.title;
      if (updates.description !== undefined) playlist.description = updates.description;
      playlist.updatedAt = Date.now();
      this.saveLibrary();
    }
  }

  deletePlaylist(playlistId: string): void {
    this.library.playlists = this.library.playlists.filter(p => p.id !== playlistId);
    this.saveLibrary();
  }

  addVideoToPlaylist(playlistId: string, videoId: string): void {
    const playlist = this.library.playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.videoIds.includes(videoId)) {
      playlist.videoIds.push(videoId);
      playlist.updatedAt = Date.now();
      this.saveLibrary();
    }
  }

  removeVideoFromPlaylist(playlistId: string, videoId: string): void {
    const playlist = this.library.playlists.find(p => p.id === playlistId);
    if (playlist) {
      playlist.videoIds = playlist.videoIds.filter(id => id !== videoId);
      playlist.updatedAt = Date.now();
      this.saveLibrary();
    }
  }

  reorderPlaylistVideos(playlistId: string, videoIds: string[]): void {
    const playlist = this.library.playlists.find(p => p.id === playlistId);
    if (playlist) {
      playlist.videoIds = videoIds;
      playlist.updatedAt = Date.now();
      this.saveLibrary();
    }
  }

  // Watch History
  getWatchHistory(): WatchHistoryItem[] {
    return [...this.library.watchHistory].sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);
  }

  getVideoProgress(videoId: string): WatchHistoryItem | undefined {
    return this.library.watchHistory.find(h => h.videoId === videoId);
  }

  updateVideoProgress(videoId: string, timestamp: number, completed: boolean = false): void {
    const existing = this.library.watchHistory.find(h => h.videoId === videoId);
    if (existing) {
      existing.timestamp = timestamp;
      existing.lastWatchedAt = Date.now();
      existing.completed = completed || existing.completed;
    } else {
      this.library.watchHistory.push({
        videoId,
        timestamp,
        lastWatchedAt: Date.now(),
        completed,
      });
    }
    this.saveLibrary();
  }

  markVideoCompleted(videoId: string): void {
    const existing = this.library.watchHistory.find(h => h.videoId === videoId);
    if (existing) {
      existing.completed = true;
      existing.lastWatchedAt = Date.now();
    } else {
      this.library.watchHistory.push({
        videoId,
        timestamp: 0,
        lastWatchedAt: Date.now(),
        completed: true,
      });
    }
    this.saveLibrary();
  }

  getContinueWatching(): WatchHistoryItem[] {
    return this.library.watchHistory
      .filter(h => !h.completed && h.timestamp > 0)
      .sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);
  }

  clearWatchHistory(): void {
    this.library.watchHistory = [];
    this.saveLibrary();
  }

  // Stats
  getStats() {
    return {
      savedCount: this.library.savedVideos.length,
      playlistCount: this.library.playlists.length,
      watchedCount: this.library.watchHistory.filter(h => h.completed).length,
      inProgressCount: this.library.watchHistory.filter(h => !h.completed && h.timestamp > 0).length,
    };
  }
}

export const libraryService = new LibraryService();
