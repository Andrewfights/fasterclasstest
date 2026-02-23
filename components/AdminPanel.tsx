import React, { useState, useRef } from 'react';
import { Video, Playlist } from '../types';
import { getYoutubeId } from '../constants';
import { Plus, Trash2, Video as VideoIcon, List, Download, Upload, RotateCcw, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';

interface AdminPanelProps {
  videos: Video[];
  playlists: Playlist[];
  setVideos: (videos: Video[]) => void;
  setPlaylists: (playlists: Playlist[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ videos, playlists, setVideos, setPlaylists }) => {
  const { authState } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'VIDEOS' | 'PLAYLISTS'>('VIDEOS');
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Video State
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoExpert, setNewVideoExpert] = useState('');
  const [newVideoTags, setNewVideoTags] = useState('');
  const [isVerticalVideo, setIsVerticalVideo] = useState(false);

  // New Playlist State
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Detect if URL is a YouTube Short
  const detectVerticalVideo = (url: string): boolean => {
    return url.includes('/shorts/') || url.includes('youtube.com/shorts');
  };

  // Handle URL change with auto-detection
  const handleUrlChange = (url: string) => {
    setNewVideoUrl(url);
    if (detectVerticalVideo(url)) {
      setIsVerticalVideo(true);
    }
  };

  const handleAddVideo = () => {
    if (!newVideoUrl || !newVideoTitle) return;

    // Handle YouTube Shorts URLs
    let processedUrl = newVideoUrl;
    if (newVideoUrl.includes('/shorts/')) {
      // Extract video ID from shorts URL
      const shortsMatch = newVideoUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (shortsMatch) {
        processedUrl = `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
      }
    }

    const ytId = getYoutubeId(processedUrl);
    const embedUrl = ytId
      ? `https://www.youtube.com/embed/${ytId}`
      : newVideoUrl;
    const thumbnail = ytId
      ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
      : 'https://picsum.photos/seed/video/800/600';

    const newVideo: Video = {
      id: `v-${Date.now()}`,
      title: newVideoTitle,
      expert: newVideoExpert || 'Unknown Expert',
      url: newVideoUrl,
      embedUrl,
      thumbnail,
      platform: ytId ? 'youtube' : 'other',
      tags: newVideoTags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      duration: isVerticalVideo ? 60 : 600, // Shorts default to 1 min, regular to 10 min
      isVertical: isVerticalVideo
    };

    setVideos([...videos, newVideo]);
    // Reset form
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoExpert('');
    setNewVideoTags('');
    setIsVerticalVideo(false);
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle) return;

    const newPlaylist: Playlist = {
      id: `p-${Date.now()}`,
      title: newPlaylistTitle,
      description: newPlaylistDesc,
      videoIds: [],
      locked: false,
      coverImage: `https://picsum.photos/seed/${newPlaylistTitle.replace(' ', '')}/800/600`
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    // Also remove from playlists
    setPlaylists(playlists.map(p => ({
      ...p,
      videoIds: p.videoIds.filter(vid => vid !== id)
    })));
  };

  // Export data as JSON file
  const handleExport = () => {
    const data = dataService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasterclass-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = dataService.importData(event.target?.result as string);
      if (result.success) {
        // Refresh state from localStorage
        setVideos(dataService.getVideos());
        setPlaylists(dataService.getPlaylists());
        setImportMessage({ type: 'success', text: 'Data imported successfully!' });
      } else {
        setImportMessage({ type: 'error', text: result.error || 'Import failed' });
      }
      // Clear message after 3 seconds
      setTimeout(() => setImportMessage(null), 3000);
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset to default data
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      dataService.resetToDefaults();
      setVideos(dataService.getVideos());
      setPlaylists(dataService.getPlaylists());
      setImportMessage({ type: 'success', text: 'Data reset to defaults!' });
      setTimeout(() => setImportMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with user info and actions */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Curator CMS</h1>
          <p className="text-slate-400">
            Welcome, <span className="text-indigo-400">{authState.user?.displayName}</span>
            <span className="text-slate-500 text-sm ml-2">({authState.user?.email})</span>
          </p>
        </div>

        {/* Data Management Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          <label className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-lg text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Import/Export Message */}
      {importMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          importMessage.type === 'success'
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {importMessage.text}
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('VIDEOS')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'VIDEOS' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <VideoIcon className="inline-block w-4 h-4 mr-2" />
          Videos ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('PLAYLISTS')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'PLAYLISTS' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <List className="inline-block w-4 h-4 mr-2" />
          Playlists ({playlists.length})
        </button>
      </div>

      {activeTab === 'VIDEOS' && (
        <div className="space-y-8">
          {/* Add Video Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add New Video</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">YouTube URL (or Shorts URL)</label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={e => handleUrlChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or /shorts/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={e => setNewVideoTitle(e.target.value)}
                  placeholder="e.g., Do things that don't scale"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Expert/Speaker</label>
                <input
                  type="text"
                  value={newVideoExpert}
                  onChange={e => setNewVideoExpert(e.target.value)}
                  placeholder="e.g., Paul Graham"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newVideoTags}
                  onChange={e => setNewVideoTags(e.target.value)}
                  placeholder="growth, sales, hiring"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Vertical Video Toggle */}
            <div className="mt-4 flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerticalVideo}
                  onChange={e => setIsVerticalVideo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm text-slate-300 flex items-center">
                  <Smartphone className="w-4 h-4 mr-1" />
                  Vertical Video (YouTube Short / 9:16)
                </span>
              </label>
            </div>

            <button
              onClick={handleAddVideo}
              className="mt-4 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </button>
          </div>

          {/* Video List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Library ({videos.length})</h2>
            </div>
            <ul className="divide-y divide-slate-800">
              {videos.map(video => (
                <li key={video.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded-md bg-slate-800" />
                      {video.isVertical && (
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                          9:16
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{video.title}</p>
                      <p className="text-sm text-slate-400">
                        {video.expert} • {video.platform}
                        {video.isVertical && <span className="ml-2 text-indigo-400">• Vertical</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'PLAYLISTS' && (
        <div className="space-y-8">
          {/* Add Playlist Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Create Playlist</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Playlist Title</label>
                <input
                  type="text"
                  value={newPlaylistTitle}
                  onChange={e => setNewPlaylistTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={e => setNewPlaylistDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 h-20 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleCreatePlaylist}
              className="mt-4 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playlists.map(playlist => (
              <div key={playlist.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{playlist.title}</h3>
                    <p className="text-sm text-slate-400">{playlist.videoIds.length} videos</p>
                  </div>
                  <button onClick={() => {
                    setPlaylists(playlists.filter(p => p.id !== playlist.id));
                  }} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Videos in playlist</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {playlist.videoIds.map(vidId => {
                      const v = videos.find(v => v.id === vidId);
                      return v ? (
                        <div key={vidId} className="flex justify-between items-center text-sm bg-slate-800 p-2 rounded">
                          <span className="truncate text-slate-300 flex items-center">
                            {v.isVertical && <Smartphone className="w-3 h-3 mr-1 text-indigo-400" />}
                            {v.title}
                          </span>
                          <button
                            className="text-slate-500 hover:text-red-400 ml-2"
                            onClick={() => {
                              const updatedPlaylist = {
                                ...playlist,
                                videoIds: playlist.videoIds.filter(id => id !== vidId)
                              };
                              setPlaylists(playlists.map(p => p.id === playlist.id ? updatedPlaylist : p));
                            }}
                          >
                            <XIconSmall />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Quick Add Video to Playlist */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <select
                      className="w-full bg-slate-800 text-slate-300 text-sm p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => {
                        if(e.target.value) {
                          const vidId = e.target.value;
                          if(!playlist.videoIds.includes(vidId)){
                            const updated = {...playlist, videoIds: [...playlist.videoIds, vidId]};
                            setPlaylists(playlists.map(p => p.id === playlist.id ? updated : p));
                          }
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">+ Add Video to Playlist</option>
                      {videos.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.isVertical ? '📱 ' : ''}{v.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const XIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default AdminPanel;
