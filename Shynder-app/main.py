from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from sql import models, schemas, db_wrapper
import random
import os
from fastapi.staticfiles import StaticFiles
from sql.database import SessionLocal, engine
import bcrypt
from fastapi import WebSocket, WebSocketDisconnect
import json

models.Base.metadata.create_all(bind=engine)
app = FastAPI()
active_users = {"1".encode('utf-8'):db_wrapper.get_user_by_email(SessionLocal(), "bykov.pn@ucu.edu.ua"), "2".encode('utf-8'):db_wrapper.get_user_by_email(SessionLocal(), "sen.pn@ucu.edu.ua")}
app.mount('/static', StaticFiles(directory='static', html=True), name='static')
class ConnectionManager:
    def __init__(self):
        self.active_sockets = {}
    async def accept_connection(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        user = active_users[session_id.encode('utf-8')]
        self.active_sockets[websocket] = (user, session_id)
        print("Accepted connection")
        await self.handle_user(websocket)
    async def close_connection(self, websocket: WebSocket):
        await websocket.close()
        del self.active_sockets[websocket]
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    async def handle_user(self, websocket: WebSocket):
        print("Handling user")
        try:
            while True:
                data = await websocket.receive_text()
                print(data)
                message = Message.from_json(data)
                await self.process_data(message, websocket) 
        except WebSocketDisconnect:
            self.close_connection(websocket)
    
    async def process_data(self, message: 'Message', websocket: WebSocket):
        if message.command == "send":
            receiver = db_wrapper.get_user_by_email(get_db().__next__(), message.receiver)
            print(receiver.id, self.active_sockets[websocket][0].id)
            match_id = db_wrapper.get_match_id(get_db().__next__(), self.active_sockets[websocket][0].id, receiver.id)
            if match_id is None:
                raise ValueError("Match not found")
            print(self.active_sockets)
            if receiver in [self.active_sockets[socket][0] for socket in self.active_sockets]:
                for socket in self.active_sockets:
                    if self.active_sockets[socket][0] == receiver:
                        await self.send_personal_message(message.messege, socket)
            try:
                with open("chat_logs/" + str(match_id) + ".txt", "a") as file:
                    file.write(message.to_json() + "\n")
            except FileNotFoundError:
                file = open("chat_logs/" + str(match_id) + ".txt", "w")
                file.write(message.to_json() + "\n")
                file.close()
        elif message.command == "get_all":
            pass

class Message:
    def __init__(self, sender:str, receiver:str, messege:str,time, command:str = ""):
        self.sender = sender
        self.receiver = receiver
        self.messege = messege
        self.command = command
        self.time = time
    def to_json(self):
        encoder = json.encoder.JSONEncoder()
        return encoder.encode(self.__dict__)
    @staticmethod
    def from_json(_json):
        decoder = json.decoder.JSONDecoder()
        decoded = decoder.decode(_json)
        return Message(sender=decoded['sender'], receiver=decoded['receiver'], messege=decoded['messege'], time=decoded['time'], command=decoded['command'])

manager = ConnectionManager()

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
    with open("./static/login/login_page.html", "r", encoding="utf-8") as file:
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
async def register(username:str, ddescription:str, age:int, email:str, ppassword:str, test_results:str):
    db = get_db().__next__()
    db_wrapper.create_user(db, schemas.UserCreate(username=username, ddescription=ddescription, age=age, email=email, ppassword=hash_bcr(ppassword), test_results=test_results))
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
        db_wrapper.update_user(db, user.id, username=username, ddescription=ddescription, age=age, email=email, ppassword=hash_bcr(ppassword))
        active_users[session_id.encode('utf-8')] = db_wrapper.get_user_by_email(db, email)
    with open("./static/user_profile/sudo_profile.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/delete_user/", response_class=HTMLResponse)
async def delete_user(session_id:str):
    if session_id.encode('utf-8') in active_users:
        db = get_db().__next__()
        db_wrapper.delete_user(db, active_users[session_id.encode('utf-8')].id)
        del active_users[session_id.encode('utf-8')]
    with open("./static/login/login_page.html", "r", encoding="utf-8") as file:
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

@app.get("/chats_page/", response_class=HTMLResponse)
async def chats_page():
    with open("./static/chats/chats.html", "r", encoding="utf-8") as file:
        html_con = '\n'.join(file.readlines())
    return html_con

@app.get("/match/")
async def match(user1_id:int, user2_id:int):
    db = get_db().__next__()
    db_wrapper.create_match(db, schemas.MatchCreate(user1_id=user1_id, user2_id=user2_id))
    return {"message": "Success"}

@app.websocket("/chats_websocket/{session_id}")
async def chats_websocket(websocket: WebSocket, session_id:str):
    print("Accepted connection")
    await manager.accept_connection(websocket, session_id)

    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
