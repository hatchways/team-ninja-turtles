from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from config import S3_BUCKET, S3_KEY, S3_SECRET, S3_REGION
import boto3

s3 = boto3.client(
    's3',
    aws_access_key_id=S3_KEY,
    aws_secret_access_key=S3_SECRET,
    region_name=S3_REGION)

db = SQLAlchemy()
bcrypt = Bcrypt()
socketio = SocketIO()