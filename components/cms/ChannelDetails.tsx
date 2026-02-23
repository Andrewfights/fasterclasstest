import React, { useCallback } from 'react';
import { CMSChannel } from '../../types/cms';
import { FastChannelCategory } from '../../types';
import { ArtworkUploader } from './ArtworkUploader';

interface ChannelDetailsProps {
  channel: CMSChannel;
  onChange: (updates: Partial<CMSChannel>) => void;
}

const categories: { value: FastChannelCategory; label: string }[] = [
  { value: 'learning', label: 'Learning' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'tech', label: 'Tech' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'creative', label: 'Creative' },
  { value: 'education', label: 'Education' },
  { value: 'shorts', label: 'Shorts' },
];

export const ChannelDetails: React.FC<ChannelDetailsProps> = ({
  channel,
  onChange,
}) => {
  const updateField = useCallback(<K extends keyof CMSChannel>(
    field: K,
    value: CMSChannel[K]
  ) => {
    onChange({ [field]: value } as Partial<CMSChannel>);
  }, [onChange]);

  const updateArtwork = useCallback((
    field: keyof CMSChannel['artwork'],
    value: string
  ) => {
    onChange({
      artwork: {
        ...channel.artwork,
        [field]: value,
      },
    });
  }, [channel.artwork, onChange]);

  const updateSettings = useCallback((
    field: keyof CMSChannel['settings'],
    value: boolean
  ) => {
    onChange({
      settings: {
        ...channel.settings,
        [field]: value,
      },
    });
  }, [channel.settings, onChange]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Basic Info */}
      <div className="bg-[#1E1E2E] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Channel Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left - Artwork */}
          <div className="space-y-4">
            <ArtworkUploader
              value={channel.artwork.thumbnail}
              onChange={(value) => updateArtwork('thumbnail', value)}
              label="Channel Thumbnail"
              aspectRatio="1:1"
            />

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Logo / Icon
              </label>
              <input
                type="text"
                value={channel.artwork.logo || channel.logo}
                onChange={(e) => updateArtwork('logo', e.target.value)}
                placeholder="Emoji or icon"
                className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white text-2xl text-center focus:outline-none focus:border-[#8B5CF6]"
              />
              <p className="text-xs text-[#6B7280] mt-1">
                Enter an emoji or paste an icon
              </p>
            </div>
          </div>

          {/* Right - Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Channel Name
              </label>
              <input
                type="text"
                value={channel.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Channel name"
                className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Short Name (3-4 chars)
              </label>
              <input
                type="text"
                value={channel.shortName}
                onChange={(e) => updateField('shortName', e.target.value.toUpperCase().slice(0, 4))}
                placeholder="e.g., YC, TED"
                maxLength={4}
                className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Channel Number
              </label>
              <input
                type="number"
                value={channel.number}
                onChange={(e) => updateField('number', parseInt(e.target.value) || 1)}
                min={1}
                max={999}
                className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Description
              </label>
              <textarea
                value={channel.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Channel description"
                rows={3}
                className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Category
              </label>
              <select
                value={channel.category}
                onChange={(e) => updateField('category', e.target.value as FastChannelCategory)}
                className="w-full px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Brand Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={channel.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-[#3E3E4E] cursor-pointer"
                />
                <input
                  type="text"
                  value={channel.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-4 py-2 bg-[#13131A] border border-[#3E3E4E] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6] uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#1E1E2E] rounded-xl p-6">
        <ArtworkUploader
          value={channel.artwork.banner}
          onChange={(value) => updateArtwork('banner', value)}
          label="Channel Banner"
          aspectRatio="16:9"
          placeholder="Upload a banner image (recommended: 1920x1080)"
        />
      </div>

      {/* Settings */}
      <div className="bg-[#1E1E2E] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-[#13131A] rounded-lg cursor-pointer hover:bg-[#1A1A24] transition-colors">
            <div>
              <h3 className="text-sm font-medium text-white">Auto-Schedule</h3>
              <p className="text-xs text-[#6B7280]">
                Automatically loop content in the library when no custom schedule is set
              </p>
            </div>
            <input
              type="checkbox"
              checked={channel.settings.autoSchedule}
              onChange={(e) => updateSettings('autoSchedule', e.target.checked)}
              className="w-5 h-5 rounded border-[#3E3E4E] text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-[#13131A] rounded-lg cursor-pointer hover:bg-[#1A1A24] transition-colors">
            <div>
              <h3 className="text-sm font-medium text-white">Loop Content</h3>
              <p className="text-xs text-[#6B7280]">
                Repeat the schedule from the beginning after all content has played
              </p>
            </div>
            <input
              type="checkbox"
              checked={channel.settings.loopContent}
              onChange={(e) => updateSettings('loopContent', e.target.checked)}
              className="w-5 h-5 rounded border-[#3E3E4E] text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-[#13131A] rounded-lg cursor-pointer hover:bg-[#1A1A24] transition-colors">
            <div>
              <h3 className="text-sm font-medium text-white">Premium Channel</h3>
              <p className="text-xs text-[#6B7280]">
                Restrict access to premium subscribers only
              </p>
            </div>
            <input
              type="checkbox"
              checked={channel.settings.isPremium}
              onChange={(e) => updateSettings('isPremium', e.target.checked)}
              className="w-5 h-5 rounded border-[#3E3E4E] text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
          </label>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-[#1E1E2E] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Metadata</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#6B7280]">Status</span>
            <p className={`font-medium ${
              channel.status === 'published' ? 'text-green-400' :
              channel.status === 'modified' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {channel.status}
            </p>
          </div>
          <div>
            <span className="text-[#6B7280]">Library Size</span>
            <p className="text-white font-medium">{channel.library.length} episodes</p>
          </div>
          <div>
            <span className="text-[#6B7280]">Last Published</span>
            <p className="text-white font-medium">
              {channel.schedule.lastPublished
                ? new Date(channel.schedule.lastPublished).toLocaleString()
                : 'Never'}
            </p>
          </div>
          <div>
            <span className="text-[#6B7280]">Last Saved</span>
            <p className="text-white font-medium">
              {channel.schedule.lastSaved
                ? new Date(channel.schedule.lastSaved).toLocaleString()
                : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetails;
