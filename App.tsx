import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Navigation from './components/Navigation';
import { Video, Playlist } from './types';
import AdminPanel from './components/AdminPanel';
import VideoPlayer from './components/VideoPlayer';
import AIGuide from './components/AIGuide';
import LoginPage from './components/LoginPage';
import { useAuth } from './contexts/AuthContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PiPProvider } from './contexts/PiPContext';
import { PiPPlayer } from './components/PiPPlayer';
import { dataService } from './services/dataService';

// Streaming components
import {
  HomePage,
  CoursesPage,
  CourseDetailPage,
  WatchPage,
  MyListPage,
  ResourcesPage,
} from './components/streaming';

// VOD and Live TV components
import { VODPage } from './components/vod';
import { LiveTVPage } from './components/tv';

// Search
import { SearchPage } from './components/search';

// Vertical Feed (Social/Shorts)
import { VerticalFeed } from './components/feed';

// Profile
import { ProfilePage } from './components/profile';
import { StartupChecklist } from './components/profile/StartupChecklist';

// Games
import { GamesPage } from './components/games';

// Learn
import { LearnPage, FlashcardPage, QuizPage, QuizPlayer, FillBlankPage } from './components/learn';

// Home Dashboard
import { Dashboard } from './components/home';

// Landing Page
import { LandingPage } from './components/landing/LandingPage';

// CMS Components
import {
  CMSLayout,
  CMSDashboard,
  VideoManager,
  CourseManager,
  ChannelManager,
  HomepageEditor,
  EpisodeManager,
} from './components/cms';

// Playlist player wrapper with route params
const PlaylistPlayerPage: React.FC<{
  playlists: Playlist[];
  videos: Video[];
}> = ({ playlists, videos }) => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Playlist not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#8B5CF6] text-white rounded-xl font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer
      playlist={playlist}
      initialVideoIndex={0}
      videos={videos}
      onBack={() => navigate('/')}
    />
  );
};

// Protected Admin Route
const ProtectedAdminPage: React.FC<{
  videos: Video[];
  playlists: Playlist[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}> = ({ videos, playlists, setVideos, setPlaylists }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  if (!authState.isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {}}
        onBack={() => navigate('/')}
      />
    );
  }

  return (
    <AdminPanel
      videos={videos}
      playlists={playlists}
      setVideos={setVideos}
      setPlaylists={setPlaylists}
    />
  );
};

// Protected CMS Layout wrapper
const ProtectedCMSLayout: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  if (!authState.isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {}}
        onBack={() => navigate('/')}
      />
    );
  }

  return <CMSLayout />;
};

function App() {
  const { isLoading, authState } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<'signin' | 'signup'>('signin');

  // Initialize state from localStorage
  const [videos, setVideos] = useState<Video[]>(() => dataService.getVideos());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => dataService.getPlaylists());

  const handleSignIn = () => {
    setLoginMode('signin');
    setShowLogin(true);
  };

  const handleGetStarted = () => {
    setLoginMode('signup');
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  // Persist videos when they change
  useEffect(() => {
    dataService.saveVideos(videos);
  }, [videos]);

  // Persist playlists when they change
  useEffect(() => {
    dataService.savePlaylists(playlists);
  }, [playlists]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-[#9CA3AF] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if requested
  if (showLogin) {
    return (
      <ThemeProvider>
        <LibraryProvider>
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setShowLogin(false)}
            initialMode={loginMode}
          />
        </LibraryProvider>
      </ThemeProvider>
    );
  }

  // Show landing page if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <ThemeProvider>
        <LibraryProvider>
          <LandingPage onSignIn={handleSignIn} onGetStarted={handleGetStarted} />
        </LibraryProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LibraryProvider>
        <PiPProvider>
        <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans">
        <Routes>
          {/* Full-screen player route - no navigation bar */}
          <Route
            path="/playlist/:playlistId"
            element={<PlaylistPlayerPage playlists={playlists} videos={videos} />}
          />

          {/* All other routes with navigation */}
          <Route path="*" element={
            <>
              <Navigation />
              <main>
                <Routes>
                  {/* Home Dashboard */}
                  <Route path="/" element={<Dashboard />} />

                  {/* Search */}
                  <Route path="/search" element={<SearchPage />} />

                  {/* Courses */}
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/course/:courseId" element={<CourseDetailPage />} />

                  {/* Watch */}
                  <Route path="/watch/:videoId" element={<WatchPage />} />

                  {/* Library */}
                  <Route path="/my-list" element={<MyListPage />} />

                  {/* On Demand (VOD) */}
                  <Route path="/vod" element={<VODPage />} />

                  {/* Resources (Glossary) */}
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/resources/:termId" element={<ResourcesPage />} />

                  {/* Live TV - Pluto TV Style */}
                  <Route path="/live" element={<LiveTVPage />} />

                  {/* Vertical Feed - Social/Shorts */}
                  <Route path="/feed" element={<VerticalFeed />} />

                  {/* Profile */}
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/checklist" element={<StartupChecklist />} />

                  {/* Games */}
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/games/:gameId" element={<GamesPage />} />

                  {/* Learn */}
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/learn/flashcards" element={<FlashcardPage />} />
                  <Route path="/learn/quizzes" element={<QuizPage />} />
                  <Route path="/learn/quiz/:quizId" element={<QuizPlayer />} />
                  <Route path="/learn/fill-blank" element={<FillBlankPage />} />

                  {/* Admin - Legacy route */}
                  <Route
                    path="/admin-legacy"
                    element={
                      <ProtectedAdminPage
                        videos={videos}
                        playlists={playlists}
                        setVideos={setVideos}
                        setPlaylists={setPlaylists}
                      />
                    }
                  />

                  {/* CMS Routes */}
                  <Route path="/admin" element={<ProtectedCMSLayout />}>
                    <Route index element={<CMSDashboard />} />
                    <Route path="videos" element={<VideoManager />} />
                    <Route path="episodes" element={<EpisodeManager />} />
                    <Route path="courses" element={<CourseManager />} />
                    <Route path="channels" element={<ChannelManager />} />
                    <Route path="homepage" element={<HomepageEditor />} />
                    <Route path="learn" element={<LearnPage />} />
                    <Route path="settings" element={
                      <ProtectedAdminPage
                        videos={videos}
                        playlists={playlists}
                        setVideos={setVideos}
                        setPlaylists={setPlaylists}
                      />
                    } />
                  </Route>
                </Routes>
              </main>
              <AIGuide allVideos={videos} />
            </>
          } />
        </Routes>
        {/* PiP Player - persists across routes */}
        <PiPPlayer />
      </div>
        </PiPProvider>
      </LibraryProvider>
    </ThemeProvider>
  );
}

export default App;
