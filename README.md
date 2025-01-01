
# Hianime Spotlight API

## About
**Hianime Spotlight API** is a simple API that fetches spotlight anime data from the [AniWatch API](https://github.com/ghoshRitesh12/aniwatch-api) and adds additional information such as the Anilist ID, also fetched from the same API. I created this project for personal use to make things easier, but I felt I should make it public. 

Let me know if you appreciate this project!

## Installation

### Requirements
- Python 3.x
- `pip` (Python package manager)

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anime-kun32/hianime-spotlight-api.git
   cd hianime-spotlight-api
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # For Windows use: venv\Scriptsctivate
   ```

3. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up your `.env` file**:
   - Create a `.env` file in the root directory and add the following variables.

   **Filling `.env` file**:
   - **API_BASE_URL**: This is the base URL for fetching spotlight data from the [AniWatch API](https://github.com/ghoshRitesh12/aniwatch-api). Replace `https://your-api-url.com` with the URL of the AniWatch API endpoint you are using.
   - **API_ORIGIN_HEADER**: Set this to the origin of your frontend (for CORS support). For example, if your frontend is hosted at `https://your-frontend.com`, set it like so: `API_ORIGIN_HEADER=https://your-frontend.com`.
   - **ALLOWED_ORIGINS**: This specifies which origins can access your API. List allowed origins in this format: `ALLOWED_ORIGINS=["https://your-frontend.com"]`. You can add multiple origins if needed.

   Example `.env` file:
   ```env
   # API base URL for spotlight data from AniWatch API
   API_BASE_URL=https://api.aniwatch.com

   # Frontend Origin (CORS)
   API_ORIGIN_HEADER=https://your-frontend.com

   # Allowed Origins for CORS
   ALLOWED_ORIGINS=["https://your-frontend.com"]
   ```

5. **Run the app locally**:
   ```bash
   uvicorn main:app --reload
   ```

   The server will be running at `http://127.0.0.1:8000`.

### Deploying on Vercel

1. **Create a new project** on [Vercel](https://vercel.com).
2. **Connect your GitHub repository** to Vercel.
3. **Set up environment variables**:
   - In the Vercel dashboard, go to your project settings and add the necessary environment variables as described above (i.e., `API_BASE_URL`, `API_ORIGIN_HEADER`, and `ALLOWED_ORIGINS`).

4. **Deploy**: Once everything is set up, deploy the project. Vercel will automatically build and deploy the app.

### Sample Response

Here’s a sample response you can expect when making a request to the API:

```json
{
  "success": true,
  "data": {
    "spotlightAnimes": [
      {
        "rank": 1,
        "id": "ranma-1-2-19335",
        "name": "Ranma 1/2",
        "description": "During their martial arts training expedition in China, Ranma Saotome and his father Genma suffered an accident, which in turn, afflicted them with a curse—whenever they are doused with cold water, Ranma transforms into a girl, while his father turns into a panda! Only hot water can reverse these changes, but any further contact with cold water opens the can of worms once more.\n\nUnfortunately, the trouble does not end there, as Ranma finds out about his betrothal to one of the daughters of Soun Tendou, his father's closest friend. During the families' first meeting, it is decided that Ranma is to be married to Akane, the youngest daughter, a decision that is met with vehement protests from both sides. The two are simply not compatible, yet they are forced to live under one roof. Ranma's status quo further adds to the chaos, leading him to a series of comedic situations and misunderstandings that, in the grand scheme of things, may just be what he needs to work with Akane.",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/1366x768/100/af1c058948079aabe09de052cc7b4261.jpg",
        "jname": "Ranma ½ (2024)",
        "episodes": {
          "sub": 12,
          "dub": 12
        },
        "type": "TV",
        "otherInfo": [
          "TV",
          "23m",
          "Oct 6, 2024",
          "HD"
        ],
        "anilistId": 178533
      }
    ]
  }
}

```

### Disclaimer
This project is not affiliated or endorsed by Hianime or any anime studios. It simply provides an API to fetch spotlight anime data from the AniWatch API for personal use and convenience.

---

If you have any questions, feel free to reach out. Enjoy using the Hianime Spotlight API!
