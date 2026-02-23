import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bookmark, Clock, Trash2, Edit2, X, Heart } from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { VideoCard } from './VideoCard';

export const MyListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    savedVideos,
    playlists,
    continueWatching,
    favorites,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    toggleSaveVideo,
  } = useLibrary();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Get video objects for saved videos
  const savedVideosList = savedVideos
    .map(id => INITIAL_VIDEOS.find(v => v.id === id))
    .filter(Boolean) as typeof INITIAL_VIDEOS;

  // Get video objects for continue watching
  const continueWatchingVideos = continueWatching
    .map(h => INITIAL_VIDEOS.find(v => v.id === h.videoId))
    .filter(Boolean) as typeof INITIAL_VIDEOS;

  // Get video objects for favorites
  const favoritedVideos = favorites
    .map(id => INITIAL_VIDEOS.find(v => v.id === id))
    .filter(Boolean) as typeof INITIAL_VIDEOS;

  const handleCreatePlaylist = () => {
    if (newPlaylistTitle.trim()) {
      createPlaylist(newPlaylistTitle.trim());
      setNewPlaylistTitle('');
      setShowCreateModal(false);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(id);
    }
  };

  const handleEditPlaylist = (id: string) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      setEditingPlaylist(id);
      setEditTitle(playlist.title);
    }
  };

  const handleSaveEdit = () => {
    if (editingPlaylist && editTitle.trim()) {
      updatePlaylist(editingPlaylist, { title: editTitle.trim() });
      setEditingPlaylist(null);
      setEditTitle('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">My Arsenal</h1>
          <p className="text-[#9CA3AF] text-lg">
            Your bookmarked sessions and curated playlists.
          </p>
        </div>

        {/* Favorites */}
        {favoritedVideos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h2 className="text-2xl font-bold text-white">Favorites</h2>
              <span className="text-[#6B7280]">({favoritedVideos.length})</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
              {favoritedVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Continue Watching */}
        {continueWatchingVideos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-[#c9a227]" />
              <h2 className="text-2xl font-bold text-white">Pick Up The Grind</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
              {continueWatchingVideos.map(video => (
                <VideoCard key={video.id} video={video} showProgress />
              ))}
            </div>
          </section>
        )}

        {/* Saved Videos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="w-6 h-6 text-[#c9a227]" />
            <h2 className="text-2xl font-bold text-white">Bookmarked Plays</h2>
            <span className="text-[#6B7280]">({savedVideosList.length})</span>
          </div>

          {savedVideosList.length === 0 ? (
            <div className="bg-[#13131A] border border-[#1E1E2E] rounded-2xl p-12 text-center">
              <Bookmark className="w-12 h-12 text-[#2E2E3E] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Your arsenal is empty</h3>
              <p className="text-[#6B7280] mb-6">
                Bookmark sessions to build your founder toolkit.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors"
              >
                Find Your First Play
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {savedVideosList.map(video => (
                <VideoCard key={video.id} video={video} size="small" />
              ))}
            </div>
          )}
        </section>

        {/* Playlists */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">My Playlists</h2>
              <span className="text-[#6B7280]">({playlists.length})</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#c9a227] text-white rounded-xl font-medium hover:bg-[#d4af37] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Playlist
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="bg-[#13131A] border border-[#1E1E2E] rounded-2xl p-12 text-center">
              <Plus className="w-12 h-12 text-[#2E2E3E] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No playlists yet</h3>
              <p className="text-[#6B7280] mb-6">
                Curate your own learning path. Build your playbook.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors"
              >
                Create Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map(playlist => {
                const playlistVideos = playlist.videoIds
                  .map(id => INITIAL_VIDEOS.find(v => v.id === id))
                  .filter(Boolean);
                const totalDuration = playlistVideos.reduce((sum, v) => sum + (v?.duration || 0), 0);

                return (
                  <div
                    key={playlist.id}
                    className="bg-[#13131A] border border-[#1E1E2E] rounded-xl overflow-hidden group"
                  >
                    {/* Thumbnail Grid */}
                    <div
                      className="relative h-36 bg-[#1E1E2E] cursor-pointer"
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                      <div className="grid grid-cols-2 gap-0.5 h-full">
                        {playlistVideos.slice(0, 4).map((video, i) => (
                          <div key={i} className="bg-[#2E2E3E] overflow-hidden">
                            {video && (
                              <img
                                src={video.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                        {playlistVideos.length < 4 &&
                          Array.from({ length: 4 - playlistVideos.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-[#2E2E3E]" />
                          ))}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">View Playlist</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      {editingPlaylist === playlist.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-3 py-2 bg-[#1E1E2E] border border-[#2E2E3E] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a227]"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 text-[#c9a227] hover:bg-[#1E1E2E] rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPlaylist(null)}
                            className="p-2 text-[#6B7280] hover:bg-[#1E1E2E] rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold truncate">{playlist.title}</h3>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditPlaylist(playlist.id)}
                                className="p-1.5 text-[#6B7280] hover:text-white hover:bg-[#1E1E2E] rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePlaylist(playlist.id)}
                                className="p-1.5 text-[#6B7280] hover:text-red-500 hover:bg-[#1E1E2E] rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-[#6B7280]">
                            {playlistVideos.length} sessions | {formatDuration(totalDuration)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#13131A] border border-[#1E1E2E] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Create New Playlist</h3>
            <input
              type="text"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227] mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-[#1E1E2E] text-white rounded-xl font-medium hover:bg-[#2E2E3E] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistTitle.trim()}
                className="flex-1 px-4 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListPage;
