from api import db
from datetime import datetime
from sqlalchemy import ForeignKey


class InspirationalImageContestLink(db.Model):
    __tablename__ = 'image_contest_link'

    contest_id = db.Column(db.Integer, ForeignKey('contest.id'), primary_key = True)
    image_id = db.Column(db.Integer, ForeignKey('image.id'), primary_key = True)
