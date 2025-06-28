
import { useState, useEffect } from 'react';
import { Settings, User, Bell, Palette, Globe, Shield, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface UserSettingsProps {
  user: any;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export function UserSettings({ user, onThemeToggle, isDarkMode }: UserSettingsProps) {
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: false,
      newArticles: true,
      trending: false,
    },
    content: {
      language: 'en',
      region: 'us',
      categories: ['general', 'technology'],
    },
    privacy: {
      analytics: true,
      personalization: true,
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('preferences');
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const updatePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    localStorage.setItem('preferences', JSON.stringify(newPrefs));
    toast({
      title: 'Settings updated',
      description: 'Your preferences have been saved.',
    });
  };

  const exportData = () => {
    const data = {
      preferences,
      favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
      musicFavorites: JSON.parse(localStorage.getItem('musicFavorites') || '[]'),
      searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Data exported',
      description: 'Your data has been downloaded successfully.',
    });
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem('preferences');
      localStorage.removeItem('favorites');
      localStorage.removeItem('musicFavorites');
      localStorage.removeItem('searchHistory');
      
      setPreferences({
        notifications: {
          email: true,
          push: false,
          newArticles: true,
          trending: false,
        },
        content: {
          language: 'en',
          region: 'us',
          categories: ['general', 'technology'],
        },
        privacy: {
          analytics: true,
          personalization: true,
        },
      });
      
      toast({
        title: 'Data cleared',
        description: 'All your data has been cleared successfully.',
      });
    }
  };

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'business', name: 'Business' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'health', name: 'Health' },
    { id: 'science', name: 'Science' },
    { id: 'sports', name: 'Sports' },
    { id: 'technology', name: 'Technology' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-8 h-8 text-purple-500" />
        Settings
      </h1>

      {/* User Profile */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.picture || user?.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {user?.name || 'User'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{user?.email}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Member since {new Date(user?.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Dark Mode</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={onThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) =>
                updatePreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, email: checked }
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">New Articles</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get notified about new articles in your interests
              </p>
            </div>
            <Switch
              checked={preferences.notifications.newArticles}
              onCheckedChange={(checked) =>
                updatePreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, newArticles: checked }
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Trending Updates</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Stay updated with trending content
              </p>
            </div>
            <Switch
              checked={preferences.notifications.trending}
              onCheckedChange={(checked) =>
                updatePreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, trending: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Preferences */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Content Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Preferred Language</Label>
            <Select
              value={preferences.content.language}
              onValueChange={(value) =>
                updatePreferences({
                  ...preferences,
                  content: { ...preferences.content, language: value }
                })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-base font-medium">Region</Label>
            <Select
              value={preferences.content.region}
              onValueChange={(value) =>
                updatePreferences({
                  ...preferences,
                  content: { ...preferences.content, region: value }
                })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-base font-medium">Interested Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Switch
                    id={category.id}
                    checked={preferences.content.categories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...preferences.content.categories, category.id]
                        : preferences.content.categories.filter(c => c !== category.id);
                      
                      updatePreferences({
                        ...preferences,
                        content: { ...preferences.content, categories: newCategories }
                      });
                    }}
                  />
                  <Label htmlFor={category.id} className="text-sm">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Analytics</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Help improve the service by sharing usage data
              </p>
            </div>
            <Switch
              checked={preferences.privacy.analytics}
              onCheckedChange={(checked) =>
                updatePreferences({
                  ...preferences,
                  privacy: { ...preferences.privacy, analytics: checked }
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Personalization</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enable personalized content recommendations
              </p>
            </div>
            <Switch
              checked={preferences.privacy.personalization}
              onCheckedChange={(checked) =>
                updatePreferences({
                  ...preferences,
                  privacy: { ...preferences.privacy, personalization: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Export Data</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Download all your data including preferences and favorites
              </p>
            </div>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Clear All Data</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Remove all stored data including favorites and preferences
              </p>
            </div>
            <Button onClick={clearAllData} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
