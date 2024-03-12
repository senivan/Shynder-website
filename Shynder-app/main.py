from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from sql import models, schemas, db_wrapper
import random
import os
from fastapi.staticfiles import StaticFiles
from sql.database import SessionLocal, engine
import bcrypt
import json


models.Base.metadata.create_all(bind=engine)
app = FastAPI()
# active_users = {"1".encode('utf-8'): schemas.UserCreate(username="test", ddescription="test", age=1, email="test", ppassword="test", test_results="test")}
active_users = {}
app.mount('/static', StaticFiles(directory='static', html=True), name='static')

class TestAnswers:
    def __init__(self, answers:str):
        self.answers = TestAnswers.from_json(answers)
    
    def to_json(self):
        return json.dumps(self.answers)
    
    @staticmethod
    def from_json(json_str:str):
        return json.loads(json_str)
    

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
async def root():
    html_con = ""
    with open("./static/login/login_page.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("./static/small_small.png")

def hash_bcr(password):
    pass_bytes = password.encode('utf-8')
    return bcrypt.hashpw(pass_bytes, bcrypt.gensalt())

@app.get("/login/")
async def login(login:str, password:str):
    db = get_db().__next__()
    flag = False
    msg = {}
    user = db_wrapper.get_user_by_email(db, login)
    if user:
        if bcrypt.checkpw(password.encode('utf-8'), user.ppassword.encode('utf-8')):
            msg = {"message": "Success"}
            flag = True
        else:
            msg = {"message": "Incorrect password"}
    else:
        msg = {"message": "User not found"}
    if flag:
        while True:
            session_id = hash_bcr(login) + hash_bcr(str(random.randint(0, 1000000)))
            if session_id not in active_users:
                active_users[session_id] = user
                break
            msg['session_id'] = session_id
    return msg



@app.get("/home/", response_class=HTMLResponse)
async def home():
    with open("./static/home/home.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/logout/", response_class=HTMLResponse)
async def logout(session_id:str):
    if session_id in active_users:
        del active_users[session_id]
    with open("./static/login.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

def embed_user_into_profile_html(email:str):
    with open("./static/user_profile/profile.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    html_con = html_con.replace("<user_email></user_email>", f'<user_email class="user">{email}</user_email>')
    return html_con

@app.get("/profile/", response_class=HTMLResponse)
async def profile(email:str, session_id:str = ""):
    if session_id.encode('utf-8') in active_users and active_users[session_id.encode('utf-8')].email == email:
        with open("./static/user_profile/sudo_profile.html", "r", encoding="utf-8") as file:
            html_con = '\n'.join(file.readlines())
        return html_con
    html_con = embed_user_into_profile_html(email)
    # with open("./static/user_profile/profile.html", "r", encoding="utf-8") as file:
    #     html_con = '\n'.join(file.readlines())
    # print(html_con)
    return html_con

@app.get("/register/")
async def register(username:str, ddescription:str, course:str, full_name:str, email:str, ppassword:str, test_results:str = ""):
    print(username, ddescription, course, full_name, email, ppassword, test_results)
    db = get_db().__next__()
    cs = 0
    if course == "1 курс":
        cs = 1
    elif course == "2 курс":
        cs = 2
    elif course == "3 курс":
        cs = 3
    elif course == "4 курс":
        cs = 4
    elif course == "Магістр":
        cs = 5
    elif course == "Аспірант":
        cs = 6
    elif course == "Працівник":
        cs = 7
    db_wrapper.create_user(db, schemas.UserCreate(username=username,full_name=full_name, ddescription=ddescription, course=cs, email=email, ppassword=hash_bcr(ppassword), test_results=test_results))
    return {"message": "Success"}

@app.get("/get_active_user/")
async def get_active_user(session_id:str):
    if session_id.encode('utf-8') in active_users:
        return active_users[session_id.encode('utf-8')]
    return {"message": "User not found"}

@app.get("/update_user/", response_class=HTMLResponse)
async def update_user(session_id:str, username:str, ddescription:str, age:int, email:str, ppassword:str):
    if session_id.encode('utf-8') in active_users:
        db = get_db().__next__()
        user = active_users[session_id.encode('utf-8')]
        db_wrapper.delete_user(db, active_users[session_id.encode('utf-8')].id)
        active_users[session_id.encode('utf-8')] = db_wrapper.create_user(db, schemas.UserCreate(username=username, ddescription=ddescription, age=age, email=email, ppassword=hash_bcr(ppassword), test_results=user.test_results))
    with open("./static/user_profile/sudo_profile.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/delete_user/", response_class=HTMLResponse)
async def delete_user(session_id:str):
    if session_id.encode('utf-8') in active_users:
        db = get_db().__next__()
        db_wrapper.delete_user(db, active_users[session_id.encode('utf-8')].id)
        del active_users[session_id.encode('utf-8')]
    with open("./static/login/login.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/temp/", response_class=HTMLResponse)
async def temp():
    with open("./static/user_profile/sudo_profile.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/get_all_active_users/")
async def get_all_active_users():
    return active_users

@app.get("/get_user_by_email/")
async def get_user_by_email(email:str):
    db = get_db().__next__()
    return db_wrapper.get_user_by_email(db, email)