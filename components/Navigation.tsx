import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  Tv,
  Play,
  BookOpen,
  Settings,
  Search,
  Home,
  Bookmark,
  User,
  Gamepad2,
  ChevronDown,
  LogOut,
  Target,
  GraduationCap,
  MonitorPlay,
  ChevronUp,
  Clapperboard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const { level, levelDefinition, xpProgress } = useGamification();
  const currentPath = location.pathname;
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [watchMenuOpen, setWatchMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const watchMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  const isWatchActive = isActive('/vod') || isActive('/live');

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (watchMenuRef.current && !watchMenuRef.current.contains(event.target as Node)) {
        setWatchMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Desktop nav items
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/live', label: 'Live', icon: Tv, hasLiveBadge: true },
    { path: '/vod', label: 'VOD', icon: Play, isAccent: true },
    { path: '/feed', label: 'Feed', icon: Clapperboard },
    { path: '/courses', label: 'Courses', icon: BookOpen, matchAlso: '/course' },
    { path: '/learn', label: 'Learn', icon: GraduationCap, matchAlso: '/learn' },
    { path: '/games', label: 'Games', icon: Gamepad2 },
  ];

  // Mobile bottom nav items (5 sections as requested)
  const mobileNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: 'watch', label: 'Watch', icon: MonitorPlay, isWatch: true },
    { path: '/courses', label: 'Courses', icon: BookOpen, matchAlso: '/course' },
    { path: '/learn', label: 'Learn', icon: GraduationCap, matchAlso: '/learn' },
    { path: '/games', label: 'Games', icon: Gamepad2 },
  ];

  return (
    <>
      {/* Top Navigation Bar - Premium Design */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F18]/80 backdrop-blur-[12px] border-b border-white/5">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#F59E0B] flex items-center justify-center shadow-card">
                <Zap className="h-4 w-4 text-black" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:inline">
                Fasterclass
              </span>
            </Link>

            {/* Center Navigation - Desktop Only */}
            <div className="hidden md:flex items-center gap-1 bg-[#111827] rounded-full p-1 shadow-card">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path) || (item.matchAlso && isActive(item.matchAlso));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm
                      transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)]
                      ${active
                        ? item.isAccent
                          ? 'bg-gradient-to-r from-[#FACC15] to-[#F59E0B] text-black shadow-[0_0_24px_rgba(250,204,21,0.4)]'
                          : 'bg-white text-black'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.hasLiveBadge && !active && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop */}
              <Link
                to="/search"
                className={`hidden md:flex p-2 rounded-full transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
                  isActive('/search')
                    ? 'bg-[#1C2433] text-white'
                    : 'text-white/60 hover:text-white hover:bg-[#1C2433]'
                }`}
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Library - Desktop */}
              <Link
                to="/my-list"
                className={`hidden md:flex p-2 rounded-full transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
                  isActive('/my-list')
                    ? 'bg-[#1C2433] text-white'
                    : 'text-white/60 hover:text-white hover:bg-[#1C2433]'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </Link>

              {/* Profile Dropdown - Both Desktop and Mobile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#1C2433] transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)]"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-card"
                    style={{ backgroundColor: levelDefinition.color }}
                  >
                    <span className="text-white">{level}</span>
                  </div>
                  <ChevronDown className={`hidden md:block w-4 h-4 text-white/60 transition-transform duration-[180ms] ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#111827] rounded-xl border border-white/10 shadow-modal overflow-hidden z-50">
                    {/* Header with level */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-card"
                          style={{ backgroundColor: levelDefinition.color }}
                        >
                          <span className="text-white font-bold">{level}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{levelDefinition.title}</p>
                          <p className="text-xs text-white/50">Level {level}</p>
                        </div>
                      </div>
                      {/* XP Progress */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                          <span>Progress to Level {level + 1}</span>
                          <span>{xpProgress.current}/{xpProgress.needed} HP</span>
                        </div>
                        <div className="h-1.5 bg-[#1C2433] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${xpProgress.progress}%`, backgroundColor: levelDefinition.color }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <User className="w-4 h-4 text-white/50" />
                        <span>Your Journey</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/search');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms] md:hidden"
                      >
                        <Search className="w-4 h-4 text-white/50" />
                        <span>Search</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/my-list');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms] md:hidden"
                      >
                        <Bookmark className="w-4 h-4 text-white/50" />
                        <span>My Arsenal</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/profile/preferences');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <Settings className="w-4 h-4 text-white/50" />
                        <span>Preferences</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/games');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                      >
                        <Target className="w-4 h-4 text-white/50" />
                        <span>My Milestones</span>
                      </button>
                    </div>

                    {/* Admin Link */}
                    {authState.isAuthenticated && (
                      <div className="py-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            navigate('/admin');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/90 hover:bg-[#1C2433] transition-all duration-[180ms]"
                        >
                          <Settings className="w-4 h-4 text-white/50" />
                          <span>Curator CMS</span>
                        </button>
                      </div>
                    )}

                    {/* Sign Out */}
                    <div className="py-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/50 hover:bg-[#1C2433] hover:text-white transition-all duration-[180ms]"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar - Premium Design */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0F18]/80 backdrop-blur-[12px] border-t border-white/5 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;

            // Handle Watch menu specially
            if (item.isWatch) {
              return (
                <div key={item.path} className="relative" ref={watchMenuRef}>
                  <button
                    onClick={() => setWatchMenuOpen(!watchMenuOpen)}
                    className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
                      isWatchActive
                        ? 'text-[#FACC15]'
                        : 'text-white/50'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {/* Live badge indicator */}
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold">{item.label}</span>
                    <ChevronUp className={`w-3 h-3 transition-transform duration-[180ms] ${watchMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Watch Menu Popup */}
                  {watchMenuOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-[#111827] rounded-xl border border-white/10 shadow-modal overflow-hidden">
                      <button
                        onClick={() => {
                          navigate('/vod');
                          setWatchMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-[180ms] ${
                          isActive('/vod')
                            ? 'bg-gradient-to-r from-[#FACC15]/20 to-[#F59E0B]/20 text-[#FACC15]'
                            : 'text-white/90 hover:bg-[#1C2433]'
                        }`}
                      >
                        <Play className="w-5 h-5" />
                        <span className="font-semibold">VOD</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/live');
                          setWatchMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-[180ms] ${
                          isActive('/live')
                            ? 'bg-red-500/20 text-red-400'
                            : 'text-white/90 hover:bg-[#1C2433]'
                        }`}
                      >
                        <Tv className="w-5 h-5" />
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Live</span>
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            const active = isActive(item.path) || (item.matchAlso && isActive(item.matchAlso));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-[180ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
                  active
                    ? 'text-white'
                    : 'text-white/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Navigation;
