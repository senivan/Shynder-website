from fastapi import WebSocket, WebSocketDisconnect, BackgroundTasks
import sql
import httpx


class ConnectionManager:
    def __init__(self):
        self.active_sockets = {}
    async def accept_connection(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_sockets[websocket] = (await httpx.get("/get_active_user/?session_id=" + session_id), session_id)
        self.handle_user(websocket)
    async def close_connection(self, websocket: WebSocket):
        await websocket.close()
        del self.active_sockets[websocket]
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    async def handle_user(self, websocket: WebSocket, background_tasks: BackgroundTasks):
        try:
            while True:
                data = await websocket.receive_text()
                message = Message.from_json(data)
                background_tasks.add_task(self.process_data(message, websocket))
        except WebSocketDisconnect:
            self.close_connection(websocket)
    
    async def process_data(self, message: Message, websocket: WebSocket):
        if message.command == "send":
            receiver = sql.get_user_by_email(message.receiver)
            match_id = sql.get_match_id(self.active_sockets[websocket][0].id, receiver.id)
            if match_id is None:
                raise ValueError("Match not found")
            if receiver in [self.active_sockets[socket][0] for socket in self.active_sockets]:
                for socket in self.active_sockets:
                    if self.active_sockets[socket][0] == receiver:
                        await self.send_personal_message(message.messege, socket)
            try:
                with open("/chat_logs/" + match_id + ".txt", "a") as file:
                    file.write(message.messege)
            except OSError:
                with open("/chat_logs/" + match_id + ".txt", "w") as file:
                    file.write(message.messege)
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
        return {"sender": self.sender, "receiver": self.receiver, "messege": self.messege, "command": self.command}
    @staticmethod
    def from_json(json):
        return Message(json["sender"], json["receiver"], json["messege"], json["command"])
