// helper.js
const { ANIME } = require('@consumet/extensions'); // Import the Zoro provider

// Create an instance of the Zoro provider
const zoro = new ANIME.Zoro();

/**
 * Fetch anime details including the trailer using the Zoro provider.
 * @param {string} animeId - The ID of the anime to fetch.
 * @returns {object|null} - The anime details including the trailer.
 */
const fetchAnimeDetails = async (animeId) => {
  try {
    // Fetch anime details from the Zoro provider
    const animeDetails = await zoro.fetchAnimeDetails(animeId);
    return animeDetails;
  } catch (error) {
    console.error(`Error fetching details for anime ID ${animeId}:`, error);
    return null; // Return null if an error occurs
  }
};

module.exports = { fetchAnimeDetails };
