import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Play,
  ExternalLink,
  Filter,
  X,
  Check,
  Clock,
  Tag,
} from 'lucide-react';
import { Video } from '../../types';
import { INITIAL_VIDEOS, getYoutubeId, formatDuration } from '../../constants';

interface VideoFormData {
  id: string;
  title: string;
  expert: string;
  url: string;
  tags: string[];
  isVertical: boolean;
}

export const VideoManager: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    videos.forEach(v => v.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [videos]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.expert.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !selectedTag || video.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [videos, searchQuery, selectedTag]);

  const handleDelete = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Videos</h1>
          <p className="text-[#6B7280] mt-1">{videos.length} videos in library</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Video
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A24] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#6B7280]" />
          <select
            value={selectedTag || ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="px-3 py-2.5 bg-[#1A1A24] border border-[#2E2E3E] rounded-xl text-white focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {(searchQuery || selectedTag) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag(null);
            }}
            className="px-3 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Video List */}
      <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2E2E3E]">
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Video</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Expert</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-[#6B7280]">Tags</th>
                <th className="text-right p-4 text-sm font-medium text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E3E]">
              {filteredVideos.map(video => (
                <tr key={video.id} className="hover:bg-[#1E1E2E] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-24 h-14 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-xs">{video.title}</p>
                        <p className="text-xs text-[#6B7280]">{video.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#9CA3AF]">{video.expert}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[#9CA3AF]">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-[#2E2E3E] text-[#6B7280] text-xs rounded-full">
                          +{video.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#6B7280] hover:text-white hover:bg-[#2E2E3E] rounded-lg transition-colors"
                        title="Open on YouTube"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setEditingVideo(video)}
                        className="p-2 text-[#6B7280] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(video.id)}
                        className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVideos.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-[#6B7280]">No videos found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingVideo) && (
        <VideoModal
          video={editingVideo}
          onClose={() => {
            setShowAddModal(false);
            setEditingVideo(null);
          }}
          onSave={(video) => {
            if (editingVideo) {
              setVideos(prev => prev.map(v => v.id === video.id ? video : v));
            } else {
              setVideos(prev => [...prev, video]);
            }
            setShowAddModal(false);
            setEditingVideo(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-2">Delete Video?</h3>
            <p className="text-[#9CA3AF] mb-6">
              This will remove the video from all courses and channels. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Video Add/Edit Modal
interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  onSave: (video: Video) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose, onSave }) => {
  const [formData, setFormData] = useState<VideoFormData>({
    id: video?.id || '',
    title: video?.title || '',
    expert: video?.expert || '',
    url: video?.url || '',
    tags: video?.tags || [],
    isVertical: video?.isVertical || false,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, url }));

    // Auto-extract video ID and create thumbnail URL
    const videoId = getYoutubeId(url);
    if (videoId && !formData.id) {
      setFormData(prev => ({
        ...prev,
        id: `video-${videoId.slice(0, 8)}`,
      }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = () => {
    if (!formData.url || !formData.title || !formData.expert) {
      setError('Please fill in all required fields');
      return;
    }

    const videoId = getYoutubeId(formData.url);
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }

    const newVideo: Video = {
      id: formData.id || `video-${Date.now()}`,
      title: formData.title,
      expert: formData.expert,
      url: formData.url,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      duration: video?.duration || 0, // Would need API to get actual duration
      platform: 'youtube',
      tags: formData.tags,
      isVertical: formData.isVertical,
    };

    onSave(newVideo);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-6 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {video ? 'Edit Video' : 'Add Video'}
          </h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              YouTube URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Video title"
              className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Expert */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Expert / Speaker *
            </label>
            <input
              type="text"
              value={formData.expert}
              onChange={(e) => setFormData(prev => ({ ...prev, expert: e.target.value }))}
              placeholder="e.g. Sam Altman"
              className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2.5 bg-[#2E2E3E] text-white rounded-xl hover:bg-[#3E3E4E] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-sm rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Vertical Video */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, isVertical: !prev.isVertical }))}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                formData.isVertical
                  ? 'bg-[#8B5CF6] border-[#8B5CF6]'
                  : 'border-[#2E2E3E]'
              }`}
            >
              {formData.isVertical && <Check className="w-3 h-3 text-white" />}
            </button>
            <label className="text-sm text-[#9CA3AF]">
              This is a vertical video (YouTube Short)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoManager;
