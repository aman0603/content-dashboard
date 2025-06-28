
import { useState, useEffect } from 'react';
import { Heart, Trash2, ExternalLink, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function FavoritesSection() {
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const [activeTab, setActiveTab] = useState('news');
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const musicFavorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
    
    // In a real app, you'd fetch the full article/track data based on the IDs
    // For now, we'll show placeholder data
    setFavoriteArticles(favorites.map((url, index) => ({
      title: `Favorite Article ${index + 1}`,
      url,
      source: { name: 'Various Sources' },
      publishedAt: new Date().toISOString(),
    })));
    
    setFavoriteTracks(musicFavorites.map((id, index) => ({
      id,
      trackName: `Favorite Track ${index + 1}`,
      artistName: 'Various Artists',
      albumName: 'Various Albums',
      duration: 180 + index * 10,
    })));
  };

  const removeFavorite = (identifier, type) => {
    const storageKey = type === 'news' ? 'favorites' : 'musicFavorites';
    const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = current.filter(item => item !== identifier);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    loadFavorites();
    toast({
      title: 'Removed from favorites',
      description: `${type === 'news' ? 'Article' : 'Track'} removed successfully.`,
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Heart className="w-8 h-8 text-red-500" />
        Your Favorites
      </h1>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'news'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          News ({favoriteArticles.length})
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'music'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Music ({favoriteTracks.length})
        </button>
      </div>

      {/* News Favorites */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          {favoriteArticles.length === 0 ? (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  No favorite articles yet. Start adding articles to your favorites!
                </p>
              </CardContent>
            </Card>
          ) : (
            favoriteArticles.map((article, index) => (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {article.source.name}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(article.url, '_blank')}
                        className="rounded-full p-2 text-slate-400 hover:text-blue-500"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(article.url, 'news')}
                        className="rounded-full p-2 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Music Favorites */}
      {activeTab === 'music' && (
        <div className="space-y-4">
          {favoriteTracks.length === 0 ? (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-8 text-center">
                <Music className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  No favorite tracks yet. Start adding music to your favorites!
                </p>
              </CardContent>
            </Card>
          ) : (
            favoriteTracks.map((track, index) => (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {track.trackName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {track.artistName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {track.albumName}
                      </p>
                      <Badge variant="outline" className="text-xs mt-2">
                        {formatDuration(track.duration)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-2 text-slate-400 hover:text-blue-500"
                      >
                        <Music className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(track.id, 'music')}
                        className="rounded-full p-2 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
