import { useState, useCallback, useRef, useEffect } from 'react';
import { YouTubePlayerRef } from '../components/tv/YouTubePlayer';

interface UseYouTubePlayerOptions {
  videoId: string;
  startTime?: number;
  livePosition?: number; // Where "live" is in the video
  autoplay?: boolean;
}

interface UseYouTubePlayerReturn {
  // Player ref to pass to YouTubePlayer component
  playerRef: React.RefObject<YouTubePlayerRef>;

  // State
  isReady: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isLive: boolean;
  currentTime: number;
  duration: number;
  livePosition: number;
  behindLive: number;

  // Actions
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  restart: () => void;
  rewind: (seconds: number) => void;
  goLive: () => void;
  toggleMute: () => void;
  isMuted: boolean;

  // Event handlers for YouTubePlayer
  onReady: () => void;
  onStateChange: (state: number) => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
}

// How close to "live" is considered live (in seconds)
const LIVE_THRESHOLD = 5;

export function useYouTubePlayer({
  videoId,
  startTime = 0,
  livePosition: initialLivePosition,
  autoplay = true,
}: UseYouTubePlayerOptions): UseYouTubePlayerReturn {
  const playerRef = useRef<YouTubePlayerRef>(null);

  // State
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(!autoplay);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Live position tracking
  const [livePosition, setLivePosition] = useState(initialLivePosition || startTime);
  const liveStartTimeRef = useRef(Date.now());

  // Update live position in real-time
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - liveStartTimeRef.current) / 1000;
      const newLivePosition = Math.min(duration, startTime + elapsed);
      setLivePosition(newLivePosition);
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, startTime, duration]);

  // Calculate if we're "live"
  const behindLive = Math.max(0, livePosition - currentTime);
  const isLive = behindLive <= LIVE_THRESHOLD;

  // Actions
  const play = useCallback(() => {
    playerRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds);
    setCurrentTime(seconds);
  }, []);

  const restart = useCallback(() => {
    seekTo(0);
    play();
  }, [seekTo, play]);

  const rewind = useCallback(
    (seconds: number) => {
      const newTime = Math.max(0, currentTime - seconds);
      seekTo(newTime);
    },
    [currentTime, seekTo]
  );

  const goLive = useCallback(() => {
    seekTo(livePosition);
    play();
  }, [livePosition, seekTo, play]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;

    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, []);

  // Event handlers
  const onReady = useCallback(() => {
    setIsReady(true);
    liveStartTimeRef.current = Date.now();

    if (playerRef.current) {
      setDuration(playerRef.current.getDuration());
      setIsMuted(playerRef.current.isMuted());
    }
  }, []);

  const onStateChange = useCallback((state: number) => {
    // YouTube player states:
    // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
    switch (state) {
      case 1: // Playing
        setIsPlaying(true);
        setIsPaused(false);
        break;
      case 2: // Paused
        setIsPlaying(false);
        setIsPaused(true);
        break;
      case 0: // Ended
        setIsPlaying(false);
        setIsPaused(false);
        break;
      default:
        break;
    }
  }, []);

  const onTimeUpdate = useCallback((time: number, dur: number) => {
    setCurrentTime(time);
    if (dur > 0) {
      setDuration(dur);
    }
  }, []);

  return {
    playerRef,
    isReady,
    isPlaying,
    isPaused,
    isLive,
    currentTime,
    duration,
    livePosition,
    behindLive,
    play,
    pause,
    seekTo,
    restart,
    rewind,
    goLive,
    toggleMute,
    isMuted,
    onReady,
    onStateChange,
    onTimeUpdate,
  };
}

export default useYouTubePlayer;
