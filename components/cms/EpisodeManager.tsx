import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Film,
  GripVertical,
  Clock,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  Scissors,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Episode, EpisodeClip, Video, DistributionChannel } from '../../types';
import { INITIAL_VIDEOS, getYoutubeId, formatDuration } from '../../constants';

// Episode storage key
const EPISODES_STORAGE_KEY = 'fasterclass_episodes';

// Load episodes from localStorage
const loadEpisodes = (): Episode[] => {
  try {
    const stored = localStorage.getItem(EPISODES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save episodes to localStorage
const saveEpisodes = (episodes: Episode[]) => {
  localStorage.setItem(EPISODES_STORAGE_KEY, JSON.stringify(episodes));
};

export const EpisodeManager: React.FC = () => {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<Episode[]>(loadEpisodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter episodes
  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode =>
      !searchQuery ||
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [episodes, searchQuery]);

  const handleSave = (episode: Episode) => {
    let newEpisodes: Episode[];
    if (editingEpisode) {
      newEpisodes = episodes.map(e => e.id === episode.id ? episode : e);
    } else {
      newEpisodes = [...episodes, episode];
    }
    setEpisodes(newEpisodes);
    saveEpisodes(newEpisodes);
    setShowAddModal(false);
    setEditingEpisode(null);
  };

  const handleDelete = (episodeId: string) => {
    const newEpisodes = episodes.filter(e => e.id !== episodeId);
    setEpisodes(newEpisodes);
    saveEpisodes(newEpisodes);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Episodes</h1>
          <p className="text-[#6B7280] mt-1">
            Create episodes by combining multiple video clips
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Episode
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search episodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A24] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
        />
      </div>

      {/* Episodes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEpisodes.map(episode => {
          const firstClipVideo = INITIAL_VIDEOS.find(v => v.id === episode.clips[0]?.videoId);

          return (
            <div
              key={episode.id}
              className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative bg-[#0D0D12]">
                {episode.thumbnail ? (
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover"
                  />
                ) : firstClipVideo ? (
                  <img
                    src={firstClipVideo.customThumbnail || firstClipVideo.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-12 h-12 text-[#6B7280]" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Stats */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-1 bg-black/60 rounded text-xs text-white">
                    {episode.clips.length} clips
                  </span>
                  <span className="px-2 py-1 bg-black/60 rounded text-xs text-white">
                    {formatDuration(episode.totalDuration)}
                  </span>
                </div>

                {/* Distribution badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    episode.distribution === 'live' ? 'bg-red-500' :
                    episode.distribution === 'vod' ? 'bg-blue-500' : 'bg-[#8B5CF6]'
                  } text-white`}>
                    {episode.distribution === 'live' ? 'LIVE' :
                     episode.distribution === 'vod' ? 'VOD' : 'ALL'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{episode.title}</h3>
                <p className="text-sm text-[#9CA3AF] line-clamp-2 mb-3">{episode.description}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingEpisode(episode)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#2E2E3E] text-white rounded-lg hover:bg-[#3E3E4E] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Quick Edit
                  </button>
                  <button
                    onClick={() => navigate(`/admin/episodes/${episode.id}`)}
                    className="px-3 py-2 bg-[#2E2E3E] text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6]/20 transition-colors"
                    title="Full editor"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(episode.id)}
                    className="px-3 py-2 bg-[#2E2E3E] text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEpisodes.length === 0 && (
        <div className="text-center py-12">
          <Film className="w-16 h-16 mx-auto text-[#6B7280] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Episodes Yet</h3>
          <p className="text-[#9CA3AF] mb-4">Create your first episode by combining video clips</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#8B5CF6] text-white rounded-xl hover:bg-[#7C3AED] transition-colors"
          >
            Create Episode
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingEpisode) && (
        <EpisodeModal
          episode={editingEpisode}
          videos={INITIAL_VIDEOS}
          onClose={() => {
            setShowAddModal(false);
            setEditingEpisode(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-2">Delete Episode?</h3>
            <p className="text-[#9CA3AF] mb-6">
              This will permanently delete this episode. The source videos will not be affected.
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

// Episode Add/Edit Modal
interface EpisodeModalProps {
  episode: Episode | null;
  videos: Video[];
  onClose: () => void;
  onSave: (episode: Episode) => void;
}

const EpisodeModal: React.FC<EpisodeModalProps> = ({ episode, videos, onClose, onSave }) => {
  const [title, setTitle] = useState(episode?.title || '');
  const [description, setDescription] = useState(episode?.description || '');
  const [thumbnail, setThumbnail] = useState(episode?.thumbnail || '');
  const [distribution, setDistribution] = useState<DistributionChannel>(episode?.distribution || 'both');
  const [clips, setClips] = useState<EpisodeClip[]>(episode?.clips || []);
  const [videoSearch, setVideoSearch] = useState('');
  const [error, setError] = useState('');

  // Filtered videos for selection
  const filteredVideos = useMemo(() => {
    return videos.filter(v =>
      !videoSearch ||
      v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      v.expert.toLowerCase().includes(videoSearch.toLowerCase())
    );
  }, [videos, videoSearch]);

  // Calculate total duration
  const totalDuration = useMemo(() => {
    return clips.reduce((total, clip) => {
      const video = videos.find(v => v.id === clip.videoId);
      if (!video) return total;
      const clipDuration = (clip.endTime || video.duration) - clip.startTime;
      return total + clipDuration;
    }, 0);
  }, [clips, videos]);

  const addClip = (video: Video) => {
    const newClip: EpisodeClip = {
      videoId: video.id,
      startTime: 0,
      endTime: video.duration,
      order: clips.length,
    };
    setClips([...clips, newClip]);
  };

  const removeClip = (index: number) => {
    setClips(clips.filter((_, i) => i !== index).map((c, i) => ({ ...c, order: i })));
  };

  const updateClip = (index: number, updates: Partial<EpisodeClip>) => {
    setClips(clips.map((c, i) => i === index ? { ...c, ...updates } : c));
  };

  const moveClip = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newClips = [...clips];
      [newClips[index - 1], newClips[index]] = [newClips[index], newClips[index - 1]];
      setClips(newClips.map((c, i) => ({ ...c, order: i })));
    } else if (direction === 'down' && index < clips.length - 1) {
      const newClips = [...clips];
      [newClips[index], newClips[index + 1]] = [newClips[index + 1], newClips[index]];
      setClips(newClips.map((c, i) => ({ ...c, order: i })));
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (clips.length === 0) {
      setError('Please add at least one clip');
      return;
    }

    const newEpisode: Episode = {
      id: episode?.id || `episode-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      thumbnail,
      clips,
      totalDuration,
      tags: [],
      distribution,
      createdAt: episode?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(newEpisode);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2E2E3E]">
          <h3 className="text-xl font-bold text-white">
            {episode ? 'Edit Episode' : 'Create Episode'}
          </h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Episode Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Episode Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Startup Fundraising Masterclass"
                  className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this episode covers..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Custom Thumbnail URL
                </label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  <Radio className="w-4 h-4 inline mr-1" />
                  Distribution
                </label>
                <div className="flex gap-2">
                  {(['vod', 'live', 'both'] as DistributionChannel[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => setDistribution(option)}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                        distribution === option
                          ? 'bg-[#8B5CF6] text-white'
                          : 'bg-[#2E2E3E] text-[#9CA3AF] hover:bg-[#3E3E4E]'
                      }`}
                    >
                      {option === 'vod' ? 'VOD Only' : option === 'live' ? 'Live Only' : 'Both'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episode Stats */}
              <div className="p-4 bg-[#0D0D12] rounded-xl border border-[#2E2E3E]">
                <h4 className="font-medium text-white mb-2">Episode Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#6B7280]">Total Clips:</span>
                    <span className="ml-2 text-white font-semibold">{clips.length}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Total Duration:</span>
                    <span className="ml-2 text-white font-semibold">{formatDuration(totalDuration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Clips */}
            <div className="space-y-4">
              {/* Video Search */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Add Clips from Videos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="Search videos..."
                    className="w-full pl-9 pr-4 py-2 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                {/* Video List */}
                <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-[#2E2E3E]">
                  {filteredVideos.slice(0, 10).map(video => (
                    <button
                      key={video.id}
                      onClick={() => addClip(video)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-[#2E2E3E] transition-colors border-b border-[#2E2E3E] last:border-b-0"
                    >
                      <img
                        src={video.customThumbnail || video.thumbnail}
                        alt={video.title}
                        className="w-16 aspect-video object-cover rounded"
                      />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm text-white truncate">{video.title}</p>
                        <p className="text-xs text-[#6B7280]">{video.expert} • {formatDuration(video.duration)}</p>
                      </div>
                      <Plus className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Clips List */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Episode Clips ({clips.length})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {clips.map((clip, index) => {
                    const video = videos.find(v => v.id === clip.videoId);
                    if (!video) return null;

                    const clipDuration = (clip.endTime || video.duration) - clip.startTime;

                    return (
                      <div
                        key={`${clip.videoId}-${index}`}
                        className="p-3 bg-[#0D0D12] rounded-xl border border-[#2E2E3E]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-[#6B7280] font-mono">#{index + 1}</span>
                          <p className="text-sm text-white flex-1 truncate">{video.title}</p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveClip(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-[#6B7280] hover:text-white disabled:opacity-30"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveClip(index, 'down')}
                              disabled={index === clips.length - 1}
                              className="p-1 text-[#6B7280] hover:text-white disabled:opacity-30"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeClip(index)}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Clip Time Controls */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="text-[#6B7280]">Start</label>
                            <input
                              type="number"
                              min="0"
                              max={video.duration}
                              value={clip.startTime}
                              onChange={(e) => updateClip(index, { startTime: parseInt(e.target.value) || 0 })}
                              className="w-full px-2 py-1 bg-[#1A1A24] border border-[#2E2E3E] rounded text-white focus:outline-none focus:border-[#8B5CF6]"
                            />
                          </div>
                          <div>
                            <label className="text-[#6B7280]">End</label>
                            <input
                              type="number"
                              min={clip.startTime}
                              max={video.duration}
                              value={clip.endTime || video.duration}
                              onChange={(e) => updateClip(index, { endTime: parseInt(e.target.value) || video.duration })}
                              className="w-full px-2 py-1 bg-[#1A1A24] border border-[#2E2E3E] rounded text-white focus:outline-none focus:border-[#8B5CF6]"
                            />
                          </div>
                          <div>
                            <label className="text-[#6B7280]">Duration</label>
                            <div className="px-2 py-1 bg-[#2E2E3E] rounded text-[#9CA3AF] text-center">
                              {formatDuration(clipDuration)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {clips.length === 0 && (
                    <div className="p-8 text-center text-[#6B7280]">
                      <Scissors className="w-8 h-8 mx-auto mb-2" />
                      <p>No clips added yet</p>
                      <p className="text-sm">Search and add videos above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-[#2E2E3E]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#2E2E3E] text-white font-semibold rounded-xl hover:bg-[#3E3E4E] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
          >
            {episode ? 'Save Changes' : 'Create Episode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeManager;
