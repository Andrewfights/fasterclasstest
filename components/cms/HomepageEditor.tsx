import React, { useState, useMemo } from 'react';
import {
  Home,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  GripVertical,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Video,
  BookOpen,
  Tv,
  Star,
  Clock,
  Search,
} from 'lucide-react';
import { INITIAL_VIDEOS, COURSES } from '../../constants';
import { HomepageSection, Video as VideoType, Course } from '../../types';

// Default sections
const DEFAULT_SECTIONS: HomepageSection[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Carousel',
    enabled: true,
    order: 0,
    config: {
      videoIds: INITIAL_VIDEOS.slice(0, 5).map(v => v.id),
      maxItems: 5,
    },
  },
  {
    id: 'continue',
    type: 'continue',
    title: 'Continue Watching',
    enabled: true,
    order: 1,
    config: {
      isAuto: true,
    },
  },
  {
    id: 'featured-courses',
    type: 'courses',
    title: 'Featured Courses',
    enabled: true,
    order: 2,
    config: {
      courseIds: COURSES.slice(0, 4).map(c => c.id),
      maxItems: 4,
    },
  },
  {
    id: 'popular',
    type: 'videos',
    title: 'Popular This Week',
    enabled: true,
    order: 3,
    config: {
      videoIds: INITIAL_VIDEOS.slice(5, 15).map(v => v.id),
      maxItems: 10,
    },
  },
  {
    id: 'new-releases',
    type: 'videos',
    title: 'New Releases',
    enabled: true,
    order: 4,
    config: {
      videoIds: INITIAL_VIDEOS.slice(15, 25).map(v => v.id),
      maxItems: 10,
    },
  },
];

const STORAGE_KEY = 'fasterclass_homepage_config';

const loadSections = (): HomepageSection[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load homepage config:', e);
  }
  return DEFAULT_SECTIONS;
};

const saveSections = (sections: HomepageSection[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  } catch (e) {
    console.error('Failed to save homepage config:', e);
  }
};

// Section type icons
const getSectionIcon = (type: HomepageSection['type']) => {
  switch (type) {
    case 'hero':
      return <Star className="w-5 h-5" />;
    case 'continue':
      return <Clock className="w-5 h-5" />;
    case 'courses':
      return <BookOpen className="w-5 h-5" />;
    case 'videos':
      return <Video className="w-5 h-5" />;
    case 'category':
      return <Tv className="w-5 h-5" />;
    default:
      return <Home className="w-5 h-5" />;
  }
};

// Section type labels
const getSectionTypeLabel = (type: HomepageSection['type']) => {
  switch (type) {
    case 'hero':
      return 'Hero Carousel';
    case 'continue':
      return 'Continue Watching (Auto)';
    case 'courses':
      return 'Course Collection';
    case 'videos':
      return 'Video Collection';
    case 'category':
      return 'Category Feed';
    default:
      return type;
  }
};

