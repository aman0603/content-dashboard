
import { useState, useEffect } from 'react';
import { Clock, ExternalLink, Heart, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchNews } from '@/services/newsService';

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

export function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { toast } = useToast();

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'business', name: 'Business' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'health', name: 'Health' },
    { id: 'science', name: 'Science' },
    { id: 'sports', name: 'Sports' },
    { id: 'technology', name: 'Technology' },
  ];

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [selectedCategory]);

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      console.log(`Fetching news for category: ${selectedCategory}`);
      const data = await fetchNews(selectedCategory);
      console.log(`Received ${data.articles.length} articles`);
      setArticles(data.articles || []);
      setError('');
    } catch (err) {
      setError('Failed to load news articles. Please try again later.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (articleUrl: string) => {
    const newFavorites = favorites.includes(articleUrl)
      ? favorites.filter(url => url !== articleUrl)
      : [...favorites, articleUrl];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(articleUrl) ? 'Removed from favorites' : 'Added to favorites',
      description: 'Your preferences have been updated.',
    });
  };

  const shareArticle = async (article: Article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: article.url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(article.url);
      toast({
        title: 'Link copied!',
        description: 'Article link has been copied to clipboard.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">News Feed</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">News Feed</h1>
        <Button onClick={fetchNewsData} variant="outline" className="shrink-0">
          Refresh
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
              : ''
            }
          >
            {category.name}
          </Button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <p className="text-sm text-red-500 dark:text-red-300 mt-2">
            Note: Using demo data due to NewsAPI CORS restrictions. In production, this would be resolved with a backend proxy.
          </p>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            {article.urlToImage && (
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-slate-700">
                    {article.source.name}
                  </Badge>
                </div>
              </div>
            )}
            
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              
              {article.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {article.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                {article.author && (
                  <span className="truncate max-w-24">By {article.author}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(article.url)}
                    className={`rounded-full p-2 ${
                      favorites.includes(article.url)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(article.url) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareArticle(article)}
                    className="rounded-full p-2 text-slate-400 hover:text-blue-500"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(article.url, '_blank')}
                  className="text-xs px-3 py-1 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-200"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No articles found for this category.</p>
        </div>
      )}
    </div>
  );
}
