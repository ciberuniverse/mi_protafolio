from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

from modules.cv_scrapper import perfil_

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.middleware("http")
async def middleware(request: Request, call_next):

    if request.url.path not in str(app.routes) and "static/" not in request.url.path:
        return RedirectResponse("/")

    return await call_next(request)

@app.get("/api/v1/profile")
async def info():
    return perfil_.retornar_api()

@app.get("/", include_in_schema=False)
async def profile():
    return FileResponse("web/profile.html")
