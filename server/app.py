from flask import Flask, Response
from api.ping_handler import ping_handler
from api.home_handler import home_handler
<<<<<<< Updated upstream
=======
from api.contest_handler import contest_handler
from config import S3_BUCKET, S3_KEY, S3_SECRET, S3_REGION
import boto3
>>>>>>> Stashed changes


s3 = boto3.client(
    's3',
    aws_access_key_id=S3_KEY,
    aws_secret_access_key=S3_SECRET,
    region_name=S3_REGION)

app = Flask(__name__)


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

