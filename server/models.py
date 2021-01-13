from app import db
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    email = db.Column(db.String())
    password = db.Column(db.String())
    created_time = db.Column(db.DateTime, default=func.utcnow())

    def __init__(self, id, email, password, created_time):
        self.id = id
        self.email = email
        self.password = password
        self.created_time = created_time

class Contest(db.Model):
    __tablename__ = 'contest'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String())
    description = db.Column(db.String())
    prize_contest = db.Column(db.Integer())
    deadline_date = db.Column(db.DateTime)
    created_time = db.Column(db.DateTime, default=func.utcnow())
    update_time = db.Column(db.DateTime, onupdate=func.utcnow()) # store updated time of row
    contest_creater = db.Column(db.Integer, ForeignKey('user.id'))

    def __init__(self, id, title, description, prize_contest, deadline_date, created_time, update_time, contest_creater):
        self.id = id
        self.title = title
        self.description = description
        self.prize_contest = prize_contest
        self.deadline_date = deadline_date
        self.created_time = created_time
        self.update_time = update_time
        self.contest_creater = contest_creater

class Submission(db.Model):
    __tablename__ = 'submission'

    id = db.Column(db.Integer, primary_key=True)
    contest_id = db.Column(db.Integer, ForeignKey('contest.id'))
    submiter_id = db.Column(db.Integer, ForeignKey('user.id'))
    active = db.Column(db.Boolean, default=False, nullable=False)
    image_link = db.Column(db.String())
    created_time = db.Column(db.DateTime, default=func.utcnow())
    update_time = db.Column(db.DateTime, onupdate=func.utcnow()) # updated time of row

    def __init__(self, id, contest_id, submiter_id, active, image_link, created_time, update_time):
        self.id = id
        self.contest_id = contest_id
        self.submiter_id = submiter_id
        self.active = active
        self.image_link = image_link
        self.created_time = created_time
        self.update_time = update_time