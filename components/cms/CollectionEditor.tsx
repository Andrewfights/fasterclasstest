import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Tag, Clock, Search } from 'lucide-react';
import { Collection, AutoRules } from '../../types/cms';
import { cmsDataService } from '../../services/cmsDataService';
import { INITIAL_VIDEOS } from '../../constants';
import { ArtworkUploader } from './ArtworkUploader';
import { DraggableList, DraggableItem } from './DraggableList';

export const CollectionEditor: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const isNew = collectionId === 'new';

  const [collection, setCollection] = useState<Collection | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Load collection
  useEffect(() => {
    if (isNew) {
      setCollection({
        id: `collection-${Date.now()}`,
        name: '',
        description: '',
        type: 'manual',
        episodeIds: [],
        autoRules: {
          includeTags: [],
          excludeTags: [],
          sortBy: 'recent',
          sortOrder: 'desc',
          limit: 12,
        },
        thumbnail: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (collectionId) {
      const loaded = cmsDataService.getCollection(collectionId);
      if (loaded) {
        setCollection(loaded);
      }
    }
  }, [collectionId, isNew]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = useCallback(async () => {
    if (!collection) return;

    setIsSaving(true);
    try {
      if (isNew) {
        cmsDataService.createCollection(collection);
      } else {
        cmsDataService.saveCollection(collection);
      }
      setHasChanges(false);
      if (isNew) {
        navigate(`/admin/collections/${collection.id}`);
      }
    } finally {
      setIsSaving(false);
    }
  }, [collection, isNew, navigate]);

  const updateField = useCallback(<K extends keyof Collection>(
    field: K,
    value: Collection[K]
  ) => {
    setCollection(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  }, []);

  const updateAutoRules = useCallback(<K extends keyof AutoRules>(
    field: K,
    value: AutoRules[K]
  ) => {
    if (!collection?.autoRules) return;
    setCollection(prev => prev ? {
      ...prev,
      autoRules: { ...prev.autoRules!, [field]: value },
    } : null);
    setHasChanges(true);
  }, [collection?.autoRules]);

  // Available videos
  const availableVideos = useMemo(() => {
    const selected = new Set(collection?.episodeIds || []);
    let filtered = INITIAL_VIDEOS.filter(v => !selected.has(v.id));

    if (search) {
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.expert.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered.slice(0, 30);
  }, [collection?.episodeIds, search]);

  // Selected videos
  const selectedVideos = useMemo(() => {
    if (!collection?.episodeIds) return [];
    return collection.episodeIds
      .map(id => INITIAL_VIDEOS.find(v => v.id === id))
      .filter(Boolean) as typeof INITIAL_VIDEOS;
  }, [collection?.episodeIds]);

  // Auto-generated preview
  const autoPreview = useMemo(() => {
    if (collection?.type !== 'auto' || !collection?.autoRules) return [];
    const episodes = cmsDataService.getCMSEpisodes();

    let filtered = episodes;

    // Apply include tags
    if (collection.autoRules.includeTags.length > 0) {
      filtered = filtered.filter(ep =>
        collection.autoRules!.includeTags.some(tag => ep.tags.includes(tag))
      );
    }

    // Apply exclude tags
    if (collection.autoRules.excludeTags.length > 0) {
      filtered = filtered.filter(ep =>
        !collection.autoRules!.excludeTags.some(tag => ep.tags.includes(tag))
      );
    }

    // Sort
    if (collection.autoRules.sortBy === 'recent') {
      filtered.sort((a, b) =>
        collection.autoRules!.sortOrder === 'desc'
          ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    } else if (collection.autoRules.sortBy === 'duration') {
      filtered.sort((a, b) =>
        collection.autoRules!.sortOrder === 'desc'
          ? b.totalDuration - a.totalDuration
          : a.totalDuration - b.totalDuration
      );
    }

    return filtered.slice(0, collection.autoRules.limit);
  }, [collection?.type, collection?.autoRules]);

  const handleAddVideo = useCallback((videoId: string) => {
    if (!collection) return;
    updateField('episodeIds', [...(collection.episodeIds || []), videoId]);
  }, [collection, updateField]);

  const handleRemoveVideo = useCallback((videoId: string) => {
    if (!collection) return;
    updateField('episodeIds', (collection.episodeIds || []).filter(id => id !== videoId));
  }, [collection, updateField]);

  const handleReorderVideos = useCallback((items: DraggableItem[]) => {
    updateField('episodeIds', items.map(item => item.id));
  }, [updateField]);

  const handleAddIncludeTag = useCallback(() => {
    if (!tagInput.trim() || !collection?.autoRules) return;
    const tags = [...collection.autoRules.includeTags, tagInput.trim()];
    updateAutoRules('includeTags', [...new Set(tags)]);
    setTagInput('');
  }, [tagInput, collection?.autoRules, updateAutoRules]);

  const handleRemoveIncludeTag = useCallback((tag: string) => {
    if (!collection?.autoRules) return;
    updateAutoRules('includeTags', collection.autoRules.includeTags.filter(t => t !== tag));
  }, [collection?.autoRules, updateAutoRules]);

  const selectedItems: DraggableItem[] = selectedVideos.map(v => ({
    id: v.id,
    title: v.title,
    subtitle: v.expert,
    thumbnail: v.thumbnail,
    duration: v.duration,
  }));

  if (!collection) {
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
              onClick={() => navigate('/admin/collections')}
              className="p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">
                {isNew ? 'Create Collection' : 'Edit Collection'}
              </h1>
              {hasChanges && (
                <p className="text-xs text-[#F5C518]">Unsaved changes</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !collection.name}
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
              <h2 className="text-lg font-semibold text-white">Collection Info</h2>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={collection.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Collection name"
                  className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  value={collection.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Collection description"
                  rows={2}
                  className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] resize-none"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Collection Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField('type', 'manual')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      collection.type === 'manual'
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-[#3E3E4E] text-[#9CA3AF] hover:bg-[#4E4E5E]'
                    }`}
                  >
                    Manual (Curated)
                  </button>
                  <button
                    onClick={() => updateField('type', 'auto')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      collection.type === 'auto'
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-[#3E3E4E] text-[#9CA3AF] hover:bg-[#4E4E5E]'
                    }`}
                  >
                    Auto (Rule-based)
                  </button>
                </div>
              </div>
            </div>

            {/* Manual Selection */}
            {collection.type === 'manual' && (
              <div className="bg-[#1E1E2E] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Content</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Available */}
                  <div>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {availableVideos.map(video => (
                        <button
                          key={video.id}
                          onClick={() => handleAddVideo(video.id)}
                          className="w-full flex items-center gap-2 p-2 hover:bg-[#2E2E3E] rounded-lg text-left transition-colors"
                        >
                          <img
                            src={video.thumbnail}
                            alt=""
                            className="w-12 h-7 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{video.title}</p>
                          </div>
                          <Plus className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected */}
                  <div>
                    <p className="text-sm text-[#6B7280] mb-3">
                      {selectedVideos.length} selected
                    </p>
                    <DraggableList
                      items={selectedItems}
                      onReorder={handleReorderVideos}
                      onRemove={handleRemoveVideo}
                      showDuration={true}
                      emptyMessage="Add content from the left"
                      className="max-h-64 overflow-y-auto"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Auto Rules */}
            {collection.type === 'auto' && collection.autoRules && (
              <div className="bg-[#1E1E2E] rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Auto Rules</h2>

                {/* Include Tags */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Include Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {collection.autoRules.includeTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => handleRemoveIncludeTag(tag)}
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
                      onKeyDown={(e) => e.key === 'Enter' && handleAddIncludeTag()}
                      placeholder="Add tag"
                      className="flex-1 px-3 py-1.5 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <button
                      onClick={handleAddIncludeTag}
                      className="px-3 py-1.5 bg-[#3E3E4E] hover:bg-[#4E4E5E] text-white text-sm rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Sort & Limit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Sort By
                    </label>
                    <select
                      value={collection.autoRules.sortBy}
                      onChange={(e) => updateAutoRules('sortBy', e.target.value as AutoRules['sortBy'])}
                      className="w-full px-3 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="duration">Duration</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Limit
                    </label>
                    <input
                      type="number"
                      value={collection.autoRules.limit}
                      onChange={(e) => updateAutoRules('limit', parseInt(e.target.value) || 10)}
                      min={1}
                      max={50}
                      className="w-full px-3 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Preview ({autoPreview.length} matches)
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {autoPreview.slice(0, 5).map(ep => (
                      <div
                        key={ep.id}
                        className="flex items-center gap-2 p-2 bg-[#13131A] rounded-lg"
                      >
                        <img
                          src={ep.artwork.thumbnail || ep.thumbnail}
                          alt=""
                          className="w-10 h-6 rounded object-cover"
                        />
                        <span className="text-xs text-white truncate">{ep.title}</span>
                      </div>
                    ))}
                    {autoPreview.length > 5 && (
                      <p className="text-xs text-[#6B7280] p-2">
                        +{autoPreview.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <ArtworkUploader
                value={collection.thumbnail}
                onChange={(value) => updateField('thumbnail', value)}
                label="Collection Thumbnail"
                aspectRatio="16:9"
              />
            </div>

            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Type</span>
                  <span className="text-white capitalize">{collection.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Items</span>
                  <span className="text-white">
                    {collection.type === 'manual'
                      ? collection.episodeIds?.length || 0
                      : autoPreview.length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Created</span>
                  <span className="text-white">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionEditor;
