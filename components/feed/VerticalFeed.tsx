import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstagramEmbed, TikTokEmbed } from 'react-social-media-embed';
import { Heart, MessageCircle, Share2, Bookmark, ChevronUp, ChevronDown, X } from 'lucide-react';

// Sample social posts - can be expanded
const SOCIAL_POSTS = [
  {
    id: 'ig-1',
    platform: 'instagram' as const,
    url: 'https://www.instagram.com/p/CzUPQzjLXzN/',
    creator: 'garyvee',
    category: 'entrepreneur',
  },
  {
    id: 'tt-1',
    platform: 'tiktok' as const,
    url: 'https://www.tiktok.com/@garyvee/video/7301234567890123456',
    creator: 'garyvee',
    category: 'entrepreneur',
  },
  {
    id: 'ig-2',
    platform: 'instagram' as const,
    url: 'https://www.instagram.com/p/CyN_Gx4LJQN/',
    creator: 'alexhormozi',
    category: 'business',
  },
  {
    id: 'ig-3',
    platform: 'instagram' as const,
    url: 'https://www.instagram.com/p/CxYZ123ABC/',
    creator: 'thefutur',
    category: 'design',
  },
  {
    id: 'tt-2',
    platform: 'tiktok' as const,
    url: 'https://www.tiktok.com/@thefutur/video/7298765432109876543',
    creator: 'thefutur',
    category: 'design',
  },
];

type Category = 'all' | 'entrepreneur' | 'business' | 'design' | 'tech';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'entrepreneur', label: 'Entrepreneur' },
  { id: 'business', label: 'Business' },
  { id: 'design', label: 'Design' },
  { id: 'tech', label: 'Tech' },
];

export const VerticalFeed: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? SOCIAL_POSTS
    : SOCIAL_POSTS.filter(post => post.category === selectedCategory);

  const currentPost = filteredPosts[currentIndex];

  // Navigate to next/previous post
  const goToNext = useCallback(() => {
    if (currentIndex < filteredPosts.length - 1) {
      setIsLoading(true);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, filteredPosts.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setIsLoading(true);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          navigate(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, navigate]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // Wheel scroll handling with debounce
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (wheelTimeout.current) return;

    if (e.deltaY > 30) {
      goToNext();
    } else if (e.deltaY < -30) {
      goToPrevious();
    }

    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = null;
    }, 500);
  }, [goToNext, goToPrevious]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Loading state
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentIndex]);

  return (
    <div className="min-h-screen bg-black pt-14">
      {/* Header with categories */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent pb-4">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-white font-semibold">Feed</h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main feed container */}
      <div
        ref={containerRef}
        className="h-screen snap-y snap-mandatory overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {filteredPosts.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/60">
            No posts in this category
          </div>
        ) : (
          <div className="h-full flex items-center justify-center relative">
            {/* Post container */}
            <div className={`w-full max-w-md mx-auto transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {currentPost && (
                <div className="relative">
                  {/* Social embed */}
                  <div className="bg-[#1A1A24] rounded-xl overflow-hidden">
                    {currentPost.platform === 'instagram' ? (
                      <InstagramEmbed
                        url={currentPost.url}
                        width="100%"
                        captioned
                      />
                    ) : (
                      <TikTokEmbed
                        url={currentPost.url}
                        width="100%"
                      />
                    )}
                  </div>

                  {/* Creator info */}
                  <div className="mt-3 px-2">
                    <p className="text-white font-medium">@{currentPost.creator}</p>
                    <p className="text-white/40 text-sm capitalize">{currentPost.category}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Side actions */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-4">
              <button className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <Bookmark className="w-6 h-6" />
              </button>
              <button className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation hints */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full transition-colors ${
                  currentIndex === 0
                    ? 'text-white/20 cursor-not-allowed'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex >= filteredPosts.length - 1}
                className={`p-2 rounded-full transition-colors ${
                  currentIndex >= filteredPosts.length - 1
                    ? 'text-white/20 cursor-not-allowed'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              {filteredPosts.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-6 rounded-full transition-colors ${
                    idx === currentIndex ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom indicator */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
          <span className="text-white/60 text-sm">
            {currentIndex + 1} / {filteredPosts.length}
          </span>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="fixed bottom-20 left-4 text-white/30 text-xs hidden md:block">
        <p>↑↓ or J/K to navigate</p>
        <p>ESC to exit</p>
      </div>
    </div>
  );
};

export default VerticalFeed;
