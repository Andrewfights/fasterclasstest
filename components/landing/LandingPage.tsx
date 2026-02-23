import React, { useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { LandingNav } from './LandingNav';
import { HeroCarousel } from '../vod/HeroCarousel';
import { InstructorMarquee } from './InstructorMarquee';
import { PopularSection } from './PopularSection';
import { ComingSoonSection } from './ComingSoonSection';
import { CertificatesSection } from './CertificatesSection';
import { CoursePreviewModal } from './CoursePreviewModal';
import { COURSES, INITIAL_VIDEOS } from '../../constants';
import { HeroCarouselItem, Course, Video } from '../../types';

// Featured experts for the landing page - using reliable hqdefault thumbnails
const FEATURED_INSTRUCTORS = [
  { name: 'Sam Altman', role: 'Former YC President', image: 'https://img.youtube.com/vi/0lJKucu6HJc/hqdefault.jpg' },
  { name: 'Naval Ravikant', role: 'AngelList Founder', image: 'https://img.youtube.com/vi/HiYo14wylQw/hqdefault.jpg' },
  { name: 'Peter Thiel', role: 'PayPal Co-founder', image: 'https://img.youtube.com/vi/rFV7wdEX-Mo/hqdefault.jpg' },
  { name: 'Kevin Hale', role: 'YC Partner', image: 'https://img.youtube.com/vi/DOtCl5PU8F0/hqdefault.jpg' },
  { name: 'Dalton Caldwell', role: 'YC Partner', image: 'https://img.youtube.com/vi/8pNxKX1SUGE/hqdefault.jpg' },
  { name: 'Y Combinator', role: 'Startup Accelerator', image: 'https://img.youtube.com/vi/CBYhVcO4WgI/hqdefault.jpg' },
  { name: 'Paul Graham', role: 'YC Co-founder', image: 'https://img.youtube.com/vi/ii1jcLg-eIQ/hqdefault.jpg' },
  { name: 'Michael Seibel', role: 'YC Partner', image: 'https://img.youtube.com/vi/C27RVio2rOs/hqdefault.jpg' },
  { name: 'Gustaf Alströmer', role: 'YC Partner', image: 'https://img.youtube.com/vi/URiIsrdplbo/hqdefault.jpg' },
  { name: 'Adora Cheung', role: 'YC Partner', image: 'https://img.youtube.com/vi/yP176MBG9Tk/hqdefault.jpg' },
];

// Topics for browsing
const TOPICS = [
  { name: 'Ideation', icon: '💡', color: '#c9a227', count: 12 },
  { name: 'Fundraising', icon: '💰', color: '#10B981', count: 18 },
  { name: 'Product', icon: '🚀', color: '#8B5CF6', count: 15 },
  { name: 'Growth', icon: '📈', color: '#3B82F6', count: 14 },
  { name: 'Leadership', icon: '👑', color: '#EC4899', count: 10 },
  { name: 'Marketing', icon: '📢', color: '#F97316', count: 11 },
  { name: 'Sales', icon: '🤝', color: '#14B8A6', count: 9 },
  { name: 'Hiring', icon: '👥', color: '#6366F1', count: 8 },
];

interface LandingPageProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onGetStarted }) => {
  // Modal state
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    item: Course | Video | null;
    itemType: 'course' | 'video';
  }>({ isOpen: false, item: null, itemType: 'course' });

  // Hero carousel items for landing
  const heroCarouselItems: HeroCarouselItem[] = [
    { type: 'course', item: COURSES[0] },
    { type: 'video', item: INITIAL_VIDEOS[0] },
    { type: 'course', item: COURSES[1] },
    { type: 'video', item: INITIAL_VIDEOS[4] },
    { type: 'course', item: COURSES[2] },
    { type: 'video', item: INITIAL_VIDEOS[8] },
  ];

  const handleMoreInfo = (carouselItem: HeroCarouselItem) => {
    setPreviewModal({
      isOpen: true,
      item: carouselItem.item,
      itemType: carouselItem.type,
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, item: null, itemType: 'course' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Masterclass-Style Top Nav */}
      <LandingNav onSignIn={onSignIn} onGetStarted={onGetStarted} />

      {/* Hero Carousel - with top padding for nav */}
      <div className="pt-14">
        <HeroCarousel
          items={heroCarouselItems}
          variant="landing"
          autoPlayInterval={6000}
          onMoreInfo={handleMoreInfo}
          onPlayClick={onGetStarted}
        />
      </div>

      {/* Auto-Scrolling Instructor Marquee */}
      <InstructorMarquee
        instructors={FEATURED_INSTRUCTORS}
        onInstructorClick={onGetStarted}
      />

      {/* Course Preview Modal */}
      <CoursePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        onGetStarted={() => {
          closePreviewModal();
          onGetStarted();
        }}
        item={previewModal.item}
        itemType={previewModal.itemType}
      />

      {/* Popular Now Section */}
      <PopularSection
        courses={COURSES}
        onCourseClick={onGetStarted}
      />

      {/* Coming Soon Section */}
      <ComingSoonSection />

      {/* Browse by Topic Section */}
      <section className="py-16 px-6 md:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="mc-label text-[#c9a227]">Explore</span>
            <h2 className="mc-heading text-3xl md:text-4xl text-white mt-2">
              Browse by Topic
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TOPICS.map((topic, index) => (
              <button
                key={index}
                onClick={onGetStarted}
                className="group p-6 bg-[#141414] border border-[#2a2a2a] rounded-xl hover:border-[#c9a227]/50 transition-all text-left"
              >
                <span className="text-4xl mb-3 block">{topic.icon}</span>
                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#c9a227] transition-colors">
                  {topic.name}
                </h3>
                <p className="text-[#737373] text-sm">{topic.count} lessons</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <CertificatesSection onGetStarted={onGetStarted} />

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="mc-label text-[#c9a227]">Simple Process</span>
            <h2 className="mc-heading text-4xl md:text-5xl text-white mt-2">
              How Fasterclass Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#c9a227]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-display font-bold text-[#c9a227]">1</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Choose Your Path</h3>
              <p className="text-[#a3a3a3]">
                Pick from curated courses or browse individual lessons by topic.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#c9a227]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-display font-bold text-[#c9a227]">2</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Learn at Your Pace</h3>
              <p className="text-[#a3a3a3]">
                Watch expert videos, take quizzes, and master key concepts with flashcards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#c9a227]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-display font-bold text-[#c9a227]">3</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Track Progress</h3>
              <p className="text-[#a3a3a3]">
                Earn XP, unlock achievements, and get certificates for completed courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 md:px-8 bg-gradient-to-r from-[#c9a227]/5 to-[#a88520]/5 border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                {INITIAL_VIDEOS.length}+
              </p>
              <p className="text-[#a3a3a3]">Expert Videos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                {COURSES.length}
              </p>
              <p className="text-[#a3a3a3]">Curated Courses</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">50+</p>
              <p className="text-[#a3a3a3]">Expert Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">100%</p>
              <p className="text-[#a3a3a3]">Free Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mc-heading text-4xl md:text-5xl text-white mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-8">
            Join thousands of founders learning to build successful startups.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a227] text-black font-bold text-lg rounded-md hover:bg-[#d4af37] transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[#737373] text-sm mt-4">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-8 border-t border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#c9a227] to-[#a88520] p-2 rounded-lg">
              <Zap className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-bold text-white">Fasterclass</span>
          </div>
          <p className="text-[#737373] text-sm">
            Built for founders, by founders.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
