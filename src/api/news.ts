
interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      name: string;
    };
    author: string;
  }>;
}

export const fetchNewsFromAPI = async (category: string = 'general'): Promise<NewsResponse> => {
  const apiKey = 'a698132e2ac5407885d1b7bab0f36d9b';
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}&pageSize=20`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw error;
  }
};
