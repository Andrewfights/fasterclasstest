import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy: () => void;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number) => void;
}

export interface YouTubePlayerRef {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  play: () => void;
  pause: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
}

interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  autoplay?: boolean;
  muted?: boolean;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (error: number) => void;
  className?: string;
}

// Load YouTube IFrame API
let apiLoaded = false;
let apiLoading = false;
const loadCallbacks: (() => void)[] = [];

const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (apiLoaded) {
      resolve();
      return;
    }

    loadCallbacks.push(resolve);

    if (apiLoading) {
      return;
    }

    apiLoading = true;

    // Set up callback
    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };

    // Load script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });
};

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  (
    {
      videoId,
      startTime = 0,
      autoplay = true,
      muted = false,
      onReady,
      onStateChange,
      onTimeUpdate,
      onError,
      className = '',
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const timeUpdateRef = useRef<number | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Expose player methods via ref
    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        playerRef.current?.seekTo(seconds, true);
      },
      getCurrentTime: () => {
        return playerRef.current?.getCurrentTime() || 0;
      },
      getDuration: () => {
        return playerRef.current?.getDuration() || 0;
      },
      play: () => {
        playerRef.current?.playVideo();
      },
      pause: () => {
        playerRef.current?.pauseVideo();
      },
      mute: () => {
        playerRef.current?.mute();
      },
      unMute: () => {
        playerRef.current?.unMute();
      },
      isMuted: () => {
        return playerRef.current?.isMuted() || false;
      },
    }));

    // Time update loop
    const startTimeUpdate = useCallback(() => {
      if (timeUpdateRef.current) return;

      const update = () => {
        if (playerRef.current && onTimeUpdate) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          onTimeUpdate(currentTime, duration);
        }
        timeUpdateRef.current = requestAnimationFrame(update);
      };
      timeUpdateRef.current = requestAnimationFrame(update);
    }, [onTimeUpdate]);

    const stopTimeUpdate = useCallback(() => {
      if (timeUpdateRef.current) {
        cancelAnimationFrame(timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
    }, []);

    // Initialize player
    useEffect(() => {
      let mounted = true;
      let player: YTPlayer | null = null;

      const initPlayer = async () => {
        await loadYouTubeAPI();

        if (!mounted || !containerRef.current) return;

        // Create container element
        const containerId = `youtube-player-${Math.random().toString(36).substr(2, 9)}`;
        const div = document.createElement('div');
        div.id = containerId;
        containerRef.current.appendChild(div);

        player = new window.YT.Player(containerId, {
          videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            start: Math.floor(startTime),
            mute: muted ? 1 : 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (!mounted) return;
              playerRef.current = event.target;
              setIsReady(true);
              onReady?.();
              if (autoplay) {
                startTimeUpdate();
              }
            },
            onStateChange: (event) => {
              if (!mounted) return;
              onStateChange?.(event.data);

              // Start/stop time updates based on play state
              if (event.data === window.YT.PlayerState.PLAYING) {
                startTimeUpdate();
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                stopTimeUpdate();
              }
            },
            onError: (event) => {
              onError?.(event.data);
            },
          },
        });
      };

      initPlayer();

      return () => {
        mounted = false;
        stopTimeUpdate();
        if (player) {
          player.destroy();
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }, []); // Only run once on mount

    // Handle video changes
    useEffect(() => {
      if (isReady && playerRef.current && videoId) {
        playerRef.current.loadVideoById(videoId, Math.floor(startTime));
      }
    }, [videoId, startTime, isReady]);

    // Handle mute changes
    useEffect(() => {
      if (isReady && playerRef.current) {
        if (muted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      }
    }, [muted, isReady]);

    return (
      <div
        ref={containerRef}
        className={`w-full h-full ${className}`}
        style={{ pointerEvents: 'none' }}
      />
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
