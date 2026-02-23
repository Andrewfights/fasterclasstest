import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  PlayCircle,
  Lightbulb,
  StickyNote,
  Trophy,
  Rocket,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService, STARTUP_CHECKLIST, CHECKLIST_CATEGORIES } from '../../services/profileService';
import { ChecklistItem, ChecklistCategory, UserChecklist } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressRing';

export const StartupChecklist: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [checklist, setChecklist] = useState<UserChecklist>({ completedItems: [], notes: {}, lastUpdated: Date.now() });
  const [expandedCategories, setExpandedCategories] = useState<ChecklistCategory[]>(['legal']);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const userEmail = authState.user?.email || 'guest';

  useEffect(() => {
    const userChecklist = profileService.getUserChecklist(userEmail);
    setChecklist(userChecklist);
  }, [userEmail]);

  const toggleCategory = (category: ChecklistCategory) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleComplete = (itemId: string) => {
    const isNowCompleted = profileService.toggleChecklistItem(userEmail, itemId);
    setChecklist(profileService.getUserChecklist(userEmail));

    // Check if all items completed
    const progress = profileService.getChecklistProgress(userEmail);
    if (isNowCompleted && progress.completed === progress.total) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  };

  const saveNote = (itemId: string) => {
    profileService.updateChecklistNote(userEmail, itemId, noteText);
    setChecklist(profileService.getUserChecklist(userEmail));
    setEditingNote(null);
    setNoteText('');
  };

  const startEditingNote = (itemId: string) => {
    setNoteText(checklist.notes[itemId] || '');
    setEditingNote(itemId);
  };

  const progress = profileService.getChecklistProgress(userEmail);

  const getItemsByCategory = (category: ChecklistCategory): ChecklistItem[] => {
    return STARTUP_CHECKLIST.filter(item => item.category === category)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-8 h-8 text-[var(--color-accent)]" />
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Startup Launch Checklist
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)]">
            Everything you need to launch your startup. Track your progress and never miss a step.
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Your Progress
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                {progress.completed} of {progress.total} tasks completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[var(--color-accent)]">
                {progress.percentage}%
              </div>
              {progress.percentage === 100 && (
                <div className="flex items-center gap-1 text-[#10B981]">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-semibold">Complete!</span>
                </div>
              )}
            </div>
          </div>
          <ProgressBar
            progress={progress.percentage}
            height={12}
            color="var(--color-accent)"
          />
        </Card>

        {/* Category Sections */}
        <div className="space-y-4">
          {CHECKLIST_CATEGORIES.map(category => {
            const categoryProgress = profileService.getCategoryProgress(userEmail, category.id);
            const isExpanded = expandedCategories.includes(category.id);
            const items = getItemsByCategory(category.id);
            const allComplete = categoryProgress.completed === categoryProgress.total;

            return (
              <Card key={category.id} className="overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">
                        {category.label}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {categoryProgress.completed} / {categoryProgress.total} completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {allComplete && (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    )}
                    <div
                      className="w-16 h-2 rounded-full overflow-hidden bg-[var(--color-bg-tertiary)]"
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(categoryProgress.completed / categoryProgress.total) * 100}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    )}
                  </div>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="border-t border-[var(--color-border)]">
                    {items.map(item => {
                      const isCompleted = checklist.completedItems.includes(item.id);
                      const isItemExpanded = expandedItems.includes(item.id);
                      const hasNote = !!checklist.notes[item.id];

                      return (
                        <div
                          key={item.id}
                          className={`border-b border-[var(--color-border)] last:border-b-0 ${
                            isCompleted ? 'bg-[var(--color-bg-secondary)]/50' : ''
                          }`}
                        >
                          {/* Item Header */}
                          <div className="flex items-start gap-3 p-4">
                            <button
                              onClick={() => toggleComplete(item.id)}
                              className="mt-0.5 flex-shrink-0"
                            >
                              {isCompleted ? (
                                <CheckCircle2
                                  className="w-6 h-6 transition-colors"
                                  style={{ color: category.color }}
                                />
                              ) : (
                                <Circle className="w-6 h-6 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="w-full text-left"
                              >
                                <h4 className={`font-medium ${
                                  isCompleted
                                    ? 'text-[var(--color-text-secondary)] line-through'
                                    : 'text-[var(--color-text-primary)]'
                                }`}>
                                  {item.title}
                                </h4>
                                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                                  {item.description}
                                </p>
                              </button>

                              {/* Expanded Content */}
                              {isItemExpanded && (
                                <div className="mt-4 space-y-4">
                                  {/* Tips */}
                                  {item.tips && item.tips.length > 0 && (
                                    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-3">
                                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                        <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                                        Pro Tips
                                      </div>
                                      <ul className="space-y-1">
                                        {item.tips.map((tip, i) => (
                                          <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                                            <span className="text-[var(--color-accent)]">•</span>
                                            {tip}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Resources */}
                                  {item.resources && item.resources.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {item.resources.map((resource, i) => (
                                        <button
                                          key={i}
                                          onClick={() => {
                                            if (resource.videoId) {
                                              navigate(`/watch/${resource.videoId}`);
                                            } else if (resource.url) {
                                              window.open(resource.url, '_blank');
                                            }
                                          }}
                                          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)]/10 rounded-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                        >
                                          {resource.videoId ? (
                                            <PlayCircle className="w-4 h-4" />
                                          ) : (
                                            <ExternalLink className="w-4 h-4" />
                                          )}
                                          {resource.title}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {/* Notes */}
                                  <div>
                                    {editingNote === item.id ? (
                                      <div className="space-y-2">
                                        <textarea
                                          value={noteText}
                                          onChange={(e) => setNoteText(e.target.value)}
                                          placeholder="Add your notes..."
                                          className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
                                          rows={3}
                                          autoFocus
                                        />
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => saveNote(item.id)}
                                            className="px-3 py-1.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium"
                                          >
                                            Save Note
                                          </button>
                                          <button
                                            onClick={() => {
                                              setEditingNote(null);
                                              setNoteText('');
                                            }}
                                            className="px-3 py-1.5 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-lg text-sm"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => startEditingNote(item.id)}
                                        className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                                      >
                                        <StickyNote className="w-4 h-4" />
                                        {hasNote ? 'Edit note' : 'Add note'}
                                      </button>
                                    )}

                                    {hasNote && editingNote !== item.id && (
                                      <div className="mt-2 p-3 bg-[#FEF3C7] dark:bg-[#78350F]/20 rounded-lg">
                                        <p className="text-sm text-[#92400E] dark:text-[#FCD34D]">
                                          {checklist.notes[item.id]}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => toggleItem(item.id)}
                              className="flex-shrink-0"
                            >
                              {isItemExpanded ? (
                                <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-[var(--color-text-secondary)]" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--color-bg-elevated)] rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <button
                onClick={() => setShowCelebration(false)}
                className="absolute top-4 right-4 text-[var(--color-text-secondary)]"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Congratulations!
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-4">
                You've completed the entire Startup Launch Checklist! You're ready to take on the world.
              </p>
              <div className="flex items-center justify-center gap-2 text-[var(--color-accent)]">
                <Trophy className="w-6 h-6" />
                <span className="font-semibold">Founder Achievement Unlocked</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupChecklist;
