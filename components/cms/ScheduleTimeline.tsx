import React, { useMemo, useCallback, useState, useRef } from 'react';
import { Clock, X, GripVertical, Plus } from 'lucide-react';
import { CMSScheduleBlock } from '../../types/cms';
import { INITIAL_VIDEOS } from '../../constants';

interface ScheduleTimelineProps {
  blocks: CMSScheduleBlock[];
  onChange: (blocks: CMSScheduleBlock[]) => void;
  onAddBlock?: (time: number) => void;
  startHour?: number;
  endHour?: number;
}

const HOUR_HEIGHT = 120; // pixels per hour
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  blocks,
  onChange,
  onAddBlock,
  startHour = 0,
  endHour = 24,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate block positions based on accumulated duration
  const positionedBlocks = useMemo(() => {
    let currentMinutes = startHour * 60;
    return blocks.map((block, index) => {
      const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
      const durationMinutes = video ? video.duration / 60 : 0;
      const startMinutes = currentMinutes;
      currentMinutes += durationMinutes;

      return {
        ...block,
        video,
        startMinutes,
        durationMinutes,
        top: (startMinutes - startHour * 60) * MINUTE_HEIGHT,
        height: durationMinutes * MINUTE_HEIGHT,
      };
    });
  }, [blocks, startHour]);

  const totalDurationMinutes = useMemo(() => {
    return blocks.reduce((sum, block) => {
      const video = INITIAL_VIDEOS.find(v => v.id === block.videoId);
      return sum + (video ? video.duration / 60 : 0);
    }, 0);
  }, [blocks]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top + timelineRef.current.scrollTop;
      const minutes = Math.floor(y / MINUTE_HEIGHT) + startHour * 60;
      setDropTime(minutes);
    }
  }, [startHour]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropTime(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newBlocks.splice(insertIndex, 0, draggedBlock);

    // Reorder
    const reordered = newBlocks.map((block, i) => ({ ...block, order: i }));
    onChange(reordered);
    handleDragEnd();
  }, [draggedIndex, blocks, onChange, handleDragEnd]);

  const handleRemoveBlock = useCallback((index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks.map((block, i) => ({ ...block, order: i })));
  }, [blocks, onChange]);

  const handleMoveBlock = useCallback((index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks.map((block, i) => ({ ...block, order: i })));
  }, [blocks, onChange]);

  const hours = Array.from(
    { length: Math.ceil(totalDurationMinutes / 60) + 1 },
    (_, i) => startHour + i
  );

  return (
    <div className="relative bg-[#13131A] rounded-xl overflow-hidden">
      {/* Timeline Header */}
      <div className="sticky top-0 z-10 bg-[#1E1E2E] border-b border-[#2E2E3E] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Clock className="w-4 h-4" />
          <span>Total: {formatDuration(totalDurationMinutes * 60)}</span>
        </div>
        <div className="text-xs text-[#6B7280]">
          {blocks.length} blocks scheduled
        </div>
      </div>

      <div
        ref={timelineRef}
        className="relative overflow-y-auto"
        style={{ height: 400 }}
        onDragOver={handleDragOver}
      >
        {/* Time Markers */}
        <div className="absolute left-0 top-0 w-16 border-r border-[#2E2E3E] bg-[#1E1E2E]/50 z-10">
          {hours.map(hour => (
            <div
              key={hour}
              className="h-[120px] border-b border-[#2E2E3E] flex items-start justify-center pt-1"
            >
              <span className="text-xs text-[#6B7280]">
                {formatTime(hour * 60)}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="ml-16 relative" style={{ minHeight: hours.length * HOUR_HEIGHT }}>
          {/* Hour Lines */}
          {hours.map(hour => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-b border-[#2E2E3E]"
              style={{ top: (hour - startHour) * HOUR_HEIGHT }}
            />
          ))}

          {/* Drop Indicator */}
          {dropTime !== null && draggedIndex !== null && (
            <div
              className="absolute left-0 right-0 h-1 bg-[#8B5CF6] z-20"
              style={{ top: (dropTime - startHour * 60) * MINUTE_HEIGHT }}
            />
          )}

          {/* Schedule Blocks */}
          {positionedBlocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              className={`absolute left-2 right-2 rounded-lg overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
                draggedIndex === index ? 'opacity-50 z-30' : 'z-10'
              }`}
              style={{
                top: block.top,
                height: Math.max(block.height, 40),
              }}
            >
              <div
                className="h-full flex items-stretch"
                style={{ backgroundColor: `hsl(${(index * 360) / Math.max(blocks.length, 1)}, 50%, 30%)` }}
              >
                {/* Drag Handle */}
                <div className="w-6 bg-black/20 flex items-center justify-center flex-shrink-0">
                  <GripVertical className="w-4 h-4 text-white/60" />
                </div>

                {/* Thumbnail */}
                {block.video && block.height > 50 && (
                  <div className="w-16 flex-shrink-0">
                    <img
                      src={block.video.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-2 min-w-0 flex flex-col justify-center">
                  <p className="text-xs font-medium text-white truncate">
                    {block.video?.title || 'Unknown'}
                  </p>
                  {block.height > 50 && (
                    <p className="text-[10px] text-white/60">
                      {formatTime(block.startMinutes)} - {formatTime(block.startMinutes + block.durationMinutes)}
                    </p>
                  )}
                </div>

                {/* Duration Badge */}
                <div className="px-2 flex items-center">
                  <span className="text-[10px] text-white/80 bg-black/30 px-1.5 py-0.5 rounded">
                    {formatDuration(block.durationMinutes * 60)}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBlock(index);
                  }}
                  className="w-6 bg-red-500/0 hover:bg-red-500/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-white/60 hover:text-white" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Block Zone */}
          {blocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-[#6B7280]">
                <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Drag episodes here to schedule</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTimeline;
