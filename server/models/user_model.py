from api import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)
    created_time = db.Column(db.DateTime, default=datetime.utcnow())
    stripe_id = db.Column(db.String())  # caller have to manually provide this.
    icon = db.Column(db.String())
    contests = db.relationship('Contest', backref="creator")

