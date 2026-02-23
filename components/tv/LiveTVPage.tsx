import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Maximize, Info, ArrowUp, ArrowDown, RotateCcw, Radio, PictureInPicture2, RectangleHorizontal } from 'lucide-react';
import { CategorySidebar, SidebarCategory } from '../shared/CategorySidebar';
import { EPGGrid } from './EPGGrid';
import { FastChannel, ChannelSchedule, Video } from '../../types';
import { FAST_CHANNELS, INITIAL_VIDEOS, LIVE_TV_CATEGORIES, getYoutubeId, formatDuration } from '../../constants';
import { usePiP } from '../../contexts/PiPContext';
import { useLibrary } from '../../contexts/LibraryContext';

// Calculate which video is playing and at what offset for a channel
const getChannelSchedule = (channel: FastChannel, videos: Video[]): ChannelSchedule | null => {
  const channelVideos = channel.videoIds
    .map(id => videos.find(v => v.id === id))
    .filter(Boolean) as Video[];

  if (channelVideos.length === 0) return null;

  const totalDuration = channelVideos.reduce((acc, v) => acc + v.duration, 0);
  const now = Date.now() / 1000;
  const loopPosition = now % totalDuration;

  let accumulated = 0;
  for (let i = 0; i < channelVideos.length; i++) {
    const video = channelVideos[i];
    if (accumulated + video.duration > loopPosition) {
      const startOffset = loopPosition - accumulated;
      const remaining = video.duration - startOffset;

      const upcoming: Video[] = [];
      for (let j = 1; j <= 5; j++) {
        upcoming.push(channelVideos[(i + j) % channelVideos.length]);
      }

      return {
        channelId: channel.id,
        currentVideo: video,
        startOffset,
        remaining,
        nextVideo: channelVideos[(i + 1) % channelVideos.length],
        upcomingVideos: upcoming,
      };
    }
    accumulated += video.duration;
  }

  return {
    channelId: channel.id,
    currentVideo: channelVideos[0],
    startOffset: 0,
    remaining: channelVideos[0].duration,
    nextVideo: channelVideos[1] || channelVideos[0],
    upcomingVideos: channelVideos.slice(1, 6),
  };
};

// Auto-hide delay for overlay
const OVERLAY_HIDE_DELAY = 5000;

// LocalStorage key for remembering last channel
const LAST_CHANNEL_KEY = 'fasterclass_last_live_channel';

