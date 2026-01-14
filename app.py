from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from cv_scrapper import perfil_

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/api/v1/profile")
def info():
    return perfil_.retornar_api()

@app.get("/", include_in_schema=False)
async def profile():
    return FileResponse("profile.html")