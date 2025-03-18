const NodeCache = require('node-cache');

// Fetch YouTube trailer based on AniList ID
const fetchYouTubeTrailer = async (anilistId) => {
  // Check if trailer data is already cached
  const cachedTrailer = myCache.get(`trailer-${anilistId}`);
  if (cachedTrailer) {
    return cachedTrailer; // Return cached trailer data if available
  }

  try {
    const response = await fetch(`https://stackblitz-starters-pdvus4gj.vercel.app/info/${anilistId}`);
    if (!response.ok) {
      console.error(`Failed to fetch trailer for AniList ID ${anilistId}`);
      return null;
    }

    const data = await response.json();
    
    if (data && data.trailer) {
      const trailer = {
        id: data.trailer.id,
        site: data.trailer.site,
        thumbnail: data.trailer.thumbnail,
        url: `https://www.youtube.com/watch?v=${data.trailer.id}`,
      };

      // Cache the trailer data
      myCache.set(`trailer-${anilistId}`, trailer);
      return trailer;
    }

    return null; // Return null if no trailer is found
  } catch (error) {
    console.error(`Error fetching YouTube trailer for AniList ID ${anilistId}:`, error);
    return null;
  }
};

module.exports = { fetchYouTubeTrailer };
