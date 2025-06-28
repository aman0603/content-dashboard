
import { useState, useEffect } from 'react';
import { Heart, Trash2, ExternalLink, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string;
}

interface Track {
  id: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
}

export function FavoritesSection() {
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [activeTab, setActiveTab] = useState('news');
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      // Load favorite articles
      const storedArticles = localStorage.getItem('favoriteArticles');
      if (storedArticles) {
        setFavoriteArticles(JSON.parse(storedArticles));
      }

      // Load favorite tracks
      const storedTracks = localStorage.getItem('musicFavorites');
      if (storedTracks) {
        const trackIds = JSON.parse(storedTracks);
        // Convert IDs to track objects (in a real app, you'd fetch full data)
        const tracks = trackIds.map((id: string, index: number) => ({
          id,
          trackName: `Favorite Track ${index + 1}`,
          artistName: 'Various Artists',
          albumName: 'Various Albums',
          duration: 180 + index * 10,
        }));
        setFavoriteTracks(tracks);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFavorite = (identifier: string, type: 'news' | 'music') => {
    try {
      if (type === 'news') {
        // Remove from favorites list
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = favorites.filter((url: string) => url !== identifier);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        
        // Remove from articles list
        const articles = JSON.parse(localStorage.getItem('favoriteArticles') || '[]');
        const updatedArticles = articles.filter((article: Article) => article.url !== identifier);
        localStorage.setItem('favoriteArticles', JSON.stringify(updatedArticles));
        
        setFavoriteArticles(updatedArticles);
      } else {
        // Remove music favorite
        const musicFavorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
        const updatedMusicFavorites = musicFavorites.filter((id: string) => id !== identifier);
        localStorage.setItem('musicFavorites', JSON.stringify(updatedMusicFavorites));
        
        setFavoriteTracks(prev => prev.filter(track => track.id !== identifier));
      }
      
      toast({
        title: 'Removed from favorites',
        description: `${type === 'news' ? 'Article' : 'Track'} removed successfully.`,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites.',
        variant: 'destructive',
      });
    }
  };

  const formatDuration = (seconds: number) => {
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
                key={`${article.url}-${index}`}
                className="group hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {article.description}
                        </p>
                      )}
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
                key={`${track.id}-${index}`}
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
