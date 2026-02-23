import React, { useState } from 'react';
import { Zap, Search, ChevronDown, X, Menu } from 'lucide-react';

interface LandingNavProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

const BROWSE_CATEGORIES = [
  { name: 'Ideation', icon: '💡', count: 12 },
  { name: 'Fundraising', icon: '💰', count: 18 },
  { name: 'Product', icon: '🚀', count: 15 },
  { name: 'Growth', icon: '📈', count: 14 },
  { name: 'Leadership', icon: '👑', count: 10 },
  { name: 'Marketing', icon: '📢', count: 11 },
];

export const LandingNav: React.FC<LandingNavProps> = ({ onSignIn, onGetStarted }) => {
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Left: Logo + Browse + Search */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-gradient-to-br from-[#c9a227] to-[#a88520] p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-black" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">Fasterclass</span>
            </div>

            {/* Browse Button - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsBrowseOpen(!isBrowseOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Browse
                <ChevronDown className={`w-4 h-4 transition-transform ${isBrowseOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Browse Dropdown */}
              {isBrowseOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsBrowseOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl z-50 py-2">
                    <div className="px-4 py-2 border-b border-[#2a2a2a]">
                      <span className="mc-label text-[#c9a227]">Browse by Topic</span>
                    </div>
                    {BROWSE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setIsBrowseOpen(false);
                          onGetStarted();
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span className="flex-1 text-left text-sm">{cat.name}</span>
                        <span className="text-xs text-[#6B7280]">{cat.count}</span>
                      </button>
                    ))}
                    <div className="border-t border-[#2a2a2a] mt-2 pt-2 px-4">
                      <button
                        onClick={() => {
                          setIsBrowseOpen(false);
                          onGetStarted();
                        }}
                        className="text-[#c9a227] text-sm font-medium hover:text-[#d4af37] transition-colors"
                      >
                        View All Courses →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative hidden md:block">
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What do you want to learn today?"
                      autoFocus
                      className="w-80 pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227] transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-[#6B7280] hover:text-white transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Auth Buttons + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onSignIn}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-3 sm:px-5 py-2 bg-[#c9a227] text-black text-xs sm:text-sm font-semibold rounded-full hover:bg-[#d4af37] transition-colors"
            >
              Get Started
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 z-40 sm:hidden">
        <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="absolute top-14 left-0 right-0 bg-[#0a0a0a] border-b border-white/10 p-4">
          {/* Mobile Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227]"
              />
            </div>
          </div>

          {/* Browse Categories */}
          <div className="mb-4">
            <span className="mc-label text-[#c9a227] mb-3 block">Browse by Topic</span>
            <div className="grid grid-cols-2 gap-2">
              {BROWSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-xl text-white hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sign In Link */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onSignIn();
            }}
            className="w-full py-3 text-white/80 hover:text-white text-sm font-medium transition-colors text-center border-t border-white/10"
          >
            Sign In
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default LandingNav;
