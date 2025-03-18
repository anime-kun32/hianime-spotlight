
# hianime Spotlight API with AniList Trailer Integration

This is a Node.js server that fetches spotlight anime data from an external API and integrates trailers from AniList using their GraphQL API. It uses native `fetch` without external modules for simplicity.

## 🚀 Features
- Fetches spotlight anime data from the HiAnime API.
- Retrieves AniList ID for each anime.
- Fetches trailers from AniList and appends them to the spotlight data.
- Uses caching to reduce unnecessary API calls.
- Built with Express.js and Node.js.

## 🛠️ Installation

1. Clone the repository:
```
git clone <https://github.com/animcd hianime-spotlight-main
```
extract the zip and then open the folder  

2. Install dependencies:
```
npm install express dotenv cors node-cache
```

3. Create a `.env` file with the following variables:
```
PORT=8000
API_BASE_URL=https://your-anime-api.com
API_ORIGIN_HEADER=https://your-origin-header.com
ALLOWED_ORIGINS=["http://localhost:3000"]
```

4. Start the server:
```
node index.js
```

## 🔥 API Endpoints

### Get Spotlight Anime
```
GET /api/spotlight
```
- Fetches spotlight anime data and appends AniList trailer information.
- Cached for 5 minutes.

### Example Response
```json
{
  "success": true,
  "data": {
    "spotlightAnimes": [
      {
        "id": "the-red-ranger-becomes-an-adventurer-in-another-world-19463",
        "name": "The Red Ranger Becomes an Adventurer in Another World",
        "description": "An epic adventure in another world...",
        "poster": "https://cdn.example.com/poster.jpg",
        "episodes": {
          "sub": 10,
          "dub": 7
        },
        "anilistId": 9253,
        "trailer": {
          "url": "https://www.youtube.com/watch?v=abc123",
          "thumbnail": "https://cdn.example.com/trailer-thumbnail.jpg"
        }
      }
    ]
  }
}
```



## disclaimer
This project is not affiliated with hianime or any anime studio at all. This project is only made to make thing easier . No files are stored on the server , they are provided by thier respective providers 
