import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Info, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { FastChannel, ChannelSchedule, Video } from '../../types';
import { FAST_CHANNELS, INITIAL_VIDEOS, getYoutubeId } from '../../constants';
import { NowPlaying } from './NowPlaying';
import { ChannelStrip } from './ChannelStrip';
import { EPGGuide } from './EPGGuide';

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

      // Get upcoming videos
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

  // Fallback to first video
  return {
    channelId: channel.id,
    currentVideo: channelVideos[0],
    startOffset: 0,
    remaining: channelVideos[0].duration,
    nextVideo: channelVideos[1] || channelVideos[0],
    upcomingVideos: channelVideos.slice(1, 6),
  };
};

export const FastChannelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentChannel, setCurrentChannel] = useState<FastChannel>(FAST_CHANNELS[0]);
  const [schedule, setSchedule] = useState<ChannelSchedule | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showEPG, setShowEPG] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [channelSwitching, setChannelSwitching] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update schedule periodically
  useEffect(() => {
    const updateSchedule = () => {
      const newSchedule = getChannelSchedule(currentChannel, INITIAL_VIDEOS);
      setSchedule(newSchedule);
    };

    updateSchedule();
    const interval = setInterval(updateSchedule, 1000);
    return () => clearInterval(interval);
  }, [currentChannel]);

  // Auto-hide overlay after inactivity
  useEffect(() => {
    const resetHideTimer = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      setShowOverlay(true);
      hideTimeoutRef.current = setTimeout(() => {
        if (!showEPG && !showInfo) {
          setShowOverlay(false);
        }
      }, 4000);
    };

    resetHideTimer();

    const handleMouseMove = () => resetHideTimer();
    const handleKeyDown = () => resetHideTimer();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showEPG, showInfo]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = FAST_CHANNELS.findIndex(c => c.id === currentChannel.id);

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            switchChannel(FAST_CHANNELS[currentIndex - 1]);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < FAST_CHANNELS.length - 1) {
            switchChannel(FAST_CHANNELS[currentIndex + 1]);
          }
          break;
        case 'g':
        case 'G':
          setShowEPG(prev => !prev);
          setShowInfo(false);
          break;
        case 'i':
        case 'I':
          setShowInfo(prev => !prev);
          setShowEPG(false);
          break;
        case 'm':
        case 'M':
          setIsMuted(prev => !prev);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (showEPG) {
            setShowEPG(false);
          } else if (showInfo) {
            setShowInfo(false);
          } else if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
        default:
          // Number keys for direct channel access
          const num = parseInt(e.key);
          if (num >= 1 && num <= FAST_CHANNELS.length) {
            switchChannel(FAST_CHANNELS[num - 1]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChannel, showEPG, showInfo, isFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const switchChannel = useCallback((channel: FastChannel) => {
    if (channel.id === currentChannel.id) return;

    setChannelSwitching(true);
    setCurrentChannel(channel);

    // Brief animation for channel switch
    setTimeout(() => {
      setChannelSwitching(false);
    }, 500);
  }, [currentChannel]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleChannelSelect = (channel: FastChannel) => {
    switchChannel(channel);
    setShowEPG(false);
  };

  // Build YouTube URL with start time
  const getVideoUrl = () => {
    if (!schedule) return '';
    const videoId = getYoutubeId(schedule.currentVideo.url);
    const startTime = Math.floor(schedule.startOffset);
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&start=${startTime}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50"
      onMouseMove={() => setShowOverlay(true)}
    >
      {/* Video Player */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${channelSwitching ? 'opacity-0' : 'opacity-100'}`}>
        {schedule && (
          <iframe
            ref={playerRef}
            src={getVideoUrl()}
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
            <span className="text-6xl mb-4 block">{currentChannel.logo}</span>
            <span className="text-2xl font-bold text-white">{currentChannel.name}</span>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Exit</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(prev => !prev)}
              className={`p-3 rounded-xl transition-colors ${showInfo ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
              title="Info (I)"
            >
              <Info size={20} />
            </button>
            <button
              onClick={() => setShowEPG(prev => !prev)}
              className={`p-3 rounded-xl transition-colors ${showEPG ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
              title="Guide (G)"
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Mute (M)"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Now Playing Overlay */}
      {schedule && !showEPG && (
        <NowPlaying
          channel={currentChannel}
          schedule={schedule}
          visible={showOverlay}
        />
      )}

      {/* Channel Strip */}
      {!showEPG && (
        <ChannelStrip
          channels={FAST_CHANNELS}
          currentChannel={currentChannel}
          onChannelSelect={handleChannelSelect}
          visible={showOverlay}
          videos={INITIAL_VIDEOS}
        />
      )}

      {/* EPG Guide */}
      {showEPG && (
        <EPGGuide
          channels={FAST_CHANNELS}
          currentChannel={currentChannel}
          onChannelSelect={handleChannelSelect}
          onClose={() => setShowEPG(false)}
          videos={INITIAL_VIDEOS}
        />
      )}

      {/* Info Panel */}
      {showInfo && schedule && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
          <div className="max-w-2xl mx-4 p-8 bg-[#1A1A24] rounded-2xl border border-white/10">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-4xl">{currentChannel.logo}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-500 text-xs font-bold rounded">LIVE</span>
                  <span className="text-[#9CA3AF] text-sm">{currentChannel.name}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{schedule.currentVideo.title}</h2>
                <p className="text-[#9CA3AF]">with {schedule.currentVideo.expert}</p>
              </div>
            </div>
            <p className="text-[#9CA3AF] mb-6">{currentChannel.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                <span className="text-white font-medium">Up Next:</span>
                <span>{schedule.nextVideo.title}</span>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Hints */}
      {showOverlay && !showEPG && !showInfo && (
        <div className="absolute bottom-4 right-4 text-xs text-white/40 space-x-4">
          <span>↑↓ Channels</span>
          <span>G Guide</span>
          <span>I Info</span>
          <span>1-0 Direct</span>
        </div>
      )}
    </div>
  );
};
