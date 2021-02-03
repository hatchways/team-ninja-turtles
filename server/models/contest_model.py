from api import db
from sqlalchemy import ForeignKey
from datetime import datetime


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
    inspirational_images = db.relationship('InspirationalImage', secondary = 'image_contest_link')

    def __init__(self, title, description, prize_contest, deadline_date, update_time, contest_creater):
        self.title = title
        self.description = description
        self.prize_contest = prize_contest
        self.deadline_date = deadline_date
        self.update_time = update_time
        self.contest_creater = contest_creater

