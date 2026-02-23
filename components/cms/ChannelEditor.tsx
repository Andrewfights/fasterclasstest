import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, ListVideo, Calendar, Save, Send, Eye } from 'lucide-react';
import { CMSChannel, TabId } from '../../types/cms';
import { cmsDataService } from '../../services/cmsDataService';
import { ChannelDetails } from './ChannelDetails';
import { ChannelLibrary } from './ChannelLibrary';
import { ChannelScheduler } from './ChannelScheduler';
import { PublishWorkflow } from './PublishWorkflow';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'details', label: 'Details', icon: <Settings className="w-4 h-4" /> },
  { id: 'library', label: 'Library', icon: <ListVideo className="w-4 h-4" /> },
  { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
];

export const ChannelEditor: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();

  const [channel, setChannel] = useState<CMSChannel | null>(null);
  const [originalChannel, setOriginalChannel] = useState<CMSChannel | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Load channel
  useEffect(() => {
    if (channelId) {
      const loaded = cmsDataService.getCMSChannel(channelId);
      if (loaded) {
        setChannel(loaded);
        setOriginalChannel(JSON.parse(JSON.stringify(loaded)));
      }
    }
  }, [channelId]);

  const hasChanges = useCallback(() => {
    if (!channel || !originalChannel) return false;
    return JSON.stringify(channel) !== JSON.stringify(originalChannel);
  }, [channel, originalChannel]);

  const handleSave = useCallback(async () => {
    if (!channel) return;

    setIsSaving(true);
    try {
      const saved = cmsDataService.saveCMSChannel(channel);
      setChannel(saved);
      setOriginalChannel(JSON.parse(JSON.stringify(saved)));
    } finally {
      setIsSaving(false);
    }
  }, [channel]);

  const handlePublish = useCallback(async () => {
    if (!channel) return;

    setIsPublishing(true);
    try {
      // First save any pending changes
      cmsDataService.saveCMSChannel(channel);
      // Then publish
      const published = cmsDataService.publishCMSChannel(channel.id);
      if (published) {
        setChannel(published);
        setOriginalChannel(JSON.parse(JSON.stringify(published)));
      }
      setShowPublishModal(false);
    } finally {
      setIsPublishing(false);
    }
  }, [channel]);

  const updateChannel = useCallback((updates: Partial<CMSChannel>) => {
    setChannel(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  if (!channel) {
    return (
      <div className="p-6 text-center text-white">
        <p>Loading channel...</p>
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
              onClick={() => navigate('/admin/channels')}
              className="p-2 hover:bg-[#1E1E2E] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{channel.logo}</span>
              <div>
                <h1 className="text-xl font-bold text-white">{channel.name}</h1>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    channel.status === 'published'
                      ? 'bg-green-500/20 text-green-400'
                      : channel.status === 'modified'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {channel.status}
                  </span>
                  {hasChanges() && (
                    <span className="text-xs text-[#F5C518]">Unsaved changes</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`/live?channel=${channel.id}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E2E3E] hover:bg-[#3E3E4E] text-white font-medium rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges()}
              className="flex items-center gap-2 px-4 py-2 bg-[#3E3E4E] hover:bg-[#4E4E5E] disabled:bg-[#2E2E3E] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Publish
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

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <ChannelDetails
            channel={channel}
            onChange={updateChannel}
          />
        )}
        {activeTab === 'library' && (
          <ChannelLibrary
            channel={channel}
            onChange={updateChannel}
          />
        )}
        {activeTab === 'schedule' && (
          <ChannelScheduler
            channel={channel}
            onChange={updateChannel}
          />
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishWorkflow
          channel={channel}
          onPublish={handlePublish}
          onClose={() => setShowPublishModal(false)}
          isPublishing={isPublishing}
        />
      )}
    </div>
  );
};

export default ChannelEditor;
