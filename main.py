from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
import httpx
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = FastAPI()

# Fetch allowed origins from the .env file
ALLOWED_ORIGINS = json.loads(os.getenv("ALLOWED_ORIGINS", "[]"))

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Dynamically load origins from .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jinja2 Templates
templates = Jinja2Templates(directory="templates")

# Fetch configurations from environment variables
API_BASE_URL = os.getenv("API_BASE_URL")
API_ORIGIN_HEADER = os.getenv("API_ORIGIN_HEADER")

@app.get("/api/spotlight")
async def get_spotlight(request: Request):
    try:
        async with httpx.AsyncClient() as client:
            # Fetch Spotlight Data
            spotlight_response = await client.get(
                f"{API_BASE_URL}/api/v2/hianime/home",
                headers={"Origin": API_ORIGIN_HEADER}
            )
            spotlight_data = spotlight_response.json()

            if not spotlight_data.get("success"):
                return {"error": "Failed to fetch spotlight data"}

            updated_spotlight = []

            for anime in spotlight_data["data"]["spotlightAnimes"]:
                anime_id = anime.get("id")
                if anime_id:
                    details_url = f"{API_BASE_URL}/api/v2/hianime/anime/{anime_id}"
                    details_response = await client.get(
                        details_url,
                        headers={"Origin": API_ORIGIN_HEADER}
                    )
                    details_data = details_response.json()

                    if details_data.get("success"):
                        anilist_id = details_data["data"]["anime"]["info"].get("anilistId")
                        if anilist_id:
                            anime["anilistId"] = anilist_id

                updated_spotlight.append(anime)

            return {"success": True, "data": {"spotlightAnimes": updated_spotlight}}
    except Exception as e:
        return {"error": "Internal Server Error", "details": str(e)}

# Custom 404 Error Handler
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return templates.TemplateResponse("404.html", {"request": request}, status_code=404)

# Custom 500 Error Handler
@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc):
    return templates.TemplateResponse("500.html", {"request": request}, status_code=500)
