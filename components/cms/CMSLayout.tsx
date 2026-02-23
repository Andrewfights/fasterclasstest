import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  BookOpen,
  Tv,
  Home,
  Settings,
  GraduationCap,
  ArrowLeft,
  LogOut,
  Film,
  PlaySquare,
  FolderOpen,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/admin/videos', icon: <Video className="w-5 h-5" />, label: 'Videos' },
  { to: '/admin/episodes', icon: <Film className="w-5 h-5" />, label: 'Episodes' },
  { to: '/admin/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Courses' },
  { to: '/admin/channels', icon: <Tv className="w-5 h-5" />, label: 'Channels' },
  { to: '/admin/vod', icon: <PlaySquare className="w-5 h-5" />, label: 'VOD Manager' },
  { to: '/admin/collections', icon: <FolderOpen className="w-5 h-5" />, label: 'Collections' },
  { to: '/admin/homepage', icon: <Home className="w-5 h-5" />, label: 'Homepage' },
  { to: '/admin/learn', icon: <GraduationCap className="w-5 h-5" />, label: 'Learning' },
  { to: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
];

export const CMSLayout: React.FC = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-14 bottom-0 w-64 bg-[#111118] border-r border-[#1E1E2E] flex flex-col z-40">
        {/* Header */}
        <div className="p-4 border-b border-[#1E1E2E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">CMS</h2>
              <p className="text-xs text-[#6B7280]">Content Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#9CA3AF] hover:bg-[#1A1A24] hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#1E1E2E] space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#9CA3AF] hover:bg-[#1A1A24] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to App</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>

          {/* User info */}
          <div className="px-3 py-2 text-xs text-[#6B7280]">
            Logged in as {authState.user?.email || 'Admin'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-14">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CMSLayout;
