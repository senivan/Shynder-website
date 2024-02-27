from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
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
    db_wrapper.create_user(get_db().__next__(), schemas.UserCreate(username="test", ddescription="test", age=18, email="", ppassword="test", test_results="test"))
    html_con = ""
    with open("./static/index.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("./static/small_small.png")


@app.get("/checkauth/")
async def validate_user_login(login:str = "", password:str = ""):
    db = get_db().__next__()
    user = db_wrapper.get_user_by_email(db, login)
    if user:
        if user.ppassword == password:
            return {"message": "Success"}
        return {"message": "Incorrect password"}
    return {"message": "User not found"}
