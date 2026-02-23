import React, { useState, useCallback, useRef } from 'react';
import { GripVertical, X, Edit, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

export interface DraggableItem {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  duration?: number;
  isVisible?: boolean;
  badge?: string;
  metadata?: Record<string, string | number>;
}

interface DraggableListProps {
  items: DraggableItem[];
  onReorder: (items: DraggableItem[]) => void;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  renderItem?: (item: DraggableItem, index: number) => React.ReactNode;
  emptyMessage?: string;
  showDuration?: boolean;
  showVisibilityToggle?: boolean;
  showIndex?: boolean;
  className?: string;
}

export const DraggableList: React.FC<DraggableListProps> = ({
  items,
  onReorder,
  onRemove,
  onEdit,
  onToggleVisibility,
  renderItem,
  emptyMessage = 'No items',
  showDuration = false,
  showVisibilityToggle = false,
  showIndex = true,
  className = '',
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedItemRef = useRef<DraggableItem | null>(null);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    draggedItemRef.current = items[index];
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }, [items]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    draggedItemRef.current = null;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    onReorder(newItems);
    handleDragEnd();
  }, [draggedIndex, items, onReorder, handleDragEnd]);

  const moveItem = useCallback((index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onReorder(newItems);
  }, [items, onReorder]);

  if (items.length === 0) {
    return (
      <div className={`text-center py-8 text-[#6B7280] ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, index)}
          className={`
            group flex items-center gap-3 p-3 rounded-xl
            bg-[#1E1E2E] hover:bg-[#2E2E3E] transition-all
            border-2 cursor-grab active:cursor-grabbing
            ${draggedIndex === index ? 'opacity-50 border-[#8B5CF6]' : 'border-transparent'}
            ${dragOverIndex === index && draggedIndex !== index
              ? 'border-[#8B5CF6] border-dashed'
              : ''
            }
            ${item.isVisible === false ? 'opacity-60' : ''}
          `}
        >
          {/* Drag Handle */}
          <div className="flex-shrink-0 text-[#6B7280] cursor-grab">
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Index */}
          {showIndex && (
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#3E3E4E] flex items-center justify-center text-sm font-medium text-white">
              {index + 1}
            </div>
          )}

          {/* Custom Render or Default */}
          {renderItem ? (
            <div className="flex-1 min-w-0">
              {renderItem(item, index)}
            </div>
          ) : (
            <>
              {/* Thumbnail */}
              {item.thumbnail && (
                <div className="flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden bg-[#2E2E3E]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white truncate">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-xs text-[#6B7280] truncate">{item.subtitle}</p>
                )}
              </div>

              {/* Duration */}
              {showDuration && item.duration && (
                <div className="flex-shrink-0 text-xs text-[#9CA3AF]">
                  {formatDuration(item.duration)}
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Move Buttons (for keyboard accessibility) */}
            <button
              onClick={() => moveItem(index, 'up')}
              disabled={index === 0}
              className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => moveItem(index, 'down')}
              disabled={index === items.length - 1}
              className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>

            {/* Visibility Toggle */}
            {showVisibilityToggle && onToggleVisibility && (
              <button
                onClick={() => onToggleVisibility(item.id)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title={item.isVisible !== false ? 'Hide' : 'Show'}
              >
                {item.isVisible !== false ? (
                  <Eye className="w-4 h-4 text-white" />
                ) : (
                  <EyeOff className="w-4 h-4 text-[#6B7280]" />
                )}
              </button>
            )}

            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={() => onEdit(item.id)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-white" />
              </button>
            )}

            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Transfer List for moving items between two lists
interface TransferListProps {
  availableItems: DraggableItem[];
  selectedItems: DraggableItem[];
  onAdd: (ids: string[]) => void;
  onRemove: (ids: string[]) => void;
  onReorder: (items: DraggableItem[]) => void;
  availableTitle?: string;
  selectedTitle?: string;
  searchable?: boolean;
}

export const TransferList: React.FC<TransferListProps> = ({
  availableItems,
  selectedItems,
  onAdd,
  onRemove,
  onReorder,
  availableTitle = 'Available',
  selectedTitle = 'Selected',
  searchable = true,
}) => {
  const [search, setSearch] = useState('');
  const [selectedAvailable, setSelectedAvailable] = useState<Set<string>>(new Set());
  const [selectedInList, setSelectedInList] = useState<Set<string>>(new Set());

  const filteredAvailable = search
    ? availableItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(search.toLowerCase())
      )
    : availableItems;

  const toggleSelect = (id: string, isAvailable: boolean) => {
    if (isAvailable) {
      setSelectedAvailable(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    } else {
      setSelectedInList(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }
  };

  const handleAdd = () => {
    if (selectedAvailable.size > 0) {
      onAdd(Array.from(selectedAvailable));
      setSelectedAvailable(new Set());
    }
  };

  const handleRemove = () => {
    if (selectedInList.size > 0) {
      onRemove(Array.from(selectedInList));
      setSelectedInList(new Set());
    }
  };

  const totalDuration = selectedItems.reduce((sum, item) => sum + (item.duration || 0), 0);
  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Available Items */}
      <div className="bg-[#13131A] border border-[#2E2E3E] rounded-xl overflow-hidden">
        <div className="p-3 border-b border-[#2E2E3E]">
          <h3 className="text-sm font-medium text-white mb-2">{availableTitle}</h3>
          {searchable && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 bg-[#1E1E2E] border border-[#3E3E4E] rounded-lg text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          )}
        </div>
        <div className="max-h-64 overflow-y-auto p-2 space-y-1">
          {filteredAvailable.map(item => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id, true)}
              className={`
                flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
                ${selectedAvailable.has(item.id)
                  ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]'
                  : 'hover:bg-[#1E1E2E] border border-transparent'
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedAvailable.has(item.id)}
                onChange={() => {}}
                className="w-4 h-4 rounded border-[#3E3E4E]"
              />
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-10 h-6 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.title}</p>
                {item.duration && (
                  <p className="text-[10px] text-[#6B7280]">
                    {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-[#2E2E3E]">
          <button
            onClick={handleAdd}
            disabled={selectedAvailable.size === 0}
            className="w-full py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-[#3E3E4E] disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Selected ({selectedAvailable.size})
          </button>
        </div>
      </div>

      {/* Selected Items */}
      <div className="bg-[#13131A] border border-[#2E2E3E] rounded-xl overflow-hidden">
        <div className="p-3 border-b border-[#2E2E3E] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white">{selectedTitle}</h3>
            <p className="text-xs text-[#6B7280]">
              {selectedItems.length} items • {formatTotalDuration(totalDuration)}
            </p>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <DraggableList
            items={selectedItems}
            onReorder={onReorder}
            showDuration={true}
            showIndex={true}
            emptyMessage="Drag items here"
            className="p-2"
          />
        </div>
        <div className="p-2 border-t border-[#2E2E3E]">
          <button
            onClick={handleRemove}
            disabled={selectedInList.size === 0}
            className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 disabled:bg-[#3E3E4E] disabled:cursor-not-allowed text-red-400 text-sm font-medium rounded-lg transition-colors"
          >
            Remove Selected ({selectedInList.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraggableList;
