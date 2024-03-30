from pydantic import BaseModel

class MatchBase(BaseModel):
    user1_id : int
    user2_id : int | None = None

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id : int

    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        return self
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

    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        return self
    class Config:
        orm_mode = True


class LikeBase(BaseModel):
    user1_id : int
    user2_id : int

class LikeCreate(LikeBase):
    pass

class Like(LikeBase):
    id : int

    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        return self
    class Config:
        orm_mode = True


class DislikeBase(BaseModel):
    user1_id : int
    user2_id : int

class DislikeCreate(DislikeBase):
    pass

class Dislike(DislikeBase):
    id : int
    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        return self

    class Config:
        orm_mode = True