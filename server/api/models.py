from app import app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from flask_migrate import Migrate


POSTGRES = {
    'user': 'postgres',
    'pw': 'Hema@101',
    'db': 'user_info',
    'host': 'localhost',
    'port': '5433',
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:\
%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class contest_user(db.Model):
    __tablename__ = 'contest_user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String())
    password = db.Column(db.String())
    createdTime = db.Column(db.DateTime, default=func.current_timestamp())

    def __init__(self, id, email, password, createdTime):
        self.id = id
        self.email = email
        self.password = password
        self.createdTime = createdTime

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






