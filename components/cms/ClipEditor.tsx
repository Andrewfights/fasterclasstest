import React, { useState, useCallback, useMemo } from 'react';
import { X, Search, Clock, Play } from 'lucide-react';
import { CMSClip } from '../../types/cms';
import { cmsDataService } from '../../services/cmsDataService';
import { Video } from '../../types';

interface ClipEditorProps {
  clip: CMSClip | null;
  onSave: (clip: CMSClip) => void;
  onClose: () => void;
}

export const ClipEditor: React.FC<ClipEditorProps> = ({
  clip,
  onSave,
  onClose,
}) => {
  const availableVideos = useMemo(() => cmsDataService.getAvailableVideos(), []);
  const [search, setSearch] = useState('');

  const isEditing = !!clip;

  const [formData, setFormData] = useState<{
    title: string;
    sourceVideoId: string;
    startTime: number;
    endTime: number;
    thumbnail: string;
  }>({
    title: clip?.title || '',
    sourceVideoId: clip?.sourceVideoId || '',
    startTime: clip?.startTime || 0,
    endTime: clip?.endTime || 0,
    thumbnail: clip?.thumbnail || '',
  });

  const selectedVideo = useMemo(() =>
    availableVideos.find(v => v.id === formData.sourceVideoId),
    [availableVideos, formData.sourceVideoId]
  );

  const filteredVideos = useMemo(() => {
    if (!search) return availableVideos.slice(0, 20);
    return availableVideos.filter(v =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.expert.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 20);
  }, [availableVideos, search]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parseInt(timeStr) || 0;
  };

  const handleSelectVideo = useCallback((video: Video) => {
    setFormData(prev => ({
      ...prev,
      sourceVideoId: video.id,
      startTime: 0,
      endTime: video.duration,
      thumbnail: video.thumbnail,
      title: prev.title || video.title,
    }));
  }, []);

  const handleTimeChange = useCallback((field: 'startTime' | 'endTime', value: string) => {
    const seconds = parseTime(value);
    setFormData(prev => ({ ...prev, [field]: seconds }));
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.sourceVideoId || !formData.title) return;

    const clipData: CMSClip = {
      id: clip?.id || `clip-${Date.now()}`,
      title: formData.title,
      sourceVideoId: formData.sourceVideoId,
      embedUrl: selectedVideo?.embedUrl || '',
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: formData.endTime - formData.startTime,
      thumbnail: formData.thumbnail,
      order: clip?.order || 0,
    };

    onSave(clipData);
  }, [clip, formData, selectedVideo, onSave]);

  const duration = formData.endTime - formData.startTime;
  const isValid = formData.sourceVideoId && formData.title && duration > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#1E1E2E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E2E3E]">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? 'Edit Clip' : 'Add Clip'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2E2E3E] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-130px)] overflow-y-auto">
          {/* Clip Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Clip Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter clip title"
              className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Source Video Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Source Video
            </label>

            {selectedVideo ? (
              <div className="p-4 bg-[#13131A] rounded-lg border border-[#3E3E4E]">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedVideo.thumbnail}
                    alt=""
                    className="w-24 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {selectedVideo.title}
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      {selectedVideo.expert} • {formatTime(selectedVideo.duration)}
                    </p>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, sourceVideoId: '' }))}
                    className="px-3 py-1.5 bg-[#3E3E4E] hover:bg-[#4E4E5E] text-white text-sm rounded-lg transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search videos..."
                    className="w-full pl-10 pr-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 p-1">
                  {filteredVideos.map(video => (
                    <button
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-[#2E2E3E] rounded-lg text-left transition-colors"
                    >
                      <img
                        src={video.thumbnail}
                        alt=""
                        className="w-16 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{video.title}</p>
                        <p className="text-xs text-[#6B7280]">
                          {video.expert} • {formatTime(video.duration)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Time Range */}
          {selectedVideo && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Time Range
              </label>

              <div className="p-4 bg-[#13131A] rounded-lg border border-[#3E3E4E] space-y-4">
                {/* Video Preview */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`${selectedVideo.embedUrl}?start=${formData.startTime}&autoplay=0&controls=1`}
                    className="w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Time Range Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span>0:00</span>
                    <span>{formatTime(selectedVideo.duration)}</span>
                  </div>

                  {/* Visual Range Indicator */}
                  <div className="relative h-2 bg-[#3E3E4E] rounded-full">
                    <div
                      className="absolute h-full bg-[#8B5CF6] rounded-full"
                      style={{
                        left: `${(formData.startTime / selectedVideo.duration) * 100}%`,
                        width: `${((formData.endTime - formData.startTime) / selectedVideo.duration) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Time Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#6B7280] mb-1">
                        Start Time
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formatTime(formData.startTime)}
                          onChange={(e) => handleTimeChange('startTime', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#1E1E2E] border border-[#3E3E4E] rounded-lg text-sm text-white text-center focus:outline-none focus:border-[#8B5CF6]"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, startTime: 0 }))}
                          className="px-2 py-1.5 bg-[#3E3E4E] text-xs text-white rounded-lg hover:bg-[#4E4E5E] transition-colors"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#6B7280] mb-1">
                        End Time
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formatTime(formData.endTime)}
                          onChange={(e) => handleTimeChange('endTime', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#1E1E2E] border border-[#3E3E4E] rounded-lg text-sm text-white text-center focus:outline-none focus:border-[#8B5CF6]"
                        />
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            endTime: selectedVideo.duration
                          }))}
                          className="px-2 py-1.5 bg-[#3E3E4E] text-xs text-white rounded-lg hover:bg-[#4E4E5E] transition-colors"
                        >
                          End
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration Display */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-white">Clip Duration: </span>
                  <span className={`font-medium ${duration > 0 ? 'text-[#8B5CF6]' : 'text-red-400'}`}>
                    {formatTime(Math.max(0, duration))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnail Override */}
          {selectedVideo && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Thumbnail (optional override)
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={formData.thumbnail || selectedVideo.thumbnail}
                  alt=""
                  className="w-24 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="Custom thumbnail URL (optional)"
                    className="w-full px-3 py-1.5 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    Leave empty to use video thumbnail
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2E2E3E]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white hover:bg-[#2E2E3E] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-[#3E3E4E] disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            {isEditing ? 'Update Clip' : 'Add Clip'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClipEditor;
