from api import db
from sqlalchemy import ForeignKey
from datetime import datetime


user_in_session = db.Table(
    'room_session_user',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('room_id', db.Integer, db.ForeignKey('room_session.id'))
)


class RoomSession(db.Model):
    __tablename__ = "room_session"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    messages = db.relationship('Message', primaryjoin="RoomSession.id == Message.session", backref="room")
    users = db.relationship('User', secondary=user_in_session, backref=db.backref("sessions"), lazy="dynamic")


class Message(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    session = db.Column(db.Integer, ForeignKey("room_session.id"))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)
    user = db.Column(db.Integer, ForeignKey("user.id"))
    message = db.Column(db.String)
