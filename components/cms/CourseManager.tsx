import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  GripVertical,
  X,
  Video,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Course, Video as VideoType } from '../../types';
import { COURSES, INITIAL_VIDEOS, formatDuration } from '../../constants';

export const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Filter courses
  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const handleDelete = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setDeleteConfirm(null);
  };

  const getCourseDuration = (course: Course) => {
    const totalSeconds = course.videoIds.reduce((acc, id) => {
      const video = INITIAL_VIDEOS.find(v => v.id === id);
      return acc + (video?.duration || 0);
    }, 0);
    return formatDuration(totalSeconds);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-[#6B7280] mt-1">{courses.length} courses available</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A24] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
        />
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.map((course, index) => (
          <div
            key={course.id}
            className="bg-[#1A1A24] rounded-xl border border-[#2E2E3E] overflow-hidden"
          >
            {/* Course Header */}
            <div
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#1E1E2E] transition-colors"
              onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: course.color + '20' }}
                >
                  {course.iconEmoji}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{course.title}</h3>
                    <span
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{ backgroundColor: course.color + '20', color: course.color }}
                    >
                      {course.topic}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] truncate">{course.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-[#6B7280]">
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>{course.videoIds.length} videos</span>
                </div>
                <span>{getCourseDuration(course)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCourse(course);
                  }}
                  className="p-2 text-[#6B7280] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(course.id);
                  }}
                  className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedCourse === course.id ? (
                  <ChevronUp className="w-5 h-5 text-[#6B7280]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#6B7280]" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCourse === course.id && (
              <div className="border-t border-[#2E2E3E] p-4 bg-[#0D0D12]">
                <h4 className="text-sm font-medium text-[#9CA3AF] mb-3">Videos in this course:</h4>
                <div className="space-y-2">
                  {course.videoIds.map((videoId, idx) => {
                    const video = INITIAL_VIDEOS.find(v => v.id === videoId);
                    if (!video) return null;

                    return (
                      <div
                        key={videoId}
                        className="flex items-center gap-3 p-2 bg-[#1A1A24] rounded-lg"
                      >
                        <span className="w-6 h-6 bg-[#2E2E3E] rounded flex items-center justify-center text-xs text-[#6B7280]">
                          {idx + 1}
                        </span>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{video.title}</p>
                          <p className="text-xs text-[#6B7280]">{video.expert}</p>
                        </div>
                        <span className="text-xs text-[#6B7280]">
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCourse) && (
        <CourseModal
          course={editingCourse}
          onClose={() => {
            setShowAddModal(false);
            setEditingCourse(null);
          }}
          onSave={(course) => {
            if (editingCourse) {
              setCourses(prev => prev.map(c => c.id === course.id ? course : c));
            } else {
              setCourses(prev => [...prev, course]);
            }
            setShowAddModal(false);
            setEditingCourse(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-2">Delete Course?</h3>
            <p className="text-[#9CA3AF] mb-6">
              This will remove the course. Videos will not be deleted.
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

// Course Add/Edit Modal
interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    topic: course?.topic || '',
    iconEmoji: course?.iconEmoji || '',
    color: course?.color || '#8B5CF6',
    videoIds: course?.videoIds || [],
  });
  const [videoSearch, setVideoSearch] = useState('');

  const availableVideos = useMemo(() => {
    if (!videoSearch) return INITIAL_VIDEOS;
    return INITIAL_VIDEOS.filter(v =>
      v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      v.expert.toLowerCase().includes(videoSearch.toLowerCase())
    );
  }, [videoSearch]);

  const toggleVideo = (videoId: string) => {
    setFormData(prev => ({
      ...prev,
      videoIds: prev.videoIds.includes(videoId)
        ? prev.videoIds.filter(id => id !== videoId)
        : [...prev.videoIds, videoId],
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.topic) return;

    const newCourse: Course = {
      id: course?.id || `course-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      topic: formData.topic,
      iconEmoji: formData.iconEmoji || '',
      color: formData.color,
      videoIds: formData.videoIds,
      coverImage: course?.coverImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800',
      order: course?.order || COURSES.length + 1,
    };

    onSave(newCourse);
  };

  const colorOptions = [
    '#8B5CF6', '#22C55E', '#3B82F6', '#F59E0B',
    '#EC4899', '#EF4444', '#06B6D4', '#10B981',
  ];

  const emojiOptions = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A24] rounded-2xl border border-[#2E2E3E] p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {course ? 'Edit Course' : 'Create Course'}
          </h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Course title"
              className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Course description"
              rows={3}
              className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] resize-none"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Topic *</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g. Ideas, Product, Growth"
              className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Icon & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Icon</label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setFormData(prev => ({ ...prev, iconEmoji: emoji }))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                      formData.iconEmoji === emoji
                        ? 'bg-[#8B5CF6] ring-2 ring-[#8B5CF6]'
                        : 'bg-[#0D0D12] hover:bg-[#2E2E3E]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Video Selection */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
              Videos ({formData.videoIds.length} selected)
            </label>
            <input
              type="text"
              value={videoSearch}
              onChange={(e) => setVideoSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-4 py-2.5 bg-[#0D0D12] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] mb-2"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 bg-[#0D0D12] rounded-xl p-2 border border-[#2E2E3E]">
              {availableVideos.map(video => (
                <button
                  key={video.id}
                  onClick={() => toggleVideo(video.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                    formData.videoIds.includes(video.id)
                      ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]'
                      : 'hover:bg-[#1A1A24]'
                  }`}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{video.title}</p>
                    <p className="text-xs text-[#6B7280]">{video.expert}</p>
                  </div>
                  {formData.videoIds.includes(video.id) && (
                    <span className="text-xs text-[#8B5CF6]">
                      #{formData.videoIds.indexOf(video.id) + 1}
                    </span>
                  )}
                </button>
              ))}
            </div>
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
            className="flex-1 px-4 py-2.5 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors"
          >
            {course ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseManager;
