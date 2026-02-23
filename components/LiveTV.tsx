import React, { useState, useEffect, useRef } from 'react';
import { Channel, Video } from '../types';
import { getYoutubeId } from '../constants';
import { Play, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';

interface LiveTVProps {
  channels: Channel[];
  videos: Video[];
}

// Global Youtube API declaration
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const LiveTV: React.FC<LiveTVProps> = ({ channels, videos }) => {
  const [activeChannelId, setActiveChannelId] = useState(channels[0].id);
  const [isMuted, setIsMuted] = useState(true); // Auto-play usually requires mute first
  const [playerReady, setPlayerReady] = useState(false);
  const [currentProgramInfo, setCurrentProgramInfo] = useState<{ videoId: string, startOffset: number, nextVideoId: string } | null>(null);
  
  // Ref to hold the player instance
  const playerRef = useRef<any>(null);
  // Ref to refresh EPG UI
  const [currentTime, setCurrentTime] = useState(Date.now());

  const activeChannel = channels.find(c => c.id === activeChannelId);

  // --- SCHEDULING LOGIC ---
  const getScheduleForChannel = (channel: Channel) => {
    const channelVideos = channel.videoIds.map(vidId => videos.find(v => v.id === vidId)).filter(Boolean) as Video[];
    if (channelVideos.length === 0) return null;

    const totalDuration = channelVideos.reduce((acc, v) => acc + (v.duration || 600), 0);
    const now = Date.now() / 1000; // seconds
    const loopTime = totalDuration > 0 ? now % totalDuration : 0;

    let accumulatedTime = 0;
    for (let i = 0; i < channelVideos.length; i++) {
      const video = channelVideos[i];
      const duration = video.duration || 600;
      
      if (accumulatedTime + duration > loopTime) {
        // This is the current video
        const startOffset = loopTime - accumulatedTime;
        const remaining = duration - startOffset;
        const nextIndex = (i + 1) % channelVideos.length;
        return {
          currentVideo: video,
          startOffset: startOffset, // Where to seek to
          remaining: remaining,
          nextVideo: channelVideos[nextIndex]
        };
      }
      accumulatedTime += duration;
    }
    // Fallback if math fails (shouldn't happen with totalDuration > 0)
    return {
       currentVideo: channelVideos[0],
       startOffset: 0,
       remaining: channelVideos[0].duration || 600,
       nextVideo: channelVideos[1] || channelVideos[0]
    };
  };

  // --- EPG UPDATER ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- PLAYER INIT ---
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = () => setPlayerReady(true);
    } else {
      setPlayerReady(true);
    }
  }, []);

  // --- CLEANUP ---
  useEffect(() => {
    return () => {
       if(playerRef.current && typeof playerRef.current.destroy === 'function') {
         try {
           playerRef.current.destroy();
         } catch(e) { console.error('Error destroying player', e); }
       }
    };
  }, []);

  // --- CHANNEL SWITCHING & PLAYBACK SYNC ---
  useEffect(() => {
    if (!activeChannel || !playerReady) return;

    const schedule = getScheduleForChannel(activeChannel);
    if (!schedule) return;

    setCurrentProgramInfo({
      videoId: schedule.currentVideo.id,
      startOffset: schedule.startOffset,
      nextVideoId: schedule.nextVideo.id
    });

    const ytVideoId = getYoutubeId(schedule.currentVideo.url);

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      // Player exists, load new video
      try {
        playerRef.current.loadVideoById({
          videoId: ytVideoId,
          startSeconds: schedule.startOffset
        });
      } catch (e) {
        console.error("Error loading video", e);
      }
    } else if (window.YT && window.YT.Player) {
      // Initialize Player
      try {
        // Destroy existing instance if it's a DOM element but not a player
        if(playerRef.current) {
            try { playerRef.current.destroy(); } catch(e) {}
        }

        playerRef.current = new window.YT.Player('tv-player', {
          height: '100%',
          width: '100%',
          videoId: ytVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0, // TV style: no controls
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            start: Math.floor(schedule.startOffset),
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              event.target.mute(); // Ensure autoplay works
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              // If video ends (0), play next
              if (event.data === 0) {
                handleVideoEnd();
              }
            },
            onError: (e: any) => {
               console.error("Player Error", e);
            }
          }
        });
      } catch (e) {
        console.error("Error creating player", e);
      }
    }
  }, [activeChannelId, playerReady]);

  const handleVideoEnd = () => {
    if (activeChannel && playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        const schedule = getScheduleForChannel(activeChannel);
        if (schedule) {
            const ytVideoId = getYoutubeId(schedule.currentVideo.url);
            playerRef.current.loadVideoById({
                videoId: ytVideoId,
                startSeconds: schedule.startOffset
            });
        }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-950 overflow-hidden">
      {/* TOP: TV PLAYER AREA */}
      <div className="relative w-full aspect-video md:h-[60vh] bg-black shadow-2xl z-10 shrink-0">
        <div id="tv-player" className="w-full h-full pointer-events-none" /> {/* Disable clicks on iframe */}
        
        {/* TV Overlay Controls */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
           <div className="absolute bottom-8 left-8 text-white pointer-events-auto">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-md">{activeChannel?.name}</h1>
              {activeChannel && (() => {
                 const sched = getScheduleForChannel(activeChannel);
                 return sched ? (
                     <div>
                        <h2 className="text-xl font-medium text-indigo-300 mb-1">{sched.currentVideo.title}</h2>
                        <p className="text-sm text-slate-300 flex items-center gap-2">
                           <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
                           {sched.currentVideo.expert}
                        </p>
                     </div>
                 ) : null;
              })()}
           </div>
           
           <button 
             onClick={toggleMute}
             className="absolute bottom-8 right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white pointer-events-auto transition-all"
           >
             {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
           </button>
        </div>
        
        {/* Static noise overlay when loading (optional visual flair) */}
        {!playerReady && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <div className="animate-pulse text-slate-500">Connecting to satellite...</div>
            </div>
        )}
      </div>

      {/* BOTTOM: CHANNEL GUIDE (EPG) */}
      <div className="flex-1 bg-slate-900 border-t border-slate-800 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto">
           {/* Header */}
           <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Guide</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
           </div>

           {/* Channels List */}
           <div className="divide-y divide-slate-800/50">
             {channels.map(channel => {
                const isActive = channel.id === activeChannelId;
                const schedule = getScheduleForChannel(channel);
                if (!schedule) return null;
                
                const progressPercent = (schedule.startOffset / (schedule.currentVideo.duration || 600)) * 100;

                return (
                  <div 
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                    className={`group relative flex items-center h-20 px-4 cursor-pointer transition-all hover:bg-slate-800 ${isActive ? 'bg-slate-800 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                  >
                    {/* Logo Column */}
                    <div className="w-16 shrink-0 flex flex-col items-center justify-center mr-4">
                       <span className="text-2xl mb-1">{channel.logo}</span>
                    </div>

                    {/* Info Column */}
                    <div className="flex-1 min-w-0 pr-4">
                       <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`font-bold truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                             {channel.name}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">
                             Next: {schedule.nextVideo.title.substring(0, 20)}...
                          </span>
                       </div>
                       
                       <p className="text-sm text-indigo-400 font-medium truncate mb-1">
                          {schedule.currentVideo.title}
                       </p>
                       
                       {/* Progress Bar */}
                       <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isActive ? 'bg-indigo-500' : 'bg-slate-600'}`} 
                            style={{ width: `${progressPercent}%` }}
                          />
                       </div>
                    </div>

                    {/* Play Button Indicator */}
                    <div className={`shrink-0 opacity-0 group-hover:opacity-100 ${isActive ? 'opacity-100' : ''} transition-opacity`}>
                        {isActive ? (
                             <div className="flex items-end gap-0.5 h-4">
                                <div className="w-1 bg-indigo-500 animate-[bounce_1s_infinite] h-2"></div>
                                <div className="w-1 bg-indigo-500 animate-[bounce_1.2s_infinite] h-4"></div>
                                <div className="w-1 bg-indigo-500 animate-[bounce_0.8s_infinite] h-3"></div>
                             </div>
                        ) : (
                             <Play className="w-6 h-6 text-slate-400" />
                        )}
                    </div>
                  </div>
                );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTV;