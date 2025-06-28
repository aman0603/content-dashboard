
import { useState, useEffect } from 'react';
import { Music, Search, Play, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface LyricsResult {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string;
}

export function MusicSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LyricsResult[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<LyricsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedFavorites = localStorage.getItem('musicFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const searchLyrics = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search lyrics');
      }
      
      const data = await response.json();
      setSearchResults(data.slice(0, 20)); // Limit to 20 results
    } catch (err) {
      console.error('Lyrics search error:', err);
      toast({
        title: 'Search failed',
        description: 'Unable to search for lyrics. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getLyrics = async (track: LyricsResult) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://lrclib.net/api/get/${track.id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get lyrics');
      }
      
      const data = await response.json();
      setSelectedTrack(data);
    } catch (err) {
      console.error('Get lyrics error:', err);
      toast({
        title: 'Failed to load lyrics',
        description: 'Unable to load lyrics for this track.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (trackId: number) => {
    const newFavorites = favorites.includes(trackId)
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];
    
    setFavorites(newFavorites);
    localStorage.setItem('musicFavorites', JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(trackId) ? 'Removed from favorites' : 'Added to favorites',
      description: 'Your music preferences have been updated.',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLyrics();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Music className="w-8 h-8 text-blue-500" />
          Music & Lyrics
        </h1>
      </div>

      {/* Search Section */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search for Song Lyrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Search by song title, artist, or album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12 rounded-lg"
            />
            <Button 
              onClick={searchLyrics}
              disabled={loading || !searchQuery.trim()}
              className="px-8 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Search Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Search Results ({searchResults.length})
          </h2>
          
          {searchResults.length === 0 && !loading && (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-8 text-center">
                <Music className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Search for your favorite songs to view lyrics
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchResults.map((track) => (
              <Card 
                key={track.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
                onClick={() => getLyrics(track)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {track.trackName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {track.artistName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                        className={`rounded-full p-2 ${
                          favorites.includes(track.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-slate-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(track.id) ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-2 text-blue-500 hover:text-blue-600"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lyrics Display */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Lyrics
          </h2>
          
          {selectedTrack ? (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-800 dark:text-white">
                      {selectedTrack.trackName}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedTrack.artistName}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {selectedTrack.albumName}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatDuration(selectedTrack.duration)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {selectedTrack.instrumental ? (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                      This is an instrumental track
                    </p>
                  </div>
                ) : selectedTrack.plainLyrics ? (
                  <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                        {selectedTrack.plainLyrics}
                      </pre>
                    </div>
                    
                    {selectedTrack.syncedLyrics && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          View Synchronized Lyrics
                        </summary>
                        <div className="mt-2 max-h-96 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                            {selectedTrack.syncedLyrics}
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">
                      Lyrics not available for this track
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-8 text-center">
                <Music className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Select a track to view lyrics
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
