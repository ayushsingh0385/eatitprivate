const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Fetch top-rated Amazon product for a query
async function fetchTopAmazonProduct(query) {
  try {
    const { data } = await axios.get(
      'https://api.scraperapi.com/structured/amazon/search',
      {
        params: {
          api_key: process.env.SCRAPERAPI_KEY,
          query,
          country: 'us'
        }
      }
    );
    const topProduct = (data.results || [])[0];
    return topProduct
      ? {
          name: topProduct.name,
          url: topProduct.url,
          image: topProduct.image,
          price: topProduct.price
        }
      : null;
  } catch (err) {
    console.error(`Error fetching Amazon data for ${query}:`, err.message);
    return null;
  }
}

// Fetch one healthy homemade recipe video from YouTube for a query
async function fetchTopYouTubeRecipe(query) {
  try {
    const searchTerm = `healthy homemade ${query} recipe`;
    const { data } = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          q: searchTerm,
          part: 'snippet',
          type: 'video',
          maxResults: 1,
          videoEmbeddable: 'true',
          safeSearch: 'moderate'
        }
      }
    );

    const video = data.items?.[0];
    return video
      ? {
          title: video.snippet.title,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/320x180.png?text=No+Thumbnail',
          channelTitle: video.snippet.channelTitle,
          description: video.snippet.description || 'No description available'
        }
      : null;
  } catch (err) {
    console.error(`Error fetching YouTube data for ${query}:`, err.message);
    return null;
  }
}

// Fetch alternatives from Gemini API
async function fetchGeminiAlternatives(query) {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
You are a health and diet assistant with expertise in recommending healthy alternatives.
Suggest 4 healthy alternatives to "${query}" that are nutritious and suitable for a balanced diet.
Focus on options that are lower in calories, higher in nutrients, or better for specific dietary needs.
Return only a JSON array like:
["Alternative 1", "Alternative 2", "Alternative 3", "Alternative 4"]
No other text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Extract the JSON array
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']') + 1;
    const jsonStr = start >= 0 && end > start ? text.slice(start, end) : '[]';
    
    const alternatives = JSON.parse(jsonStr);

    // Filter out invalid or duplicate alternatives
    const uniqueAlternatives = [...new Set(alternatives)].filter(
      alt => typeof alt === 'string' && alt.trim().length > 0
    );

    return uniqueAlternatives;
  } catch (err) {
    console.error(`Error fetching Gemini alternatives for ${query}:`, err.message);
    return [`Healthy alternative to ${query}`, `Nutritious version of ${query}`, `Low-calorie ${query}`, `Diet-friendly ${query}`];
  }
}

// API route handler for searching alternatives
async function searchAlternatives(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter `q` is required' });

  try {
    // Fetch alternatives from Gemini API
    const alternatives = await fetchGeminiAlternatives(q);
    console.log(`Got ${alternatives.length} alternatives for "${q}":`, alternatives);

    // Fetch Amazon products and YouTube recipes for each alternative
    const amazonPromises = alternatives.map(alt => fetchTopAmazonProduct(alt));
    const youtubePromises = alternatives.map(alt => fetchTopYouTubeRecipe(alt));
    
    const [amazonResults, youtubeResults] = await Promise.all([
      Promise.all(amazonPromises),
      Promise.all(youtubePromises)
    ]);
    
    // Filter out null results
    const amazonProducts = amazonResults.filter(Boolean);
    const youtubeRecipes = youtubeResults.filter(Boolean);

    res.json({ 
      amazonProducts, 
      youtubeRecipes,
      query: q,
      alternatives
    });
  } catch (err) {
    console.error('Error in /api/search:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

module.exports = {
  fetchTopAmazonProduct,
  fetchTopYouTubeRecipe,
  fetchGeminiAlternatives,
  searchAlternatives
};
