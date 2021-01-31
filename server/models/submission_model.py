from api import db

from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from datetime import datetime

class Submission(db.Model):
    __tablename__ = 'submission'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    contest_id = db.Column(db.Integer, ForeignKey('contest.id'))
    submiter_id = db.Column(db.Integer, ForeignKey('user.id'))
    active = db.Column(db.Boolean, default=False, nullable=False)
    image_link = db.Column(db.String())
    created_time = db.Column(db.DateTime, default=datetime.utcnow())
    update_time = db.Column(db.DateTime, onupdate=func.utcnow()) # updated time of row

    def __init__(self, contest_id, submiter_id, active, image_link, update_time):
        self.contest_id = contest_id
        self.submiter_id = submiter_id
        self.active = active
        self.image_link = image_link
        self.update_time = update_time