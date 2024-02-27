from pydantic import BaseModel

class MatchBase(BaseModel):
    user1_id : int
    user2_id : int | None = None

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id : int
    chat_log_file : str | None = None
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username : str
    description: str | None = None
    age: int
    email : str

class UserCreate(UserBase):
    password : str #hashed password
    test_results : str

class User(UserBase):
    id : int
    matches : list[Match] = []
    class Config:
        orm_mode = True