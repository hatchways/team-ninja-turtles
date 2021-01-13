from flask import Flask
import os
from api.ping_handler import ping_handler
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate,MigrateCommand
from api.home_handler import home_handler

app = Flask(__name__)

POSTGRES = {
    'user': os.environ.get('DB_USER'),
    'pw': os.environ.get('DB_PASS'),
    'db': os.environ.get('DB_DB'),
    'host': os.environ.get('DB_HOST'),
    'port': os.environ.get('DB_PORT')
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:\
%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)
migrate = Migrate(app, db)

import models


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)


