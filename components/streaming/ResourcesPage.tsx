import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { GLOSSARY_TERMS } from '../../constants';
import { GlossaryCategory } from '../../types';

const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  starting_company: 'Starting a Company',
  credit_cards: 'Credit & Finance',
  raising_money: 'Raising Money',
  hiring: 'Hiring',
  prototyping: 'Product & MVP',
  ai: 'AI & Tech',
  growth: 'Growth',
  legal: 'Legal',
  general: 'General',
};

const CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  starting_company: '#8B5CF6',
  credit_cards: '#EC4899',
  raising_money: '#F97316',
  hiring: '#06B6D4',
  prototyping: '#60A5FA',
  ai: '#10B981',
  growth: '#FBBF24',
  legal: '#EF4444',
  general: '#6B7280',
};

export const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');

  // Get unique categories
  const categories = Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)));

  // Filter terms
  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0D0D12] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Resources</h1>
          <p className="text-[#9CA3AF] text-lg">
            Glossary of startup terms and concepts. Master the language of founders.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms..."
              className="w-full pl-12 pr-4 py-3 bg-[#13131A] border border-[#1E1E2E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as GlossaryCategory | 'all')}
            className="px-4 py-3 bg-[#13131A] border border-[#1E1E2E] rounded-xl text-white focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-[#1E1E2E] text-[#9CA3AF] hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'text-white'
                  : 'bg-[#1E1E2E] text-[#9CA3AF] hover:text-white'
              }`}
              style={{
                backgroundColor: selectedCategory === cat ? CATEGORY_COLORS[cat] : undefined,
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-[#6B7280] mb-6">
          {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
        </p>

        {/* Terms List */}
        <div className="space-y-3">
          {filteredTerms.map(term => (
            <div
              key={term.id}
              className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-5 hover:border-[#2E2E3E] transition-colors cursor-pointer group"
              onClick={() => navigate(`/resources/${term.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[term.category] }}
                    >
                      {CATEGORY_LABELS[term.category]}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#8B5CF6] transition-colors">
                    {term.term}
                  </h3>
                  <p className="text-[#9CA3AF] text-sm line-clamp-2">{term.definition}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6B7280] flex-shrink-0 group-hover:text-[#8B5CF6] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-[#2E2E3E] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No terms found</h3>
            <p className="text-[#6B7280]">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
