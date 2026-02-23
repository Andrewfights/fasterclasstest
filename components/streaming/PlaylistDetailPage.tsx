import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Shuffle, Share2, Edit2, Trash2,
  GripVertical, X, Lock, Globe, MoreVertical, Clock
} from 'lucide-react';
import { INITIAL_VIDEOS, formatDuration } from '../../constants';
import { useLibrary } from '../../contexts/LibraryContext';
import { Video } from '../../types';

export const PlaylistDetailPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const {
    getPlaylist,
    updatePlaylist,
    deletePlaylist,
    removeVideoFromPlaylist,
    library,
  } = useLibrary();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const playlist = playlistId ? getPlaylist(playlistId) : undefined;

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#0D0D12] pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Playlist Not Found</h1>
          <p className="text-[#6B7280] mb-8">This playlist doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/my-stuff')}
            className="px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors"
          >
            Back to My Stuff
          </button>
        </div>
      </div>
    );
  }

  const videos = playlist.videoIds
    .map(id => INITIAL_VIDEOS.find(v => v.id === id))
    .filter(Boolean) as Video[];

  const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);

  const handlePlayAll = () => {
    if (videos.length > 0) {
      navigate(`/watch/${videos[0].id}?playlist=${playlist.id}`);
    }
  };

  const handleShuffle = () => {
    if (videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      navigate(`/watch/${videos[randomIndex].id}?playlist=${playlist.id}&shuffle=true`);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/playlist/${playlist.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Playlist link copied to clipboard!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(playlist.id);
      navigate('/my-stuff');
    }
  };

  const handleStartEdit = () => {
    setEditTitle(playlist.title);
    setEditDescription(playlist.description || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updatePlaylist(playlist.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleRemoveVideo = (videoId: string) => {
    removeVideoFromPlaylist(playlist.id, videoId);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newVideoIds = [...playlist.videoIds];
      const [draggedItem] = newVideoIds.splice(draggedIndex, 1);
      newVideoIds.splice(dragOverIndex, 0, draggedItem);

      // Update playlist through library service
      const updatedLibrary = {
        ...library,
        playlists: library.playlists.map(p =>
          p.id === playlist.id ? { ...p, videoIds: newVideoIds, updatedAt: Date.now() } : p
        ),
      };
      localStorage.setItem('fasterclass_library', JSON.stringify(updatedLibrary));
      window.location.reload(); // Simple refresh to update state
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const firstVideo = videos[0];

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-stuff')}
          className="flex items-center gap-2 text-[#6B7280] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Stuff
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Thumbnail */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="aspect-video rounded-xl overflow-hidden bg-[#1E1E2E]">
              {firstVideo ? (
                <img
                  src={firstVideo.thumbnail}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-12 h-12 text-[#2E2E3E]" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white text-xl font-bold focus:outline-none focus:border-[#c9a227]"
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white focus:outline-none focus:border-[#c9a227] resize-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-[#c9a227] text-white rounded-lg font-medium hover:bg-[#d4af37] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-[#1E1E2E] text-white rounded-lg font-medium hover:bg-[#2E2E3E] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-white">{playlist.title}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStartEdit}
                      className="p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors"
                      title="Edit playlist"
                    >
                      <Edit2 className="w-5 h-5 text-[#6B7280]" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors"
                      title="Delete playlist"
                    >
                      <Trash2 className="w-5 h-5 text-[#6B7280] hover:text-red-500" />
                    </button>
                  </div>
                </div>

                {playlist.description && (
                  <p className="text-[#9CA3AF] mb-4">{playlist.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-6">
                  <div className="flex items-center gap-1">
                    {playlist.isPublic ? (
                      <>
                        <Globe className="w-4 h-4" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Private
                      </>
                    )}
                  </div>
                  <span>•</span>
                  <span>{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(totalDuration)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handlePlayAll}
                    disabled={videos.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Play All
                  </button>
                  <button
                    onClick={handleShuffle}
                    disabled={videos.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1E1E2E] text-white rounded-xl font-medium hover:bg-[#2E2E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shuffle className="w-5 h-5" />
                    Shuffle
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1E1E2E] text-white rounded-xl font-medium hover:bg-[#2E2E3E] transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Video List */}
        <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1E1E2E]">
            <h2 className="text-lg font-semibold text-white">Videos</h2>
            <p className="text-sm text-[#6B7280]">Drag to reorder</p>
          </div>

          {videos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#6B7280] mb-4">No videos in this playlist yet.</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#c9a227] text-white rounded-xl font-semibold hover:bg-[#d4af37] transition-colors"
              >
                Browse Videos
              </button>
            </div>
          ) : (
            <div>
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 border-b border-[#1E1E2E] last:border-b-0 hover:bg-[#1E1E2E] transition-colors ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${dragOverIndex === index ? 'bg-[#1E1E2E]' : ''}`}
                >
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-[#6B7280] hover:text-white">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Index */}
                  <span className="w-6 text-center text-[#6B7280] text-sm">{index + 1}</span>

                  {/* Thumbnail */}
                  <div
                    className="w-24 aspect-video rounded-lg overflow-hidden bg-[#2E2E3E] flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/watch/${video.id}?playlist=${playlist.id}`)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/watch/${video.id}?playlist=${playlist.id}`)}
                  >
                    <h3 className="text-white font-medium truncate hover:text-[#c9a227] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm truncate">{video.expert}</p>
                  </div>

                  {/* Duration */}
                  <span className="text-[#6B7280] text-sm flex-shrink-0">
                    {formatDuration(video.duration)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveVideo(video.id)}
                    className="p-2 hover:bg-[#2E2E3E] rounded-lg transition-colors"
                    title="Remove from playlist"
                  >
                    <X className="w-4 h-4 text-[#6B7280] hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
