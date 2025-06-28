
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { MusicSection } from '@/components/MusicSection';
import { TrendingSection } from '@/components/TrendingSection';
import { FavoritesSection } from '@/components/FavoritesSection';
import { SearchSection } from '@/components/SearchSection';
import { UserSettings } from '@/components/UserSettings';
import { AuthModal } from '@/components/AuthModal';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const [activeSection, setActiveSection] = useState('feed');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
    localStorage.removeItem('preferences');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'feed':
        return <NewsFeed />;
      case 'music':
        return <MusicSection />;
      case 'trending':
        return <TrendingSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'search':
        return <SearchSection />;
      case 'settings':
        return <UserSettings user={user} onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />;
      default:
        return <NewsFeed />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
          {/* Global sidebar trigger - always visible */}
          <div className="fixed top-4 left-4 z-50 md:hidden">
            <SidebarTrigger className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md" />
          </div>
          
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            isAuthenticated={isAuthenticated}
          />
          
          <div className="flex-1 flex flex-col">
            <Header 
              user={user}
              isAuthenticated={isAuthenticated}
              onAuthClick={() => setShowAuthModal(true)}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              onThemeToggle={toggleTheme}
            />
            
            <main className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {renderActiveSection()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default Index;
