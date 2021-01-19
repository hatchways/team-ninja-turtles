from api import db

from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from datetime import datetime


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)
    created_time = db.Column(db.DateTime, default=datetime.utcnow())


class Contest(db.Model):
    __tablename__ = 'contest'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    title = db.Column(db.String())
    description = db.Column(db.String())
    prize_contest = db.Column(db.Integer())
    deadline_date = db.Column(db.DateTime)
    created_time = db.Column(db.DateTime, default=datetime.utcnow())
    update_time = db.Column(db.DateTime, onupdate=datetime.utcnow()) # store updated time of row
    contest_creater = db.Column(db.Integer, ForeignKey('user.id'))

    def __init__(self, title, description, prize_contest, deadline_date, update_time, contest_creater):
        self.title = title
        self.description = description
        self.prize_contest = prize_contest
        self.deadline_date = deadline_date
        self.update_time = update_time
        self.contest_creater = contest_creater


class Submission(db.Model):
    __tablename__ = 'submission'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    contest_id = db.Column(db.Integer, ForeignKey('contest.id'))
    submiter_id = db.Column(db.Integer, ForeignKey('user.id'))
    active = db.Column(db.Boolean, default=False, nullable=False)
    image_link = db.Column(db.String())
    created_time = db.Column(db.DateTime, default=func.utcnow())
    update_time = db.Column(db.DateTime, onupdate=func.utcnow()) # updated time of row

    def __init__(self, contest_id, submiter_id, active, image_link, update_time):
        self.contest_id = contest_id
        self.submiter_id = submiter_id
        self.active = active
        self.image_link = image_link
        self.update_time = update_time