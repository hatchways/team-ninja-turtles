from flask import Flask
from api.ping_handler import ping_handler
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from api.home_handler import home_handler

app = Flask(__name__)

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

import models


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)


