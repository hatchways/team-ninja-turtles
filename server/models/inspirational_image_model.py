from api import db
from datetime import datetime
from sqlalchemy.orm import relationship


class InspirationalImage(db.Model):
    __tablename__ = 'image'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    image_link = db.Column(db.String())
    created_time = db.Column(db.DateTime, default=datetime.utcnow())
    update_time = db.Column(db.DateTime, onupdate=datetime.utcnow()) # updated time of row
    contests = db.relationship('Contest', secondary = 'image_contest_link')

    def __init__(self, image_link, update_time):
        self.image_link = image_link
        self.update_time = update_time

