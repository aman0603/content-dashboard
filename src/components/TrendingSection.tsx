
import { useState, useEffect } from 'react';
import { TrendingUp, ExternalLink, Heart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TrendingSection() {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  const fetchTrendingNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=15&apiKey=a698132e2ac5407885d1b7bab0f36d9b`
      );
      const data = await response.json();
      setTrendingNews(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch trending news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-green-500" />
          Trending Now
        </h1>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 flex gap-4">
                <div className="w-24 h-16 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <TrendingUp className="w-8 h-8 text-green-500" />
        Trending Now
      </h1>

      <div className="grid gap-4">
        {trendingNews.map((article, index) => (
          <Card 
            key={index}
            className="group hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    #{index + 1}
                  </div>
                </div>
                
                {article.urlToImage && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-24 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                    
                    <div className="flex items-center gap-1 ml-4">
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
                        <Share2 className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(article.url, '_blank')}
                        className="rounded-full p-2 text-slate-400 hover:text-green-500"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
