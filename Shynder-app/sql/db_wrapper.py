from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).where(models.User.id == user_id).first()

def get_user_matches(db: Session, user_id: int):
    return db.query(models.User).where(models.User.id == user_id).first().matches

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).where(models.User.email == email).first()

def get_match(db: Session, match_id: int):
    return db.query(models.Match).where(models.Match.id == match_id).first()

def get_matches(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Match).offset(skip).limit(limit).all()

def get_all_matches(db: Session, user_id:int):
    return db.query(models.Match).where(models.Match.user1_id == user_id).all() + db.query(models.Match).where(models.Match.user2_id == user_id).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_match(db: Session, match: schemas.MatchCreate):
    db_match = models.Match(**match.model_dump())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def delete_match(db: Session, match_id: int):
    db.query(models.Match).where(models.Match.id == match_id).delete()
    db.commit()
    return {"message": "Match deleted"}

def delete_user(db: Session, user_id: int):
    db.query(models.User).where(models.User.id == user_id).delete()
    db.commit()
    return {"message": "User deleted"}

def update_user(db: Session, user_id: int, **kwargs):
    db.query(models.User).where(models.User.id == user_id).update(kwargs)
    db.commit()
    return {"message": "User updated"}

def update_match(db: Session, match_id: int, **kwargs):
    db.query(models.Match).where(models.Match.id == match_id).update(kwargs)
    db.commit()
    return {"message": "Match updated"}

def get_match_id(db: Session, user1_id: int, user2_id: int):
    try:
        return db.query(models.Match).where(models.Match.user1_id == user1_id and models.Match.user2_id == user2_id).first().id
    except AttributeError:
        try:
            return db.query(models.Match).where(models.Match.user1_id == user2_id and models.Match.user2_id == user1_id).first().id
        except AttributeError:
            return None