require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Fetch allowed origins from .env file
const ALLOWED_ORIGINS = JSON.parse(process.env.ALLOWED_ORIGINS || '[]');

// Middleware
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());

// API Base URLs from your environment variables
const API_BASE_URL = process.env.API_BASE_URL;
const API_ORIGIN_HEADER = process.env.API_ORIGIN_HEADER;

// Function to fetch trailer data from AniList API
async function fetchAnilistTrailer(anilistId) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        trailer {
          id
          site
          thumbnail
          url
        }
      }
    }
  `;
  const variables = { id: anilistId };
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await response.json();
  if (data.data && data.data.Media && data.data.Media.trailer) {
    return data.data.Media.trailer;
  }
  return null;
}

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Go to /api/spotlight for spotlight data' });
});

app.get('/api/spotlight', async (req, res) => {
  try {
    // Use native fetch to get spotlight data
    const spotlightResponse = await fetch(`${API_BASE_URL}/api/v2/hianime/home`, {
      headers: { Origin: API_ORIGIN_HEADER },
    });
    const spotlightData = await spotlightResponse.json();

    if (!spotlightData.success) {
      return res.status(500).json({ error: 'Failed to fetch spotlight data' });
    }

    // Update each anime with additional details and trailer info from AniList API
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
                // Fetch trailer from AniList API
                try {
                  const trailer = await fetchAnilistTrailer(anilistId);
                  if (trailer) {
                    anime.trailer = trailer;
                  }
                } catch (trailerError) {
                  console.error(`Error fetching trailer for AniList ID ${anilistId}:`, trailerError);
                }
              }
            }
          }
          return anime;
        } catch (err) {
          console.error(`Error fetching details for anime ID ${anime.id}:`, err);
          return anime;
        }
      })
    );

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
