require('dotenv').config();
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const { fetchYouTubeTrailer } = require('./helper');

const app = express();
const PORT = process.env.PORT || 8000;

// Fetch allowed origins from .env file
const ALLOWED_ORIGINS = JSON.parse(process.env.ALLOWED_ORIGINS || '[]');

// Cache setup: Cache spotlight data for 5 minutes (300 seconds) and trailer data for 24 hours (86400 seconds)
const myCache = new NodeCache({
  stdTTL: 300, // TTL for spotlight data
  checkperiod: 600, // Period to check for expired items in cache
  maxKeys: 100, // Limit the number of keys in the cache to manage memory
});

const API_BASE_URL = process.env.API_BASE_URL;
const API_ORIGIN_HEADER = process.env.API_ORIGIN_HEADER;

// Middleware
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());

// API endpoint to fetch spotlight data
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Go to /api/spotlight for spotlight data' });
});

// Endpoint for fetching spotlight data
app.get('/api/spotlight', async (req, res) => {
  try {
    // Check if the spotlight data is already in cache
    const cachedSpotlight = myCache.get('spotlightData');
    if (cachedSpotlight) {
      return res.json(cachedSpotlight); // Return cached data if available
    }

    // Fetch spotlight data from your API
    const spotlightResponse = await fetch(`${API_BASE_URL}/api/v2/hianime/home`, {
      headers: { Origin: API_ORIGIN_HEADER },
    });
    const spotlightData = await spotlightResponse.json();

    if (!spotlightData.success) {
      return res.status(500).json({ error: 'Failed to fetch spotlight data' });
    }

    // Process spotlight data with trailers
    const updatedSpotlight = await Promise.all(
      spotlightData.data.spotlightAnimes.map(async (anime) => {
        try {
          const animeId = anime.id;
          if (animeId) {
            const detailsResponse = await fetch(`${API_BASE_URL}/api/v2/hianime/anime/${animeId}`, {
              headers: { Origin: API_ORIGIN_HEADER },
            });
            const detailsData = await detailsResponse.json();

            if (detailsData.success) {
              const anilistId = detailsData.data.anime.info?.anilistId;
              if (anilistId) {
                anime.anilistId = anilistId;
                // Fetch trailer from the external API
                const trailer = await fetchYouTubeTrailer(anilistId);
                if (trailer) {
                  anime.trailer = trailer;
                }
              }
            }
          }
          return anime;
        } catch (err) {
          console.error(`Error fetching details for anime ID ${anime.id}:`, err);
          return anime; // Return anime even if there is an error
        }
      })
    );

    // Cache the processed data for subsequent requests
    myCache.set('spotlightData', { success: true, data: { spotlightAnimes: updatedSpotlight } });

    // Return the updated spotlight data including trailers
    res.json({ success: true, data: { spotlightAnimes: updatedSpotlight } });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Custom 404 Error Handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Custom 500 Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 Internal Server Error');
});

// Export the app for Vercel (serverless function)
module.exports = app;

// Only start the server locally when not deployed to Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Memory usage monitoring (for local testing)
if (process.env.NODE_ENV !== 'production') {
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`Memory Usage: RSS: ${memoryUsage.rss / 1024 / 1024} MB`);
    if (memoryUsage.rss > 1024 * 1024 * 1024) { // 1 GB limit
      console.warn("Memory usage exceeded 1GB, consider clearing cache or optimizing.");
      myCache.flushAll(); // Clear cache if memory limit exceeded
    }
  }, 5000);
}
