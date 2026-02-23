import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Clock, Tag, Tv } from 'lucide-react';
import { CMSEpisode, CMSClip } from '../../types/cms';
import { cmsDataService } from '../../services/cmsDataService';
import { FAST_CHANNELS } from '../../constants';
import { ArtworkUploader } from './ArtworkUploader';
import { DraggableList, DraggableItem } from './DraggableList';
import { ClipEditor } from './ClipEditor';

export const EpisodeEditor: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  const isNew = episodeId === 'new';

  const [episode, setEpisode] = useState<CMSEpisode | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingClip, setEditingClip] = useState<CMSClip | null>(null);
  const [showClipEditor, setShowClipEditor] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Load episode
  useEffect(() => {
    if (isNew) {
      setEpisode({
        id: `episode-${Date.now()}`,
        title: '',
        description: '',
        thumbnail: '',
        clips: [],
        totalDuration: 0,
        tags: [],
        distribution: 'vod',
        channelIds: [],
        artwork: { thumbnail: '', poster: '' },
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (episodeId) {
      const loaded = cmsDataService.getCMSEpisode(episodeId);
      if (loaded) {
        setEpisode(loaded);
      }
    }
  }, [episodeId, isNew]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = useCallback(async () => {
    if (!episode) return;

    setIsSaving(true);
    try {
      if (isNew) {
        cmsDataService.createCMSEpisode(episode);
      } else {
        cmsDataService.saveCMSEpisode(episode);
      }
      setHasChanges(false);
      if (isNew) {
        navigate(`/admin/episodes/${episode.id}`);
      }
    } finally {
      setIsSaving(false);
    }
  }, [episode, isNew, navigate]);

  const updateField = useCallback(<K extends keyof CMSEpisode>(
    field: K,
    value: CMSEpisode[K]
  ) => {
    setEpisode(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  }, []);

  const handleClipsReorder = useCallback((items: DraggableItem[]) => {
    if (!episode) return;
    const reorderedClips = items.map((item, index) => {
      const clip = episode.clips.find(c => c.id === item.id);
      return clip ? { ...clip, order: index } : null;
    }).filter(Boolean) as CMSClip[];

    updateField('clips', reorderedClips);
  }, [episode, updateField]);

  const handleAddClip = useCallback(() => {
    setEditingClip(null);
    setShowClipEditor(true);
  }, []);

  const handleEditClip = useCallback((clipId: string) => {
    if (!episode) return;
    const clip = episode.clips.find(c => c.id === clipId);
    if (clip) {
      setEditingClip(clip);
      setShowClipEditor(true);
    }
  }, [episode]);

  const handleRemoveClip = useCallback((clipId: string) => {
    if (!episode) return;
    const updatedClips = episode.clips
      .filter(c => c.id !== clipId)
      .map((clip, index) => ({ ...clip, order: index }));

    const totalDuration = updatedClips.reduce((sum, c) => sum + c.duration, 0);
    setEpisode(prev => prev ? {
      ...prev,
      clips: updatedClips,
      totalDuration,
    } : null);
    setHasChanges(true);
  }, [episode]);

  const handleSaveClip = useCallback((clip: CMSClip) => {
    if (!episode) return;

    let updatedClips: CMSClip[];
    if (editingClip) {
      // Update existing
      updatedClips = episode.clips.map(c =>
        c.id === clip.id ? clip : c
      );
    } else {
      // Add new
      updatedClips = [...episode.clips, { ...clip, order: episode.clips.length }];
    }

    const totalDuration = updatedClips.reduce((sum, c) => sum + c.duration, 0);
    setEpisode(prev => prev ? {
      ...prev,
      clips: updatedClips,
      totalDuration,
    } : null);
    setHasChanges(true);
    setShowClipEditor(false);
    setEditingClip(null);
  }, [episode, editingClip]);

  const handleAddTag = useCallback(() => {
    if (!episode || !tagInput.trim()) return;
    if (!episode.tags.includes(tagInput.trim())) {
      updateField('tags', [...episode.tags, tagInput.trim()]);
    }
    setTagInput('');
  }, [episode, tagInput, updateField]);

  const handleRemoveTag = useCallback((tag: string) => {
    if (!episode) return;
    updateField('tags', episode.tags.filter(t => t !== tag));
  }, [episode, updateField]);

  const handleToggleChannel = useCallback((channelId: string) => {
    if (!episode) return;
    const newChannelIds = episode.channelIds.includes(channelId)
      ? episode.channelIds.filter(id => id !== channelId)
      : [...episode.channelIds, channelId];
    updateField('channelIds', newChannelIds);
  }, [episode, updateField]);

  const clipItems: DraggableItem[] = episode?.clips.map(clip => ({
    id: clip.id,
    title: clip.title,
    subtitle: `${formatDuration(clip.startTime)} - ${formatDuration(clip.endTime)}`,
    thumbnail: clip.thumbnail,
    duration: clip.duration,
  })) || [];

  if (!episode) {
    return (
      <div className="p-6 text-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0D0D12]/95 backdrop-blur border-b border-[#2E2E3E]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/episodes')}
              className="p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">
                {isNew ? 'Create Episode' : 'Edit Episode'}
              </h1>
              {hasChanges && (
                <p className="text-xs text-[#F5C518]">Unsaved changes</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !episode.title}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-[#3E3E4E] text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-[#1E1E2E] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Basic Info</h2>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={episode.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Episode title"
                  className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  value={episode.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Episode description"
                  rows={3}
                  className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {episode.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-lg text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add tag"
                    className="flex-1 px-3 py-1.5 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-[#3E3E4E] hover:bg-[#4E4E5E] text-white text-sm rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Distribution */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Distribution
                </label>
                <div className="flex gap-2">
                  {(['vod', 'live', 'both'] as const).map(dist => (
                    <button
                      key={dist}
                      onClick={() => updateField('distribution', dist)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        episode.distribution === dist
                          ? 'bg-[#8B5CF6] text-white'
                          : 'bg-[#3E3E4E] text-[#9CA3AF] hover:bg-[#4E4E5E]'
                      }`}
                    >
                      {dist === 'vod' ? 'VOD Only' : dist === 'live' ? 'Live Only' : 'Both'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clips */}
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Clips</h2>
                  <p className="text-sm text-[#6B7280]">
                    {episode.clips.length} clips • {formatDuration(episode.totalDuration)} total
                  </p>
                </div>
                <button
                  onClick={handleAddClip}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Clip
                </button>
              </div>

              <DraggableList
                items={clipItems}
                onReorder={handleClipsReorder}
                onEdit={handleEditClip}
                onRemove={handleRemoveClip}
                showDuration={true}
                emptyMessage="No clips yet. Add clips to build your episode."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <ArtworkUploader
                value={episode.artwork.thumbnail}
                onChange={(value) => updateField('artwork', { ...episode.artwork, thumbnail: value })}
                label="Thumbnail"
                aspectRatio="16:9"
              />
            </div>

            {/* Channels */}
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Tv className="w-4 h-4" />
                Assigned Channels
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {FAST_CHANNELS.map(channel => (
                  <label
                    key={channel.id}
                    className="flex items-center gap-3 p-2 hover:bg-[#2E2E3E] rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={episode.channelIds.includes(channel.id)}
                      onChange={() => handleToggleChannel(channel.id)}
                      className="w-4 h-4 rounded border-[#3E3E4E]"
                    />
                    <span className="text-lg">{channel.logo}</span>
                    <span className="text-sm text-white">{channel.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Status</span>
                  <span className={`font-medium ${
                    episode.status === 'published' ? 'text-green-400' : 'text-[#F5C518]'
                  }`}>
                    {episode.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total Duration</span>
                  <span className="text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(episode.totalDuration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Clips</span>
                  <span className="text-white">{episode.clips.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Created</span>
                  <span className="text-white">
                    {new Date(episode.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clip Editor Modal */}
      {showClipEditor && (
        <ClipEditor
          clip={editingClip}
          onSave={handleSaveClip}
          onClose={() => {
            setShowClipEditor(false);
            setEditingClip(null);
          }}
        />
      )}
    </div>
  );
};

export default EpisodeEditor;
