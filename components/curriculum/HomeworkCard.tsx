import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Circle, Lightbulb, Trophy, FileText } from 'lucide-react';
import { HomeworkAssignment, UserHomeworkProgress } from '../../types';

interface HomeworkCardProps {
  homework: HomeworkAssignment;
  progress?: UserHomeworkProgress;
  onToggleItem?: (itemId: string) => void;
  onUpdateNotes?: (notes: string) => void;
  onComplete?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({
  homework,
  progress,
  onToggleItem,
  onUpdateNotes,
  onComplete,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(progress?.notes || '');

  const completedItems = progress?.completedItems || [];
  const requiredItems = homework.actionItems.filter(item => item.isRequired);
  const completedRequired = requiredItems.filter(item => completedItems.includes(item.id)).length;
  const allRequiredDone = completedRequired === requiredItems.length;
  const totalCompleted = homework.actionItems.filter(item => completedItems.includes(item.id)).length;
  const progressPercent = (totalCompleted / homework.actionItems.length) * 100;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value);
  };

  const handleNotesSave = () => {
    onUpdateNotes?.(localNotes);
    setShowNotes(false);
  };

  return (
    <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1E1E2E] transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            progress?.completedAt
              ? 'bg-green-500/20'
              : progressPercent > 0
              ? 'bg-amber-500/20'
              : 'bg-[#c9a227]/20'
          }`}>
            {progress?.completedAt ? (
              <Trophy className="w-6 h-6 text-green-500" />
            ) : (
              <FileText className="w-6 h-6 text-[#c9a227]" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold">{homework.title}</h3>
            <p className="text-sm text-[#6B7280]">
              {totalCompleted}/{homework.actionItems.length} tasks completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* XP Badge */}
          <div className="flex items-center gap-1 px-3 py-1 bg-[#c9a227]/20 rounded-full">
            <span className="text-[#c9a227] font-semibold text-sm">+{homework.xpReward} XP</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[#2E2E3E]">
        <div
          className={`h-full transition-all ${
            progress?.completedAt ? 'bg-green-500' : 'bg-[#c9a227]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-[#1E1E2E]">
          {/* Description */}
          <p className="text-[#9CA3AF] mb-6">{homework.description}</p>

          {/* Action Items */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Action Items</h4>
            {homework.actionItems.map(item => {
              const isCompleted = completedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    isCompleted
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-[#1E1E2E] border-[#2E2E3E] hover:border-[#3E3E4E]'
                  }`}
                >
                  <button
                    onClick={() => onToggleItem?.(item.id)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'border-2 border-[#4E4E5E] hover:border-[#c9a227]'
                    }`}
                  >
                    {isCompleted && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                        {item.task}
                      </p>
                      {!item.isRequired && (
                        <span className="px-2 py-0.5 bg-[#2E2E3E] rounded text-xs text-[#6B7280] flex-shrink-0">
                          Optional
                        </span>
                      )}
                    </div>
                    {item.hint && (
                      <div className="flex items-start gap-2 mt-2 text-xs text-[#6B7280]">
                        <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
                        <span>{item.hint}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4" />
              {showNotes ? 'Hide Notes' : 'Add Notes'}
            </button>
            {showNotes && (
              <div className="mt-3">
                <textarea
                  value={localNotes}
                  onChange={handleNotesChange}
                  placeholder="Write your reflections, insights, or next steps..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleNotesSave}
                    className="px-4 py-2 bg-[#c9a227] text-white rounded-lg text-sm font-medium hover:bg-[#d4af37] transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Complete Button */}
          {!progress?.completedAt && allRequiredDone && (
            <button
              onClick={onComplete}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Complete Homework & Earn {homework.xpReward} XP
            </button>
          )}

          {/* Completion Status */}
          {progress?.completedAt && (
            <div className="flex items-center justify-center gap-2 py-3 bg-green-500/20 text-green-400 rounded-xl font-medium">
              <Check className="w-5 h-5" />
              Completed! You earned {homework.xpReward} XP
            </div>
          )}

          {/* Progress Message */}
          {!progress?.completedAt && !allRequiredDone && (
            <div className="text-center py-3 text-[#6B7280] text-sm">
              Complete all required tasks to finish this homework
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeworkCard;
