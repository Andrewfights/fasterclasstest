import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from './LibraryContext';

interface PiPVideoData {
  videoId: string;
  embedUrl: string;
  title: string;
  expert: string;
  thumbnail: string;
  duration: number;
  isLive?: boolean;
  channelId?: string;
  startTime?: number;
}

interface PiPState {
  isActive: boolean;
  video: PiPVideoData | null;
  currentTime: number;
  isPlaying: boolean;
  isMinimized: boolean;
}

interface PiPContextType {
  // State
  isActive: boolean;
  video: PiPVideoData | null;
  currentTime: number;
  isPlaying: boolean;
  isMinimized: boolean;
  // Actions
  enablePiP: (videoData: PiPVideoData) => void;
  disablePiP: () => void;
  updateCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleMinimize: () => void;
  expandToFull: () => void;
}

const PiPContext = createContext<PiPContextType | undefined>(undefined);

export const PiPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { updateVideoProgress } = useLibrary();

  const [state, setState] = useState<PiPState>({
    isActive: false,
    video: null,
    currentTime: 0,
    isPlaying: false,
    isMinimized: false,
  });

  const enablePiP = useCallback((videoData: PiPVideoData) => {
    setState({
      isActive: true,
      video: videoData,
      currentTime: videoData.startTime || 0,
      isPlaying: true,
      isMinimized: false,
    });
  }, []);

  const disablePiP = useCallback(() => {
    // Save progress before closing
    if (state.video && !state.video.isLive) {
      updateVideoProgress(state.video.videoId, state.currentTime, false);
    }
    setState({
      isActive: false,
      video: null,
      currentTime: 0,
      isPlaying: false,
      isMinimized: false,
    });
  }, [state.video, state.currentTime, updateVideoProgress]);

  const updateCurrentTime = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
    // Also update library progress periodically
    if (state.video && !state.video.isLive) {
      updateVideoProgress(state.video.videoId, time, false);
    }
  }, [state.video, updateVideoProgress]);

  const setIsPlaying = useCallback((playing: boolean) => {
    setState(prev => ({ ...prev, isPlaying: playing }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const expandToFull = useCallback(() => {
    if (state.video) {
      const { videoId, isLive, channelId } = state.video;
      const currentTime = Math.floor(state.currentTime);

      // Close PiP first
      setState({
        isActive: false,
        video: null,
        currentTime: 0,
        isPlaying: false,
        isMinimized: false,
      });

      // Navigate to full player
      if (isLive && channelId) {
        navigate('/live');
      } else {
        navigate(`/watch/${videoId}?t=${currentTime}`);
      }
    }
  }, [state.video, state.currentTime, navigate]);

  return (
    <PiPContext.Provider
      value={{
        isActive: state.isActive,
        video: state.video,
        currentTime: state.currentTime,
        isPlaying: state.isPlaying,
        isMinimized: state.isMinimized,
        enablePiP,
        disablePiP,
        updateCurrentTime,
        setIsPlaying,
        toggleMinimize,
        expandToFull,
      }}
    >
      {children}
    </PiPContext.Provider>
  );
};

export const usePiP = (): PiPContextType => {
  const context = useContext(PiPContext);
  if (!context) {
    throw new Error('usePiP must be used within a PiPProvider');
  }
  return context;
};

export default PiPContext;
