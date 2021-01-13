from app import db
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey

class contest_user(db.Model):
    __tablename__ = 'contest_user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String())
    password = db.Column(db.String())
    createdTime = db.Column(db.DateTime, default=func.utcnow())

    def __init__(self, id, email, password, createdTime):
        self.id = id
        self.email = email
        self.password = password
        self.createdTime = createdTime

class submission_user(db.Model):
    __tablename__ = 'submission_user'

    id = db.Column(db.Integer, primary_key=True)
    sub_email = db.Column(db.String())
    sub_password = db.Column(db.String())
    createdTime = db.Column(db.DateTime, default=func.utcnow())

class contest_table(db.Model):
    __tablename__ = 'contest'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String())
    description = db.Column(db.String())
    prizeContest = db.Column(db.Integer())
    deadlineDate = db.Column(db.DateTime)
    createdTime = db.Column(db.DateTime, default=func.utcnow())
    updateTime = db.Column(db.DateTime, onupdate=func.utcnow()) # store updated time of row
    contestCreater = db.Column(db.Integer, ForeignKey('contest_user.id'))

    def __init__(self, id, title, description, prizeContest, deadlineDate, createdTime, updateTime, contestCreater):
        self.id = id
        self.title = title
        self.description = description
        self.prizeContest = prizeContest
        self.deadlineDate = deadlineDate
        self.createdTime = createdTime
        self.updateTime = updateTime
        self.contestCreater = contestCreater

class submission_table(db.Model):
    __tablename__ = 'submission'

    id = db.Column(db.Integer, primary_key=True)
    contest_id = db.Column(db.Integer, ForeignKey('contest.id'))
    submiter_id = db.Column(db.Integer, ForeignKey('submission_user.id'))
    active = db.Column(db.Boolean, default=False, nullable=False)
    image_link = db.Column(db.String())
    createdTime = db.Column(db.DateTime, default=func.utcnow())
    updateTime = db.Column(db.DateTime, onupdate=func.utcnow()) # updated time of row

    def __init__(self, id, contest_id, submiter_id, active, image_link, createdTime, updateTime):
        self.id = id
        self.contest_id = contest_id
        self.submiter_id = submiter_id
        self.active = active
        self.image_link = image_link
        self.createdTime = createdTime
        self.updateTime = updateTime





