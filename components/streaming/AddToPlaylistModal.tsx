import React, { useState } from 'react';
import { X, Plus, Check, ListVideo } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { INITIAL_VIDEOS } from '../../constants';

interface AddToPlaylistModalProps {
  videoId: string;
  onClose: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  videoId,
  onClose,
}) => {
  const {
    playlists,
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
  } = useLibrary();

  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  const video = INITIAL_VIDEOS.find(v => v.id === videoId);

  const handleTogglePlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist?.videoIds.includes(videoId)) {
      removeVideoFromPlaylist(playlistId, videoId);
    } else {
      addVideoToPlaylist(playlistId, videoId);
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistTitle.trim()) {
      const newPlaylist = createPlaylist(newPlaylistTitle.trim());
      addVideoToPlaylist(newPlaylist.id, videoId);
      setNewPlaylistTitle('');
      setShowCreateNew(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#13131A] border border-[#1E1E2E] rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1E1E2E]">
          <div className="flex items-center gap-3">
            <ListVideo className="w-5 h-5 text-[#c9a227]" />
            <h3 className="text-lg font-bold text-white">Add to Playlist</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Video Preview */}
        {video && (
          <div className="p-4 border-b border-[#1E1E2E]">
            <div className="flex items-center gap-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{video.title}</p>
                <p className="text-[#6B7280] text-xs">{video.expert}</p>
              </div>
            </div>
          </div>
        )}

        {/* Create New Playlist */}
        <div className="p-4 border-b border-[#1E1E2E]">
          {showCreateNew ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                placeholder="New playlist name"
                className="flex-1 px-3 py-2 bg-[#1E1E2E] border border-[#2E2E3E] rounded-lg text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreatePlaylist();
                  if (e.key === 'Escape') {
                    setShowCreateNew(false);
                    setNewPlaylistTitle('');
                  }
                }}
              />
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistTitle.trim()}
                className="px-4 py-2 bg-[#c9a227] text-white rounded-lg font-medium text-sm hover:bg-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateNew(false);
                  setNewPlaylistTitle('');
                }}
                className="p-2 text-[#6B7280] hover:bg-[#1E1E2E] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateNew(true)}
              className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#1E1E2E] hover:bg-[#2E2E3E] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#c9a227] flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">Create New Playlist</span>
            </button>
          )}
        </div>

        {/* Existing Playlists */}
        <div className="max-h-64 overflow-y-auto">
          {playlists.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[#6B7280] text-sm">
                No playlists yet. Create one above!
              </p>
            </div>
          ) : (
            <div className="p-2">
              {playlists.map(playlist => {
                const isInPlaylist = playlist.videoIds.includes(videoId);
                const firstVideo = playlist.videoIds.length > 0
                  ? INITIAL_VIDEOS.find(v => v.id === playlist.videoIds[0])
                  : null;

                return (
                  <button
                    key={playlist.id}
                    onClick={() => handleTogglePlaylist(playlist.id)}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-[#1E1E2E] transition-colors"
                  >
                    {/* Playlist Thumbnail */}
                    <div className="w-10 h-10 rounded-lg bg-[#2E2E3E] overflow-hidden flex-shrink-0">
                      {firstVideo ? (
                        <img
                          src={firstVideo.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ListVideo className="w-5 h-5 text-[#6B7280]" />
                        </div>
                      )}
                    </div>

                    {/* Playlist Info */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white font-medium truncate">{playlist.title}</p>
                      <p className="text-[#6B7280] text-xs">
                        {playlist.videoIds.length} video{playlist.videoIds.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Checkbox */}
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                        isInPlaylist
                          ? 'bg-[#c9a227] text-white'
                          : 'border-2 border-[#2E2E3E]'
                      }`}
                    >
                      {isInPlaylist && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E1E2E]">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-[#1E1E2E] text-white rounded-xl font-medium hover:bg-[#2E2E3E] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
