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
import datetime
from mail_wrapper import *

models.Base.metadata.create_all(bind=engine)
app = FastAPI()
# active_users = {"1".encode('utf-8'): schemas.UserCreate(username="test", ddescription="test", age=1, email="test", ppassword="test", test_results="test")}
active_users = {}
waiting_verification = {}
app.mount('/static', StaticFiles(directory='static', html=True), name='static')

class TestAnswers:
    def __init__(self, answers:str):
        self.answers = TestAnswers.from_json(answers)
    
    def to_json(self):
        return json.dumps(self.answers)
    
    @staticmethod
    def from_json(json_str:str):
        return json.loads(json_str)
    

waiting_verification = {}
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
            print(receiver.email)
            print(receiver.id, self.active_sockets[websocket][0].id)
            match_id = db_wrapper.get_match_id(get_db().__next__(), self.active_sockets[websocket][0].id, receiver.id)
            if match_id is None:
                raise ValueError("Match not found")
            # print(self.active_sockets)
            print(receiver.email)
            print(f"Receivers: {[self.active_sockets[socket][0].email for socket in self.active_sockets]}")
            if receiver.email in [self.active_sockets[socket][0].email for socket in self.active_sockets]:
                for socket in self.active_sockets:
                    print(self.active_sockets[socket][0].email, receiver.email)
                    if self.active_sockets[socket][0].email == receiver.email:
                        await self.send_personal_message(message.to_json(), socket)
            try:
                with open("chat_logs/" + str(match_id) + ".txt", "a") as file:
                    file.write(message.to_json() + "\n")
            except FileNotFoundError:
                file = open("chat_logs/" + str(match_id) + ".txt", "w")
                file.write(message.to_json() + "\n")
                file.close()
        elif message.command == "get_all":
            match_id = db_wrapper.get_match_id(get_db().__next__(), self.active_sockets[websocket][0].id, db_wrapper.get_user_by_email(get_db().__next__(), message.receiver).id)
            print(match_id)
            try:
                with open("chat_logs/" + str(match_id) + ".txt", "r") as file:
                    for line in file.readlines():
                        await self.send_personal_message(line, websocket)
            except FileNotFoundError:
                file = open("chat_logs/" + str(match_id) + ".txt", "w")
                file.close()
            with open("chat_logs/" + str(match_id) + ".txt", "r") as file:
                lines = []
                for line in file:
                    message = Message.from_json(line)
                    date = datetime.date(int(message.time.split(" ")[0].split(":")[0]), int(message.time.split(" ")[0].split(":")[1]), int(message.time.split(" ")[0].split(":")[2]))
                    current_date = datetime.date.now()
                    if not(current_date - date > datetime.timedelta(days=28)):
                        lines.append(line)
            with open("chat_logs/" + str(match_id) + ".txt", "w") as file:
                for line in lines:
                    file.write(line)

        elif message.command == "get_all_matches":
            print(self.active_sockets[websocket][0].id)
            matches = db_wrapper.get_all_matches(get_db().__next__(), self.active_sockets[websocket][0].id)
            res_matches = []
            for match in matches:
                res_matches.append(match.as_dict())
                res_matches[-1]['command'] = "get_all_matches"
            await self.send_personal_message(json.dumps(res_matches), websocket)
        

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
    if not ("ucu.edu.ua" in email):
        return {"message":"Not UCU mail"}
    if db_wrapper.get_user_by_email(db, email) is not None:
        return {"message":"User already exists"}
    # db_wrapper.create_user(db, schemas.UserCreate(username=username, ddescription=ddescription, age=age, email=email, ppassword=hash_bcr(ppassword), test_results=test_results))
    user = schemas.UserCreate(username=username, ddescription=ddescription, course=cs, full_name=full_name, email=email, ppassword=hash_bcr(ppassword), test_results=test_results)
    token = str(hash_bcr(email + str(random.randint(0, 1000000))))
    waiting_verification[token] = user
    await send_email(email, username, token)
    return {"message": "Waiting verification"}
@app.get("/verify/", response_class=HTMLResponse)
async def verify(token:str):
    if token in waiting_verification:
        db = get_db().__next__()
        db_wrapper.create_user(db, waiting_verification[token])
        del waiting_verification[token]
        html = ""
        with open("./static/login/login_page.html", "r", encoding="utf-8") as file:
            html = '\n'.join(file.readlines())
    return HTMLResponse(content=html)


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

@app.get("/get_match/")
async def get_match(match_id:int):
    db = get_db().__next__()
    return db_wrapper.get_match(db, match_id)

@app.get("/get_user_by_id/")
async def get_user_by_id(user_id:int):
    db = get_db().__next__()
    return db_wrapper.get_user(db, user_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)