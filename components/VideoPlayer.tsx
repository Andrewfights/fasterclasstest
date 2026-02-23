import React, { useState, useEffect, useRef } from 'react';
import { Video, Playlist } from '../types';
import { getYoutubeId } from '../constants';
import { SkipBack, SkipForward, X, Lock, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  playlist: Playlist;
  initialVideoIndex: number;
  videos: Video[]; // Full library to lookup details
  onBack: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const STORAGE_KEY = 'fasterclass_video_progress';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playlist, initialVideoIndex, videos, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(initialVideoIndex);
  const [apiReady, setApiReady] = useState(false);
  // Track watched status to update UI immediately
  const [watchedMap, setWatchedMap] = useState<Record<string, boolean>>({});
  
  const playerRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Resolve current video object
  const currentVideoId = playlist.videoIds[currentIndex];
  const currentVideo = videos.find(v => v.id === currentVideoId);

  // Load progress data on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const map: Record<string, boolean> = {};
      Object.keys(stored).forEach(key => {
        if (stored[key].watched) map[key] = true;
      });
      setWatchedMap(map);
    } catch (e) {
      console.error("Failed to load progress", e);
    }
  }, []);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = () => setApiReady(true);
    } else {
      setApiReady(true);
    }
  }, []);

  // Helpers
  const saveProgress = (time: number, duration: number, watched: boolean) => {
    if (!currentVideo) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    stored[currentVideo.id] = {
      timestamp: time,
      duration: duration,
      watched: watched || stored[currentVideo.id]?.watched, // Don't unwatch
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    
    if (watched) {
      setWatchedMap(prev => ({ ...prev, [currentVideo.id]: true }));
    }
  };

  const startTracking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        saveProgress(time, duration, false);
      }
    }, 5000);
  };

  const stopTracking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Initialize Player when video or API changes
  useEffect(() => {
    if (!currentVideo) return;
    
    stopTracking();

    if (currentVideo.platform === 'youtube' && apiReady) {
       const videoId = getYoutubeId(currentVideo.url);
       if (!videoId) return;

       const timeoutId = setTimeout(() => {
         if (playerRef.current && playerRef.current.destroy) {
            try {
              playerRef.current.destroy();
            } catch (e) {
              console.error(e);
            }
         }

         playerRef.current = new window.YT.Player('youtube-player-container', {
           height: '100%',
           width: '100%',
           videoId: videoId,
           playerVars: {
             autoplay: 1,
             modestbranding: 1,
             rel: 0,
             playsinline: 1,
             origin: window.location.origin // FIX: Required to prevent 153 errors on some videos
           },
           events: {
             onReady: (event: any) => {
               const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
               const data = stored[currentVideo.id];
               if (data && !data.watched && data.timestamp > 5) {
                 event.target.seekTo(data.timestamp);
               }
               event.target.playVideo();
             },
             onStateChange: (event: any) => {
               // 1 = playing, 0 = ended
               if (event.data === 1) {
                 startTracking();
               } else if (event.data === 0) {
                 stopTracking();
                 saveProgress(0, 0, true);
               } else {
                 stopTracking();
               }
             }
           }
         });
       }, 100);

       return () => {
         clearTimeout(timeoutId);
         stopTracking();
         if (playerRef.current && playerRef.current.destroy) {
           try {
              playerRef.current.destroy();
           } catch (e) { console.error(e); }
         }
       };
    }
  }, [currentVideo, apiReady]);

  const handleNext = () => {
    if (currentIndex < playlist.videoIds.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentVideo) return <div className="text-white p-10">Video not found</div>;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <button onClick={onBack} className="pointer-events-auto text-white/80 hover:text-white flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition-all">
            <X className="w-5 h-5" /> <span className="text-sm font-medium">Close</span>
          </button>
        </div>

        {/* Video Frame */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <div className="w-full h-full md:p-8 flex items-center justify-center">
            {/* Conditional aspect ratio based on video orientation */}
            {currentVideo.isVertical ? (
              // Vertical Video (9:16 aspect ratio)
              <div className="relative h-full max-h-[85vh] aspect-[9/16] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                {currentVideo.platform === 'youtube' ? (
                  <div key={currentVideo.id} id="youtube-player-container" className="w-full h-full" />
                ) : (
                  <iframe
                    src={`${currentVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={currentVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              // Horizontal Video (16:9 aspect ratio)
              <div className="relative w-full h-full max-h-[80vh] aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                {currentVideo.platform === 'youtube' ? (
                  <div key={currentVideo.id} id="youtube-player-container" className="w-full h-full" />
                ) : (
                  <iframe
                    src={`${currentVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={currentVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Controls / Info */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 md:hidden">
          <h2 className="text-lg font-bold text-white mb-1 line-clamp-1">{currentVideo.title}</h2>
          <p className="text-indigo-400 text-sm mb-4">{currentVideo.expert}</p>
          <div className="flex justify-between">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="p-3 bg-slate-800 rounded-full disabled:opacity-50">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={handleNext} disabled={currentIndex === playlist.videoIds.length - 1} className="p-3 bg-indigo-600 rounded-full disabled:opacity-50 text-white">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="hidden md:flex w-96 bg-slate-950 border-l border-slate-800 flex-col z-20">
        <div className="p-6 border-b border-slate-800 bg-slate-950">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Current Playlist</h3>
          <h2 className="text-xl font-bold text-white leading-tight">{playlist.title}</h2>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
             {/* Simple playlist progress bar */}
             <div 
               className="h-full bg-indigo-500 transition-all duration-500" 
               style={{ width: `${(Object.keys(watchedMap).filter(id => playlist.videoIds.includes(id)).length / playlist.videoIds.length) * 100}%` }} 
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {playlist.videoIds.map((vidId, idx) => {
             const vid = videos.find(v => v.id === vidId);
             if (!vid) return null;
             
             const isActive = idx === currentIndex;
             const isLocked = playlist.locked && idx > 2;
             const isWatched = watchedMap[vidId];

             return (
               <button
                 key={vidId}
                 onClick={() => !isLocked && setCurrentIndex(idx)}
                 className={`w-full text-left p-4 border-b border-slate-900/50 hover:bg-slate-900 transition-colors flex gap-3 group relative ${isActive ? 'bg-slate-900' : ''}`}
               >
                 <div className="relative w-24 h-16 flex-shrink-0">
                    <img src={vid.thumbnail} alt="" className={`w-full h-full object-cover rounded-md ${isLocked ? 'opacity-30' : ''}`} />
                    {isActive && !isLocked && (
                      <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center rounded-md">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                        <Lock className="w-4 h-4 text-white/70" />
                      </div>
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium mb-0.5 line-clamp-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {vid.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{vid.expert}</p>
                    {isWatched && (
                       <div className="flex items-center mt-1 text-emerald-500 text-[10px] font-medium">
                         <CheckCircle className="w-3 h-3 mr-1" /> Watched
                       </div>
                    )}
                 </div>
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;