from pydantic import BaseModel

class MatchBase(BaseModel):
    user1_id : int
    user2_id : int | None = None

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id : int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username : str
    ddescription: str | None = None
    course: int
    email : str
    full_name : str


class UserCreate(UserBase):
    ppassword : str #hashed password
    test_results : str

class User(UserBase):
    id : int
    matches : list[Match] = []
    class Config:
        orm_mode = True


class LikeBase(BaseModel):
    id : int
    user1_id : int
    user2_id : int

class LikeCreate(LikeBase):
    pass

class Like(LikeBase):
    class Config:
        orm_mode = True
