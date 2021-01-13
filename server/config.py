import os

TEAM_NAME = os.environ['TEAM_NAME']

S3_BUCKET = os.environ.get("S3_BUCKET")
S3_KEY = os.environ.get("S3_KEY")
S3_SECRET = os.environ.get("S3_SECRET")
S3_REGION = os.environ.get("S3_REGION")