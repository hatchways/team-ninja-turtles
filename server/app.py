from flask import Flask
from api.ping_handler import ping_handler
from api import db, bcrypt
from api.home_handler import home_handler
from api.contest_handler import contest_handler
from api.user_handler import user_handler
from api.submission_handler import submission_handler
from config import S3_BUCKET, S3_KEY, S3_SECRET, S3_REGION
import os
import boto3

s3 = boto3.client(
    's3',
    aws_access_key_id=S3_KEY,
    aws_secret_access_key=S3_SECRET,
    region_name=S3_REGION)

app = Flask(__name__)

POSTGRES = {
    'user': os.environ.get('DB_USER'),
    'pw': os.environ.get('DB_PASS'),
    'db': os.environ.get('DB_DB'),
    'host': os.environ.get('DB_HOST'),
    'port': os.environ.get('DB_PORT')
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['JWT_SECRET'] = os.environ.get('JWT_SECRET') if os.environ.get('JWT_SECRET') else "bad_secret_key"

db.init_app(app)

bcrypt.init_app(app)

app.register_blueprint(user_handler)
app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(contest_handler)
app.register_blueprint(submission_handler)
