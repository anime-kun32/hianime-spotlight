// Function to fetch the trailer data from AniList API
const fetchAnilistTrailer = async (anilistId) => {
  const query = `
    query {
      Media(id: ${anilistId}, type: ANIME) {
        trailer {
          id
          site
          thumbnail
        }
      }
    }`;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (data?.data?.Media?.trailer?.site === 'youtube') {
    return {
      youtubeUrl: `https://www.youtube.com/watch?v=${data.data.Media.trailer.id}`,
      thumbnail: data.data.Media.trailer.thumbnail,
    };
  }
  return null;
};

module.exports = { fetchAnilistTrailer };
