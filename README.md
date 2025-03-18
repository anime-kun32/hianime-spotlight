
# hianime Spotlight API with AniList Trailer Integration

This is a Node.js api that fetches spotlight anime data from an external API and integrates trailers from AniList using their GraphQL API.
## 🚀 Features
- Fetches spotlight anime data from the HiAnime API.
- Retrieves AniList ID for each anime.
- Fetches trailers from AniList and appends them to the spotlight data.
- Uses caching to reduce unnecessary API calls.
- Built with Express.js and Node.js.

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/anime-kun32/hianime-spotlight.git
```
extract the zip and then open the folder  

2. Install dependencies:
```bash
npm install express dotenv cors node-cache
```

3 fill up the env with the following variables:
```.env
PORT=8000
API_BASE_URL=https://your-anime-api.com # https://github.com/ghoshRitesh12/aniwatch-api
API_ORIGIN_HEADER=https://your-origin-header.com # your deployment url or localhost if running locally , this is to prevent cors issues on aniwatch api 
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
- Cached for 5 minutes. data is cached in order to make it faster 

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
## contribution and issues 
If you appreciate this project and you want to contribute to it mention in issues or make a pull request if not a star would be appreciated . Any issues at all mention in the issues as well . Thanks for using this project I really appreciate it 
