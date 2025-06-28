
import { useState } from 'react';
import { Bell, Moon, Sun, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  user: any;
  isAuthenticated: boolean;
  onAuthClick: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function Header({ 
  user, 
  isAuthenticated, 
  onAuthClick, 
  onLogout, 
  isDarkMode, 
  onThemeToggle 
}: HeaderProps) {
  const [notifications] = useState(3); // Mock notification count

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="hidden sm:block">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getCurrentGreeting()}
              {isAuthenticated && user ? `, ${user.name || user.email}` : ''}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 relative"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.picture || user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={onAuthClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function getCurrentGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
