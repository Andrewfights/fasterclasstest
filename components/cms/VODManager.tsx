import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Save, Send, Plus, Eye, EyeOff, Settings, Image, LayoutList, Tag } from 'lucide-react';
import { VODConfig, HeroSlide, VODSection, VODCategory, VODTabId } from '../../types/cms';
import { cmsDataService } from '../../services/cmsDataService';
import { INITIAL_VIDEOS } from '../../constants';
import { DraggableList, DraggableItem } from './DraggableList';

const tabs: { id: VODTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'hero', label: 'Hero Carousel', icon: <Image className="w-4 h-4" /> },
  { id: 'sections', label: 'Sections', icon: <LayoutList className="w-4 h-4" /> },
  { id: 'categories', label: 'Categories', icon: <Tag className="w-4 h-4" /> },
];

export const VODManager: React.FC = () => {
  const [config, setConfig] = useState<VODConfig | null>(null);
  const [originalConfig, setOriginalConfig] = useState<VODConfig | null>(null);
  const [activeTab, setActiveTab] = useState<VODTabId>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAddHero, setShowAddHero] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  // Load config
  useEffect(() => {
    const loaded = cmsDataService.getVODConfig();
    setConfig(loaded);
    setOriginalConfig(JSON.parse(JSON.stringify(loaded)));
  }, []);

  const hasChanges = useMemo(() => {
    if (!config || !originalConfig) return false;
    return JSON.stringify(config) !== JSON.stringify(originalConfig);
  }, [config, originalConfig]);

  const handleSave = useCallback(async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      const saved = cmsDataService.saveVODConfig(config);
      setConfig(saved);
      setOriginalConfig(JSON.parse(JSON.stringify(saved)));
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  const handlePublish = useCallback(async () => {
    if (!config) return;
    setIsPublishing(true);
    try {
      cmsDataService.saveVODConfig(config);
      const published = cmsDataService.publishVODConfig();
      setConfig(published);
      setOriginalConfig(JSON.parse(JSON.stringify(published)));
    } finally {
      setIsPublishing(false);
    }
  }, [config]);

  // Hero Carousel Handlers
  const heroItems: DraggableItem[] = useMemo(() => {
    if (!config) return [];
    return config.heroCarousel.map(slide => {
      const video = INITIAL_VIDEOS.find(v => v.id === slide.episodeId);
      return {
        id: slide.id,
        title: slide.title || video?.title || 'Unknown',
        subtitle: video?.expert,
        thumbnail: slide.customThumbnail || video?.thumbnail,
        isVisible: slide.isVisible,
      };
    });
  }, [config]);

  const handleReorderHero = useCallback((items: DraggableItem[]) => {
    if (!config) return;
    const reordered = items.map((item, index) => {
      const slide = config.heroCarousel.find(s => s.id === item.id);
      return slide ? { ...slide, order: index } : null;
    }).filter(Boolean) as HeroSlide[];
    setConfig({ ...config, heroCarousel: reordered });
  }, [config]);

  const handleRemoveHero = useCallback((id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      heroCarousel: config.heroCarousel.filter(s => s.id !== id),
    });
  }, [config]);

  const handleToggleHeroVisibility = useCallback((id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      heroCarousel: config.heroCarousel.map(s =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      ),
    });
  }, [config]);

  const handleAddHero = useCallback((videoId: string) => {
    if (!config) return;
    const video = INITIAL_VIDEOS.find(v => v.id === videoId);
    if (!video) return;

    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      episodeId: videoId,
      title: video.title,
      description: `Watch ${video.expert} share insights`,
      ctaText: 'Watch Now',
      order: config.heroCarousel.length,
      isVisible: true,
    };

    setConfig({
      ...config,
      heroCarousel: [...config.heroCarousel, newSlide],
    });
    setShowAddHero(false);
  }, [config]);

  // Sections Handlers
  const sectionItems: DraggableItem[] = useMemo(() => {
    if (!config) return [];
    return config.sections.map(section => ({
      id: section.id,
      title: section.title,
      subtitle: section.type === 'auto' ? 'Auto-populated' : `${section.episodeIds?.length || 0} items`,
      badge: section.type,
      isVisible: section.isVisible,
    }));
  }, [config]);

  const handleReorderSections = useCallback((items: DraggableItem[]) => {
    if (!config) return;
    const reordered = items.map((item, index) => {
      const section = config.sections.find(s => s.id === item.id);
      return section ? { ...section, order: index } : null;
    }).filter(Boolean) as VODSection[];
    setConfig({ ...config, sections: reordered });
  }, [config]);

  const handleRemoveSection = useCallback((id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      sections: config.sections.filter(s => s.id !== id),
    });
  }, [config]);

  const handleToggleSectionVisibility = useCallback((id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      sections: config.sections.map(s =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      ),
    });
  }, [config]);

  const handleAddSection = useCallback((type: VODSection['type'], title: string) => {
    if (!config) return;

    const newSection: VODSection = {
      id: `section-${Date.now()}`,
      title,
      type,
      isVisible: true,
      order: config.sections.length,
      episodeIds: type === 'manual' ? [] : undefined,
      autoRules: type === 'auto' ? {
        includeTags: [],
        excludeTags: [],
        sortBy: 'recent',
        sortOrder: 'desc',
        limit: 10,
      } : undefined,
    };

    setConfig({
      ...config,
      sections: [...config.sections, newSection],
    });
    setShowAddSection(false);
  }, [config]);

  // Categories Handlers
  const categoryItems: DraggableItem[] = useMemo(() => {
    if (!config) return [];
    return config.categories.map(cat => ({
      id: cat.id,
      title: cat.name,
      subtitle: cat.slug,
      badge: cat.icon,
      isVisible: cat.isVisible,
    }));
  }, [config]);

  const handleReorderCategories = useCallback((items: DraggableItem[]) => {
    if (!config) return;
    const reordered = items.map((item, index) => {
      const category = config.categories.find(c => c.id === item.id);
      return category ? { ...category, order: index } : null;
    }).filter(Boolean) as VODCategory[];
    setConfig({ ...config, categories: reordered });
  }, [config]);

  const handleToggleCategoryVisibility = useCallback((id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      categories: config.categories.map(c =>
        c.id === id ? { ...c, isVisible: !c.isVisible } : c
      ),
    });
  }, [config]);

  if (!config) {
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
          <div>
            <h1 className="text-xl font-bold text-white">VOD Manager</h1>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                config.status === 'published'
                  ? 'bg-green-500/20 text-green-400'
                  : config.status === 'modified'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
              }`}>
                {config.status}
              </span>
              {hasChanges && (
                <span className="text-xs text-[#F5C518]">Unsaved changes</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('/vod', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E2E3E] hover:bg-[#3E3E4E] text-white font-medium rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="flex items-center gap-2 px-4 py-2 bg-[#3E3E4E] hover:bg-[#4E4E5E] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#8B5CF6] text-white'
                  : 'border-transparent text-[#6B7280] hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Hero Carousel Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Hero Carousel</h2>
                  <p className="text-sm text-[#6B7280]">
                    Featured content shown at the top of the VOD page
                  </p>
                </div>
                <button
                  onClick={() => setShowAddHero(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Slide
                </button>
              </div>

              <DraggableList
                items={heroItems}
                onReorder={handleReorderHero}
                onRemove={handleRemoveHero}
                onToggleVisibility={handleToggleHeroVisibility}
                showVisibilityToggle={true}
                emptyMessage="No hero slides. Add content to feature."
              />
            </div>

            {/* Add Hero Modal */}
            {showAddHero && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="bg-[#1E1E2E] rounded-xl w-full max-w-md p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Add to Hero Carousel</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {INITIAL_VIDEOS.slice(0, 20).map(video => (
                      <button
                        key={video.id}
                        onClick={() => handleAddHero(video.id)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-[#2E2E3E] rounded-lg text-left transition-colors"
                      >
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-16 h-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{video.title}</p>
                          <p className="text-xs text-[#6B7280]">{video.expert}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAddHero(false)}
                    className="w-full mt-4 py-2 bg-[#3E3E4E] hover:bg-[#4E4E5E] text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Content Sections</h2>
                  <p className="text-sm text-[#6B7280]">
                    Rows of content displayed on the VOD page
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSection(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>

              <DraggableList
                items={sectionItems}
                onReorder={handleReorderSections}
                onRemove={handleRemoveSection}
                onToggleVisibility={handleToggleSectionVisibility}
                showVisibilityToggle={true}
                emptyMessage="No sections. Add content rows."
              />
            </div>

            {/* Add Section Modal */}
            {showAddSection && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="bg-[#1E1E2E] rounded-xl w-full max-w-sm p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Add Section</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddSection('manual', 'New Section')}
                      className="w-full p-4 bg-[#13131A] hover:bg-[#2E2E3E] rounded-lg text-left transition-colors"
                    >
                      <p className="text-white font-medium">Manual Section</p>
                      <p className="text-xs text-[#6B7280]">Hand-pick specific content</p>
                    </button>
                    <button
                      onClick={() => handleAddSection('auto', 'New Auto Section')}
                      className="w-full p-4 bg-[#13131A] hover:bg-[#2E2E3E] rounded-lg text-left transition-colors"
                    >
                      <p className="text-white font-medium">Auto Section</p>
                      <p className="text-xs text-[#6B7280]">Auto-populate based on rules</p>
                    </button>
                    <button
                      onClick={() => handleAddSection('collection', 'Collection Section')}
                      className="w-full p-4 bg-[#13131A] hover:bg-[#2E2E3E] rounded-lg text-left transition-colors"
                    >
                      <p className="text-white font-medium">Collection</p>
                      <p className="text-xs text-[#6B7280]">Link to an existing collection</p>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAddSection(false)}
                    className="w-full mt-4 py-2 bg-[#3E3E4E] hover:bg-[#4E4E5E] text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Categories</h2>
                  <p className="text-sm text-[#6B7280]">
                    Filter pills shown in the VOD sidebar
                  </p>
                </div>
              </div>

              <DraggableList
                items={categoryItems}
                onReorder={handleReorderCategories}
                onToggleVisibility={handleToggleCategoryVisibility}
                showVisibilityToggle={true}
                emptyMessage="No categories configured"
              />
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-6 bg-[#1E1E2E] rounded-xl p-6">
          <h3 className="text-sm font-medium text-[#6B7280] mb-3">Metadata</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#6B7280]">Last Published</span>
              <p className="text-white">
                {config.lastPublished
                  ? new Date(config.lastPublished).toLocaleString()
                  : 'Never'}
              </p>
            </div>
            <div>
              <span className="text-[#6B7280]">Last Saved</span>
              <p className="text-white">
                {config.lastSaved
                  ? new Date(config.lastSaved).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VODManager;
