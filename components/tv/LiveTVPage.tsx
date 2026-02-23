import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Volume2, VolumeX, Maximize, Info, ArrowUp, ArrowDown, RotateCcw, Radio } from 'lucide-react';
import { CategorySidebar, SidebarCategory } from '../shared/CategorySidebar';
import { EPGGrid } from './EPGGrid';
import { FastChannel, ChannelSchedule, Video } from '../../types';
import { FAST_CHANNELS, INITIAL_VIDEOS, LIVE_TV_CATEGORIES, getYoutubeId, formatDuration } from '../../constants';

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

export const LiveTVPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentChannel, setCurrentChannel] = useState<FastChannel>(FAST_CHANNELS[0]);
  const [schedule, setSchedule] = useState<ChannelSchedule | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [channelSwitching, setChannelSwitching] = useState(false);
  const [isLive, setIsLive] = useState(true); // DVR state - are we watching live?
  const [dvrStartOffset, setDvrStartOffset] = useState<number | null>(null); // Custom start position
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter channels by category
  const filteredChannels = useMemo(() => {
    const category = LIVE_TV_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return FAST_CHANNELS;
    return FAST_CHANNELS.filter(category.filter);
  }, [selectedCategory]);

  // Convert live TV categories to sidebar format
  const sidebarCategories: SidebarCategory[] = useMemo(() => {
    return LIVE_TV_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: FAST_CHANNELS.filter(cat.filter).length,
    }));
  }, []);

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
          setIsMuted(prev => !prev);
          break;
        case 'i':
        case 'I':
          setShowInfo(prev => !prev);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
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
  }, [currentChannel, filteredChannels]);

  const switchChannel = useCallback((channel: FastChannel) => {
    if (channel.id === currentChannel.id) return;

    setChannelSwitching(true);
    setCurrentChannel(channel);
    // Reset DVR state when switching channels
    setIsLive(true);
    setDvrStartOffset(null);

    setTimeout(() => {
      setChannelSwitching(false);
    }, 500);
  }, [currentChannel]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
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

  // Memoize YouTube URL - only changes when video or mute state changes
  // Start parameter syncs playback to the "broadcast" position
  const videoUrl = useMemo(() => {
    if (!currentVideoId || !schedule) return '';
    const videoId = getYoutubeId(schedule.currentVideo.url);
    // Use dvrStartOffset if set (restart mode), otherwise use live position
    const startTime = dvrStartOffset !== null ? dvrStartOffset : initialStartOffset;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startTime}&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`;
  }, [currentVideoId, initialStartOffset, dvrStartOffset, isMuted, schedule?.currentVideo?.url]);

  const progress = schedule
    ? ((schedule.currentVideo.duration - schedule.remaining) / schedule.currentVideo.duration) * 100
    : 0;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0D0D12] pt-14">
      <div className="flex">
        {/* Left Sidebar - Channel Categories */}
        <div className="fixed left-0 top-14 bottom-0 z-40">
          <CategorySidebar
            categories={sidebarCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            title="Channels"
            accentColor="#F5C518"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-56">
          {/* Video Player Section */}
          <div className="relative bg-black">
            <div className="aspect-video max-h-[50vh] relative">
              {/* Video Player */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${channelSwitching ? 'opacity-0' : 'opacity-100'}`}>
                {schedule && videoUrl && (
                  <iframe
                    key={currentVideoId} // Only recreate iframe when video changes
                    src={videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
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
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
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
                      onClick={() => setIsMuted(prev => !prev)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Mute (M)"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
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
              <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-white/40">
                <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" /><ArrowDown className="w-3 h-3" /> Channels</span>
                <span>M Mute</span>
                <span>F Fullscreen</span>
              </div>
            </div>
          </div>

          {/* EPG Grid */}
          <div className="border-t border-[#1E1E2E]">
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
