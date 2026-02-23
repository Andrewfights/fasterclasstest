import React, { useMemo } from 'react';
import { X, Send, AlertTriangle, Check, Clock, ListVideo, Calendar } from 'lucide-react';
import { CMSChannel } from '../../types/cms';
import { INITIAL_VIDEOS } from '../../constants';

interface PublishWorkflowProps {
  channel: CMSChannel;
  onPublish: () => void;
  onClose: () => void;
  isPublishing: boolean;
}

export const PublishWorkflow: React.FC<PublishWorkflowProps> = ({
  channel,
  onPublish,
  onClose,
  isPublishing,
}) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Calculate changes
  const changes = useMemo(() => {
    const changesList: { type: 'added' | 'removed' | 'changed'; description: string }[] = [];

    // Compare library
    const oldLibrary = new Set(channel.schedule.published.map(b => b.videoId));
    const newLibrary = new Set(channel.schedule.draft.map(b => b.videoId));

    // Added videos
    channel.schedule.draft.forEach(block => {
      if (!oldLibrary.has(block.videoId)) {
        const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
        changesList.push({
          type: 'added',
          description: `Added "${video?.title || 'Unknown'}" to schedule`,
        });
      }
    });

    // Removed videos
    channel.schedule.published.forEach(block => {
      if (!newLibrary.has(block.videoId)) {
        const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
        changesList.push({
          type: 'removed',
          description: `Removed "${video?.title || 'Unknown'}" from schedule`,
        });
      }
    });

    // Order changes
    if (changesList.length === 0 &&
        channel.schedule.draft.length === channel.schedule.published.length &&
        channel.schedule.draft.length > 0) {
      const orderChanged = channel.schedule.draft.some((block, i) =>
        block.videoId !== channel.schedule.published[i]?.videoId
      );
      if (orderChanged) {
        changesList.push({
          type: 'changed',
          description: 'Schedule order has been changed',
        });
      }
    }

    return changesList;
  }, [channel.schedule.draft, channel.schedule.published]);

  // Stats
  const draftStats = useMemo(() => {
    const totalDuration = channel.schedule.draft.reduce((sum, block) => {
      const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
      return sum + (video?.duration || 0);
    }, 0);

    return {
      blocks: channel.schedule.draft.length,
      duration: totalDuration,
    };
  }, [channel.schedule.draft]);

  const publishedStats = useMemo(() => {
    const totalDuration = channel.schedule.published.reduce((sum, block) => {
      const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
      return sum + (video?.duration || 0);
    }, 0);

    return {
      blocks: channel.schedule.published.length,
      duration: totalDuration,
    };
  }, [channel.schedule.published]);

  const hasChanges = changes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#1E1E2E] rounded-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E2E3E]">
          <h2 className="text-lg font-semibold text-white">Publish Channel</h2>
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="p-2 hover:bg-[#2E2E3E] rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Channel Info */}
          <div className="flex items-center gap-4 p-4 bg-[#13131A] rounded-xl">
            <span className="text-3xl">{channel.logo}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
              <p className="text-sm text-[#6B7280]">Channel #{channel.number}</p>
            </div>
          </div>

          {/* Changes */}
          {hasChanges ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Changes to Publish
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {changes.map((change, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      change.type === 'added'
                        ? 'bg-green-500/10 text-green-400'
                        : change.type === 'removed'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {change.type === 'added' && <span>+</span>}
                    {change.type === 'removed' && <span>-</span>}
                    {change.type === 'changed' && <span>~</span>}
                    {change.description}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-500/10 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-400">No Changes</p>
                <p className="text-xs text-green-400/70">
                  The schedule is already up to date
                </p>
              </div>
            </div>
          )}

          {/* Stats Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#13131A] rounded-xl">
              <h4 className="text-xs text-[#6B7280] mb-2">Current (Published)</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-white">
                  <ListVideo className="w-4 h-4 text-[#6B7280]" />
                  {publishedStats.blocks} blocks
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  {formatDuration(publishedStats.duration)}
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl">
              <h4 className="text-xs text-[#8B5CF6] mb-2">New (Draft)</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-white">
                  <ListVideo className="w-4 h-4 text-[#8B5CF6]" />
                  {draftStats.blocks} blocks
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-[#8B5CF6]" />
                  {formatDuration(draftStats.duration)}
                </div>
              </div>
            </div>
          </div>

          {/* Last Published */}
          {channel.schedule.lastPublished && (
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Calendar className="w-4 h-4" />
              Last published: {new Date(channel.schedule.lastPublished).toLocaleString()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2E2E3E]">
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="px-4 py-2 text-white hover:bg-[#2E2E3E] rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onPublish}
            disabled={isPublishing || !hasChanges}
            className="flex items-center gap-2 px-6 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-[#3E3E4E] disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isPublishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishWorkflow;
