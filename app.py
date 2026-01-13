from fastapi import FastAPI
from validator import Login
from cv_scrapper import info_cv

app = FastAPI()

@app.post("/login")
def login(usuario_info: Login):

    return usuario_info

@app.get("/info")
def info():
    
    return info_cv