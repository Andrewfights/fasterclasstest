import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserLibrary, UserPlaylist, WatchHistoryItem } from '../types';
import { libraryService } from '../services/libraryService';

interface LibraryContextType {
  library: UserLibrary;
  // Saved Videos
  savedVideos: string[];
  isVideoSaved: (videoId: string) => boolean;
  toggleSaveVideo: (videoId: string) => void;
  // Favorites
  favorites: string[];
  isFavorited: (videoId: string) => boolean;
  toggleFavorite: (videoId: string) => void;
  // Playlists
  playlists: UserPlaylist[];
  getPlaylist: (playlistId: string) => UserPlaylist | undefined;
  createPlaylist: (title: string, description?: string) => UserPlaylist;
  updatePlaylist: (playlistId: string, updates: Partial<Pick<UserPlaylist, 'title' | 'description'>>) => void;
  deletePlaylist: (playlistId: string) => void;
  addVideoToPlaylist: (playlistId: string, videoId: string) => void;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  // Watch History
  watchHistory: WatchHistoryItem[];
  getVideoProgress: (videoId: string) => WatchHistoryItem | undefined;
  updateVideoProgress: (videoId: string, timestamp: number, completed?: boolean) => void;
  markVideoCompleted: (videoId: string) => void;
  continueWatching: WatchHistoryItem[];
  // Refresh
  refresh: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<UserLibrary>(() => libraryService.getLibrary());

  const refresh = useCallback(() => {
    setLibrary(libraryService.getLibrary());
  }, []);

  // Saved Videos
  const isVideoSaved = useCallback((videoId: string) => {
    return library.savedVideos.includes(videoId);
  }, [library.savedVideos]);

  const toggleSaveVideo = useCallback((videoId: string) => {
    libraryService.toggleSaveVideo(videoId);
    refresh();
  }, [refresh]);

  // Favorites
  const isFavorited = useCallback((videoId: string) => {
    return libraryService.isFavorited(videoId);
  }, [library.favorites]);

  const toggleFavorite = useCallback((videoId: string) => {
    libraryService.toggleFavorite(videoId);
    refresh();
  }, [refresh]);

  // Playlists
  const getPlaylist = useCallback((playlistId: string) => {
    return library.playlists.find(p => p.id === playlistId);
  }, [library.playlists]);

  const createPlaylist = useCallback((title: string, description?: string) => {
    const playlist = libraryService.createPlaylist(title, description);
    refresh();
    return playlist;
  }, [refresh]);

  const updatePlaylist = useCallback((playlistId: string, updates: Partial<Pick<UserPlaylist, 'title' | 'description'>>) => {
    libraryService.updatePlaylist(playlistId, updates);
    refresh();
  }, [refresh]);

  const deletePlaylist = useCallback((playlistId: string) => {
    libraryService.deletePlaylist(playlistId);
    refresh();
  }, [refresh]);

  const addVideoToPlaylist = useCallback((playlistId: string, videoId: string) => {
    libraryService.addVideoToPlaylist(playlistId, videoId);
    refresh();
  }, [refresh]);

  const removeVideoFromPlaylist = useCallback((playlistId: string, videoId: string) => {
    libraryService.removeVideoFromPlaylist(playlistId, videoId);
    refresh();
  }, [refresh]);

  // Watch History
  const getVideoProgress = useCallback((videoId: string) => {
    return library.watchHistory.find(h => h.videoId === videoId);
  }, [library.watchHistory]);

  const updateVideoProgress = useCallback((videoId: string, timestamp: number, completed?: boolean) => {
    libraryService.updateVideoProgress(videoId, timestamp, completed);
    refresh();
  }, [refresh]);

  const markVideoCompleted = useCallback((videoId: string) => {
    libraryService.markVideoCompleted(videoId);
    refresh();
  }, [refresh]);

  const continueWatching = library.watchHistory
    .filter(h => !h.completed && h.timestamp > 0)
    .sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);

  const value: LibraryContextType = {
    library,
    savedVideos: library.savedVideos,
    isVideoSaved,
    toggleSaveVideo,
    favorites: library.favorites || [],
    isFavorited,
    toggleFavorite,
    playlists: library.playlists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    watchHistory: library.watchHistory,
    getVideoProgress,
    updateVideoProgress,
    markVideoCompleted,
    continueWatching,
    refresh,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
