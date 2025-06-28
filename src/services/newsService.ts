
// Mock news service for development - NewsAPI has CORS restrictions on free tier
interface NewsArticle {
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

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Mock data for different categories
const mockArticles: Record<string, NewsArticle[]> = {
  general: [
    {
      title: "Breaking: Major Tech Conference Announces Revolutionary AI Breakthrough",
      description: "Scientists reveal groundbreaking artificial intelligence technology that could transform multiple industries.",
      url: "https://example.com/tech-breakthrough",
      urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: "Tech Daily" },
      author: "Sarah Johnson"
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement",
      description: "World leaders unite on comprehensive climate action plan with ambitious 2030 targets.",
      url: "https://example.com/climate-summit",
      urlToImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e2?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { name: "Global News" },
      author: "Michael Chen"
    },
    {
      title: "Space Mission Successfully Lands on Mars",
      description: "Historic space exploration mission achieves successful landing on Martian surface.",
      url: "https://example.com/mars-landing",
      urlToImage: "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { name: "Space Today" },
      author: "Dr. Emily Rodriguez"
    }
  ],
  business: [
    {
      title: "Stock Markets Reach Record Highs Amid Economic Growth",
      description: "Major indices surge as quarterly earnings exceed expectations across multiple sectors.",
      url: "https://example.com/stock-markets",
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      source: { name: "Business Wire" },
      author: "James Patterson"
    },
    {
      title: "Tech Giant Announces Major Acquisition Deal",
      description: "Industry leader acquires innovative startup in billion-dollar transaction.",
      url: "https://example.com/acquisition",
      urlToImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      source: { name: "Market Watch" },
      author: "Lisa Wong"
    }
  ],
  technology: [
    {
      title: "Revolutionary Quantum Computer Achieves New Milestone",
      description: "Breakthrough in quantum computing brings us closer to solving complex problems.",
      url: "https://example.com/quantum-computer",
      urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      source: { name: "Tech Review" },
      author: "Alex Kumar"
    }
  ],
  health: [
    {
      title: "Medical Research Reveals Promising Treatment for Rare Disease",
      description: "Clinical trials show significant improvement in patient outcomes.",
      url: "https://example.com/medical-breakthrough",
      urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: "Health Today" },
      author: "Dr. Maria Garcia"
    }
  ],
  science: [
    {
      title: "Astronomers Discover New Exoplanet in Habitable Zone",
      description: "Earth-like planet found orbiting nearby star could potentially support life.",
      url: "https://example.com/exoplanet",
      urlToImage: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      source: { name: "Science Daily" },
      author: "Dr. Robert Kim"
    }
  ],
  sports: [
    {
      title: "Championship Finals Set Record Viewership Numbers",
      description: "Historic sports event draws millions of viewers worldwide.",
      url: "https://example.com/championship",
      urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      source: { name: "Sports Network" },
      author: "Tom Bradley"
    }
  ],
  entertainment: [
    {
      title: "Film Festival Announces Award Winners",
      description: "Independent films take center stage at international festival.",
      url: "https://example.com/film-festival",
      urlToImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=200&fit=crop",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { name: "Entertainment Weekly" },
      author: "Amanda Foster"
    }
  ]
};

export const fetchNews = async (category: string = 'general'): Promise<NewsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const articles = mockArticles[category] || mockArticles.general;
  
  return {
    status: 'ok',
    totalResults: articles.length,
    articles: articles
  };
};

// For production, you would implement the real NewsAPI call here
// but only after setting up a backend proxy to handle CORS
export const fetchRealNews = async (category: string = 'general'): Promise<NewsResponse> => {
  const apiKey = 'a698132e2ac5407885d1b7bab0f36d9b';
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}&pageSize=20`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  
  return await response.json();
};
