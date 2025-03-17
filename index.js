require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { META } = require('@consumet/extensions');

const app = express();
const PORT = process.env.PORT || 8000;

// Fetch allowed origins from the .env file
const ALLOWED_ORIGINS = JSON.parse(process.env.ALLOWED_ORIGINS || '[]');

// Middleware
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());

// API Base URLs
const API_BASE_URL = process.env.API_BASE_URL;
const API_ORIGIN_HEADER = process.env.API_ORIGIN_HEADER;

// Consumet API Instance
const anilist = new META.Anilist();

app.get('/api/spotlight', async (req, res) => {
  try {
    // Fetch Spotlight Data
    const spotlightResponse = await fetch(
      `${API_BASE_URL}/api/v2/hianime/home`,
      {
        headers: { Origin: API_ORIGIN_HEADER },
      }
    );
    const spotlightData = await spotlightResponse.json();

    if (!spotlightData.success) {
      return res.status(500).json({ error: 'Failed to fetch spotlight data' });
    }

    const updatedSpotlight = await Promise.all(
      spotlightData.data.spotlightAnimes.map(async (anime) => {
        try {
          const animeId = anime.id;
          if (animeId) {
            const detailsResponse = await fetch(
              `${API_BASE_URL}/api/v2/hianime/anime/${animeId}`,
              {
                headers: { Origin: API_ORIGIN_HEADER },
              }
            );
            const detailsData = await detailsResponse.json();

            if (detailsData.success) {
              const anilistId = detailsData.data.anime.info?.anilistId;
              if (anilistId) {
                anime.anilistId = anilistId;

                // Fetch trailer from Consumet API
                try {
                  const anilistInfo = await anilist.fetchAnimeInfo(anilistId);
                  anime.trailer = anilistInfo?.trailer;
                } catch (trailerError) {
                  console.error(
                    `Error fetching trailer for Anilist ID ${anilistId}:`,
                    trailerError
                  );
                }
              }
            }
          }
          return anime;
        } catch (err) {
          console.error(
            `Error fetching details for anime ID ${anime.id}:`,
            err
          );
          return anime;
        }
      })
    );

    res.json({ success: true, data: { spotlightAnimes: updatedSpotlight } });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
