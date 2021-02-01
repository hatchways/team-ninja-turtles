from api import db
from sqlalchemy import ForeignKey
from datetime import datetime


class RoomSession(db.Model):
    __tablename__ = "room_session"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user1 = db.Column(db.Integer, ForeignKey("user.id"))
    user2 = db.Column(db.Integer, ForeignKey("user.id"))
    messages = db.relationship('message', backref="id")


class Message(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    session = db.Column(db.Integer, ForeignKey("room_session.id"))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    user = db.Column(db.Integer, ForeignKey("user.id"))
    message = db.Column(db.String)
