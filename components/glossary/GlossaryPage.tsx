import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Check, ChevronRight } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { GLOSSARY_TERMS } from '../../constants';
import { GlossaryCategory } from '../../types';
import { Card } from '../ui/Card';

const categoryLabels: Record<GlossaryCategory, string> = {
  starting_company: 'Starting a Company',
  credit_cards: 'Credit Cards & Finance',
  raising_money: 'Raising Money',
  hiring: 'Hiring & Team',
  prototyping: 'Product & Prototyping',
  ai: 'AI & Technology',
  growth: 'Growth & Marketing',
  legal: 'Legal',
  general: 'General',
};

const categoryColors: Record<GlossaryCategory, string> = {
  starting_company: '#58CC02',
  credit_cards: '#FF9600',
  raising_money: '#EC4899',
  hiring: '#8B5CF6',
  prototyping: '#1CB0F6',
  ai: '#06B6D4',
  growth: '#F97316',
  legal: '#6B7280',
  general: '#3C3C3C',
};

export const GlossaryPage: React.FC = () => {
  const { progress, learnTerm } = useGamification();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(GLOSSARY_TERMS.map((t) => t.category));
    return Array.from(cats) as GlossaryCategory[];
  }, []);

  const learnedTermIds = new Set(progress.learnedTerms);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-[#3C3C3C] mb-2">Startup Glossary</h1>
              <p className="text-[#777777]">
                Learn essential startup terminology and concepts.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1CB0F6] to-[#0D94DD] rounded-2xl p-6 text-white text-center shadow-lg">
              <div className="text-4xl font-bold">{learnedTermIds.size}</div>
              <div className="text-sm opacity-90">of {GLOSSARY_TERMS.length} learned</div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] focus:outline-none transition-colors text-[#3C3C3C]"
            />
          </div>

          {/* Category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-colors
                ${selectedCategory === 'all'
                  ? 'bg-[#3C3C3C] text-white'
                  : 'bg-[#F7F7F7] text-[#777777] hover:bg-[#E5E5E5]'
                }
              `}
            >
              All ({GLOSSARY_TERMS.length})
            </button>
            {categories.map((category) => {
              const count = GLOSSARY_TERMS.filter((t) => t.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-semibold transition-colors
                    ${selectedCategory === category
                      ? 'text-white'
                      : 'bg-[#F7F7F7] text-[#777777] hover:bg-[#E5E5E5]'
                    }
                  `}
                  style={{
                    backgroundColor: selectedCategory === category ? categoryColors[category] : undefined,
                  }}
                >
                  {categoryLabels[category]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms list */}
        <div className="space-y-3">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-[#777777]">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#AFAFAF]" />
              <p>No terms found matching your search.</p>
            </div>
          ) : (
            filteredTerms.map((term) => {
              const isLearned = learnedTermIds.has(term.id);
              return (
                <Link to={`/glossary/${term.id}`} key={term.id}>
                  <Card hover className="flex items-center gap-4">
                    {/* Category indicator */}
                    <div
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: categoryColors[term.category] }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#3C3C3C]">{term.term}</h3>
                        {isLearned && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#58CC02] text-xs font-semibold">
                            <Check className="w-3 h-3" />
                            Learned
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#777777] truncate">{term.definition}</p>
                    </div>

                    {/* Category badge */}
                    <span
                      className="hidden md:block px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: categoryColors[term.category] }}
                    >
                      {categoryLabels[term.category]}
                    </span>

                    <ChevronRight className="w-5 h-5 text-[#AFAFAF]" />
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
