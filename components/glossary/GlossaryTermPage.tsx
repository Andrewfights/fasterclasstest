import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Check, BookOpen, PlayCircle, Zap } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { GLOSSARY_TERMS, INITIAL_VIDEOS } from '../../constants';
import { GlossaryCategory } from '../../types';
import { Button } from '../ui/Button';
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

export const GlossaryTermPage: React.FC = () => {
  const { termId } = useParams<{ termId: string }>();
  const { progress, learnTerm } = useGamification();

  const term = GLOSSARY_TERMS.find((t) => t.id === termId);

  if (!term) {
    return <Navigate to="/glossary" replace />;
  }

  const isLearned = progress.learnedTerms.includes(term.id);
  const relatedTerms = GLOSSARY_TERMS.filter((t) => term.relatedTerms.includes(t.id));
  const relatedVideos = INITIAL_VIDEOS.filter((v) => term.videoIds.includes(v.id));

  const handleMarkAsLearned = () => {
    if (!isLearned) {
      learnTerm(term.id);
    }
  };

  // Parse markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={index} className="font-bold text-[#3C3C3C] mt-4 mb-2">
            {line.slice(2, -2)}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-[#3C3C3C] ml-4 list-disc">
            {line.slice(2)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-[#3C3C3C]">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 pb-32">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back button */}
        <Link
          to="/glossary"
          className="inline-flex items-center gap-2 text-[#777777] hover:text-[#3C3C3C] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Glossary</span>
        </Link>

        {/* Main content */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="p-8 text-white"
            style={{ backgroundColor: categoryColors[term.category] }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-semibold mb-4">
              {categoryLabels[term.category]}
            </span>
            <h1 className="text-3xl font-bold mb-2">{term.term}</h1>
            <p className="text-lg opacity-90">{term.definition}</p>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Full explanation */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#3C3C3C] mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Full Explanation
              </h3>
              <div className="prose prose-slate">
                {renderContent(term.fullExplanation)}
              </div>
            </div>

            {/* Examples */}
            {term.examples.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#3C3C3C] mb-4">Examples</h3>
                <div className="space-y-2">
                  {term.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-[#F7F7F7] rounded-xl p-4 border-l-4"
                      style={{ borderColor: categoryColors[term.category] }}
                    >
                      <p className="text-[#3C3C3C] italic">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#3C3C3C] mb-4 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Related Videos
                </h3>
                <div className="grid gap-3">
                  {relatedVideos.map((video) => (
                    <Card key={video.id} hover className="flex items-center gap-4">
                      <div
                        className="w-20 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${video.thumbnail})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#3C3C3C] truncate">{video.title}</h4>
                        <p className="text-sm text-[#777777]">by {video.expert}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Related Terms */}
            {relatedTerms.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#3C3C3C] mb-4">Related Terms</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedTerms.map((relatedTerm) => (
                    <Link
                      key={relatedTerm.id}
                      to={`/glossary/${relatedTerm.id}`}
                      className="px-4 py-2 rounded-full bg-[#F7F7F7] text-[#3C3C3C] font-medium hover:bg-[#E5E5E5] transition-colors"
                    >
                      {relatedTerm.term}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mark as learned button */}
            <div className="pt-6 border-t border-[#E5E5E5]">
              {isLearned ? (
                <div className="flex items-center gap-3 text-[#58CC02]">
                  <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">You&apos;ve learned this term!</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleMarkAsLearned}
                  icon={<Zap className="w-5 h-5" />}
                >
                  Mark as Learned (+5 XP)
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
