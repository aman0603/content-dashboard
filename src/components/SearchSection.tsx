
import { useState, useEffect, useCallback } from 'react';
import { Search, Clock, Music, ExternalLink, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function SearchSection() {
  const [query, setQuery] = useState('');
  const [newsResults, setNewsResults] = useState([]);
  const [musicResults, setMusicResults] = useState([]);
  const [activeTab, setActiveTab] = useState('news');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setNewsResults([]);
      setMusicResults([]);
    }
  }, [query, debouncedSearch]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    
    try {
      // Search news
      const newsResponse = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&pageSize=10&apiKey=a698132e2ac5407885d1b7bab0f36d9b`
      );
      const newsData = await newsResponse.json();
      setNewsResults(newsData.articles || []);

      // Search music
      const musicResponse = await fetch(
        `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const musicData = await musicResponse.json();
      setMusicResults(musicData.slice(0, 10) || []);

      // Add to search history
      addToSearchHistory(searchQuery);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search failed',
        description: 'Unable to perform search. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToSearchHistory = (searchQuery) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [searchQuery, ...history.filter(item => item !== searchQuery)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearchHistory(newHistory);
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
    setSearchHistory([]);
    toast({
      title: 'Search history cleared',
      description: 'Your search history has been cleared.',
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
        <Search className="w-8 h-8 text-purple-500" />
        Universal Search
      </h1>

      {/* Search Input */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search for news articles, songs, artists, or albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg rounded-lg"
            />
          </div>
          
          {/* Search History */}
          {searchHistory.length > 0 && !query && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearchHistory}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-sm text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {query && (
        <>
          {/* Results Tabs */}
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'news'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              News ({newsResults.length})
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'music'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Music ({musicResults.length})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Searching...</p>
            </div>
          )}

          {/* News Results */}
          {activeTab === 'news' && !loading && (
            <div className="space-y-4">
              {newsResults.length === 0 ? (
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                      No news articles found for "{query}"
                    </p>
                  </CardContent>
                </Card>
              ) : (
                newsResults.map((article, index) => (
                  <Card 
                    key={index}
                    className="group hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {article.urlToImage && (
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {article.title}
                          </h3>
                          
                          {article.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                              {article.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {article.source.name}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full p-2 text-slate-400 hover:text-red-500"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(article.url, '_blank')}
                                className="rounded-full p-2 text-slate-400 hover:text-blue-500"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Music Results */}
          {activeTab === 'music' && !loading && (
            <div className="space-y-4">
              {musicResults.length === 0 ? (
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Music className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                      No music found for "{query}"
                    </p>
                  </CardContent>
                </Card>
              ) : (
                musicResults.map((track, index) => (
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
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {formatDuration(track.duration)}
                            </Badge>
                            {track.instrumental && (
                              <Badge variant="secondary" className="text-xs">
                                Instrumental
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full p-2 text-slate-400 hover:text-red-500"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full p-2 text-slate-400 hover:text-blue-500"
                          >
                            <Music className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