// Get saved channel from localStorage
const getSavedChannel = (): FastChannel => {
  try {
    const saved = localStorage.getItem(LAST_CHANNEL_KEY);
    if (saved) {
      const channel = FAST_CHANNELS.find(c => c.id === saved);
      if (channel) return channel;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return FAST_CHANNELS[0];
};

export const LiveTVPage: React.FC = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentChannel, setCurrentChannel] = useState<FastChannel>(getSavedChannel);
  const [schedule, setSchedule] = useState<ChannelSchedule | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [channelSwitching, setChannelSwitching] = useState(false);
  const [isLive, setIsLive] = useState(true); // DVR state - are we watching live?
  const [dvrStartOffset, setDvrStartOffset] = useState<number | null>(null); // Custom start position
  const [isTheaterMode, setIsTheaterMode] = useState(false); // Theater mode state
  const [showOverlay, setShowOverlay] = useState(true); // Auto-hide overlay state
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigatingAwayRef = useRef(false); // Track if we're actually leaving the page
  const scheduleRef = useRef<ChannelSchedule | null>(null); // Store schedule for cleanup
  const channelRef = useRef<FastChannel>(currentChannel); // Store channel for cleanup
  const dvrOffsetRef = useRef<number | null>(null); // Store DVR offset for cleanup
  const enablePiPRef = useRef(enablePiP); // Store enablePiP for cleanup
  const isPiPActiveRef = useRef(isPiPActive); // Store isPiPActive for cleanup
  const { enablePiP, disablePiP, isActive: isPiPActive } = usePiP();
  const { playlists } = useLibrary();

  // Convert user playlists to virtual FastChannel objects
  const userChannels: FastChannel[] = useMemo(() => {
    return playlists
      .filter(p => p.videoIds.length > 0)
      .map((playlist, index) => ({
        id: `user-${playlist.id}`,
        number: 90 + index, // User channels start at 90
        name: playlist.title,
        shortName: playlist.title.slice(0, 3).toUpperCase(),
        description: playlist.description || 'Your personal playlist',
        category: 'mixed' as const,
        logo: '⭐',
        color: playlist.color || '#c9a227',
        videoIds: playlist.videoIds,
        isLive: false,
      }));
  }, [playlists]);

  // All channels including user channels
  const allChannels = useMemo(() => {
    return [...FAST_CHANNELS, ...userChannels];
  }, [userChannels]);

  // Keep refs in sync with state
  scheduleRef.current = schedule;
  channelRef.current = currentChannel;
  dvrOffsetRef.current = dvrStartOffset;
  enablePiPRef.current = enablePiP;
  isPiPActiveRef.current = isPiPActive;

  // Send command to YouTube player via postMessage (no reload needed)
  const sendPlayerCommand = useCallback((command: string, args?: unknown) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: args ? [args] : [] }),
        '*'
      );
    }
  }, []);

  // Handle mute toggle via YouTube API (no reload)
  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      sendPlayerCommand(newMuted ? 'mute' : 'unMute');
      return newMuted;
    });
  }, [sendPlayerCommand]);

  // Skip to next video in channel when current video is unavailable
  const skipToNextVideo = useCallback(() => {
    if (!schedule) return;
    // Force update to next video by advancing the time check
    const newSchedule = getChannelSchedule(currentChannel, INITIAL_VIDEOS);
    if (newSchedule && newSchedule.nextVideo) {
      setCurrentVideoId(newSchedule.nextVideo.id);
      setInitialStartOffset(0);
      setIsLive(true);
      setDvrStartOffset(null);
    }
  }, [schedule, currentChannel]);

  // Listen for YouTube player errors via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only handle YouTube messages
      if (!event.origin.includes('youtube.com')) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // YouTube sends error codes: 2 (invalid param), 5 (HTML5 error), 100 (not found), 101/150 (embed disabled)
        if (data.event === 'onError' || (data.info && data.info.playerState === -1)) {
          console.log('YouTube video unavailable, skipping to next...');
          skipToNextVideo();
        }
      } catch {
        // Not a JSON message, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [skipToNextVideo]);

  // Auto-hide overlay logic
  const startHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, OVERLAY_HIDE_DELAY);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowOverlay(true);
    startHideTimer();
  }, [startHideTimer]);

  // Start hide timer on mount and when video changes
  useEffect(() => {
    startHideTimer();
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [currentChannel, startHideTimer]);

  // Show overlay on channel switch
  useEffect(() => {
    if (channelSwitching) {
      setShowOverlay(true);
      startHideTimer();
    }
  }, [channelSwitching, startHideTimer]);

  // Filter channels by category
  const filteredChannels = useMemo(() => {
    // Handle My Channels category
    if (selectedCategory === 'my-channels') {
      return userChannels;
    }
    const category = LIVE_TV_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return allChannels;
    return FAST_CHANNELS.filter(category.filter);
  }, [selectedCategory, userChannels, allChannels]);

  // Convert live TV categories to sidebar format
  const sidebarCategories: SidebarCategory[] = useMemo(() => {
    const standardCategories = LIVE_TV_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: FAST_CHANNELS.filter(cat.filter).length,
    }));

    // Add My Channels category if user has playlists with videos
    if (userChannels.length > 0) {
      return [
        ...standardCategories,
        {
          id: 'my-channels',
          name: 'My Channels',
          count: userChannels.length,
        },
      ];
    }

    return standardCategories;
  }, [userChannels]);

  // Track current video ID and its initial start offset to detect actual video changes
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [initialStartOffset, setInitialStartOffset] = useState<number>(0);

  // Update schedule periodically (reduced from 1 second to prevent flickering)
  useEffect(() => {
    const updateSchedule = () => {
      const newSchedule = getChannelSchedule(currentChannel, INITIAL_VIDEOS);
      setSchedule(newSchedule);
      // Only update video ID and capture start offset when video actually changes
      if (newSchedule && newSchedule.currentVideo.id !== currentVideoId) {
        setCurrentVideoId(newSchedule.currentVideo.id);
        // Capture the start offset only when video changes - this syncs playback
        setInitialStartOffset(Math.floor(newSchedule.startOffset));
      }
    };

    updateSchedule();
    const interval = setInterval(updateSchedule, 10000); // 10 seconds instead of 1
    return () => clearInterval(interval);
  }, [currentChannel, currentVideoId]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = filteredChannels.findIndex(c => c.id === currentChannel.id);

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            switchChannel(filteredChannels[currentIndex - 1]);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < filteredChannels.length - 1) {
            switchChannel(filteredChannels[currentIndex + 1]);
          }
          break;
        case 'm':
        case 'M':
          handleMuteToggle();
          break;
        case 'i':
        case 'I':
          setShowInfo(prev => !prev);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 't':
        case 'T':
          setIsTheaterMode(prev => !prev);
          break;
        default:
          const num = parseInt(e.key);
          if (num >= 1 && num <= filteredChannels.length) {
            switchChannel(filteredChannels[num - 1]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChannel, filteredChannels, handleMuteToggle]);

  const switchChannel = useCallback((channel: FastChannel) => {
    if (channel.id === currentChannel.id) return;

    setChannelSwitching(true);
    setCurrentChannel(channel);
    // Reset DVR state when switching channels
    setIsLive(true);
    setDvrStartOffset(null);

    // Save to localStorage for persistence
    try {
      localStorage.setItem(LAST_CHANNEL_KEY, channel.id);
    } catch (e) {
      // Ignore localStorage errors
    }

    setTimeout(() => {
      setChannelSwitching(false);
    }, 500);
  }, [currentChannel]);

  const toggleFullscreen = useCallback(() => {
    // Use playerRef for fullscreen (just the video area, not whole page)
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen().catch(err => {
        // Fallback to container if player fullscreen fails
        if (containerRef.current) {
          containerRef.current.requestFullscreen();
        }
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  // DVR: Restart from beginning
  const handleRestart = useCallback(() => {
    setDvrStartOffset(0);
    setIsLive(false);
    // Force iframe reload by updating currentVideoId
    setCurrentVideoId(prev => prev + '-restart-' + Date.now());
  }, []);

  // DVR: Go back to live
  const handleGoLive = useCallback(() => {
    setDvrStartOffset(null);
    setIsLive(true);
    // Force iframe reload to sync to live position
    if (schedule) {
      setInitialStartOffset(Math.floor(schedule.startOffset));
      setCurrentVideoId(prev => prev?.replace(/-restart-.*/, '') || prev);
    }
  }, [schedule]);

  // Enable Picture-in-Picture
  const handleEnablePiP = useCallback(() => {
    if (schedule && !isPiPActive) {
      const currentVideo = schedule.currentVideo;
      enablePiP({
        videoId: currentVideo.id,
        embedUrl: currentVideo.embedUrl,
        title: currentVideo.title,
        expert: currentVideo.expert,
        thumbnail: currentVideo.thumbnail,
        duration: currentVideo.duration,
        startTime: dvrStartOffset !== null ? dvrStartOffset : Math.floor(schedule.startOffset),
        isLive: true,
        channelId: currentChannel.id,
      });
    }
  }, [schedule, currentChannel, dvrStartOffset, enablePiP, isPiPActive]);

  // Track when we're navigating away (not just switching channels)
  useEffect(() => {
    // When location changes (component unmounts from route change), set the flag
    return () => {
      isNavigatingAwayRef.current = true;
    };
  }, [location.pathname]);

  // Auto-enable PiP when navigating away from Live TV page (not on channel switch)
  useEffect(() => {
    return () => {
      // Only enable PiP if we're actually navigating away, not just switching channels
      // Use refs to get current values at cleanup time
      if (isNavigatingAwayRef.current && scheduleRef.current && !isPiPActiveRef.current) {
        const currentVideo = scheduleRef.current.currentVideo;
        enablePiPRef.current({
          videoId: currentVideo.id,
          embedUrl: currentVideo.embedUrl,
          title: currentVideo.title,
          expert: currentVideo.expert,
          thumbnail: currentVideo.thumbnail,
          duration: currentVideo.duration,
          startTime: dvrOffsetRef.current !== null ? dvrOffsetRef.current : Math.floor(scheduleRef.current.startOffset),
          isLive: true,
          channelId: channelRef.current.id,
        });
      }
    };
    // Run cleanup only on component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize YouTube URL - does NOT include mute state (controlled via API)
  // Start parameter syncs playback to the "broadcast" position
  const videoUrl = useMemo(() => {
    if (!currentVideoId || !schedule) return '';
    const videoId = getYoutubeId(schedule.currentVideo.url);
    // Use dvrStartOffset if set (restart mode), otherwise use live position
    const startTime = dvrStartOffset !== null ? dvrStartOffset : initialStartOffset;
    // Note: mute is controlled via postMessage API to avoid iframe reload
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startTime}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`;
  }, [currentVideoId, initialStartOffset, dvrStartOffset, schedule?.currentVideo?.url]);

  const progress = schedule
    ? ((schedule.currentVideo.duration - schedule.remaining) / schedule.currentVideo.duration) * 100
    : 0;

  return (
    <div ref={containerRef} className="bg-[#0D0D12] pt-14">
      <div className="flex">
        {/* Left Sidebar - Channel Categories - Hidden on mobile and in theater mode */}
        {!isTheaterMode && (
          <div className="fixed left-0 top-14 bottom-0 z-40 hidden lg:block">
            <CategorySidebar
              categories={sidebarCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              title="Channels"
              accentColor="#F5C518"
            />
          </div>
        )}

        {/* Main Content - Full width on mobile and in theater mode */}
        <main className={`flex-1 transition-all duration-300 ${isTheaterMode ? 'ml-0' : 'ml-0 lg:ml-56'}`}>
          {/* Video Player Section - Sticky on mobile, Centered */}
          <div className="sticky top-14 z-30 lg:relative lg:z-auto bg-black flex justify-center">
            <div className={`w-full max-w-7xl ${isTheaterMode ? '' : 'px-0 lg:px-4'}`}>
              <div
                ref={playerRef}
                className={`aspect-video relative transition-all duration-300 mx-auto ${isTheaterMode ? 'max-h-[80vh]' : 'max-h-[35vh] lg:max-h-[50vh]'}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseMove}
              >
              {/* Video Player - Paused when PiP is active */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${channelSwitching ? 'opacity-0' : 'opacity-100'}`}>
                {schedule && videoUrl && !isPiPActive && (
                  <iframe
                    ref={iframeRef}
                    key={currentVideoId} // Only recreate iframe when video changes
                    src={videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {isPiPActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-center">
                      <p className="text-white/60 mb-2">Playing in mini player</p>
                      <button
                        onClick={disablePiP}
                        className="px-4 py-2 bg-[#c9a227] text-black font-semibold rounded-lg"
                      >
                        Return to Full Screen
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Channel Switch Animation */}
              {channelSwitching && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <div className="text-center animate-pulse">
                    <span className="text-5xl mb-4 block">{currentChannel.logo}</span>
                    <span className="text-xl font-bold text-white">{currentChannel.name}</span>
                  </div>
                </div>
              )}

              {/* Now Playing Overlay */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-4">
                    {/* Channel Info */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: currentChannel.color + '40' }}
                    >
                      {currentChannel.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {isLive ? (
                          <span className="px-2 py-0.5 bg-red-500 text-[10px] font-bold rounded animate-pulse">LIVE</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500 text-[10px] font-bold rounded">DVR</span>
                        )}
                        <span className="text-white font-semibold">{currentChannel.name}</span>
                        <span className="text-white/40 text-sm">CH {currentChannel.number}</span>
                      </div>
                      {schedule && (
                        <>
                          <h3 className="text-lg font-semibold text-white">{schedule.currentVideo.title}</h3>
                          <p className="text-sm text-white/60">with {schedule.currentVideo.expert}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    {/* DVR Controls */}
                    <button
                      onClick={handleRestart}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Restart from beginning"
                    >
                      <RotateCcw className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={handleGoLive}
                      disabled={isLive}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                        isLive
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      title="Go to live"
                    >
                      <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
                      {isLive ? 'LIVE' : 'GO LIVE'}
                    </button>

                    <div className="w-px h-6 bg-white/20 mx-1" />

                    <button
                      onClick={() => setShowInfo(prev => !prev)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Info (I)"
                    >
                      <Info className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={handleMuteToggle}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Mute (M)"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                    </button>
                    <button
                      onClick={handleEnablePiP}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Mini Player"
                    >
                      <PictureInPicture2 className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setIsTheaterMode(prev => !prev)}
                      className={`p-2 rounded-lg transition-colors ${
                        isTheaterMode
                          ? 'bg-[#c9a227] text-black'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      title="Theater Mode (T)"
                    >
                      <RectangleHorizontal className={`w-5 h-5 ${isTheaterMode ? 'text-black' : 'text-white'}`} />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Fullscreen (F)"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {schedule && (
                  <div className="mt-3">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%`, backgroundColor: currentChannel.color }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-white/40">
                      <span>{formatDuration(Math.floor(schedule.currentVideo.duration - schedule.remaining))}</span>
                      <span>Up Next: {schedule.nextVideo.title}</span>
                      <span>{formatDuration(schedule.currentVideo.duration)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Keyboard hints */}
              <div className={`absolute top-4 right-4 flex items-center gap-2 text-xs text-white/40 transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
                <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" /><ArrowDown className="w-3 h-3" /> Channels</span>
                <span>M Mute</span>
                <span>T Theater</span>
                <span>F Fullscreen</span>
              </div>
              </div>
            </div>
          </div>

          {/* Mobile Category Pills - Sticky below player - Scrolls to section */}
          <div className="lg:hidden sticky top-[calc(35vh+56px)] z-20 bg-[#0D0D12] px-4 py-3 overflow-x-auto border-b border-[#1E1E2E]" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-2">
              {LIVE_TV_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    // Scroll to category section
                    const element = document.getElementById(`mobile-category-${cat.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#F5C518] text-black'
                      : 'bg-[#1E1E2E] text-white/70 hover:bg-[#2E2E3E]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Channel Guide - Pluto TV Style - Shows ALL channels grouped by category */}
          <div className="lg:hidden">
            <div className="px-4 py-2 flex items-center justify-between text-sm border-b border-[#1E1E2E] bg-[#0D0D12]">
              <span className="text-white/60">Now - {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
              <span className="text-[#F5C518]">Next →</span>
            </div>
            {/* Channel list - scrolls naturally with page */}
            <div className="pb-4">
              {LIVE_TV_CATEGORIES.filter(cat => cat.id !== 'all').map(category => {
                const categoryChannels = FAST_CHANNELS.filter(category.filter);
                if (categoryChannels.length === 0) return null;

                return (
                  <div key={category.id} id={`mobile-category-${category.id}`}>
                    {/* Category Header */}
                    <div className="px-4 py-2 bg-[#1A1A24] sticky top-0 z-10">
                      <span className="text-[#F5C518] text-xs font-semibold uppercase tracking-wider">
                        {category.name}
                      </span>
                    </div>
                    {/* Channels in this category */}
                    {categoryChannels.map(channel => {
                      const channelSchedule = getChannelSchedule(channel, INITIAL_VIDEOS);
                      const isSelected = channel.id === currentChannel.id;
                      const timeLeft = channelSchedule ? Math.floor(channelSchedule.remaining / 60) : 0;

                      return (
                        <button
                          key={channel.id}
                          onClick={() => switchChannel(channel)}
                          className={`w-full flex items-center gap-3 p-3 border-b border-[#1E1E2E] transition-colors ${
                            isSelected ? 'bg-[#F5C518]/10 border-l-2 border-l-[#F5C518]' : 'hover:bg-[#1E1E2E]'
                          }`}
                        >
                          {/* Channel Logo */}
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                            style={{ backgroundColor: channel.color + '30' }}
                          >
                            {channel.logo}
                          </div>

                          {/* Channel Name & Current Program */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold truncate">
                                {channel.name}
                              </span>
                              {isSelected && (
                                <span className="px-1.5 py-0.5 bg-red-500 text-[10px] font-bold rounded">LIVE</span>
                              )}
                            </div>
                            <div className="text-white/70 text-sm truncate">
                              {channelSchedule?.currentVideo.title || 'Loading...'}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-white/50 text-xs">{timeLeft}m left</span>
                              {/* Progress bar */}
                              {channelSchedule && (
                                <div className="flex-1 h-1 bg-[#2E2E3E] rounded-full overflow-hidden max-w-20">
                                  <div
                                    className="h-full bg-[#F5C518]"
                                    style={{
                                      width: `${((channelSchedule.currentVideo.duration - channelSchedule.remaining) / channelSchedule.currentVideo.duration) * 100}%`
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Next Program */}
                          <div className="text-right text-xs text-white/40 flex-shrink-0 max-w-24">
                            <div className="truncate">{channelSchedule?.nextVideo.title || 'Up next'}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* EPG Grid - Desktop only, Collapsed in theater mode */}
          <div className={`hidden lg:block border-t border-[#1E1E2E] transition-all duration-300 ${
            isTheaterMode ? 'max-h-[20vh] overflow-hidden' : ''
          }`}>
            <EPGGrid
              channels={filteredChannels}
              currentChannel={currentChannel}
              onChannelSelect={switchChannel}
              videos={INITIAL_VIDEOS}
            />
          </div>
        </main>
      </div>

      {/* Info Modal */}
      {showInfo && schedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="max-w-xl mx-4 p-6 bg-[#1A1A24] rounded-2xl border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{currentChannel.logo}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-500 text-xs font-bold rounded">LIVE</span>
                  <span className="text-[#9CA3AF] text-sm">{currentChannel.name}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{schedule.currentVideo.title}</h2>
                <p className="text-[#9CA3AF]">with {schedule.currentVideo.expert}</p>
              </div>
            </div>
            <p className="text-[#9CA3AF] mb-4">{currentChannel.description}</p>
            <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
              <span><strong className="text-white">Duration:</strong> {formatDuration(schedule.currentVideo.duration)}</span>
              <span><strong className="text-white">Up Next:</strong> {schedule.nextVideo.title}</span>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTVPage;
