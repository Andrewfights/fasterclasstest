import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, X, Play, Share2, Lock, Globe, MoreVertical, ListVideo, ChevronRight } from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { UserPlaylist } from '../../types';

export const PlaylistManager: React.FC = () => {
  const navigate = useNavigate();
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
  } = useLibrary();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<UserPlaylist | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistTitle.trim()) {
      createPlaylist(newPlaylistTitle.trim(), newPlaylistDescription.trim() || undefined);
      setNewPlaylistTitle('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(id);
    }
    setActiveMenu(null);
  };

  const handleEditPlaylist = (playlist: UserPlaylist) => {
    setEditingPlaylist(playlist);
    setNewPlaylistTitle(playlist.title);
    setNewPlaylistDescription(playlist.description || '');
    setActiveMenu(null);
  };

  const handleSaveEdit = () => {
    if (editingPlaylist && newPlaylistTitle.trim()) {
      updatePlaylist(editingPlaylist.id, {
        title: newPlaylistTitle.trim(),
        description: newPlaylistDescription.trim() || undefined,
      });
      setEditingPlaylist(null);
      setNewPlaylistTitle('');
      setNewPlaylistDescription('');
    }
  };

  const handleTogglePublic = (playlist: UserPlaylist) => {
    // For now, just toggle - in production this would generate a shareCode
    updatePlaylist(playlist.id, {});
    setActiveMenu(null);
  };

  const handleShare = (playlist: UserPlaylist) => {
    // Copy share link to clipboard
    const shareUrl = `${window.location.origin}/playlist/${playlist.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Playlist link copied to clipboard!');
    setActiveMenu(null);
  };

  const getPlaylistThumbnails = (playlist: UserPlaylist) => {
    return playlist.videoIds
      .slice(0, 4)
      .map(id => INITIAL_VIDEOS.find(v => v.id === id))
      .filter(Boolean);
  };

  const getTotalDuration = (playlist: UserPlaylist) => {
    return playlist.videoIds.reduce((sum, id) => {
      const video = INITIAL_VIDEOS.find(v => v.id === id);
      return sum + (video?.duration || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">My Stuff</h1>
            <p className="text-[#9CA3AF] text-lg">
              Manage your playlists and curated content.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Playlist
          </button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <button
            onClick={() => navigate('/my-list')}
            className="flex items-center justify-between p-4 bg-[#13131A] border border-[#1E1E2E] rounded-xl hover:bg-[#1E1E2E] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#c9a227]/20 flex items-center justify-center">
                <ListVideo className="w-5 h-5 text-[#c9a227]" />
              </div>
              <span className="text-white font-medium">My Arsenal</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <div className="bg-[#13131A] border border-[#1E1E2E] rounded-2xl p-16 text-center">
            <ListVideo className="w-16 h-16 text-[#2E2E3E] mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">No playlists yet</h3>
            <p className="text-[#6B7280] mb-8 max-w-md mx-auto">
              Create your first playlist to organize your favorite content. Build your own learning path.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors"
            >
              Create Your First Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map(playlist => {
              const thumbnails = getPlaylistThumbnails(playlist);
              const totalDuration = getTotalDuration(playlist);

              return (
                <div
                  key={playlist.id}
                  className="bg-[#13131A] border border-[#1E1E2E] rounded-xl overflow-hidden group"
                >
                  {/* Thumbnail Grid */}
                  <div
                    className="relative h-44 bg-[#1E1E2E] cursor-pointer"
                    onClick={() => navigate(`/my-stuff/${playlist.id}`)}
                  >
                    {thumbnails.length > 0 ? (
                      <div className="grid grid-cols-2 gap-0.5 h-full">
                        {thumbnails.map((video, i) => (
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
                        {thumbnails.length < 4 &&
                          Array.from({ length: 4 - thumbnails.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-[#2E2E3E]" />
                          ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ListVideo className="w-12 h-12 text-[#2E2E3E]" />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-stuff/${playlist.id}`);
                        }}
                        className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Play className="w-6 h-6 text-[#0D0D12] fill-current ml-0.5" />
                      </button>
                    </div>

                    {/* Public/Private Badge */}
                    <div className="absolute top-2 left-2">
                      {playlist.isPublic ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/80 rounded text-xs text-white">
                          <Globe className="w-3 h-3" />
                          Public
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded text-xs text-white">
                          <Lock className="w-3 h-3" />
                          Private
                        </div>
                      )}
                    </div>

                    {/* Video Count Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                      {playlist.videoIds.length} video{playlist.videoIds.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className="text-white font-semibold flex-1 truncate cursor-pointer hover:text-[#c9a227] transition-colors"
                        onClick={() => navigate(`/my-stuff/${playlist.id}`)}
                      >
                        {playlist.title}
                      </h3>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === playlist.id ? null : playlist.id)}
                          className="p-1 hover:bg-[#1E1E2E] rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenu === playlist.id && (
                          <div className="absolute right-0 top-8 z-20 w-48 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl shadow-xl overflow-hidden">
                            <button
                              onClick={() => handleEditPlaylist(playlist)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#2E2E3E] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleShare(playlist)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#2E2E3E] transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                              Share Link
                            </button>
                            <button
                              onClick={() => handleDeletePlaylist(playlist.id)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-400 hover:bg-[#2E2E3E] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {playlist.description && (
                      <p className="text-[#6B7280] text-sm mb-2 line-clamp-2">{playlist.description}</p>
                    )}

                    <div className="text-xs text-[#6B7280]">
                      {formatDuration(totalDuration)} total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* Create/Edit Playlist Modal */}
      {(showCreateModal || editingPlaylist) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#13131A] border border-[#1E1E2E] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPlaylist(null);
                  setNewPlaylistTitle('');
                  setNewPlaylistDescription('');
                }}
                className="p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Name</label>
                <input
                  type="text"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Description (optional)</label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="What's this playlist about?"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPlaylist(null);
                  setNewPlaylistTitle('');
                  setNewPlaylistDescription('');
                }}
                className="flex-1 px-4 py-3 bg-[#1E1E2E] text-white rounded-xl font-medium hover:bg-[#2E2E3E] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingPlaylist ? handleSaveEdit : handleCreatePlaylist}
                disabled={!newPlaylistTitle.trim()}
                className="flex-1 px-4 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingPlaylist ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;
