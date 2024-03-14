from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    """
    User model.
    """
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    ppassword = Column(String)
    username = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    course = Column(Integer, nullable=False)
    ddescription = Column(String, nullable=False)
    test_results = Column(String, nullable=False)
    matches = relationship("Match", back_populates="user1", foreign_keys='Match.user1_id')
    likes = relationship("Likes", back_populates="user1", foreign_keys='Likes.user1_id')
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Match(Base):
    """
    Match model.
    """
    __tablename__ = "Matches"
    id = Column(Integer, primary_key=True)
    user1_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    user2_id = Column(Integer, ForeignKey("Users.id"), nullable=True)
    user1 = relationship("User", back_populates="matches", foreign_keys=[user1_id])
    user2 = relationship("User", back_populates="matches", foreign_keys=[user2_id])

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Likes(Base):
    """
    Likes model.
    """
    __tablename__ = "Likes"
    id = Column(Integer, primary_key=True)
    user1_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    user2_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    user1 = relationship("User", back_populates="likes", foreign_keys=[user1_id])
    user2 = relationship("User", back_populates="likes", foreign_keys=[user2_id])

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}