export const HomepageEditor: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>(loadSections);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [videoSearch, setVideoSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Sort sections by order
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );

  // Filter videos for selection
  const filteredVideos = useMemo(() => {
    if (!videoSearch.trim()) return INITIAL_VIDEOS;
    const query = videoSearch.toLowerCase();
    return INITIAL_VIDEOS.filter(
      v =>
        v.title.toLowerCase().includes(query) ||
        v.expert.toLowerCase().includes(query)
    );
  }, [videoSearch]);

  // Filter courses for selection
  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return COURSES;
    const query = courseSearch.toLowerCase();
    return COURSES.filter(
      c =>
        c.title.toLowerCase().includes(query) ||
        c.topic.toLowerCase().includes(query)
    );
  }, [courseSearch]);

  // Toggle section visibility
  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(s =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      )
    );
    setHasChanges(true);
  };

  // Move section up/down
  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex(s => s.id === sectionId);
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === sorted.length - 1)
      ) {
        return prev;
      }

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...sorted];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated.map((s, i) => ({ ...s, order: i }));
    });
    setHasChanges(true);
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    setHasChanges(true);
  };

  // Add new section
  const addSection = (type: HomepageSection['type']) => {
    const newSection: HomepageSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${getSectionTypeLabel(type)}`,
      enabled: true,
      order: sections.length,
      config: {
        videoIds: type === 'videos' || type === 'hero' ? [] : undefined,
        courseIds: type === 'courses' ? [] : undefined,
        maxItems: 10,
        isAuto: type === 'continue',
      },
    };
    setSections(prev => [...prev, newSection]);
    setEditingSection(newSection);
    setShowAddModal(false);
    setHasChanges(true);
  };

  // Update section
  const updateSection = (updated: HomepageSection) => {
    setSections(prev =>
      prev.map(s => (s.id === updated.id ? updated : s))
    );
    setHasChanges(true);
  };

  // Toggle video in section
  const toggleVideoInSection = (videoId: string) => {
    if (!editingSection) return;
    const currentIds = editingSection.config.videoIds || [];
    const newIds = currentIds.includes(videoId)
      ? currentIds.filter(id => id !== videoId)
      : [...currentIds, videoId];

    updateSection({
      ...editingSection,
      config: { ...editingSection.config, videoIds: newIds },
    });
    setEditingSection(prev =>
      prev ? { ...prev, config: { ...prev.config, videoIds: newIds } } : null
    );
  };

  // Toggle course in section
  const toggleCourseInSection = (courseId: string) => {
    if (!editingSection) return;
    const currentIds = editingSection.config.courseIds || [];
    const newIds = currentIds.includes(courseId)
      ? currentIds.filter(id => id !== courseId)
      : [...currentIds, courseId];

    updateSection({
      ...editingSection,
      config: { ...editingSection.config, courseIds: newIds },
    });
    setEditingSection(prev =>
      prev ? { ...prev, config: { ...prev.config, courseIds: newIds } } : null
    );
  };

  // Save all changes
  const handleSave = () => {
    saveSections(sections);
    setHasChanges(false);
  };

  // Reset to defaults
  const handleReset = () => {
    setSections(DEFAULT_SECTIONS);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Homepage Editor</h1>
          <p className="text-[#6B7280] mt-1">Curate and arrange homepage sections</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-amber-500 text-sm">Unsaved changes</span>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              hasChanges
                ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                : 'bg-[#2E2E3E] text-[#6B7280] cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section List */}
        <div className="lg:col-span-2 space-y-3">
          {sortedSections.map((section, index) => (
            <div
              key={section.id}
              className={`bg-[#1A1A24] rounded-xl border transition-colors ${
                section.enabled
                  ? 'border-[#2E2E3E]'
                  : 'border-[#2E2E3E]/50 opacity-60'
              }`}
            >
              <div className="p-4 flex items-center gap-4">
                {/* Drag handle */}
                <div className="text-[#6B7280] cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Section icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    section.enabled ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-[#2E2E3E] text-[#6B7280]'
                  }`}
                >
                  {getSectionIcon(section.type)}
                </div>

                {/* Section info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{section.title}</h3>
                  <p className="text-sm text-[#6B7280]">
                    {getSectionTypeLabel(section.type)}
                    {section.config.videoIds && ` • ${section.config.videoIds.length} videos`}
                    {section.config.courseIds && ` • ${section.config.courseIds.length} courses`}
                    {section.config.isAuto && ' • Auto-populated'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#2E2E3E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === sortedSections.length - 1}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#2E2E3E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      section.enabled
                        ? 'text-[#22C55E] hover:bg-[#22C55E]/10'
                        : 'text-[#6B7280] hover:bg-[#2E2E3E]'
                    }`}
                  >
                    {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingSection(section)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#2E2E3E] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {section.type !== 'hero' && section.type !== 'continue' && (
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Section Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full p-4 bg-[#1A1A24] rounded-xl border border-dashed border-[#2E2E3E] hover:border-[#8B5CF6]/50 text-[#6B7280] hover:text-[#8B5CF6] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Section
          </button>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-4">
            <h3 className="font-medium text-white mb-3">Preview</h3>
            <div className="bg-[#0D0D12] rounded-lg p-3 space-y-2">
              {sortedSections
                .filter(s => s.enabled)
                .map(section => (
                  <div
                    key={section.id}
                    className="flex items-center gap-2 p-2 bg-[#1A1A24] rounded"
                  >
                    <div className="w-6 h-6 rounded bg-[#8B5CF6]/20 flex items-center justify-center">
                      {getSectionIcon(section.type)}
                    </div>
                    <span className="text-xs text-white truncate">{section.title}</span>
                  </div>
                ))}
            </div>
            <p className="text-xs text-[#6B7280] mt-3 text-center">
              {sortedSections.filter(s => s.enabled).length} sections visible
            </p>
          </div>

          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] p-4">
            <h3 className="font-medium text-white mb-3">Tips</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6]">•</span>
                Drag sections to reorder them
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6]">•</span>
                Click the eye icon to hide/show sections
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6]">•</span>
                Edit sections to customize their content
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6]">•</span>
                Changes are saved to localStorage
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] w-full max-w-md">
            <div className="p-4 border-b border-[#2E2E3E] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add Section</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#6B7280] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => addSection('videos')}
                className="w-full p-4 bg-[#0D0D12] rounded-lg border border-[#2E2E3E] hover:border-[#8B5CF6]/50 transition-colors text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-white">Video Collection</p>
                  <p className="text-sm text-[#6B7280]">Curated list of videos</p>
                </div>
              </button>
              <button
                onClick={() => addSection('courses')}
                className="w-full p-4 bg-[#0D0D12] rounded-lg border border-[#2E2E3E] hover:border-[#8B5CF6]/50 transition-colors text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-white">Course Collection</p>
                  <p className="text-sm text-[#6B7280]">Featured learning paths</p>
                </div>
              </button>
              <button
                onClick={() => addSection('category')}
                className="w-full p-4 bg-[#0D0D12] rounded-lg border border-[#2E2E3E] hover:border-[#8B5CF6]/50 transition-colors text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-white">Category Feed</p>
                  <p className="text-sm text-[#6B7280]">Auto-populated by category</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#2E2E3E] flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-white">Edit Section</h3>
              <button
                onClick={() => setEditingSection(null)}
                className="text-[#6B7280] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={e => {
                    const newSection = { ...editingSection, title: e.target.value };
                    setEditingSection(newSection);
                    updateSection(newSection);
                  }}
                  className="w-full px-3 py-2 bg-[#0D0D12] border border-[#2E2E3E] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Max Items */}
              {!editingSection.config.isAuto && (
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    Max Items to Show
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={editingSection.config.maxItems || 10}
                    onChange={e => {
                      const newSection = {
                        ...editingSection,
                        config: { ...editingSection.config, maxItems: parseInt(e.target.value) || 10 },
                      };
                      setEditingSection(newSection);
                      updateSection(newSection);
                    }}
                    className="w-24 px-3 py-2 bg-[#0D0D12] border border-[#2E2E3E] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              )}

              {/* Video Selection */}
              {(editingSection.type === 'videos' || editingSection.type === 'hero') && (
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Select Videos ({editingSection.config.videoIds?.length || 0} selected)
                  </label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={videoSearch}
                      onChange={e => setVideoSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#0D0D12] border border-[#2E2E3E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 bg-[#0D0D12] rounded-lg border border-[#2E2E3E] p-2">
                    {filteredVideos.map(video => {
                      const isSelected = editingSection.config.videoIds?.includes(video.id);
                      return (
                        <button
                          key={video.id}
                          onClick={() => toggleVideoInSection(video.id)}
                          className={`w-full p-2 rounded-lg flex items-center gap-3 transition-colors ${
                            isSelected
                              ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/50'
                              : 'hover:bg-[#1A1A24]'
                          }`}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm text-white truncate">{video.title}</p>
                            <p className="text-xs text-[#6B7280]">{video.expert}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Course Selection */}
              {editingSection.type === 'courses' && (
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Select Courses ({editingSection.config.courseIds?.length || 0} selected)
                  </label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={courseSearch}
                      onChange={e => setCourseSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#0D0D12] border border-[#2E2E3E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 bg-[#0D0D12] rounded-lg border border-[#2E2E3E] p-2">
                    {filteredCourses.map(course => {
                      const isSelected = editingSection.config.courseIds?.includes(course.id);
                      return (
                        <button
                          key={course.id}
                          onClick={() => toggleCourseInSection(course.id)}
                          className={`w-full p-2 rounded-lg flex items-center gap-3 transition-colors ${
                            isSelected
                              ? 'bg-[#22C55E]/20 border border-[#22C55E]/50'
                              : 'hover:bg-[#1A1A24]'
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: course.color + '30' }}
                          >
                            {course.iconEmoji}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm text-white truncate">{course.title}</p>
                            <p className="text-xs text-[#6B7280]">{course.topic}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Auto-populated info */}
              {editingSection.config.isAuto && (
                <div className="bg-[#0D0D12] rounded-lg p-4 border border-[#2E2E3E]">
                  <p className="text-sm text-[#6B7280]">
                    This section is automatically populated based on user activity.
                    Content is determined dynamically and cannot be manually configured.
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-[#2E2E3E] flex justify-end flex-shrink-0">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
