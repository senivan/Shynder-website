from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os

from sql import models, schemas, db_wrapper
from sql.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
async def root():
    html_con = ""
    with open("./static/index.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("./static/small_small.png")


@app.get("/checkauth/")
async def validate_user_login(login:str = "", password:str = ""):
    db = SessionLocal()
    user = db_wrapper.get_user_by_email(db, login)
    if user:
        if user._password == password:
            return {"message": "Success"}
        return {"message": "Incorrect password"}
    return {"message": "User not found"}
